"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Textarea, Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
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
  BrainIcon,
  ArrowLeftIcon,
} from "@/components";

// Core CS Concepts for concept-based interviews
const coreConceptCategories = [
  {
    category: "Computer Science Fundamentals",
    concepts: [
      { key: "os", label: "Operating Systems", icon: "💻", description: "Process, Memory, Scheduling" },
      { key: "cn", label: "Computer Networks", icon: "🌐", description: "TCP/IP, HTTP, DNS, OSI Model" },
      { key: "dbms", label: "Database Management", icon: "🗄️", description: "SQL, Normalization, Indexing" },
      { key: "oops", label: "Object-Oriented Programming", icon: "🧱", description: "Inheritance, Polymorphism, Abstraction" },
    ]
  },
  {
    category: "Data Structures & Algorithms",
    concepts: [
      { key: "dsa", label: "DSA Fundamentals", icon: "📊", description: "Arrays, Trees, Graphs, DP" },
      { key: "sorting", label: "Sorting & Searching", icon: "🔍", description: "QuickSort, BinarySearch, etc." },
      { key: "complexity", label: "Time & Space Complexity", icon: "⏱️", description: "Big O, Optimization" },
    ]
  },
  {
    category: "System Design & Architecture",
    concepts: [
      { key: "system-design", label: "System Design", icon: "🏗️", description: "Scalability, Load Balancing" },
      { key: "design-patterns", label: "Design Patterns", icon: "🎨", description: "Singleton, Factory, Observer" },
      { key: "microservices", label: "Microservices", icon: "🔌", description: "API Gateway, Service Mesh" },
    ]
  },
  {
    category: "Web & Software Development",
    concepts: [
      { key: "web", label: "Web Development", icon: "🌍", description: "REST, GraphQL, WebSockets" },
      { key: "security", label: "Security Fundamentals", icon: "🔐", description: "Authentication, Encryption" },
      { key: "testing", label: "Testing & QA", icon: "🧪", description: "Unit, Integration, E2E Testing" },
      { key: "devops", label: "DevOps & CI/CD", icon: "🚀", description: "Docker, Kubernetes, Jenkins" },
    ]
  },
];

const targetRoles = [
  { key: "sde", label: "Software Development Engineer" },
  { key: "frontend", label: "Frontend Developer" },
  { key: "backend", label: "Backend Developer" },
  { key: "fullstack", label: "Full Stack Developer" },
  { key: "data-engineer", label: "Data Engineer" },
  { key: "devops", label: "DevOps Engineer" },
  { key: "system-design", label: "System Design Engineer" },
  { key: "custom", label: "Other (Custom)" },
];

