import mongoose, { Schema, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    fileName: String,
    resumeText: String,

    targetRole: { type: String, required: true },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      required: true,
    },

    atsScore: Number,
    matchedKeywords: [String],
    missingKeywords: [String],
    
    // Enhanced ATS fields
    detailedScores: {
      keywordMatch: Number,
      skillsMatch: Number,
      formatScore: Number,
      experienceScore: Number,
      educationScore: Number,
      contactScore: Number,
      sectionScore: Number,
      quantifiableScore: Number
    },
    strengths: [String],
    weaknesses: [String],
    industryBenchmark: {
      percentile: Number,
      averageScore: Number,
      topTierThreshold: Number
    }
  },
  { timestamps: true }
);

export default models.Resume || mongoose.model("Resume", ResumeSchema);
