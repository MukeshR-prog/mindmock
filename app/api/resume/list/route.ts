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
      .select("fileName targetRole experienceLevel atsScore matchedKeywords missingKeywords createdAt");

    return NextResponse.json({ resumes });
  } catch (error) {
    return NextResponse.json(
      { resumes: [], error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
