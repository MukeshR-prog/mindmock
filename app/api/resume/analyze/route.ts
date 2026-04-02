export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Resume from "@/models/Resume";
import User from "@/models/User";
import mammoth from "mammoth";
import { calculateIndustryStandardATS } from "@/utils/industryStandardATS";
import { generateEnhancedResumeSuggestions } from "@/utils/enhancedResumeSuggestions";

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

    // ✅ Validate file format (PDF or DOCX)
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".pdf") && !fileName.endsWith(".docx")) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported" },
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

    // 🧠 Extract text from file
    const buffer = Buffer.from(await file.arrayBuffer());
    let resumeText = "";

    if (file.name.toLowerCase().endsWith(".pdf")) {
      // Extract from PDF using pdf2json
      try {
        const PDFParser = require("pdf2json");
        const pdfParser = new PDFParser(null, 1);
        
        // Parse PDF using Promise
        const parsePdf = () => new Promise<string>((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error("PDF Parser Error:", errData);
            reject(errData.parserError);
          });
          pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            try {
              // Safe decode function that handles malformed URIs
              const safeDecode = (str: string): string => {
                try {
                  return decodeURIComponent(str);
                } catch {
                  // If decode fails, return the original string
                  return str.replace(/%[0-9A-Fa-f]{2}/g, (match) => {
                    try {
                      return decodeURIComponent(match);
                    } catch {
                      return match;
                    }
                  });
                }
              };

              // Extract text from all pages
              let text = "";
              if (pdfData && pdfData.Pages) {
                pdfData.Pages.forEach((page: any) => {
                  if (page.Texts) {
                    page.Texts.forEach((textItem: any) => {
                      if (textItem.R) {
                        textItem.R.forEach((run: any) => {
                          if (run.T) {
                            text += safeDecode(run.T) + " ";
                          }
                        });
                      }
                    });
                    text += "\n";
                  }
                });
              }
              console.log("Extracted PDF text length:", text.length);
              resolve(text.trim());
            } catch (extractError) {
              console.error("Text extraction error:", extractError);
              reject(extractError);
            }
          });
          pdfParser.parseBuffer(buffer);
        });

        resumeText = await parsePdf();
      } catch (pdfError: any) {
        console.error("PDF parsing error:", pdfError);
        return NextResponse.json(
          { error: "Failed to parse PDF file", details: pdfError.message },
          { status: 400 }
        );
      }
    } else if (file.name.toLowerCase().endsWith(".docx")) {
      // Extract from DOCX
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value;
    }

    console.log("Final extracted text length:", resumeText.length);
    console.log("Text preview:", resumeText.substring(0, 200));

    if (!resumeText.trim()) {
      console.error("Empty text extracted from file:", file.name);
      return NextResponse.json(
        { error: "Failed to extract text from resume. The file may be empty or contain only images." },
        { status: 400 }
      );
    }

    // 🔍 Industry-standard ATS analysis
    const atsResult = calculateIndustryStandardATS(
      resumeText, 
      jobDescription, 
      targetRole, 
      experienceLevel
    );
    
    const enhancedSuggestions = generateEnhancedResumeSuggestions(atsResult);

    // 💾 Save to DB with enhanced data
    const resume = await Resume.create({
      userId: user._id,
      fileName: file.name,
      resumeText,
      targetRole,
      experienceLevel,
      atsScore: atsResult.atsScore,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      detailedScores: atsResult.detailedScores,
      strengths: atsResult.strengths,
      weaknesses: atsResult.weaknesses,
      industryBenchmark: atsResult.industryBenchmark
    });

    // Update user's ATS stats
    await updateUserAtsStats(user._id);

    return NextResponse.json({
      _id: resume._id,           // ← returned so the frontend can pass resumeId to /interviews/setup
      atsScore: atsResult.atsScore,
      detectedRole: atsResult.detectedRole,
      detailedScores: atsResult.detailedScores,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      criticalMissingSkills: atsResult.criticalMissingSkills,
      recommendations: atsResult.recommendations,
      strengths: atsResult.strengths,
      weaknesses: atsResult.weaknesses,
      industryBenchmark: atsResult.industryBenchmark,
      suggestions: enhancedSuggestions,
      // Legacy compatibility
      keywordScore: atsResult.detailedScores.keywordMatch,
      roleSkillScore: atsResult.detailedScores.skillsMatch
    });

  } catch (error: any) {
    console.error("RESUME ANALYZE ERROR 👉", error);
    return NextResponse.json(
      { error: "Resume analysis failed", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to update user's ATS stats
async function updateUserAtsStats(userId: string) {
  const resumes = await Resume.find({ userId }).lean();
  
  if (!resumes.length) return;
  
  const totalResumes = resumes.length;
  const avgAtsScore = Math.round(
    resumes.reduce((sum: number, r: any) => sum + (r.atsScore || 0), 0) / totalResumes
  );
  
  await User.findByIdAndUpdate(userId, {
    totalResumes,
    avgAtsScore,
  });
}
