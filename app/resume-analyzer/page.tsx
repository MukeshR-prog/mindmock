"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

export default function ResumeAnalyzerPage() {
  const { user } = useAuthStore();

  // ✅ REQUIRED STATES (YOU WERE MISSING THESE)
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [role, setRole] = useState<string>("frontend");
  const [experience, setExperience] = useState<string>("fresher");

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    if (!file || !user) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);
    formData.append("firebaseUid", user.uid);
    formData.append("targetRole", role);
    formData.append("experienceLevel", experience);

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
            accept=".docx"
            description="Only DOCX resumes supported"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <Textarea
            label="Job Description"
            minRows={6}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />

          {/* ✅ TARGET ROLE */}
          <Select
            label="Target Role"
            selectedKeys={[role]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              setRole(value);
            }}
          >
            <SelectItem key="frontend">
              Frontend Developer
            </SelectItem>
            <SelectItem key="backend">
              Backend Developer
            </SelectItem>
            <SelectItem key="fullstack">
              Full Stack Developer
            </SelectItem>
          </Select>

          {/* ✅ EXPERIENCE LEVEL */}
          <Select
            label="Experience Level"
            selectedKeys={[experience]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              setExperience(value);
            }}
          >
            <SelectItem key="fresher">Fresher</SelectItem>
            <SelectItem key="junior">0–2 Years</SelectItem>
            <SelectItem key="mid">2–5 Years</SelectItem>
            <SelectItem key="senior">5+ Years</SelectItem>
          </Select>

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
