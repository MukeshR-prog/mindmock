import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import User from "@/models/User";
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
  const scores = interviews.map((i: any) => i.overallScore || 0);
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

  // Calculate skill averages
  let relevance = 0, confidence = 0, star = 0, totalAnswers = 0;

  interviews.forEach((i: any) => {
    i.answers?.forEach((a: any) => {
      relevance += a.relevanceScore || 0;
      confidence += a.confidenceScore || 0;
      star += a.starScore || 0;
      totalAnswers++;
    });
  });

  const avgRelevance = totalAnswers ? Math.round((relevance / totalAnswers) * 10) : 0;
  const avgConfidence = totalAnswers ? Math.round((confidence / totalAnswers) * 10) : 0;
  const avgStarScore = totalAnswers ? Math.round((star / totalAnswers) * 10) : 0;

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
