import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    provider: { type: String }, // google | password
    role: { type: String, default: "user" },

    // Dashboard stats (stored in DB)
    totalInterviews: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    improvementRate: { type: Number, default: 0 },
    avgAtsScore: { type: Number, default: 0 },
    totalResumes: { type: Number, default: 0 },
    
    // Skill averages
    avgRelevance: { type: Number, default: 0 },
    avgConfidence: { type: Number, default: 0 },
    avgStarScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
