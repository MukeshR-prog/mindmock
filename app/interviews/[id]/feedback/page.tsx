"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";

export default function FeedbackPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState<any>(null);

    useEffect(() => {
    const loadInterview = async () => {
        const res = await fetch(`/api/interviews/${id}`);

        if (!res.ok) {
        console.error("Failed to fetch interview");
        return;
        }

        const data = await res.json();
        setInterview(data);
    };

    loadInterview();
    }, [id]);


  if (!interview) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Interview Feedback
      </h1>
      {interview?.answers?.map((a: any, i: number) => (
        <Card key={i} className="mb-4">
          <CardBody>
            <p className="font-medium">
              Q: {a.question}
            </p>
            <p className="mt-2">A: {a.answer}</p>

            <div className="mt-3 text-sm">
              <p>Relevance: {a.relevanceScore}/10</p>
              <p>Confidence: {a.confidenceScore}/10</p>
              <p>STAR Score: {a.starScore}/10</p>
              <p>Fillers: {a.fillerWords.join(", ") || "None"}</p>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {a.feedback}
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
