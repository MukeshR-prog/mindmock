const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const mongoose = require('mongoose');

async function testIndexes() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  // Define schemas and index specifications matching our models to force creation during testing
  const InterviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["created", "in-progress", "completed"], default: "created" },
  }, { timestamps: true });
  InterviewSchema.index({ userId: 1, status: 1, createdAt: 1 });
  InterviewSchema.index({ status: 1, userId: 1 });

  const UserSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true },
  });

  const Interview = mongoose.models.Interview || mongoose.model('Interview', InterviewSchema, 'interviews');
  const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

  console.log("Syncing and building indexes...");
  try {
    await Interview.createIndexes();
    await User.createIndexes();
    console.log("Indexes sync completed.");
  } catch (err) {
    console.error("Error creating indexes:", err);
  }

  // Get index list from MongoDB native driver
  const interviewIndexes = await mongoose.connection.db.collection('interviews').listIndexes().toArray();
  console.log("\nIndexes on 'interviews' collection:");
  console.log(JSON.stringify(interviewIndexes, null, 2));

  const userIndexes = await mongoose.connection.db.collection('users').listIndexes().toArray();
  console.log("\nIndexes on 'users' collection:");
  console.log(JSON.stringify(userIndexes, null, 2));

  await mongoose.disconnect();
  console.log("\nDisconnected.");
}

testIndexes().catch(console.error);
