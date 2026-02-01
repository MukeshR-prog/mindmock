"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Progress } from "@heroui/progress";
import { motion } from "framer-motion";
import {
  DashboardNavbar,
  GradientText,
  ResumeIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@/components";

export default function ResumeAnalyzerPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [role, setRole] = useState<string>("frontend");
  const [customRole, setCustomRole] = useState<string>("");
  const [experience, setExperience] = useState<string>("fresher");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".docx") || droppedFile.name.endsWith(".pdf")) {
        setFile(droppedFile);
      }
    }
  };

  const analyzeResume = async () => {
    if (!file || !user) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);
    formData.append("firebaseUid", user.uid);
    formData.append("targetRole", role === "custom" ? customRole : role);
    formData.append("experienceLevel", experience);

    const res = await fetch("/api/resume/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

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
            <GradientText>Resume Analyzer</GradientText>
          </h1>
          <p className="text-foreground/60">
            Upload your resume and get instant ATS score with actionable suggestions.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ResumeIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upload Resume</h3>
                  <p className="text-sm text-foreground/60">
                    DOCX and PDF format supported
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 space-y-5">
              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-divider hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".docx,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ResumeIcon size={32} className="text-primary" />
                </div>
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-success">
                    <CheckCircleIcon size={20} />
                    <span className="font-medium">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <p className="font-medium mb-1">
                      Drag & drop your resume here
                    </p>
                    <p className="text-sm text-foreground/60">
                      or click to browse (DOCX and PDF)
                    </p>
                  </>
                )}
              </div>

              {/* Job Description */}
              <Textarea
                label="Job Description"
                placeholder="Paste the job description here for better keyword matching..."
                minRows={5}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                classNames={{
                  inputWrapper: "bg-content2/50",
                }}
              />

              {/* Options Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Select
                    label="Target Role"
                    selectedKeys={[role]}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      setRole(value);
                      if (value !== "custom") {
                        setCustomRole("");
                      }
                    }}
                    classNames={{
                      trigger: "bg-content2/50",
                    }}
                  >
                    <SelectItem key="frontend">Frontend Developer</SelectItem>
                    <SelectItem key="backend">Backend Developer</SelectItem>
                    <SelectItem key="fullstack">Full Stack Developer</SelectItem>
                    <SelectItem key="devops">DevOps Engineer</SelectItem>
                    <SelectItem key="data">Data Scientist</SelectItem>
                    <SelectItem key="mobile">Mobile Developer</SelectItem>
                    <SelectItem key="custom">Other (Custom Role)</SelectItem>
                  </Select>

                  {role === "custom" && (
                    <Input
                      label="Enter Custom Role"
                      placeholder="e.g., Machine Learning Engineer, QA Engineer..."
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      classNames={{
                        inputWrapper: "bg-content2/50",
                      }}
                    />
                  )}
                </div>

                <Select
                  label="Experience Level"
                  selectedKeys={[experience]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setExperience(value);
                  }}
                  classNames={{
                    trigger: "bg-content2/50",
                  }}
                >
                  <SelectItem key="fresher">Fresher</SelectItem>
                  <SelectItem key="junior">0–2 Years</SelectItem>
                  <SelectItem key="mid">2–5 Years</SelectItem>
                  <SelectItem key="senior">5+ Years</SelectItem>
                </Select>
              </div>

              {/* Analyze Button */}
              <Button
                color="primary"
                size="lg"
                onPress={analyzeResume}
                isLoading={loading}
                isDisabled={!file || (role === "custom" && !customRole.trim())}
                className="w-full font-semibold"
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </Button>
            </CardBody>
          </Card>
        </motion.div>

        {/* Results Section */}
        {result && result.atsScore !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 space-y-6"
          >
            {/* ATS Score Card */}
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider overflow-hidden">
              <CardBody className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <svg className="w-32 h-32 -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="hsl(var(--heroui-content2))"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke={`hsl(var(--heroui-${getScoreColor(result.atsScore)}))`}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={351.86}
                        initial={{ strokeDashoffset: 351.86 }}
                        animate={{
                          strokeDashoffset:
                            351.86 - (result.atsScore / 100) * 351.86,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{result.atsScore}</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2">ATS Score</h2>
                    <p className="text-foreground/60 mb-4">
                      {result.atsScore >= 80
                        ? "Excellent! Your resume is well-optimized for ATS."
                        : result.atsScore >= 60
                        ? "Good score! Some improvements can be made."
                        : "Your resume needs optimization for better ATS compatibility."}
                    </p>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() => router.push("/interviews/setup")}
                    >
                      Start Mock Interview
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Missing Keywords */}
            {Array.isArray(result.missingKeywords) &&
              result.missingKeywords.length > 0 && (
                <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
                  <CardHeader className="px-6 pt-6 pb-0">
                    <h3 className="text-lg font-semibold text-danger">
                      Missing Keywords
                    </h3>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <p className="text-sm text-foreground/60 mb-4">
                      Consider adding these keywords to improve your ATS score:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((word: string) => (
                        <Chip
                          key={word}
                          color="danger"
                          variant="flat"
                          size="sm"
                        >
                          {word}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

            {/* Matched Keywords */}
            {Array.isArray(result.matchedKeywords) &&
              result.matchedKeywords.length > 0 && (
                <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
                  <CardHeader className="px-6 pt-6 pb-0">
                    <h3 className="text-lg font-semibold text-success">
                      Matched Keywords
                    </h3>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.map((word: string) => (
                        <Chip
                          key={word}
                          color="success"
                          variant="flat"
                          size="sm"
                        >
                          {word}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

            {/* AI Suggestions */}
            {result?.suggestions && result.suggestions.length > 0 && (
              <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
                <CardHeader className="px-6 pt-6 pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <SparklesIcon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold">AI Suggestions</h3>
                  </div>
                </CardHeader>
                <CardBody className="px-6 pb-6">
                  <ul className="space-y-3">
                    {result.suggestions.map((suggestion: string, idx: number) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-content2/50"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">
                            {idx + 1}
                          </span>
                        </div>
                        <p className="text-sm">{suggestion}</p>
                      </motion.li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
