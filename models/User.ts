import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    provider: { type: String }, // google | password
    role: { type: String, default: "user" },

    // dashboard stats
    totalInterviews: { type: Number, default: 0 },
    bestConfidence: { type: Number, default: 0 },
    avgAtsScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
