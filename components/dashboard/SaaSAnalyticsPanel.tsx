"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrendPoint = { name: string; score: number };
type ComparisonPoint = { skill: string; you: number; average: number };
type DistributionPoint = { name: string; value: number; color?: string };

type SaaSAnalyticsPanelProps = {
  trendData: TrendPoint[];
  comparisonData: ComparisonPoint[];
  distributionData: DistributionPoint[];
};

const FALLBACK_COLORS = ["#3b82f6", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function SaaSAnalyticsPanel({
  trendData,
  comparisonData,
  distributionData,
}: SaaSAnalyticsPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <Card className="border border-divider bg-content1/80 backdrop-blur-sm xl:col-span-2">
        <CardHeader className="pb-0 pt-5">
          <div>
            <h3 className="text-lg font-semibold">Performance Over Time</h3>
            <p className="text-sm text-foreground/60">Interview score trend</p>
          </div>
        </CardHeader>
        <CardBody className="h-[320px] pb-5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-divider))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-content1/80 backdrop-blur-sm">
        <CardHeader className="pb-0 pt-5">
          <div>
            <h3 className="text-lg font-semibold">Distribution</h3>
            <p className="text-sm text-foreground/60">Filler words share</p>
          </div>
        </CardHeader>
        <CardBody className="h-[320px] pb-5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card className="border border-divider bg-content1/80 backdrop-blur-sm xl:col-span-3">
        <CardHeader className="pb-0 pt-5">
          <div>
            <h3 className="text-lg font-semibold">Category-wise Analysis</h3>
            <p className="text-sm text-foreground/60">You vs average candidates</p>
          </div>
        </CardHeader>
        <CardBody className="h-[320px] pb-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-divider))" vertical={false} />
              <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="you" name="You" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="average" name="Average" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}