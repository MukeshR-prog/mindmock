"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import { useResumeStore } from "@/store/resumeStore";
import { useAuthStore } from "@/store/authStore";
import {
  DashboardNavbar,
  GradientText,
  MicrophoneIcon,
  ResumeIcon,
  TargetIcon,
  RocketIcon,
} from "@/components";

export default function InterviewSetupPage() {
  const router = useRouter();
  const { selectedResume, setSelectedResume } = useResumeStore();
  const { user, loading: authLoading } = useAuthStore();

  const [jobDescription, setJobDescription] = useState("");
  const [interviewType, setInterviewType] = useState("mixed");
  const [difficulty, setDifficulty] = useState("junior");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (!selectedResume) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ResumeIcon size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Resume Selected</h2>
            <p className="text-foreground/60 mb-6 max-w-md mx-auto">
              Please select a resume from your history or upload a new one to
              start a mock interview.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                color="primary"
                variant="flat"
                onPress={() => router.push("/resume-analyzer/history")}
              >
                View Resume History
              </Button>
              <Button
                color="primary"
                onPress={() => router.push("/resume-analyzer")}
              >
                Upload New Resume
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const createInterview = async () => {
    if (!user || !jobDescription) return;

    setLoading(true);

    const res = await fetch("/api/interviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebaseUid: user.uid,
        resumeId: selectedResume._id,
        jobDescription,
        interviewType,
        difficulty,
      }),
    });

    const interview = await res.json();
    setLoading(false);

    router.push(`/interviews/${interview._id}/live`);
  };

  const interviewTypes = [
    {
      key: "technical",
      label: "Technical",
      description: "Focus on coding & system design",
    },
    {
      key: "behavioral",
      label: "Behavioral",
      description: "STAR method based questions",
    },
    {
      key: "mixed",
      label: "Mixed",
      description: "Both technical & behavioral",
    },
  ];

  const difficultyLevels = [
    { key: "junior", label: "Junior", color: "success" },
    { key: "mid", label: "Mid-Level", color: "warning" },
    { key: "senior", label: "Senior", color: "danger" },
    { key: "stress", label: "Stress Mode", color: "secondary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <GradientText>Interview Setup</GradientText>
          </h1>
          <p className="text-foreground/60">
            Configure your mock interview session and get ready to practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Setup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardHeader className="px-6 pt-6 pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MicrophoneIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Interview Settings</h3>
                    <p className="text-sm text-foreground/60">
                      Customize your practice session
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6 space-y-6">
                {/* Job Description */}
                <div>
                  <Textarea
                    label="Job Description"
                    placeholder="Paste the job description you're preparing for..."
                    minRows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    classNames={{
                      inputWrapper: "bg-content2/50",
                    }}
                    description="This helps generate relevant interview questions"
                  />
                </div>

                {/* Interview Type Selection */}
                <div>
                  <p className="text-sm font-medium mb-3">Interview Type</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {interviewTypes.map((type) => (
                      <motion.div
                        key={type.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          interviewType === type.key
                            ? "border-primary bg-primary/10"
                            : "border-divider hover:border-primary/50"
                        }`}
                        onClick={() => setInterviewType(type.key)}
                      >
                        <p className="font-medium">{type.label}</p>
                        <p className="text-xs text-foreground/60 mt-1">
                          {type.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <p className="text-sm font-medium mb-3">Difficulty Level</p>
                  <div className="flex flex-wrap gap-3">
                    {difficultyLevels.map((level) => (
                      <Chip
                        key={level.key}
                        color={level.color as any}
                        variant={difficulty === level.key ? "solid" : "flat"}
                        className="cursor-pointer"
                        onClick={() => setDifficulty(level.key)}
                      >
                        {level.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  color="primary"
                  size="lg"
                  isLoading={loading}
                  isDisabled={!jobDescription}
                  onPress={createInterview}
                  className="w-full font-semibold"
                  startContent={!loading && <RocketIcon size={20} />}
                >
                  {loading ? "Preparing Interview..." : "Start Interview"}
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          {/* Sidebar - Resume Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider sticky top-24">
              <CardHeader className="px-6 pt-6 pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <ResumeIcon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">Selected Resume</h3>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-content2/50">
                    <p className="font-medium truncate">{selectedResume.fileName}</p>
                    <p className="text-sm text-foreground/60 mt-1">
                      {selectedResume.targetRole || "No role specified"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-content2/50">
                    <span className="text-sm text-foreground/60">ATS Score</span>
                    <span className="text-xl font-bold text-primary">
                      {selectedResume.atsScore}/100
                    </span>
                  </div>

                  <Button
                    variant="flat"
                    color="primary"
                    size="sm"
                    className="w-full"
                    onPress={() => router.push("/resume-analyzer/history")}
                  >
                    Change Resume
                  </Button>
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TargetIcon size={16} className="text-primary" />
                    <span className="text-sm font-medium">Pro Tip</span>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Use the STAR method (Situation, Task, Action, Result) to
                    structure your answers for behavioral questions.
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
