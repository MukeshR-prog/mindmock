import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Resume from "@/models/Resume";
import User from "@/models/User";
import mammoth from "mammoth";
import { calculateUniversalATS } from "@/utils/universalATS";
import { generateResumeSuggestions } from "@/utils/resumeSuggestions";

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription") as string;
    const firebaseUid = formData.get("firebaseUid") as string;
    const targetRole = formData.get("targetRole") as string;
    const experienceLevel = formData.get("experienceLevel") as string;

if (!targetRole || !experienceLevel) {
  return NextResponse.json(
    { error: "Missing role or experience" },
    { status: 400 }
  );
}

    if (!file || !jobDescription || !firebaseUid) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // ❌ Only DOCX for Day 3
    if (!file.name.toLowerCase().endsWith(".docx")) {
      return NextResponse.json(
        { error: "Only .docx resumes are supported for now" },
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

    // 🧠 Extract text from DOCX
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    const resumeText = result.value;

    // 🔍 ATS analysis
    const atsResult = calculateUniversalATS(resumeText, jobDescription);
    const suggestions = generateResumeSuggestions(
      atsResult.missingKeywords,
      atsResult.detectedRole
    );

    // 💾 Save to DB
    const resume = await Resume.create({
  userId: user._id,
  fileName: file.name,
  resumeText,
  targetRole,
  experienceLevel,
  atsScore: atsResult.atsScore,
  matchedKeywords: atsResult.matchedKeywords,
  missingKeywords: atsResult.missingKeywords,
});

return NextResponse.json({
  atsScore: atsResult.atsScore,
  detectedRole: atsResult.detectedRole,
  keywordScore: atsResult.keywordScore,
  roleSkillScore: atsResult.roleSkillScore,
  matchedKeywords: atsResult.matchedKeywords,
  missingKeywords: atsResult.missingKeywords,
  suggestions
});

  } catch (error: any) {
    console.error("RESUME ANALYZE ERROR 👉", error);
    return NextResponse.json(
      { error: "Resume analysis failed", details: error.message },
      { status: 500 }
    );
  }
}
