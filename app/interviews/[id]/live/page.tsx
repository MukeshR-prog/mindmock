"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { useInterviewStore } from "@/store/interviewStore";
import { useRouter } from "next/navigation";

export default function LiveInterviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const forceStopRef = useRef(false);
  // 🎙 Speech recognition instance
  const recognitionRef = useRef<any>(null);

  // 🧠 Store last spoken answer for AI follow-up
  const lastAnswerRef = useRef<string>("");

  const {
    setInterviewId,
    currentQuestion,
    setQuestion,
    transcript,
    addTranscript,
    isListening,
    startListening,
    stopListening,
  } = useInterviewStore();

  // 🔥 Fetch AI-generated question from server
  const fetchNextQuestion = async (previousAnswer?: string) => {
    const res = await fetch("/api/interviews/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewId: id,
        previousAnswer,
      }),
    });

    const data = await res.json();
    setQuestion(data.question);
    addTranscript(`AI: ${data.question}`);
  };

  // Initial question
  useEffect(() => {
    setInterviewId(id as string);
    fetchNextQuestion();
  }, [id]);

  const startMic = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }
    forceStopRef.current = false;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      startListening();
    };

    recognition.onresult = (event: any) => {
       if (forceStopRef.current) return;
      const answer = event.results[0][0].transcript;

      // Save answer
      lastAnswerRef.current = answer;
      addTranscript(`You: ${answer}`);
    };

    recognition.onend = async () => {
      if (forceStopRef.current) {
        stopListening();
        return;
      }
      stopListening();
      await fetchNextQuestion(lastAnswerRef.current);
      await fetch("/api/interviews/evaluate-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewId: id,
        question: currentQuestion,
        answer: lastAnswerRef.current,
  }),
});

    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopMic = () => {
    forceStopRef.current = true;

    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    stopListening();
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

    alert("Interview progress saved");
  };

  const endInterview = async () => {
     if (recognitionRef.current) {
    recognitionRef.current.stop();
    recognitionRef.current = null;
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
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Live Mock Interview</h1>

      <Card>
        <CardBody>
          <p className="font-medium mb-4">AI: {currentQuestion}</p>

          {!isListening ? (
            <Button color="primary" onPress={startMic}>
              Answer
            </Button>
          ) : (
            <Button color="danger" onPress={stopMic}>
              Stop Listening
            </Button>
          )}
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardBody>
          <h2 className="font-semibold mb-2">Transcript</h2>
          <div className="space-y-1 text-sm">
            {transcript.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </CardBody>
      </Card>

      <Button className="mt-6" variant="bordered" onPress={saveProgress}>
        Save Progress
      </Button>
      <Button className="mt-4" color="danger" onPress={endInterview}>
        End Interview
      </Button>
    </div>
  );
}
