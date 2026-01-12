import mongoose, { Schema, models } from "mongoose";

const InterviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: "Resume", required: true },

    jobDescription: { type: String, required: true },
    interviewType: {
      type: String,
      enum: ["technical", "behavioral", "mixed"],
      default: "mixed",
    },
    difficulty: {
      type: String,
      enum: ["junior", "mid", "senior", "stress"],
      default: "junior",
    },

    status: {
      type: String,
      enum: ["created", "in-progress", "completed"],
      default: "created",
    },

    transcript: { type: String, default: "" },
    confidenceScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Interview ||
  mongoose.model("Interview", InterviewSchema);
