import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { interviewId, transcript } = await req.json();

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID missing" },
        { status: 400 }
      );
    }

    await Interview.findByIdAndUpdate(interviewId, {
      transcript: transcript?.join("\n") || "",
      status: "completed",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("END INTERVIEW ERROR:", error);
    return NextResponse.json(
      { error: "Failed to end interview" },
      { status: 500 }
    );
  }
}
