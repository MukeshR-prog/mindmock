import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import Resume from "@/models/Resume";
import Groq from "groq-sdk";
import { interviewQuestionPrompt } from "@/utils/aiPrompts";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { interviewId, previousAnswer } = await req.json();

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    console.log("Interview data:", {
      id: interview._id,
      mode: interview.interviewMode,
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      selectedConcepts: interview.selectedConcepts,
    });

    let prompt: string;

    // Check if this is a concept-based or resume-based interview
    if (interview.interviewMode === "concept-based") {
      // Concept-based interview - no resume needed
      const experienceLevel = interview.difficulty === "mid" ? "mid-level" : 
                             interview.difficulty === "senior" ? "senior" :
                             interview.difficulty === "stress" ? "senior (stress mode)" :
                             "junior";
      
      const concepts = interview.selectedConcepts || [];
      
      if (concepts.length === 0) {
        return NextResponse.json(
          { error: "No concepts selected for this interview" },
          { status: 400 }
        );
      }
      
      prompt = interviewQuestionPrompt({
        role: interview.targetRole || "Software Engineer",
        experience: experienceLevel,
        previousAnswer,
        interviewMode: "concept-based",
        selectedConcepts: concepts,
      });
    } else {
      // Resume-based interview
      const resume = await Resume.findById(interview.resumeId);

      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }

      prompt = interviewQuestionPrompt({
        resumeText: resume.resumeText.slice(0, 4000),
        role: resume.targetRole,
        experience: resume.experienceLevel,
        previousAnswer,
      });
    }

    console.log("Generated prompt length:", prompt.length);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const question =
      completion.choices[0]?.message?.content?.trim();

    console.log("Generated question:", question);

    if (!question) {
      return NextResponse.json(
        { error: "AI returned empty response", question: null },
        { status: 500 }
      );
    }

    return NextResponse.json({ question });
  } catch (error: any) {
    console.error("AI QUESTION ERROR:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate question" },
      { status: 500 }
    );
  }
}
