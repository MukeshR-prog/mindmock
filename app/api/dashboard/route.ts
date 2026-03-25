import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import Resume from "@/models/Resume";
import User from "@/models/User";

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function calculateSkillAverages(interviews: any[]) {
  let relevanceTotal = 0;
  let confidenceTotal = 0;
  let starTotal = 0;
  let answerCount = 0;

  interviews.forEach((interview) => {
    interview.answers?.forEach((answer: any) => {
      relevanceTotal += answer.relevanceScore || 0;
      confidenceTotal += answer.confidenceScore || 0;
      starTotal += answer.starScore || 0;
      answerCount += 1;
    });
  });

  if (!answerCount) {
    return {
      relevance: 0,
      confidence: 0,
      star: 0,
    };
  }

  return {
    relevance: clampPercentage((relevanceTotal / answerCount) * 10),
    confidence: clampPercentage((confidenceTotal / answerCount) * 10),
    star: clampPercentage((starTotal / answerCount) * 10),
  };
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const firebaseUid = req.headers.get("firebaseUid");
    if (!firebaseUid) {
      return NextResponse.json({
        totalInterviews: 0,
        avgScore: 0,
        bestScore: 0,
        improvementRate: 0,
        avgAtsScore: 0,
        totalResumes: 0,
        trendData: [],
        radarData: [],
        fillerData: [],
        comparisonData: [],
      }, { status: 401 });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json({
        totalInterviews: 0,
        avgScore: 0,
        bestScore: 0,
        improvementRate: 0,
        avgAtsScore: 0,
        totalResumes: 0,
        trendData: [],
        radarData: [],
        fillerData: [],
        comparisonData: [],
      }, { status: 404 });
    }

  // Get user stats directly from database 
  const {
    totalInterviews,
    avgScore,
    bestScore,
    improvementRate,
    avgAtsScore,
    totalResumes,
    avgRelevance,
    avgConfidence,
    avgStarScore,
  } = user;

  // Get interviews for chart data
  const interviews = await Interview.find({
    userId: user._id,
    status: "completed",
  })
    .sort({ createdAt: 1 })
    .lean();

  const peerInterviews = await Interview.find({
    userId: { $ne: user._id },
    status: "completed",
  })
    .select("answers")
    .lean();

  // Generate chart data from interviews
  const trendData = interviews.map((i: any, idx: number) => ({
    name: `I${idx + 1}`,
    score: i.overallScore || 0,
  }));

  // Build skill scores from actual interview answers to avoid stale cached values.
  const userSkillAverages = calculateSkillAverages(interviews);
  const peerSkillAverages = calculateSkillAverages(peerInterviews);

  // Use calculated scores if available, otherwise fall back to user stats
  const relevanceScore = userSkillAverages.relevance > 0 ? userSkillAverages.relevance : clampPercentage(avgRelevance || 0);
  const confidenceScore = userSkillAverages.confidence > 0 ? userSkillAverages.confidence : clampPercentage(avgConfidence || 0);
  const starScore = userSkillAverages.star > 0 ? userSkillAverages.star : clampPercentage(avgStarScore || 0);

  // Use peer averages, or user scores if peer data doesn't exist
  const relevanceAverage = peerSkillAverages.relevance > 0 ? peerSkillAverages.relevance : relevanceScore;
  const confidenceAverage = peerSkillAverages.confidence > 0 ? peerSkillAverages.confidence : confidenceScore;
  const starAverage = peerSkillAverages.star > 0 ? peerSkillAverages.star : starScore;

  // Radar chart data from computed user skill averages
  const radarData = [
    { skill: "Relevance", score: relevanceScore },
    { skill: "Confidence", score: confidenceScore },
    { skill: "STAR", score: starScore },
  ];

  // Filler words pie chart - only if we have data
  const fillerCount: Record<string, number> = {};
  const FILLER_COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];
  
  interviews.forEach((i: any) => {
    i.answers?.forEach((a: any) => {
      a.fillerWords?.forEach((w: string) => {
        fillerCount[w] = (fillerCount[w] || 0) + 1;
      });
    });
  });

  const fillerData = Object.keys(fillerCount).length > 0
    ? Object.keys(fillerCount)
        .slice(0, 6)
        .map((k, idx) => ({
          name: k,
          value: fillerCount[k],
          color: FILLER_COLORS[idx % FILLER_COLORS.length],
        }))
    : [];

  // Comparison chart (you vs average candidates) from actual data.
  const comparisonData = [
    { skill: "Relevance", you: relevanceScore, average: relevanceAverage },
    { skill: "Confidence", you: confidenceScore, average: confidenceAverage },
    { skill: "STAR Method", you: starScore, average: starAverage },
  ];

  return NextResponse.json({
    // Stats from DB
    totalInterviews: totalInterviews || 0,
    avgScore: avgScore || 0,
    bestScore: bestScore || 0,
    improvementRate: improvementRate || 0,
    avgAtsScore: avgAtsScore || 0,
    totalResumes: totalResumes || 0,
    
    // Chart data
    trendData,
    radarData,
    fillerData,
    comparisonData,
  });
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);
    return NextResponse.json({
      totalInterviews: 0,
      avgScore: 0,
      bestScore: 0,
      improvementRate: 0,
      avgAtsScore: 0,
      totalResumes: 0,
      trendData: [],
      radarData: [],
      fillerData: [],
      comparisonData: [],
      error: "Failed to fetch dashboard data",
    }, { status: 500 });
  }
}
