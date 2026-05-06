const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const mongoose = require('mongoose');

// Helper to calculate score normalization (matching utils/scoreCalculator)
function normalizeOverallScore(score) {
  if (score === undefined || score === null) return 0;
  return Math.round(score);
}

function clampPercentage(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

async function runBenchmark() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  // Retrieve a user to run user-specific benchmarks
  const User = mongoose.connection.model('User', new mongoose.Schema({}, { strict: false }), 'users');
  const Interview = mongoose.connection.model('Interview', new mongoose.Schema({}, { strict: false }), 'interviews');

  const testUser = await User.findOne({ totalInterviews: { $gt: 0 } });
  if (!testUser) {
    console.log("No users with completed interviews found in database. Finding any user...");
    const anyUser = await User.findOne({});
    if (!anyUser) {
      console.error("No users found in database to benchmark. Exiting.");
      await mongoose.disconnect();
      return;
    }
    console.log(`Using user: ${anyUser._id} (${anyUser.email})`);
    await runBenchmarksForUser(anyUser, Interview);
  } else {
    console.log(`Found active user with completed interviews: ${testUser._id} (${testUser.email})`);
    await runBenchmarksForUser(testUser, Interview);
  }

  await mongoose.disconnect();
  console.log("Disconnected.");
}

async function runBenchmarksForUser(user, Interview) {
  console.log("\n--- Starting Benchmarks ---");

  // 1. Benchmark User Interviews Query with Projection
  const startQuery = performance.now();
  const interviews = await Interview.find({
    userId: user._id,
    status: "completed",
  })
    .select("overallScore createdAt answers.relevanceScore answers.confidenceScore answers.starScore answers.fillerWords")
    .sort({ createdAt: 1 })
    .lean();
  const endQuery = performance.now();
  console.log(`[PASS 1] User query projection time: ${(endQuery - startQuery).toFixed(2)} ms (fetched ${interviews.length} interviews)`);

  // 2. Benchmark Single-pass metrics calculation
  const startSinglePass = performance.now();
  let overallScoreSum = 0;
  let computedBestScore = 0;
  const trendData = [];
  let relevanceTotal = 0, confidenceTotal = 0, starTotal = 0, totalAnswers = 0;
  const fillerCount = {};

  interviews.forEach((interview, idx) => {
    const normScore = normalizeOverallScore(interview.overallScore);
    overallScoreSum += normScore;
    if (normScore > computedBestScore) {
      computedBestScore = normScore;
    }
    trendData.push({
      name: `I${idx + 1}`,
      score: normScore || 0,
    });

    interview.answers?.forEach((answer) => {
      relevanceTotal += answer.relevanceScore || 0;
      confidenceTotal += answer.confidenceScore || 0;
      starTotal += answer.starScore || 0;
      totalAnswers += 1;

      answer.fillerWords?.forEach((word) => {
        fillerCount[word] = (fillerCount[word] || 0) + 1;
      });
    });
  });

  const computedAvgScore = interviews.length
    ? Math.round(overallScoreSum / interviews.length)
    : 0;

  const userSkillAverages = totalAnswers ? {
    relevance: clampPercentage((relevanceTotal / totalAnswers) * 10),
    confidence: clampPercentage((confidenceTotal / totalAnswers) * 10),
    star: clampPercentage((starTotal / totalAnswers) * 10),
  } : { relevance: 0, confidence: 0, star: 0 };
  const endSinglePass = performance.now();
  console.log(`[PASS 2] Single-pass metrics computation: ${(endSinglePass - startSinglePass).toFixed(4)} ms`);

  // 3. Benchmark Peer aggregation query (Uncached)
  const startAgg = performance.now();
  const peerAveragesResult = await Interview.aggregate([
    {
      $match: {
        userId: { $ne: user._id },
        status: "completed",
      },
    },
    {
      $unwind: "$answers",
    },
    {
      $group: {
        _id: null,
        relevanceSum: { $sum: "$answers.relevanceScore" },
        confidenceSum: { $sum: "$answers.confidenceScore" },
        starSum: { $sum: "$answers.starScore" },
        answerCount: { $sum: 1 },
      },
    },
  ]);

  let peerSkillAverages = { relevance: 0, confidence: 0, star: 0 };
  if (peerAveragesResult.length > 0) {
    const { relevanceSum, confidenceSum, starSum, answerCount } = peerAveragesResult[0];
    if (answerCount > 0) {
      peerSkillAverages = {
        relevance: clampPercentage((relevanceSum / answerCount) * 10),
        confidence: clampPercentage((confidenceSum / answerCount) * 10),
        star: clampPercentage((starSum / answerCount) * 10),
      };
    }
  }
  const endAgg = performance.now();
  console.log(`[PASS 3] Peer averages DB aggregation (Uncached): ${(endAgg - startAgg).toFixed(2)} ms`);

  // 4. Benchmark Peer averages retrieved from Cache (Cached simulation)
  const startCache = performance.now();
  // Simulate cached reading
  const simulatedCacheResult = peerSkillAverages; 
  const endCache = performance.now();
  console.log(`[PASS 4] Peer averages cache retrieval: ${(endCache - startCache).toFixed(4)} ms`);

  console.log("\n--- Metrics Summary ---");
  console.log(`Total Interviews: ${interviews.length}`);
  console.log(`Average Score: ${computedAvgScore}`);
  console.log(`Best Score: ${computedBestScore}`);
  console.log(`User Skill Averages:`, userSkillAverages);
  console.log(`Peer Skill Averages:`, peerSkillAverages);
}

runBenchmark().catch(console.error);
