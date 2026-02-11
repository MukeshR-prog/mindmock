"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useInterviewStore } from "@/store/interviewStore";
import {
  DashboardNavbar,
  GradientText,
  MicrophoneIcon,
  VolumeIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@/components";

export default function LiveInterviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const forceStopRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const lastAnswerRef = useRef<string>("");
  const hasFetchedInitialQuestion = useRef(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);

  const {
    setInterviewId,
    currentQuestion,
    setQuestion,
    transcript,
    addTranscript,
    isListening,
    startListening,
    stopListening,
    reset,
  } = useInterviewStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Text-to-speech for AI questions
  const speakQuestion = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  // Fetch AI-generated question from server
  const fetchNextQuestion = async (previousAnswer?: string) => {
    try {
      setIsLoadingQuestion(true);
      const interviewId = Array.isArray(id) ? id[0] : id;
      if (!interviewId) {
        console.error("No interview ID available");
        setQuestion("Error: No interview ID found.");
        setIsLoadingQuestion(false);
        return;
      }
      
      const res = await fetch("/api/interviews/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          previousAnswer,
        }),
      });

      const data = await res.json();
      
      if (!res.ok || !data.question) {
        console.error("Failed to generate question:", data);
        setQuestion(`Error: ${data.error || "Failed to generate question. Please try again."}`);
        setIsLoadingQuestion(false);
        return;
      }
      
      setQuestion(data.question);
      addTranscript(`AI: ${data.question}`);
      setQuestionCount((prev) => prev + 1);
      speakQuestion(data.question);
    } catch (error) {
      console.error("Error fetching question:", error);
      setQuestion("Sorry, there was an error generating the question. Please try again.");
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // Initial question - only fetch once when authenticated
  useEffect(() => {
    if (!id || !user) return;
    if (hasFetchedInitialQuestion.current) return;
    
    hasFetchedInitialQuestion.current = true;
    const interviewId = Array.isArray(id) ? id[0] : id;
    
    // Reset store to clear any stale data from previous interviews
    reset();
    setInterviewId(interviewId);
    fetchNextQuestion();
  }, [id, user]);

  // Show loading when auth is checking
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

  const startMic = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }
    forceStopRef.current = false;
    setIsAnswering(true);

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";
    let interimTranscript = "";

    recognition.onstart = () => {
      startListening();
      finalTranscript = "";
      interimTranscript = "";
      setCurrentAnswer("");
    };

    recognition.onresult = (event: any) => {
      if (forceStopRef.current) return;
      
      finalTranscript = "";
      interimTranscript = "";
      
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      const fullAnswer = (finalTranscript + interimTranscript).trim();
      lastAnswerRef.current = fullAnswer;
      setCurrentAnswer(fullAnswer);
    };

    recognition.onend = async () => {
      // If force stopped by user, don't do anything (stopMic handles it)
      if (forceStopRef.current) {
        return;
      }
      
      // If recognition ended unexpectedly (e.g., silence timeout), restart it
      // This keeps listening until user manually stops
      if (recognitionRef.current && !forceStopRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Recognition may have been stopped, ignore
        }
      }
    };

    recognition.onerror = (event: any) => {
      // Handle no-speech error by restarting
      if (event.error === "no-speech" && !forceStopRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Ignore
        }
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopMic = async () => {
    forceStopRef.current = true;

    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    stopListening();
    setIsAnswering(false);

    // If there's an answer, process it
    if (lastAnswerRef.current.trim()) {
      addTranscript(`You: ${lastAnswerRef.current}`);
      setCurrentAnswer("");

      // Evaluate answer
      await fetch("/api/interviews/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: id,
          question: currentQuestion,
          answer: lastAnswerRef.current,
        }),
      });

      // Fetch next question
      await fetchNextQuestion(lastAnswerRef.current);
      lastAnswerRef.current = "";
    }
  };

  const saveProgress = async () => {
    await fetch("/api/interviews/update-transcript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewId: id,
        transcript,
      }),
    });

    // Show a toast or notification
    alert("Interview progress saved");
  };

  const endInterview = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // Stop any ongoing speech
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }

    await fetch("/api/interviews/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewId: id,
        transcript,
      }),
    });

    router.push(`/interviews/${id}/feedback`);
  };

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
              <GradientText>Live Interview</GradientText>
            </h1>
            <p className="text-foreground/60">
              Question {questionCount} • Speak clearly and take your time
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="bordered"
              onPress={saveProgress}
              startContent={<CheckCircleIcon size={18} />}
            >
              Save Progress
            </Button>
            <Button color="danger" variant="flat" onPress={endInterview}>
              End Interview
            </Button>
          </div>
        </motion.div>

        {/* Main Interview Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardHeader className="px-6 pt-6 pb-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSpeaking
                        ? "bg-primary/20 animate-pulse"
                        : "bg-primary/10"
                    }`}
                  >
                    <SparklesIcon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">AI Interviewer</h3>
                    <p className="text-sm text-foreground/60">
                      {isSpeaking ? "Speaking..." : "Waiting for your answer"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion || "loading"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="py-6"
                  >
                    {isLoadingQuestion ? (
                      <div className="flex items-center gap-2 text-foreground/60">
                        <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        <span>Generating question...</span>
                      </div>
                    ) : (
                      <p className="text-lg leading-relaxed">{currentQuestion || "Loading question..."}</p>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Microphone Control */}
                <div className="flex flex-col items-center mt-6 pt-6 border-t border-divider">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isListening ? stopMic : startMic}
                    disabled={isLoadingQuestion}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      isLoadingQuestion
                        ? "bg-default-300 cursor-not-allowed"
                        : isListening
                        ? "bg-danger shadow-lg shadow-danger/30"
                        : "bg-primary shadow-lg shadow-primary/30"
                    }`}
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <VolumeIcon size={40} className="text-white" />
                      </motion.div>
                    ) : (
                      <MicrophoneIcon size={40} className="text-white" />
                    )}
                  </motion.button>
                  <p className="mt-4 text-sm text-foreground/60">
                    {isListening
                      ? "Listening... Click to stop"
                      : "Click to start answering"}
                  </p>

                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1 mt-4"
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-primary rounded-full"
                          animate={{
                            height: [10, 30, 10],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.5,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}

                  {/* Real-time Answer Display */}
                  {isListening && currentAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full mt-6 p-4 rounded-xl bg-content2/50 border border-divider"
                    >
                      <p className="text-sm text-foreground/60 mb-2">Your answer:</p>
                      <p className="text-foreground leading-relaxed">{currentAnswer}</p>
                    </motion.div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Transcript Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider sticky top-24 max-h-[70vh] overflow-hidden">
              <CardHeader className="px-6 pt-6 pb-0">
                <h3 className="text-lg font-semibold">Transcript</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6 overflow-y-auto max-h-[calc(70vh-80px)]">
                <div className="space-y-4">
                  {transcript.length === 0 ? (
                    <p className="text-sm text-foreground/40 text-center py-8">
                      Your conversation will appear here...
                    </p>
                  ) : (
                    transcript.map((line, index) => {
                      const isAI = line.startsWith("AI:");
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: isAI ? -10 : 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-3 rounded-xl text-sm ${
                            isAI
                              ? "bg-primary/10 mr-4"
                              : "bg-content2 ml-4"
                          }`}
                        >
                          <Chip
                            size="sm"
                            variant="flat"
                            color={isAI ? "primary" : "default"}
                            className="mb-2"
                          >
                            {isAI ? "AI" : "You"}
                          </Chip>
                          <p className="text-foreground/80">
                            {line.replace(/^(AI:|You:)\s*/, "")}
                          </p>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-primary/5 border border-primary/20">
            <CardBody className="p-4">
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-primary" />
                  <span>Use the STAR method for behavioral questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-primary" />
                  <span>Avoid filler words like &quot;um&quot; and &quot;uh&quot;</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-primary" />
                  <span>Take a moment to think before answering</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
