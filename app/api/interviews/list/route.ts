import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";
import User from "@/models/User";

export async function GET(req: Request) {
  await connectDB();

  const firebaseUid = req.headers.get("firebaseUid");
  if (!firebaseUid) {
    return NextResponse.json([], { status: 401 });
  }

  const user = await User.findOne({ firebaseUid });
  if (!user) {
    return NextResponse.json([], { status: 404 });
  }

  const interviews = await Interview.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .select("createdAt status");

  return NextResponse.json(interviews);
}
