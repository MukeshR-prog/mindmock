"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { DashboardCard } from "@/components";

interface ComparisonDataPoint {
  skill: string;
  you: number;
  average: number;
}

interface SkillsComparisonChartProps {
  data: ComparisonDataPoint[] | undefined;
  delay?: number;
}

function toSafePercent(value: unknown) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function sanitizeComparisonData(data: ComparisonDataPoint[] | undefined) {
  if (!Array.isArray(data)) return [];

  return data
    .filter((item) => item && typeof item.skill === "string" && item.skill.trim().length > 0)
    .map((item) => ({
      skill: item.skill.trim(),
      you: toSafePercent(item.you),
      average: toSafePercent(item.average),
    }));
}

// Custom tooltip for better UX
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const yourScore = payload.find((p: any) => p.dataKey === "you")?.value || 0;
    const avgScore = payload.find((p: any) => p.dataKey === "average")?.value || 0;
    const difference = yourScore - avgScore;
    
    return (
      <div className="bg-content1 border border-divider rounded-xl p-4 shadow-xl backdrop-blur-lg min-w-[180px]">
        <p className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-divider">
          {label}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary" />
              <span className="text-xs text-foreground/70">Your Score</span>
            </div>
            <span className="text-sm font-bold text-foreground">{yourScore}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-content3" />
              <span className="text-xs text-foreground/70">Average</span>
            </div>
            <span className="text-sm font-medium text-foreground/70">{avgScore}%</span>
          </div>
        </div>
        <div className={`mt-3 pt-2 border-t border-divider flex items-center justify-between`}>
          <span className="text-xs text-foreground/50">Difference</span>
          <span className={`text-sm font-bold ${difference >= 0 ? 'text-success' : 'text-danger'}`}>
            {difference >= 0 ? '+' : ''}{difference}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom bar shape with gradient
const GradientBar = (props: any) => {
  const { x, y, width, height, dataKey } = props;
  const isUser = dataKey === "you";
  const gradientId = isUser ? "userBarGradient" : "avgBarGradient";
  
  return (
    <g>
      <defs>
        <linearGradient id="userBarGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--heroui-primary))" />
          <stop offset="100%" stopColor="hsl(var(--heroui-secondary))" />
        </linearGradient>
        <linearGradient id="avgBarGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--heroui-content3))" />
          <stop offset="100%" stopColor="hsl(var(--heroui-content3))" stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#${gradientId})`}
        rx={4}
        ry={4}
      />
    </g>
  );
};

export default function SkillsComparisonChart({ data, delay = 0.9 }: SkillsComparisonChartProps) {
  const safeData = sanitizeComparisonData(data);
  const hasData = safeData.length > 0;

  // Calculate statistics
  const stats = hasData
    ? {
        ahead: safeData.filter((d) => d.you > d.average).length,
        behind: safeData.filter((d) => d.you < d.average).length,
        avgDiff: Math.round(
          safeData.reduce((a, d) => a + (d.you - d.average), 0) / safeData.length
        ),
      }
    : { ahead: 0, behind: 0, avgDiff: 0 };

  return (
    <DashboardCard
      title="Skills Comparison"
      subtitle="Your scores vs. average candidates"
      delay={delay}
    >
      {hasData ? (
        <div className="h-[320px] mt-2">
          <ResponsiveContainer width="100%" height="75%">
            <BarChart
              data={safeData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              barGap={4}
              barCategoryGap={12}
            >
              <defs>
                <linearGradient id="userBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--heroui-primary))" />
                  <stop offset="100%" stopColor="hsl(var(--heroui-secondary))" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--heroui-divider))"
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--heroui-divider))" }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="skill"
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--heroui-content2))', opacity: 0.3 }} />
              <Bar
                dataKey="you"
                fill="url(#userBarGradient)"
                radius={[0, 6, 6, 0]}
                maxBarSize={16}
              >
                <LabelList
                  dataKey="you"
                  position="right"
                  fill="hsl(var(--heroui-foreground))"
                  fontSize={10}
                  fontWeight={600}
                  formatter={(value: any) => `${value}%`}
                />
              </Bar>
              <Bar
                dataKey="average"
                fill="hsl(var(--heroui-content3))"
                radius={[0, 6, 6, 0]}
                maxBarSize={12}
                opacity={0.6}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm bg-gradient-to-r from-primary to-secondary" />
              <span className="text-xs font-medium text-foreground/70">Your Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm bg-content3 opacity-60" />
              <span className="text-xs font-medium text-foreground/70">Average Candidate</span>
            </div>
          </div>

          {/* Statistics footer */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-divider">
            <div className="text-center">
              <p className="text-lg font-bold text-success">{stats.ahead}</p>
              <p className="text-[10px] text-foreground/50 uppercase">Skills Ahead</p>
            </div>
            <div className="text-center border-x border-divider">
              <p className={`text-lg font-bold ${stats.avgDiff >= 0 ? 'text-primary' : 'text-danger'}`}>
                {stats.avgDiff >= 0 ? '+' : ''}{stats.avgDiff}%
              </p>
              <p className="text-[10px] text-foreground/50 uppercase">Avg Difference</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-warning">{stats.behind}</p>
              <p className="text-[10px] text-foreground/50 uppercase">Needs Work</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[320px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-content2/50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground/30"
              >
                <path d="M3 3v18h18" />
                <path d="M7 16h2" />
                <path d="M11 11h2" />
                <path d="M15 14h2" />
                <path d="M19 8h2" />
              </svg>
            </div>
            <p className="text-foreground/50 font-medium">No comparison data yet</p>
            <p className="text-sm text-foreground/30 mt-1">Complete interviews to see how you compare</p>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
