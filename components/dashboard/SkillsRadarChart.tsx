"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { DashboardCard, SparklesIcon, TargetIcon } from "@/components";

interface SkillDataPoint {
  skill: string;
  score: number;
}

interface SkillsRadarChartProps {
  data: SkillDataPoint[] | undefined;
  delay?: number;
}

// Custom label component for better readability
const CustomPolarAngleAxisTick = (props: any) => {
  const { payload, x, y, cx, cy } = props;
  const angle = Math.atan2(y - cy, x - cx);
  const radius = 15;
  const adjustedX = x + Math.cos(angle) * radius;
  const adjustedY = y + Math.sin(angle) * radius;

  return (
    <text
      x={adjustedX}
      y={adjustedY}
      textAnchor={adjustedX > cx ? "start" : adjustedX < cx ? "end" : "middle"}
      dominantBaseline="central"
      fill="hsl(var(--heroui-foreground))"
      fontSize={11}
      fontWeight={500}
    >
      {payload.value}
    </text>
  );
};

export default function SkillsRadarChart({ data, delay = 0.6 }: SkillsRadarChartProps) {
  const hasData = data && data.length > 0;

  // Calculate average score
  const avgScore = hasData
    ? Math.round(data.reduce((a, b) => a + b.score, 0) / data.length)
    : 0;

  // Find strongest and weakest skills
  const sortedSkills = hasData 
    ? [...data].sort((a, b) => b.score - a.score)
    : [];
  const strongestSkill = sortedSkills[0];
  const weakestSkill = sortedSkills[sortedSkills.length - 1];

  return (
    <DashboardCard
      title="Skills Overview"
      subtitle="Performance across different areas"
      icon={<SparklesIcon size={20} />}
      delay={delay}
    >
      {hasData ? (
        <div className="h-[300px] mt-2">
          <ResponsiveContainer width="100%" height="85%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(var(--heroui-secondary))" stopOpacity={0.2} />
                </linearGradient>
                <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <PolarGrid 
                stroke="hsl(var(--heroui-divider))" 
                strokeDasharray="3 3"
                strokeOpacity={0.6}
              />
              <PolarAngleAxis
                dataKey="skill"
                tick={<CustomPolarAngleAxisTick />}
                tickLine={false}
              />
              <PolarRadiusAxis 
                domain={[0, 100]} 
                tick={false} 
                axisLine={false}
                tickCount={5}
              />
              <Radar
                name="Skills"
                dataKey="score"
                stroke="hsl(var(--heroui-primary))"
                fill="url(#radarGradient)"
                strokeWidth={2}
                filter="url(#radarGlow)"
                dot={{
                  r: 4,
                  fill: "hsl(var(--heroui-primary))",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Skills summary */}
          <div className="flex items-center justify-between px-4 pt-2 border-t border-divider">
            <div className="text-center flex-1">
              <p className="text-[10px] text-foreground/50 uppercase tracking-wide">Strongest</p>
              <p className="text-xs font-semibold text-success truncate">{strongestSkill?.skill}</p>
            </div>
            <div className="text-center flex-1 border-x border-divider px-4">
              <p className="text-[10px] text-foreground/50 uppercase tracking-wide">Average</p>
              <p className="text-lg font-bold text-primary">{avgScore}%</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-foreground/50 uppercase tracking-wide">Needs Work</p>
              <p className="text-xs font-semibold text-warning truncate">{weakestSkill?.skill}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-content2/50 flex items-center justify-center">
              <TargetIcon size={40} className="text-foreground/30" />
            </div>
            <p className="text-foreground/50 font-medium">No skill data yet</p>
            <p className="text-sm text-foreground/30 mt-1">Complete interviews to see skill breakdown</p>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
