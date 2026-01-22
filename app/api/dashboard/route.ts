import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import User from "@/models/User";

export async function GET(req: Request) {
  await connectDB();

  const firebaseUid = req.headers.get("firebaseUid");
  if (!firebaseUid)
    return NextResponse.json({}, { status: 401 });

  const user = await User.findOne({ firebaseUid });
  if (!user)
    return NextResponse.json({}, { status: 404 });

  const interviews = await Interview.find({
    userId: user._id,
    status: "completed",
  }).lean();

  if (!interviews.length) {
    return NextResponse.json({
      totalInterviews: 0,
      avgScore: 0,
      bestScore: 0,
      improvementRate: 0,
      charts: {},
    });
  }

  // ✅ Overall Scores
  const scores = interviews.map((i) => i.overallScore || 0);
  const avgScore = Math.round(
    scores.reduce((a, b) => a + b, 0) / scores.length
  );
  const bestScore = Math.max(...scores);

  // ✅ Improvement Rate
  const improvementRate =
    scores.length > 1
      ? Math.round(
          ((scores[scores.length - 1] - scores[0]) /
            scores[0]) *
            100
        )
      : 0;

  // ✅ Line Chart Data (Score Trend)
  const trendData = interviews.map((i, idx) => ({
    name: `I${idx + 1}`,
    score: i.overallScore || 0,
  }));

  // ✅ Radar Chart Data (Skill Averages)
  let relevance = 0,
    confidence = 0,
    star = 0,
    totalAnswers = 0;

  interviews.forEach((i) => {
    i.answers?.forEach((a: any) => {
      relevance += a.relevanceScore || 0;
      confidence += a.confidenceScore || 0;
      star += a.starScore || 0;
      totalAnswers++;
    });
  });

  const radarData = totalAnswers
    ? [
        {
          skill: "Relevance",
          value: Math.round(relevance / totalAnswers),
        },
        {
          skill: "Confidence",
          value: Math.round(confidence / totalAnswers),
        },
        {
          skill: "STAR",
          value: Math.round(star / totalAnswers),
        },
      ]
    : [];

  // ✅ Filler Words Pie Chart
  const fillerCount: Record<string, number> = {};
  interviews.forEach((i) => {
    i.answers?.forEach((a:any) => {
      a.fillerWords?.forEach((w: string) => {
        fillerCount[w] = (fillerCount[w] || 0) + 1;
      });
    });
  });

  const fillerData = Object.keys(fillerCount).map((k) => ({
    name: k,
    value: fillerCount[k],
  }));

  // ✅ Comparison Chart (per interview)
  const comparisonData = interviews.map((i, idx) => {
    let r = 0,
      c = 0,
      s = 0,
      n = 0;

    i.answers?.forEach((a: any) => {
      r += a.relevanceScore || 0;
      c += a.confidenceScore || 0;
      s += a.starScore || 0;
      n++;
    });

    return {
      name: `I${idx + 1}`,
      relevance: n ? Math.round(r / n) : 0,
      confidence: n ? Math.round(c / n) : 0,
      star: n ? Math.round(s / n) : 0,
    };
  });

  return NextResponse.json({
    totalInterviews: interviews.length,
    avgScore,
    bestScore,
    improvementRate,
    charts: {
      trendData,
      radarData,
      fillerData,
      comparisonData,
    },
  });
}
