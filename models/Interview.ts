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
    resumeId: { type: Schema.Types.ObjectId, ref: "Resume" }, // Optional for concept-based interviews

    // Interview mode
    interviewMode: { 
      type: String, 
      enum: ["resume-based", "concept-based"], 
      default: "resume-based" 
    },

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

    // Concept-based interview fields
    selectedConcepts: [{ type: String }], // OS, CN, DBMS, OOP, etc.
    conceptFocus: { type: String }, // Primary concept focus

    // Interview experience settings
    voiceType: { 
      type: String, 
      enum: ["professional-male", "professional-female", "friendly-male", "friendly-female"], 
      default: "professional-female" 
    },
    cameraEnabled: { type: Boolean, default: false },

    transcript: String,
    answers: [AnswerSchema],
    overallScore: Number,
  },
  { timestamps: true }
);

export default models.Interview ||
  mongoose.model("Interview", InterviewSchema);
