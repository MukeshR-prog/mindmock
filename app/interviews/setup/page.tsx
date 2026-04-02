"use client";

import { useEffect, useState, useRef } from "react";
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
  CameraIcon,
  VolumeIcon,
  InterviewSetupSkeleton,
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

// Voice types for AI interviewer
const voiceTypes = [
  { 
    key: "professional-female", 
    label: "Professional Female", 
    icon: "👩‍💼", 
    description: "Clear, authoritative tone",
    preview: "Hello, I'm your professional interviewer. Let's begin with your experience."
  },
  { 
    key: "professional-male", 
    label: "Professional Male", 
    icon: "👨‍💼", 
    description: "Formal, confident delivery",
    preview: "Welcome to your interview. Tell me about your technical background."
  },
  { 
    key: "friendly-female", 
    label: "Friendly Female", 
    icon: "👩‍🏫", 
    description: "Warm, encouraging style",
    preview: "Hi there! I'm excited to learn more about you. Don't worry, just be yourself!"
  },
  { 
    key: "friendly-male", 
    label: "Friendly Male", 
    icon: "👨‍🏫", 
    description: "Casual, supportive approach",
    preview: "Hey! Great to meet you. Let's have a relaxed conversation about your skills."
  },
];

export default function InterviewSetupPage() {
  const router = useRouter();
  const { selectedResume, setSelectedResume } = useResumeStore();
  const { user, loading: authLoading } = useAuthStore();

  // Interview mode: "resume" or "concept"
  // Default to "concept"; auto-switch to "resume" when a resume is available
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

  // Interview experience settings
  const [voiceType, setVoiceType] = useState("professional-female");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<string | null>(null);
  
  // Camera preview states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    cameraStreamRef.current = cameraStream;
  }, [cameraStream]);

  // Initialize/cleanup camera when cameraEnabled changes
  useEffect(() => {
    if (cameraEnabled) {
      initializeCamera();
    } else {
      // Stop camera when disabled
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setCameraError(null);
      setIsVideoReady(false);
    }
    
    // Cleanup on unmount
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraEnabled]);

  // Attach stream to video element when stream or video element changes
  useEffect(() => {
    const attachStream = async () => {
      if (videoRef.current && cameraStream) {
        videoRef.current.srcObject = cameraStream;
        try {
          await videoRef.current.play();
          setIsVideoReady(true);
        } catch (err) {
          console.log("Video play was interrupted, will auto-play");
        }
      }
    };
    attachStream();
  }, [cameraStream]);

  // Initialize camera
  const initializeCamera = async () => {
    setIsCameraLoading(true);
    setCameraError(null);
    setIsVideoReady(false);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      setCameraStream(stream);
      
      // If video element is already mounted, attach stream directly
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          setIsVideoReady(true);
        } catch (err) {
          console.log("Video play was interrupted");
        }
      }
    } catch (error: any) {
      console.error("Camera access error:", error);
      setCameraError(
        error.name === "NotAllowedError" 
          ? "Camera access denied. Please allow camera access in your browser settings."
          : error.name === "NotFoundError"
          ? "No camera found. Please connect a camera and try again."
          : "Failed to access camera. Please check your permissions."
      );
    } finally {
      setIsCameraLoading(false);
    }
  };

  // Handle video element ready
  const handleVideoCanPlay = () => {
    setIsVideoReady(true);
    setIsCameraLoading(false);
  };

  // Voice preview function
  const previewVoice = (voiceKey: string, previewText: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the voice when clicking preview
    
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // If clicking the same voice that's playing, just stop
      if (isPreviewPlaying === voiceKey) {
        setIsPreviewPlaying(null);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(previewText);
      utterance.lang = "en-US";
      
      const voices = speechSynthesis.getVoices();
      
      const voiceConfig: Record<string, { gender: string; rate: number; pitch: number }> = {
        "professional-female": { gender: "female", rate: 0.9, pitch: 1.0 },
        "professional-male": { gender: "male", rate: 0.85, pitch: 0.9 },
        "friendly-female": { gender: "female", rate: 0.95, pitch: 1.1 },
        "friendly-male": { gender: "male", rate: 0.95, pitch: 1.0 },
      };
      
      const config = voiceConfig[voiceKey] || voiceConfig["professional-female"];
      
      const preferredVoice = voices.find(voice => {
        const name = voice.name.toLowerCase();
        const isFemale = name.includes("female") || name.includes("zira") || name.includes("samantha") || name.includes("victoria") || name.includes("karen") || name.includes("moira");
        const isMale = name.includes("male") || name.includes("david") || name.includes("mark") || name.includes("alex") || name.includes("daniel");
        
        if (config.gender === "female") {
          return isFemale && voice.lang.startsWith("en");
        } else {
          return isMale && voice.lang.startsWith("en");
        }
      });
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.onstart = () => setIsPreviewPlaying(voiceKey);
      utterance.onend = () => setIsPreviewPlaying(null);
      utterance.onerror = () => setIsPreviewPlaying(null);
      
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // ── Resume reference recovery ───────────────────────────────────────────
  // Reads ?resumeId from the URL using window.location.search (client-side only).
  // 1. If Zustand already has the resume → just switch the tab.
  // 2. If Zustand is empty (e.g. page refresh) → fetch the resume from the API.
  useEffect(() => {
    // window is only available client-side — safe inside useEffect
    const resumeIdFromUrl = new URLSearchParams(window.location.search).get("resumeId");

    if (selectedResume) {
      // Resume already in store — just flip to the resume tab
      setInterviewMode("resume");
      return;
    }

    if (!resumeIdFromUrl || !user) return;

    // Fetch the specific resume from the list and restore it in the store
    const restoreResume = async () => {
      try {
        const res = await fetch("/api/resume/list", {
          headers: { firebaseUid: user.uid },
        });
        const data = await res.json();
        const resumes: any[] = data.resumes || [];
        const found = resumes.find((r: any) => r._id === resumeIdFromUrl);
        if (found) {
          setSelectedResume(found);
          setInterviewMode("resume");
        }
      } catch (err) {
        console.error("Failed to restore resume from URL param:", err);
      }
    };

    restoreResume();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Preload voices for preview
  useEffect(() => {
    if ("speechSynthesis" in window) {
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
      };
    }
    
    // Cleanup: stop any playing preview when component unmounts
    return () => {
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

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
      voiceType,
      cameraEnabled,
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
    { key: "junior", label: "Junior", color: "success", bgColor: "bg-success/20", borderColor: "border-success", textColor: "text-success", icon: "🌱" },
    { key: "mid", label: "Mid-Level", color: "warning", bgColor: "bg-warning/20", borderColor: "border-warning", textColor: "text-warning", icon: "💪" },
    { key: "senior", label: "Senior", color: "danger", bgColor: "bg-danger/20", borderColor: "border-danger", textColor: "text-danger", icon: "🔥" },
    { key: "stress", label: "Stress Mode", color: "secondary", bgColor: "bg-purple-500/20", borderColor: "border-purple-500", textColor: "text-purple-500", icon: "⚡" },
  ];

  const canStartInterview = interviewMode === "resume" 
    ? (selectedResume && jobDescription)
    : selectedConcepts.length > 0;

  // Show skeleton while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <InterviewSetupSkeleton />
      </div>
    );
  }

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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {difficultyLevels.map((level) => (
                        <motion.div
                          key={level.key}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                            difficulty === level.key
                              ? `${level.borderColor} ${level.bgColor}`
                              : "border-divider hover:border-foreground/30 bg-content2/30"
                          }`}
                          onClick={() => setDifficulty(level.key)}
                        >
                          <span className="text-2xl block mb-1">{level.icon}</span>
                          <p className={`font-semibold text-sm ${difficulty === level.key ? level.textColor : ""}`}>
                            {level.label}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interview Experience Settings */}
                <div className="pt-4 border-t border-divider">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <VolumeIcon size={16} className="text-secondary" />
                    </div>
                    <h4 className="font-medium">Interview Experience</h4>
                  </div>

                  {/* AI Voice Selection */}
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-3">AI Interviewer Voice</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {voiceTypes.map((voice) => (
                        <motion.div
                          key={voice.key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            voiceType === voice.key
                              ? "border-secondary bg-secondary/10"
                              : "border-divider hover:border-secondary/50"
                          }`}
                          onClick={() => setVoiceType(voice.key)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{voice.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{voice.label}</p>
                              <p className="text-xs text-foreground/60">{voice.description}</p>
                            </div>
                            {/* Preview Button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => previewVoice(voice.key, voice.preview, e)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isPreviewPlaying === voice.key
                                  ? "bg-secondary text-white"
                                  : "bg-content2 hover:bg-secondary/20 text-foreground/60 hover:text-secondary"
                              }`}
                              title="Preview voice"
                            >
                              {isPreviewPlaying === voice.key ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                              ) : (
                                <VolumeIcon size={16} />
                              )}
                            </motion.button>
                            {voiceType === voice.key && (
                              <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
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

                  {/* Camera Toggle */}
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-3">Video Interview Mode</p>
                    <div className={`rounded-xl border-2 transition-all ${
                      cameraEnabled
                        ? "border-success bg-success/10"
                        : "border-divider hover:border-success/50"
                    }`}>
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        className="p-4 cursor-pointer"
                        onClick={() => setCameraEnabled(!cameraEnabled)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                            cameraEnabled ? "bg-success/20" : "bg-content2"
                          }`}>
                            <CameraIcon size={24} className={cameraEnabled ? "text-success" : "text-foreground/60"} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Enable Camera</p>
                            <p className="text-xs text-foreground/60">
                              Practice with video to simulate real interview experience
                            </p>
                          </div>
                          <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
                            cameraEnabled ? "bg-success" : "bg-content3"
                          }`}>
                            <motion.div
                              className="w-5 h-5 rounded-full bg-white shadow-md"
                              animate={{ x: cameraEnabled ? 20 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Camera Preview */}
                      {cameraEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                        >
                          <div className="pt-3 border-t border-success/20">
                            <div className="aspect-video max-w-sm mx-auto rounded-xl overflow-hidden bg-black relative">
                              {/* Loading State */}
                              {(isCameraLoading || (!isVideoReady && !cameraError)) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-content2 z-10">
                                  <div className="text-center">
                                    <div className="animate-spin w-8 h-8 border-2 border-success border-t-transparent rounded-full mx-auto mb-2" />
                                    <p className="text-xs text-foreground/60">Starting camera...</p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Error State */}
                              {cameraError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-content2 p-4 z-10">
                                  <div className="text-center">
                                    <CameraIcon size={32} className="mx-auto mb-2 text-foreground/40" />
                                    <p className="text-xs text-danger mb-2">{cameraError}</p>
                                    <div onClick={(e) => e.stopPropagation()}>
                                      <Button
                                        size="sm"
                                        variant="flat"
                                        color="success"
                                        className="cursor-pointer"
                                        onPress={() => initializeCamera()}
                                      >
                                        Try Again
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Video Element - Always render but show/hide */}
                              <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                onCanPlay={handleVideoCanPlay}
                                onLoadedMetadata={handleVideoCanPlay}
                                className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity ${
                                  isVideoReady && !cameraError ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              
                              {/* Live Indicator */}
                              {isVideoReady && !cameraError && (
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                  <span className="text-xs text-white">Live</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-foreground/50 text-center mt-2">
                              Preview: This is how you'll appear during the interview
                            </p>
                          </div>
                        </motion.div>
                      )}
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

                  {/* Voice & Camera Settings */}
                  <div className="p-4 rounded-xl bg-content2/50">
                    <p className="text-xs text-foreground/60 mb-2">Experience</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{voiceTypes.find(v => v.key === voiceType)?.icon}</span>
                      <span className="text-sm font-medium">{voiceTypes.find(v => v.key === voiceType)?.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CameraIcon size={14} className={cameraEnabled ? "text-success" : "text-foreground/40"} />
                      <span className={`text-sm ${cameraEnabled ? "text-success" : "text-foreground/60"}`}>
                        {cameraEnabled ? "Camera On" : "Camera Off"}
                      </span>
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
