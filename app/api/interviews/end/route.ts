import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import { calculateOverallScore } from "@/utils/scoreCalculator";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { interviewId, transcript } = await req.json();
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const overallScore = calculateOverallScore(
      interview.answers || []
    );

    interview.transcript = transcript?.join("\n") || "";
    interview.status = "completed";
    interview.overallScore = overallScore;

    await interview.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("END INTERVIEW ERROR:", error);
    return NextResponse.json(
      { error: "Failed to end interview" },
      { status: 500 }
    );
  }
}
