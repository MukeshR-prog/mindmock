import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import Resume from "@/models/Resume";
import { buildQuestionPrompt } from "@/utils/questionPrompt";

export async function POST(req: Request) {
  await connectDB();

  const { interviewId } = await req.json();

  const interview = await Interview.findById(interviewId);
  const resume = await Resume.findById(interview.resumeId);

  const prompt = buildQuestionPrompt({
    resumeText: resume.resumeText.slice(0, 3000),
    role: resume.targetRole,
    experience: resume.experienceLevel,
    interviewType: interview.interviewType,
  });

  // 🔹 FREE fallback logic (always works)
  const fallbackQuestion = `Can you explain your experience with ${
    resume.targetRole
  } technologies mentioned in your resume?`;

  try {
    // OPTIONAL: plug Groq / OpenRouter here
    return NextResponse.json({ question: fallbackQuestion });
  } catch {
    return NextResponse.json({ question: fallbackQuestion });
  }
}
