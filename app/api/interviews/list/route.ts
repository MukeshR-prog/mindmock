import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import User from "@/models/User";
import { normalizeOverallScore } from "@/utils/scoreCalculator";

export async function GET(req: Request) {
  try {
    await connectDB();

  const firebaseUid = req.headers.get("firebaseUid");
  if (!firebaseUid) {
    return NextResponse.json({ interviews: [] }, { status: 401 });
  }

  const user = await User.findOne({ firebaseUid });
  if (!user) {
    return NextResponse.json({ interviews: [] }, { status: 404 });
  }

    const interviews = await Interview.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select("_id createdAt status targetRole overallScore interviewType difficulty");

    // Ensure all required fields are present with proper defaults
    const validatedInterviews = interviews.map((interview: any) => ({
      _id: interview._id,
      createdAt: interview.createdAt || new Date().toISOString(),
      status: interview.status || "created",
      targetRole: interview.targetRole || "General Interview",
      overallScore: interview.overallScore !== undefined && interview.overallScore !== null
        ? normalizeOverallScore(interview.overallScore)
        : null,
      interviewType: interview.interviewType || "mixed",
      difficulty: interview.difficulty || "junior",
    }));

    return NextResponse.json({ interviews: validatedInterviews });
  } catch (error) {
    console.error("INTERVIEWS LIST ERROR:", error);
    return NextResponse.json(
      { interviews: [], error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}