export default function InterviewSetupPage() {
  const router = useRouter();
  const { selectedResume, setSelectedResume } = useResumeStore();
  const { user, loading: authLoading } = useAuthStore();

  // Interview mode: "resume" or "concept"
  const [interviewMode, setInterviewMode] = useState<string>("concept");
  
  // Common settings
  const [interviewType, setInterviewType] = useState("technical");
  const [difficulty, setDifficulty] = useState("junior");
  const [loading, setLoading] = useState(false);

  // Resume-based settings
  const [jobDescription, setJobDescription] = useState("");

  // Concept-based settings
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState("sde");
  const [customRole, setCustomRole] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const toggleConcept = (conceptKey: string) => {
    setSelectedConcepts(prev =>
      prev.includes(conceptKey)
        ? prev.filter(c => c !== conceptKey)
        : [...prev, conceptKey]
    );
  };

  const createInterview = async () => {
    if (!user) return;

    setLoading(true);

    const payload: any = {
      firebaseUid: user.uid,
      interviewType,
      difficulty,
      interviewMode: interviewMode === "resume" ? "resume-based" : "concept-based",
    };

    if (interviewMode === "resume") {
      if (!selectedResume || !jobDescription) {
        setLoading(false);
        return;
      }
      payload.resumeId = selectedResume._id;
      payload.jobDescription = jobDescription;
    } else {
      if (selectedConcepts.length === 0) {
        setLoading(false);
        return;
      }
      payload.selectedConcepts = selectedConcepts;
      payload.conceptFocus = selectedConcepts[0];
      payload.targetRole = targetRole === "custom" ? customRole : targetRoles.find(r => r.key === targetRole)?.label;
    }

    try {
      const res = await fetch("/api/interviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const interview = await res.json();
      
      if (!res.ok || !interview._id) {
        console.error("Failed to create interview:", interview);
        alert(`Failed to create interview: ${interview.error || "Unknown error"}`);
        setLoading(false);
        return;
      }
      
      setLoading(false);
      router.push(`/interviews/${interview._id}/live`);
    } catch (error) {
      console.error("Error creating interview:", error);
      alert("Failed to create interview. Please try again.");
      setLoading(false);
    }
  };

  const interviewTypes = [
    {
      key: "technical",
      label: "Technical",
      description: "Focus on concepts & problem solving",
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

  const canStartInterview = interviewMode === "resume" 
    ? (selectedResume && jobDescription)
    : selectedConcepts.length > 0;

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
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <GradientText>Interview Setup</GradientText>
          </h1>
          <p className="text-foreground/60">
            Choose your interview mode and configure your practice session.
          </p>
        </motion.div>

        {/* Interview Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Tabs
            selectedKey={interviewMode}
            onSelectionChange={(key) => setInterviewMode(key as string)}
            color="primary"
            variant="bordered"
            classNames={{
              tabList: "bg-content1/50 backdrop-blur-sm border border-divider p-1",
              tab: "h-12",
              cursor: "bg-primary",
            }}
          >
            <Tab
              key="concept"
              title={
                <div className="flex items-center gap-2">
                  <BrainIcon size={18} />
                  <span>Core Concepts</span>
                </div>
              }
            />
            <Tab
              key="resume"
              title={
                <div className="flex items-center gap-2">
                  <ResumeIcon size={18} />
                  <span>Resume Based</span>
                </div>
              }
            />
          </Tabs>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Setup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardHeader className="px-6 pt-6 pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {interviewMode === "concept" ? <BrainIcon size={20} /> : <MicrophoneIcon size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {interviewMode === "concept" ? "Concept-Based Interview" : "Resume-Based Interview"}
                    </h3>
                    <p className="text-sm text-foreground/60">
                      {interviewMode === "concept" 
                        ? "Practice CS fundamentals without resume" 
                        : "Questions based on your resume & job description"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6 space-y-6">
                
                {/* Concept-Based Mode */}
                {interviewMode === "concept" && (
                  <>
                    {/* Target Role Selection */}
                    <div>
                      <p className="text-sm font-medium mb-3">Target Role</p>
                      <div className="flex flex-wrap gap-3 mb-2">
                        {targetRoles.map((role) => (
                          <Chip
                            key={role.key}
                            variant={targetRole === role.key ? "solid" : "flat"}
                            color={targetRole === role.key ? "primary" : "default"}
                            className="cursor-pointer justify-center"
                            onClick={() => setTargetRole(role.key)}
                          >
                            {role.label}
                          </Chip>
                        ))}
                      </div>
                      {targetRole === "custom" && (
                        <Input
                          className="mt-3"
                          placeholder="Enter your target role..."
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          classNames={{
                            inputWrapper: "bg-content2/50",
                          }}
                        />
                      )}
                    </div>

                    {/* Core Concepts Selection */}
                    <div>
                      <p className="text-sm font-medium mb-3">
                        Select Topics <span className="text-foreground/60">(Choose one or more)</span>
                      </p>
                      <div className="space-y-4">
                        {coreConceptCategories.map((category) => (
                          <div key={category.category}>
                            <p className="text-xs text-foreground/60 mb-2 uppercase tracking-wide">
                              {category.category}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {category.concepts.map((concept) => (
                                <motion.div
                                  key={concept.key}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                    selectedConcepts.includes(concept.key)
                                      ? "border-primary bg-primary/10"
                                      : "border-divider hover:border-primary/50"
                                  }`}
                                  onClick={() => toggleConcept(concept.key)}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl">{concept.icon}</span>
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{concept.label}</p>
                                      <p className="text-xs text-foreground/60">{concept.description}</p>
                                    </div>
                                    {selectedConcepts.includes(concept.key) && (
                                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Resume-Based Mode */}
                {interviewMode === "resume" && (
                  <>
                    {!selectedResume ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <ResumeIcon size={32} className="text-primary" />
                        </div>
                        <h4 className="font-semibold mb-2">No Resume Selected</h4>
                        <p className="text-sm text-foreground/60 mb-4">
                          Select a resume to start a resume-based interview
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button
                            color="primary"
                            variant="flat"
                            className="cursor-pointer"
                            onPress={() => router.push("/resume-analyzer/history")}
                          >
                            View Resume History
                          </Button>
                          <Button
                            color="primary"
                            className="cursor-pointer"
                            onPress={() => router.push("/resume-analyzer")}
                          >
                            Upload New Resume
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Selected Resume Info */}
                        <div className="p-4 rounded-xl bg-content2/50 border border-divider">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                              <ResumeIcon size={20} className="text-secondary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{selectedResume.fileName}</p>
                              <p className="text-sm text-foreground/60">
                                ATS Score: {selectedResume.atsScore}/100
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="flat"
                              className="cursor-pointer"
                              onPress={() => router.push("/resume-analyzer/history")}
                            >
                              Change
                            </Button>
                          </div>
                        </div>

                        {/* Job Description */}
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
                      </>
                    )}
                  </>
                )}

                {/* Common Settings */}
                <div className="pt-4 border-t border-divider">
                  {/* Interview Type Selection */}
                  <div className="mb-6">
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
                  <div className="mb-6">
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
                </div>

                {/* Start Button */}
                <Button
                  color="primary"
                  size="lg"
                  isLoading={loading}
                  isDisabled={!canStartInterview}
                  onPress={createInterview}
                  className="w-full font-semibold cursor-pointer"
                  startContent={!loading && <RocketIcon size={20} />}
                >
                  {loading ? "Preparing Interview..." : "Start Interview"}
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider sticky top-24">
              <CardHeader className="px-6 pt-6 pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <TargetIcon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">Interview Summary</h3>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <div className="space-y-4">
                  {/* Mode Info */}
                  <div className="p-4 rounded-xl bg-content2/50">
                    <p className="text-xs text-foreground/60 mb-1">Mode</p>
                    <p className="font-medium">
                      {interviewMode === "concept" ? "🧠 Core Concepts" : "📄 Resume Based"}
                    </p>
                  </div>

                  {/* Selected Concepts or Resume */}
                  {interviewMode === "concept" ? (
                    <div className="p-4 rounded-xl bg-content2/50">
                      <p className="text-xs text-foreground/60 mb-2">Selected Topics</p>
                      {selectedConcepts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedConcepts.map((key) => {
                            const concept = coreConceptCategories
                              .flatMap(c => c.concepts)
                              .find(c => c.key === key);
                            return (
                              <Chip key={key} size="sm" variant="flat" color="primary">
                                {concept?.label || key}
                              </Chip>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/60">No topics selected</p>
                      )}
                    </div>
                  ) : selectedResume ? (
                    <div className="p-4 rounded-xl bg-content2/50">
                      <p className="text-xs text-foreground/60 mb-1">Resume</p>
                      <p className="font-medium truncate">{selectedResume.fileName}</p>
                    </div>
                  ) : null}

                  {/* Difficulty & Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-content2/50 text-center">
                      <p className="text-xs text-foreground/60 mb-1">Type</p>
                      <p className="font-medium text-sm capitalize">{interviewType}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-content2/50 text-center">
                      <p className="text-xs text-foreground/60 mb-1">Level</p>
                      <p className="font-medium text-sm capitalize">{difficulty}</p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💡</span>
                    <span className="text-sm font-medium">Pro Tips</span>
                  </div>
                  {interviewMode === "concept" ? (
                    <ul className="text-xs text-foreground/60 space-y-1">
                      <li>• Focus on core concepts, not memorization</li>
                      <li>• Explain with real-world examples</li>
                      <li>• Draw diagrams when needed</li>
                      <li>• Discuss trade-offs and alternatives</li>
                    </ul>
                  ) : (
                    <ul className="text-xs text-foreground/60 space-y-1">
                      <li>• Use STAR method for behavioral questions</li>
                      <li>• Relate answers to the job description</li>
                      <li>• Highlight relevant experience</li>
                      <li>• Be specific with examples</li>
                    </ul>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
