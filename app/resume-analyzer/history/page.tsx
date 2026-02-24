"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useResumeStore } from "@/store/resumeStore";
import {
  DashboardNavbar,
  GradientText,
  ResumeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ResumeHistorySkeleton,
} from "@/components";

interface ResumeItem {
  _id: string;
  fileName: string;
  targetRole?: string;
  experienceLevel?: string;
  atsScore: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  createdAt: string;
}

export default function ResumeHistoryPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { setSelectedResume } = useResumeStore();
  const router = useRouter();

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchResumes = async () => {
      try {
        const res = await fetch("/api/resume/list", {
          headers: {
            firebaseUid: user.uid,
          },
        });
        const data = await res.json();
        setResumes(data.resumes || data);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [user]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const handleSelectResume = (resume: ResumeItem) => {
    setSelectedResume(resume);
    router.push("/interviews/setup");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <ResumeHistorySkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            onPress={() => router.push("/dashboard")}
            className="text-foreground/60 hover:text-foreground cursor-pointer"
          >
            Back to Dashboard
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
              <GradientText>Resume History</GradientText>
            </h1>
            <p className="text-foreground/60">
              View and manage your analyzed resumes.
            </p>
          </div>
          <Button
            color="primary"
            className="cursor-pointer"
            onPress={() => router.push("/resume-analyzer")}
            startContent={<ResumeIcon size={18} />}
          >
            Upload New Resume
          </Button>
        </motion.div>

        {/* Stats Overview */}
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {resumes.length}
                </p>
                <p className="text-sm text-foreground/60">Total Resumes</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-success">
                  {resumes.length > 0
                    ? Math.round(
                        resumes.reduce((sum, r) => sum + r.atsScore, 0) /
                          resumes.length
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-foreground/60">Avg ATS Score</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {resumes.length > 0
                    ? Math.max(...resumes.map((r) => r.atsScore))
                    : 0}
                  %
                </p>
                <p className="text-sm text-foreground/60">Best Score</p>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Resume List */}
        {resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ResumeIcon size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Resumes Yet</h2>
            <p className="text-foreground/60 mb-6 max-w-md mx-auto">
              Upload your first resume to get an ATS score and personalized
              improvement suggestions.
            </p>
            <Button
              color="primary"
              size="lg"
              className="cursor-pointer"
              onPress={() => router.push("/resume-analyzer")}
            >
              Upload Resume
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-content1/50 backdrop-blur-sm border border-divider hover:border-primary/30 transition-all">
                  <CardBody className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                          <ResumeIcon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {resume.fileName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {resume.targetRole && (
                              <Chip size="sm" variant="flat">
                                {resume.targetRole}
                              </Chip>
                            )}
                            {resume.experienceLevel && (
                              <Chip size="sm" variant="bordered">
                                {resume.experienceLevel}
                              </Chip>
                            )}
                            <span className="text-sm text-foreground/60">
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* ATS Score Progress */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-foreground/60">ATS Score</span>
                              <span
                                className={`font-semibold text-${getScoreColor(
                                  resume.atsScore
                                )}`}
                              >
                                {resume.atsScore}%
                              </span>
                            </div>
                            <Progress
                              value={resume.atsScore}
                              color={getScoreColor(resume.atsScore)}
                              size="sm"
                              className="max-w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 md:flex-shrink-0">
                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          className="cursor-pointer"
                          endContent={<ArrowRightIcon size={16} />}
                          onPress={() => handleSelectResume(resume)}
                        >
                          Start Interview
                        </Button>
                      </div>
                    </div>

                    {/* Keywords Preview */}
                    {resume.matchedKeywords && resume.matchedKeywords.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-divider">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-foreground/60">
                            Matched:
                          </span>
                          {resume.matchedKeywords.slice(0, 5).map((keyword, idx) => (
                            <Chip
                              key={`matched-${resume._id}-${idx}-${keyword}`}
                              size="sm"
                              color="success"
                              variant="flat"
                            >
                              {keyword}
                            </Chip>
                          ))}
                          {resume.matchedKeywords.length > 5 && (
                            <span className="text-xs text-foreground/60">
                              +{resume.matchedKeywords.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
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
