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
      interviewMode,
      selectedConcepts,
      conceptFocus,
      targetRole,
      voiceType,
      cameraEnabled,
    } = body;

    // Validate based on interview mode
    if (!firebaseUid) {
      return NextResponse.json(
        { error: "Missing user ID" },
        { status: 400 }
      );
    }

    // Resume-based requires resumeId and jobDescription
    if (interviewMode === "resume-based" && (!resumeId || !jobDescription)) {
      return NextResponse.json(
        { error: "Resume and job description required for resume-based interview" },
        { status: 400 }
      );
    }

    // Concept-based requires selectedConcepts
    if (interviewMode === "concept-based" && (!selectedConcepts || selectedConcepts.length === 0)) {
      return NextResponse.json(
        { error: "Please select at least one concept for concept-based interview" },
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

    const interviewData: any = {
      userId: user._id,
      interviewType,
      difficulty,
      interviewMode: interviewMode || "resume-based",
      voiceType: voiceType || "professional-female",
      cameraEnabled: cameraEnabled || false,
      answers: [],
    };

    // Add fields based on interview mode
    if (interviewMode === "concept-based") {
      interviewData.selectedConcepts = selectedConcepts;
      interviewData.conceptFocus = conceptFocus;
      interviewData.targetRole = targetRole || "Software Engineer";
      // Generate a description for concept-based interviews
      interviewData.jobDescription = `Technical interview focusing on ${selectedConcepts.join(", ")} concepts for ${targetRole || "Software Engineer"} position.`;
    } else {
      interviewData.resumeId = resumeId;
      interviewData.jobDescription = jobDescription;
    }

    const interview = await Interview.create(interviewData);

    return NextResponse.json(interview);
  } catch (error: any) {
    console.error("INTERVIEW CREATE ERROR 👉", error);
    return NextResponse.json(
      { error: "Interview creation failed" },
      { status: 500 }
    );
  }
}
