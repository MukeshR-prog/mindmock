"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { useAuthStore } from "@/store/authStore";
import { useResumeStore } from "@/store/resumeStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ResumeItem = {
  _id: string;
  fileName: string;
  atsScore: number;
  createdAt: string;
};

export default function ResumeHistoryPage() {
  const { user } = useAuthStore();
  const { setSelectedResume } = useResumeStore();
  const router = useRouter();

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch("/api/resume/list", {
      headers: {
        firebaseUid: user.uid,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setResumes(data);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p className="p-8">Loading resumes...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Resume History
      </h1>

      {resumes.length === 0 && (
        <p>No resumes uploaded yet.</p>
      )}

      <div className="space-y-4">
        {resumes.map((resume) => (
          <Card key={resume._id}>
            <CardBody className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {resume.fileName}
                </p>
                <p className="text-sm text-gray-500">
                  ATS Score: {resume.atsScore} |{" "}
                  {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Button
                color="primary"
                onClick={() => {
                  setSelectedResume(resume);
                  router.push("/interviews/setup");
                }}
              >
                Use for Interview
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
