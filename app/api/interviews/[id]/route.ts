import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Interview from "@/models/Interview";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const interview = await Interview.findById(id).lean();

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error("FETCH INTERVIEW ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview" },
      { status: 500 }
    );
  }
}
