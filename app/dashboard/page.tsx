"use client";

import { Card, CardBody } from "@heroui/card";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DashboardStats = {
  totalInterviews: number;
  bestConfidence: number;
  avgAtsScore: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats>({
    totalInterviews: 0,
    bestConfidence: 0,
    avgAtsScore: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch("/api/dashboard", {
        headers: { firebaseUid: user.uid },
      })
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(console.error);
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Welcome, {user?.email}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            Total Interviews: {stats.totalInterviews}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            Best Confidence: {stats.bestConfidence}%
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            Avg ATS Score: {stats.avgAtsScore}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
