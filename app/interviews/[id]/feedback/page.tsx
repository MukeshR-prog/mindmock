"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import {
  DashboardNavbar,
  GradientText,
  ProgressRing,
  ChartIcon,
  TargetIcon,
  SparklesIcon,
  TrendingIcon,
  MicrophoneIcon,
  ArrowLeftIcon,
} from "@/components";

interface Answer {
  question: string;
  answer: string;
  relevanceScore: number;
  confidenceScore: number;
  starScore: number;
  fillerWords: string[];
  feedback: string;
}

interface Interview {
  _id: string;
  status: string;
  targetRole?: string;
  interviewType?: string;
  difficulty?: string;
  overallScore?: number;
  answers: Answer[];
  createdAt: string;
  interviewMode?: string;
  selectedConcepts?: string[];
}

export default function FeedbackPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const loadInterview = async () => {
      try {
        const res = await fetch(`/api/interviews/${id}`);

        if (!res.ok) {
          console.error("Failed to fetch interview");
          return;
        }

        const data = await res.json();
        setInterview(data);
      } catch (error) {
        console.error("Error loading interview:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [id, user]);

  // Show loading if auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number, max: number = 10) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    return "danger";
  };

  const calculateOverallScore = () => {
    if (!interview?.answers || interview.answers.length === 0) return 0;

    const totalScore = interview.answers.reduce((sum, answer) => {
      return (
        sum +
        (answer.relevanceScore + answer.confidenceScore + answer.starScore) / 3
      );
    }, 0);

    return Math.round((totalScore / interview.answers.length) * 10);
  };

  const calculateAverageScores = () => {
    if (!interview?.answers || interview.answers.length === 0) {
      return { relevance: 0, confidence: 0, star: 0 };
    }

    const totals = interview.answers.reduce(
      (acc, answer) => ({
        relevance: acc.relevance + answer.relevanceScore,
        confidence: acc.confidence + answer.confidenceScore,
        star: acc.star + answer.starScore,
      }),
      { relevance: 0, confidence: 0, star: 0 }
    );

    const count = interview.answers.length;
    return {
      relevance: Math.round((totals.relevance / count) * 10),
      confidence: Math.round((totals.confidence / count) * 10),
      star: Math.round((totals.star / count) * 10),
    };
  };

  const getTotalFillerWords = () => {
    if (!interview?.answers) return 0;
    return interview.answers.reduce(
      (sum, answer) => sum + (answer.fillerWords?.length || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Interview Not Found</h2>
            <Button color="primary" onPress={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const avgScores = calculateAverageScores();
  const overallScore = calculateOverallScore();

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Button
            variant="light"
            size="sm"
            startContent={<ArrowLeftIcon size={18} />}
            onPress={() => router.push("/interviews/history")}
            className="text-foreground/60 hover:text-foreground"
          >
            Back to Interview History
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <GradientText>Interview Feedback</GradientText>
            </h1>
            <p className="text-foreground/60">
              {interview.targetRole || "Mock Interview"} •{" "}
              {interview.interviewMode === "concept-based" ? "Concept-Based" : "Resume-Based"} •{" "}
              {new Date(interview.createdAt).toLocaleDateString()}
            </p>
            {interview.selectedConcepts && interview.selectedConcepts.length > 0 && (
              <p className="text-sm text-foreground/50 mt-1">
                Topics: {interview.selectedConcepts.map(c => c.toUpperCase()).join(", ")}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="flat"
              color="primary"
              onPress={() => router.push("/interviews/history")}
            >
              View All Interviews
            </Button>
            <Button
              color="primary"
              onPress={() => router.push("/interviews/setup")}
              startContent={<MicrophoneIcon size={18} />}
            >
              New Interview
            </Button>
          </div>
        </motion.div>

        {/* Score Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Overall Score */}
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider md:col-span-1">
            <CardBody className="p-6 flex flex-col items-center justify-center">
              <ProgressRing
                value={overallScore}
                color={`hsl(var(--heroui-${getScoreColor(overallScore, 100)}))`}
                sublabel="/100"
                size={140}
                strokeWidth={10}
              />
              <p className="mt-4 font-semibold">Overall Score</p>
            </CardBody>
          </Card>

          {/* Individual Scores */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <TargetIcon size={20} />
                  </div>
                  <span className="font-medium">Relevance</span>
                </div>
                <p className="text-3xl font-bold mb-2">{avgScores.relevance}%</p>
                <Progress
                  value={avgScores.relevance}
                  color={getScoreColor(avgScores.relevance, 100)}
                  size="sm"
                />
              </CardBody>
            </Card>

            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <TrendingIcon size={20} />
                  </div>
                  <span className="font-medium">Confidence</span>
                </div>
                <p className="text-3xl font-bold mb-2">{avgScores.confidence}%</p>
                <Progress
                  value={avgScores.confidence}
                  color={getScoreColor(avgScores.confidence, 100)}
                  size="sm"
                />
              </CardBody>
            </Card>

            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                    <ChartIcon size={20} />
                  </div>
                  <span className="font-medium">STAR Score</span>
                </div>
                <p className="text-3xl font-bold mb-2">{avgScores.star}%</p>
                <Progress
                  value={avgScores.star}
                  color={getScoreColor(avgScores.star, 100)}
                  size="sm"
                />
              </CardBody>
            </Card>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardBody className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {interview.answers?.length || 0}
              </p>
              <p className="text-sm text-foreground/60">Questions Answered</p>
            </CardBody>
          </Card>
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardBody className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">
                {getTotalFillerWords()}
              </p>
              <p className="text-sm text-foreground/60">Filler Words Used</p>
            </CardBody>
          </Card>
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardBody className="p-4 text-center">
              <Chip color={interview.difficulty === "senior" ? "danger" : interview.difficulty === "mid" ? "warning" : "success"}>
                {interview.difficulty || "Junior"}
              </Chip>
              <p className="text-sm text-foreground/60 mt-1">Difficulty</p>
            </CardBody>
          </Card>
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardBody className="p-4 text-center">
              <Chip color="primary" variant="flat">
                {interview.interviewType || "Mixed"}
              </Chip>
              <p className="text-sm text-foreground/60 mt-1">Type</p>
            </CardBody>
          </Card>
        </motion.div>

        {/* Detailed Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4">Detailed Feedback</h2>
          <div className="space-y-4">
            {interview.answers?.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-content1/50 backdrop-blur-sm border border-divider overflow-hidden">
                  <CardHeader
                    className="px-6 py-4 cursor-pointer hover:bg-content2/50 transition-colors"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  >
                    <div className="flex items-start gap-4 w-full">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <span className="font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-left">{answer.question}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          color={getScoreColor(
                            (answer.relevanceScore +
                              answer.confidenceScore +
                              answer.starScore) /
                              3,
                            10
                          )}
                        >
                          {Math.round(
                            ((answer.relevanceScore +
                              answer.confidenceScore +
                              answer.starScore) /
                              3) *
                              10
                          )}
                          %
                        </Chip>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transform transition-transform ${
                            expandedIndex === index ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardBody className="px-6 pb-6 pt-0 border-t border-divider">
                        {/* Your Answer */}
                        <div className="mb-6 mt-4">
                          <p className="text-sm font-medium text-foreground/60 mb-2">
                            Your Answer
                          </p>
                          <p className="text-sm bg-content2/50 p-4 rounded-xl">
                            {answer.answer}
                          </p>
                        </div>

                        {/* Score Breakdown */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 rounded-xl bg-content2/50">
                            <p className="text-2xl font-bold text-primary">
                              {answer.relevanceScore}/10
                            </p>
                            <p className="text-xs text-foreground/60">Relevance</p>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-content2/50">
                            <p className="text-2xl font-bold text-secondary">
                              {answer.confidenceScore}/10
                            </p>
                            <p className="text-xs text-foreground/60">Confidence</p>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-content2/50">
                            <p className="text-2xl font-bold text-success">
                              {answer.starScore}/10
                            </p>
                            <p className="text-xs text-foreground/60">STAR Score</p>
                          </div>
                        </div>

                        {/* Filler Words */}
                        {answer.fillerWords && answer.fillerWords.length > 0 && (
                          <div className="mb-6">
                            <p className="text-sm font-medium text-foreground/60 mb-2">
                              Filler Words Used
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {answer.fillerWords.map((word, i) => (
                                <Chip key={i} size="sm" color="warning" variant="flat">
                                  {word}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Feedback */}
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-2 mb-2">
                            <SparklesIcon size={16} className="text-primary" />
                            <span className="text-sm font-medium">
                              AI Suggestions
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80">
                            {answer.feedback}
                          </p>
                        </div>
                      </CardBody>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-divider">
            <CardBody className="p-8">
              <h3 className="text-xl font-bold mb-2">Ready to improve?</h3>
              <p className="text-foreground/60 mb-6">
                Practice more to enhance your interview skills and confidence.
              </p>
              <Button
                color="primary"
                size="lg"
                onPress={() => router.push("/interviews/setup")}
                startContent={<MicrophoneIcon size={20} />}
              >
                Start Another Interview
              </Button>
            </CardBody>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
