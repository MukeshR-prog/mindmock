import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  const firebaseUid = req.headers.get("firebaseUid");

  await connectDB();

  const user = await User.findOne({ firebaseUid });

  return NextResponse.json({
    totalInterviews: user?.totalInterviews || 0,
    bestConfidence: user?.bestConfidence || 0,
    avgAtsScore: user?.avgAtsScore || 0,
  });
}
