"use client";

import {
  Card,
  CardBody,
} from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useResumeStore } from "@/store/resumeStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InterviewSetupPage() {
  const router = useRouter();
  const { selectedResume } = useResumeStore();
  const { user } = useAuthStore();

  const [jobDescription, setJobDescription] = useState("");
  const [interviewType, setInterviewType] = useState("mixed");
  const [difficulty, setDifficulty] = useState("junior");
  const [loading, setLoading] = useState(false);

  if (!selectedResume) {
    router.push("/resume-analyzer/history");
    return null;
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

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Interview Setup
      </h1>

      <Card>
        <CardBody className="space-y-4">
          <p className="text-sm">
            <strong>Selected Resume:</strong>{" "}
            {selectedResume.fileName} (ATS:{" "}
            {selectedResume.atsScore})
          </p>

          <Textarea
            label="Job Description"
            placeholder="Paste job description here..."
            minRows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <Select
            label="Interview Type"
            selectedKeys={[interviewType]}
            onSelectionChange={(keys) =>
              setInterviewType(Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="technical">Technical</SelectItem>
            <SelectItem key="behavioral">Behavioral</SelectItem>
            <SelectItem key="mixed">Mixed</SelectItem>
          </Select>

          <Select
            label="Difficulty"
            selectedKeys={[difficulty]}
            onSelectionChange={(keys) =>
              setDifficulty(Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="junior">Junior</SelectItem>
            <SelectItem key="mid">Mid</SelectItem>
            <SelectItem key="senior">Senior</SelectItem>
            <SelectItem key="stress">Stress Mode</SelectItem>
          </Select>

          <Button
            color="primary"
            isLoading={loading}
            onClick={createInterview}
          >
            Start Interview
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
