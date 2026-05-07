import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import User from "@/models/User";
import { calculateOverallScore, normalizeOverallScore } from "@/utils/scoreCalculator";

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

    // Update user stats in database
    await updateUserStats(interview.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("END INTERVIEW ERROR:", error);
    return NextResponse.json(
      { error: "Failed to end interview" },
      { status: 500 }
    );
  }
}

// Helper function to update user stats
async function updateUserStats(userId: string) {
  const interviews = await Interview.find({
    userId,
    status: "completed",
  }).lean();

  if (!interviews.length) return;

  // Calculate overall stats
  const scores = interviews.map((i: any) => normalizeOverallScore(i.overallScore));
  const totalInterviews = interviews.length;
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const bestScore = Math.max(...scores);

  // Calculate improvement rate
  let improvementRate = 0;
  if (scores.length > 1) {
    const firstScore = scores[0];
    const lastScore = scores[scores.length - 1];
    if (firstScore > 0) {
      improvementRate = Math.round(((lastScore - firstScore) / firstScore) * 100);
    } else if (lastScore > firstScore) {
      // If first score is 0 but last score is positive, show 100% improvement
      improvementRate = 100;
    }
  }

  // Calculate skill averages counting only valid non-null scores
  let relevanceTotal = 0, relevanceCount = 0;
  let confidenceTotal = 0, confidenceCount = 0;
  let starTotal = 0, starCount = 0;

  interviews.forEach((i: any) => {
    i.answers?.forEach((a: any) => {
      if (a.relevanceScore !== undefined && a.relevanceScore !== null) {
        relevanceTotal += a.relevanceScore;
        relevanceCount++;
      }
      if (a.confidenceScore !== undefined && a.confidenceScore !== null) {
        confidenceTotal += a.confidenceScore;
        confidenceCount++;
      }
      if (a.starScore !== undefined && a.starScore !== null) {
        starTotal += a.starScore;
        starCount++;
      }
    });
  });

  const avgRelevance = relevanceCount ? Math.round((relevanceTotal / relevanceCount) * 10) : 0;
  const avgConfidence = confidenceCount ? Math.round((confidenceTotal / confidenceCount) * 10) : 0;
  const avgStarScore = starCount ? Math.round((starTotal / starCount) * 10) : 0;

  // Update user in database
  await User.findByIdAndUpdate(userId, {
    totalInterviews,
    avgScore,
    bestScore,
    improvementRate,
    avgRelevance,
    avgConfidence,
    avgStarScore,
  });
}
