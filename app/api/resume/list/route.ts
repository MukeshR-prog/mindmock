import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Resume from "@/models/Resume";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    const firebaseUid = req.headers.get("firebaseUid");
    if (!firebaseUid) {
      return NextResponse.json(
        { resumes: [], error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json(
        { resumes: [], error: "User not found" },
        { status: 404 }
      );
    }

    const resumes = await Resume.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select("_id fileName targetRole experienceLevel atsScore matchedKeywords missingKeywords createdAt");

    // Ensure all required fields are present with proper defaults
    const validatedResumes = resumes.map((resume: any) => ({
      _id: resume._id,
      fileName: resume.fileName || "Untitled Resume",
      targetRole: resume.targetRole || "Not specified",
      experienceLevel: resume.experienceLevel || "fresher",
      atsScore: Math.max(0, Math.min(100, resume.atsScore || 0)),
      matchedKeywords: Array.isArray(resume.matchedKeywords) ? resume.matchedKeywords : [],
      missingKeywords: Array.isArray(resume.missingKeywords) ? resume.missingKeywords : [],
      createdAt: resume.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json({ resumes: validatedResumes });
  } catch (error) {
    console.error("RESUME LIST ERROR:", error);
    return NextResponse.json(
      { resumes: [], error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
