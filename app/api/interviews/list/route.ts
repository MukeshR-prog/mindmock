import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import User from "@/models/User";
import { verifyAuth } from "@/utils/jwt";

export async function GET(req: Request) {
  let auth;
  try {
    auth = await verifyAuth(req);
  } catch {
    return NextResponse.json({ interviews: [], error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { firebaseUid } = auth;
  const user = await User.findOne({ firebaseUid });
  if (!user) {
    return NextResponse.json({ interviews: [], error: "User not found" }, { status: 404 });
  }

  const interviews = await Interview.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .select("createdAt status targetRole overallScore interviewType difficulty");

  return NextResponse.json({ interviews });
}
