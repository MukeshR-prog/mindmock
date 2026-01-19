import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import User from "@/models/User";
import Interview from "@/models/Interview";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      firebaseUid,
      resumeId,
      jobDescription,
      interviewType,
      difficulty,
    } = body;

    if (!firebaseUid || !resumeId || !jobDescription) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const interview = await Interview.create({
      userId: user._id,
      resumeId,
      jobDescription,
      interviewType,
      difficulty,
      answers: [], 
    });

    return NextResponse.json(interview);
  } catch (error: any) {
    console.error("INTERVIEW CREATE ERROR 👉", error);
    return NextResponse.json(
      { error: "Interview creation failed" },
      { status: 500 }
    );
  }
}
