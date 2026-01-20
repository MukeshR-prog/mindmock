"use client";

import { Card, CardBody } from "@heroui/card";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [data, setData] = useState<any>(null);
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
        .then((data) => setData(data))
        .catch(console.error);
    }
  }, [user, loading]);

  if (loading || !data) return null;

    const chartData = data.interviews.map((i: any, idx: number) => ({
    name: `Interview ${idx + 1}`,
    score: i.overallScore,
  }));

return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">
              Total Interviews
            </p>
            <p className="text-2xl font-bold">
              {data.totalInterviews}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">
              Average Score
            </p>
            <p className="text-2xl font-bold">
              {data.avgScore}
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h2 className="font-semibold mb-4">
            Interview Performance
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}
