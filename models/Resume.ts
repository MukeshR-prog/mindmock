import mongoose, { Schema, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    atsScore: Number,
    extractedText: String,
  },
  { timestamps: true }
);

export default models.Resume || mongoose.model("Resume", ResumeSchema);
