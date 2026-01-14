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

    const interview = await Interview.findById(interviewId);
    const resume = await Resume.findById(interview.resumeId);

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    const prompt = interviewQuestionPrompt({
      resumeText: resume.resumeText.slice(0, 4000),
      role: resume.targetRole,
      experience: resume.experienceLevel,
      previousAnswer,
    });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const question =
      completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ question });
  } catch (error) {
    console.error("AI QUESTION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
