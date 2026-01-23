  "use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardBody } from "@heroui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    fetch("/api/dashboard", {
      headers: { firebaseUid: user.uid },
    })
      .then((res) => res.json())
      .then(setData);
  }, [user]);

  if (!data) return null;

  const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EF4444"];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">
        Performance Dashboard
      </h1>

      {/* ✅ SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">
              Total Interviews
            </p>
            <p className="text-2xl font-bold">
              {data?.totalInterviews}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">
              Average Score
            </p>
            <p className="text-2xl font-bold">
              {data?.avgScore}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">
              Best Score
            </p>
            <p className="text-2xl font-bold">
              {data.bestScore}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">
              Improvement Rate
            </p>
            <p className="text-2xl font-bold">
              {data?.improvementRate}%
            </p>
          </CardBody>
        </Card>
      </div>

      {/* ✅ SCORE TREND LINE CHART */}
      <Card>
        <CardBody>
          <h2 className="font-semibold mb-3">
            Score Trend Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.charts?.trendData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366F1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ RADAR CHART */}
        <Card>
          <CardBody>
            <h2 className="font-semibold mb-3">
              Skill Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={data?.charts?.radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <Radar
                  dataKey="value"
                  stroke="#22C55E"
                  fill="#22C55E"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* ✅ FILLER WORDS PIE CHART */}
        <Card>
          <CardBody>
            <h2 className="font-semibold mb-3">
              Filler Words Usage
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.charts?.fillerData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {data?.charts?.fillerData?.map(
                    (_: any, idx: number) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* ✅ COMPARISON BAR CHART */}
      <Card>
        <CardBody>
          <h2 className="font-semibold mb-3">
            Interview Skill Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.charts?.comparisonData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="relevance" fill="#6366F1" />
              <Bar dataKey="confidence" fill="#22C55E" />
              <Bar dataKey="star" fill="#F97316" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}
