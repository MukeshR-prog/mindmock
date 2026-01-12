"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { useState } from "react";

export default function ResumeAnalyzerPage() {
  const { user } = useAuthStore();

  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    if (!file || !user) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);
    formData.append("firebaseUid", user.uid);

    const res = await fetch("/api/resume/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Resume Analyzer
      </h1>

      <Card>
        <CardBody className="space-y-4">
          <Input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <Textarea
            label="Job Description"
            minRows={6}
            onChange={(e) => setJd(e.target.value)}
          />

          <Button
            color="primary"
            onClick={analyzeResume}
            isLoading={loading}
          >
            Analyze Resume
          </Button>
        </CardBody>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardBody>
            <h2 className="text-xl font-semibold mb-2">
              ATS Score: {result.atsScore} / 100
            </h2>

            <p className="font-medium">Missing Keywords:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.missingKeywords.map((word: string) => (
                <span
                  key={word}
                  className="px-2 py-1 bg-red-100 rounded text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
