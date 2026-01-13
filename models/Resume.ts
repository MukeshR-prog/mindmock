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
  },
  { timestamps: true }
);

export default models.Resume || mongoose.model("Resume", ResumeSchema);
