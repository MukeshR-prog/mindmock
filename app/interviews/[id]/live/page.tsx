"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { useInterviewStore } from "@/store/interviewStore";

export default function LiveInterviewPage() {
  const { id } = useParams();
  const recognitionRef = useRef<any>(null);

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

  // ✅ Fetch AI-generated question from server
  const fetchNextQuestion = async () => {
    const res = await fetch("/api/interviews/generate-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interviewId: id }),
    });

    const data = await res.json();
    setQuestion(data.question);
    addTranscript(`AI: ${data.question}`);
  };

  useEffect(() => {
    setInterviewId(id as string);
    fetchNextQuestion();
  }, [id]);

  const startMic = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => startListening();

    recognition.onresult = (event: any) => {
      const answer = event.results[0][0].transcript;
      addTranscript(`You: ${answer}`);
    };

    recognition.onend = async () => {
      stopListening();
      await fetchNextQuestion(); // 🔥 NEXT QUESTION
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
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

    alert("Interview progress saved");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Live Mock Interview
      </h1>

      <Card>
        <CardBody>
          <p className="font-medium mb-4">
            AI: {currentQuestion}
          </p>

          {!isListening ? (
            <Button color="primary" onClick={startMic}>
              Answer
            </Button>
          ) : (
            <Button color="danger" onClick={stopMic}>
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

      <Button
        className="mt-6"
        variant="bordered"
        onClick={saveProgress}
      >
        Save Progress
      </Button>
    </div>
  );
}
