import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import Resume from "@/models/Resume";

/**
 * GET /api/resume/:id
 * Fetches a single resume document by its MongoDB ObjectId.
 * Used by the interview setup page to restore a resume reference
 * from the URL query param without downloading the entire list.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const resume = await Resume.findById(id)
      .select(
        "_id fileName targetRole experienceLevel atsScore matchedKeywords missingKeywords createdAt"
      )
      .lean();

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("FETCH RESUME BY ID ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}
