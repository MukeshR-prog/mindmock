"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardBody } from "@heroui/card";

type InterviewItem = {
  _id: string;
  createdAt: string;
  status: string;
};

export default function InterviewHistoryPage() {
  const { user } = useAuthStore();
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/interviews/list", {
      headers: {
        firebaseUid: user.uid,
      },
    })
      .then((res) => res.json())
      .then(setInterviews);
  }, [user]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Interview History
      </h1>

      {interviews.length === 0 && (
        <p>No interviews found.</p>
      )}

      <div className="space-y-4">
        {interviews.map((interview) => (
          <Card key={interview._id}>
            <CardBody>
              <p className="font-medium">
                Interview on{" "}
                {new Date(interview.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Status: {interview.status}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
