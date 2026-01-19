import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import Resume from "@/models/Resume";
import Groq from "groq-sdk";
import { detectFillerWords } from "@/utils/fillerWords";
import { answerEvaluationPrompt } from "@/utils/answerEvaluationPrompt";
import { starEvaluationPrompt } from "@/utils/starPrompt";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { interviewId, question, answer } = await req.json();

    const interview = await Interview.findById(interviewId);
    const resume = await Resume.findById(interview.resumeId);

    if (!interview || !resume) {
      return NextResponse.json(
        { error: "Interview or resume not found" },
        { status: 404 }
      );
    }

    // 🔹 Filler words
    const fillerWords = detectFillerWords(answer);

    // 🔹 Relevance & confidence
    const evalPrompt = answerEvaluationPrompt({
      question,
      answer,
      role: resume.targetRole,
      experience: resume.experienceLevel,
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
