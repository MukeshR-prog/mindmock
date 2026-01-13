import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { interviewId, transcript } = await req.json();

    if (!interviewId || !transcript) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    await Interview.findByIdAndUpdate(interviewId, {
      transcript: transcript.join("\n"),
      status: "in-progress",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transcript" },
      { status: 500 }
    );
  }
}
