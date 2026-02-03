"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import {
  DashboardNavbar,
  GradientText,
  MicrophoneIcon,
  ChartIcon,
  ArrowRightIcon,
} from "@/components";

interface InterviewItem {
  _id: string;
  createdAt: string;
  status: string;
  targetRole?: string;
  overallScore?: number;
  interviewType?: string;
  interviewMode?: string;
  selectedConcepts?: string[];
}

export default function InterviewHistoryPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchInterviews = async () => {
      try {
        const res = await fetch("/api/interviews/list", {
          headers: {
            firebaseUid: user.uid,
          },
        });
        const data = await res.json();
        setInterviews(data.interviews || data);
      } catch (error) {
        console.error("Failed to fetch interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      default:
        return "default";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <GradientText>Interview History</GradientText>
            </h1>
            <p className="text-foreground/60">
              Review your past interviews and track your progress.
            </p>
          </div>
          <Button
            color="primary"
            onPress={() => router.push("/interviews/setup")}
            startContent={<MicrophoneIcon size={18} />}
          >
            New Interview
          </Button>
        </motion.div>

        {/* Stats Overview */}
        {interviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {interviews.length}
                </p>
                <p className="text-sm text-foreground/60">Total Interviews</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-success">
                  {interviews.filter((i) => i.status === "completed").length}
                </p>
                <p className="text-sm text-foreground/60">Completed</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-warning">
                  {interviews.filter((i) => i.status === "in-progress").length}
                </p>
                <p className="text-sm text-foreground/60">In Progress</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {interviews.length > 0
                    ? Math.round(
                        interviews
                          .filter((i) => i.overallScore)
                          .reduce((sum, i) => sum + (i.overallScore || 0), 0) /
                          interviews.filter((i) => i.overallScore).length || 0
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-foreground/60">Avg Score</p>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Interview List */}
        {interviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MicrophoneIcon size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Interviews Yet</h2>
            <p className="text-foreground/60 mb-6 max-w-md mx-auto">
              Start your first mock interview to practice and improve your
              interview skills.
            </p>
            <Button
              color="primary"
              size="lg"
              onPress={() => router.push("/resume-analyzer")}
            >
              Get Started
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-content1/50 backdrop-blur-sm border border-divider hover:border-primary/30 transition-all group">
                  <CardBody className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <MicrophoneIcon size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {interview.targetRole || "Mock Interview"}
                          </h3>
                          <p className="text-sm text-foreground/60">
                            {new Date(interview.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Chip
                              size="sm"
                              color={getStatusColor(interview.status)}
                              variant="flat"
                            >
                              {interview.status}
                            </Chip>
                            {interview.interviewMode === "concept-based" && (
                              <Chip size="sm" color="secondary" variant="flat">
                                Concept-Based
                              </Chip>
                            )}
                            {interview.interviewType && (
                              <Chip size="sm" variant="bordered">
                                {interview.interviewType}
                              </Chip>
                            )}
                            {interview.selectedConcepts && interview.selectedConcepts.length > 0 && (
                              <span className="text-xs text-foreground/50">
                                Topics: {interview.selectedConcepts.slice(0, 3).map(c => c.toUpperCase()).join(", ")}
                                {interview.selectedConcepts.length > 3 && ` +${interview.selectedConcepts.length - 3} more`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {interview.overallScore !== undefined && (
                          <div className="text-right">
                            <p className="text-sm text-foreground/60">Score</p>
                            <p
                              className={`text-2xl font-bold ${getScoreColor(
                                interview.overallScore
                              )}`}
                            >
                              {interview.overallScore}%
                            </p>
                          </div>
                        )}
                        <Button
                          color="primary"
                          variant={
                            interview.status === "completed" ? "flat" : "solid"
                          }
                          size="sm"
                          endContent={<ArrowRightIcon size={16} />}
                          onPress={() =>
                            router.push(
                              interview.status === "completed"
                                ? `/interviews/${interview._id}/feedback`
                                : `/interviews/${interview._id}/live`
                            )
                          }
                        >
                          {interview.status === "completed"
                            ? "View Feedback"
                            : "Continue"}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
