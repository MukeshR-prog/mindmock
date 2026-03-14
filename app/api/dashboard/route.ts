import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import Resume from "@/models/Resume";
import User from "@/models/User";

export async function GET(req: Request) {
  await connectDB();

  const firebaseUid = req.headers.get("firebaseUid");
  if (!firebaseUid)
    return NextResponse.json({}, { status: 401 });

  const user = await User.findOne({ firebaseUid });
  if (!user)
    return NextResponse.json({}, { status: 404 });

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

  // Generate chart data from interviews
  const trendData = interviews.map((i: any, idx: number) => ({
    name: `I${idx + 1}`,
    score: i.overallScore || 0,
  }));

  // Radar chart data from user averages
  const radarData = [
    { skill: "Relevance", score: avgRelevance || 0 },
    { skill: "Confidence", score: avgConfidence || 0 },
    { skill: "STAR", score: avgStarScore || 0 },
  ];

  // Filler words pie chart
  const fillerCount: Record<string, number> = {};
  const FILLER_COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];
  
  interviews.forEach((i: any) => {
    i.answers?.forEach((a: any) => {
      a.fillerWords?.forEach((w: string) => {
        fillerCount[w] = (fillerCount[w] || 0) + 1;
      });
    });
  });

  const fillerData = Object.keys(fillerCount)
    .slice(0, 6)
    .map((k, idx) => ({
      name: k,
      value: fillerCount[k],
      color: FILLER_COLORS[idx % FILLER_COLORS.length],
    }));

  // Comparison chart (you vs average - simulated average for now)
  const comparisonData = [
    { skill: "Relevance", you: avgRelevance || 0, average: 65 },
    { skill: "Confidence", you: avgConfidence || 0, average: 60 },
    { skill: "STAR Method", you: avgStarScore || 0, average: 55 },
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
}
