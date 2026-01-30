import mongoose, { Schema, models } from "mongoose";

const AnswerSchema = new Schema({
  question: String,
  answer: String,
  relevanceScore: Number,   // 0–10
  confidenceScore: Number,  // 0–10
  starScore: Number,        // 0–10
  fillerWords: [String],
  feedback: String,
});

const InterviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: "Resume", required: true },

    status: {
      type: String,
      enum: ["created", "in-progress", "completed"],
      default: "created",
    },

    // Interview settings
    targetRole: { type: String },
    interviewType: { type: String, enum: ["technical", "behavioral", "mixed"], default: "mixed" },
    difficulty: { type: String, enum: ["junior", "mid", "senior", "stress"], default: "junior" },
    jobDescription: { type: String },

    transcript: String,
    answers: [AnswerSchema],
    overallScore: Number,
  },
  { timestamps: true }
);

export default models.Interview ||
  mongoose.model("Interview", InterviewSchema);
