import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import Resume from "@/models/Resume";
import Groq from "groq-sdk";
import { detectFillerWords } from "@/utils/fillerWords";
import { answerEvaluationPrompt } from "@/utils/answerEvaluationPrompt";
import { starEvaluationPrompt } from "@/utils/starPrompt";
import { verifyAuth } from "@/utils/jwt";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    try {
      await verifyAuth(req);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interviewId, question, answer } = await req.json();

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Determine role and experience based on interview mode
    let role: string;
    let experience: string;

    if (interview.interviewMode === "concept-based") {
      // Concept-based interview - use interview data directly
      role = interview.targetRole;
      experience = interview.difficulty || "mid-level";
    } else {
      // Resume-based interview - get from resume
      const resume = await Resume.findById(interview.resumeId);
      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }
      role = resume.targetRole;
      experience = resume.experienceLevel;
    }

    // 🔹 Filler words
    const fillerWords = detectFillerWords(answer);

    // 🔹 Relevance & confidence
    const evalPrompt = answerEvaluationPrompt({
      question,
      answer,
      role,
      experience,
      interviewMode: interview.interviewMode,
      selectedConcepts: interview.selectedConcepts,
    });

    const evalRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: evalPrompt }],
      temperature: 0,
    });

    const evalData = JSON.parse(
      evalRes.choices[0].message.content!
    );

    // 🔹 STAR method
    const starRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: starEvaluationPrompt(answer) },
      ],
      temperature: 0,
    });

    const starData = JSON.parse(
      starRes.choices[0].message.content!
    );

    const answerResult = {
      question,
      answer,
      relevanceScore: evalData.relevanceScore,
      confidenceScore: evalData.confidenceScore,
      starScore: starData.starScore,
      fillerWords,
      feedback: `${evalData.feedback}\nSTAR: ${starData.feedback}`,
    };
    if (!interview.answers) {
    interview.answers = [];
    }

    interview.answers.push(answerResult);
    interview.status = "in-progress";
    await interview.save();

    return NextResponse.json(answerResult);
  } catch (error) {
    console.error("EVALUATION ERROR:", error);
    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}
