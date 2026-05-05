import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import Resume from "@/models/Resume";
import User from "@/models/User";
import { normalizeOverallScore } from "@/utils/scoreCalculator";

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
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

  // Get interviews for chart data (projecting only required fields, excluding large transcript/answers text)
  const interviews = await Interview.find({
    userId: user._id,
    status: "completed",
  })
    .select("overallScore createdAt answers.relevanceScore answers.confidenceScore answers.starScore answers.fillerWords")
    .sort({ createdAt: 1 })
    .lean();


  // Generate user stats, trend data, and count filler words in a single optimized pass
  let overallScoreSum = 0;
  let computedBestScore = 0;
  const trendData: any[] = [];
  
  let relevanceTotal = 0;
  let confidenceTotal = 0;
  let starTotal = 0;
  let totalAnswers = 0;
  
  const fillerCount: Record<string, number> = {};

  interviews.forEach((interview, idx) => {
    // 1. Overall & Trend score
    const normScore = normalizeOverallScore(interview.overallScore);
    overallScoreSum += normScore;
    if (normScore > computedBestScore) {
      computedBestScore = normScore;
    }
    trendData.push({
      name: `I${idx + 1}`,
      score: normScore || 0,
    });

    // 2. Answers-based stats: Skill Averages and Filler words
    interview.answers?.forEach((answer: any) => {
      relevanceTotal += answer.relevanceScore || 0;
      confidenceTotal += answer.confidenceScore || 0;
      starTotal += answer.starScore || 0;
      totalAnswers += 1;

      answer.fillerWords?.forEach((word: string) => {
        fillerCount[word] = (fillerCount[word] || 0) + 1;
      });
    });
  });

  const computedAvgScore = interviews.length
    ? Math.round(overallScoreSum / interviews.length)
    : 0;

  const userSkillAverages = totalAnswers ? {
    relevance: clampPercentage((relevanceTotal / totalAnswers) * 10),
    confidence: clampPercentage((confidenceTotal / totalAnswers) * 10),
    star: clampPercentage((starTotal / totalAnswers) * 10),
  } : {
    relevance: 0,
    confidence: 0,
    star: 0,
  };

  // Compute peer averages directly in the database using aggregation to prevent out-of-memory overhead
  const peerAveragesResult = await Interview.aggregate([
    {
      $match: {
        userId: { $ne: user._id },
        status: "completed",
      },
    },
    {
      $unwind: "$answers",
    },
    {
      $group: {
        _id: null,
        relevanceSum: { $sum: "$answers.relevanceScore" },
        confidenceSum: { $sum: "$answers.confidenceScore" },
        starSum: { $sum: "$answers.starScore" },
        answerCount: { $sum: 1 },
      },
    },
  ]);

  let peerSkillAverages = { relevance: 0, confidence: 0, star: 0 };
  if (peerAveragesResult.length > 0) {
    const { relevanceSum, confidenceSum, starSum, answerCount } = peerAveragesResult[0];
    if (answerCount > 0) {
      peerSkillAverages = {
        relevance: clampPercentage((relevanceSum / answerCount) * 10),
        confidence: clampPercentage((confidenceSum / answerCount) * 10),
        star: clampPercentage((starSum / answerCount) * 10),
      };
    }
  }

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

  // Colors config for filler words pie chart
  const FILLER_COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

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
    avgScore: computedAvgScore || avgScore || 0,
    bestScore: computedBestScore || bestScore || 0,
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
