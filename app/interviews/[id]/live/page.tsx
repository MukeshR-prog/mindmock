"use client";

import { useParams } from "next/navigation";

export default function LiveInterviewPage() {
  const params = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">
        Live Interview
      </h1>
      <p className="mt-2 text-gray-600">
        Interview ID: {params.id}
      </p>

      <p className="mt-6">
        🚧 Live interview logic will start here (Day 6).
      </p>
    </div>
  );
}
