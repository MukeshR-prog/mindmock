"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { DashboardCard } from "@/components";

interface FillerDataPoint {
  name: string;
  value: number;
  color: string;
}

interface FillerWordsChartProps {
  data: FillerDataPoint[] | undefined;
  delay?: number;
}

// Modern gradient colors
const GRADIENT_COLORS = [
  { start: "#6366f1", end: "#8b5cf6" },  // Indigo to Purple
  { start: "#ec4899", end: "#f472b6" },  // Pink
  { start: "#f59e0b", end: "#fbbf24" },  // Amber
  { start: "#10b981", end: "#34d399" },  // Emerald
  { start: "#3b82f6", end: "#60a5fa" },  // Blue
  { start: "#ef4444", end: "#f87171" },  // Red
];

// Custom tooltip for pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-content1 border border-divider rounded-xl p-4 shadow-xl backdrop-blur-lg">
        <p className="text-sm font-semibold text-foreground mb-1">{data.name}</p>
        <p className="text-2xl font-bold text-foreground">{data.value}</p>
        <p className="text-xs text-foreground/50">occurrences</p>
      </div>
    );
  }
  return null;
};

export default function FillerWordsChart({ data, delay = 0.8 }: FillerWordsChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasData = data && data.length > 0;

  // Calculate total filler words
  const totalFillers = hasData ? data.reduce((a, b) => a + b.value, 0) : 0;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Assign gradient colors to data
  const enhancedData = hasData
    ? data.map((item, index) => ({
        ...item,
        color: GRADIENT_COLORS[index % GRADIENT_COLORS.length].start,
      }))
    : [];

  return (
    <DashboardCard
      title="Filler Words Analysis"
      subtitle="Words to reduce in your speech"
      delay={delay}
    >
      {hasData ? (
        <div className="h-[280px] mt-2">
          <ResponsiveContainer width="100%" height="75%">
            <PieChart>
              <defs>
                {GRADIENT_COLORS.map((color, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`fillerGradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color.start} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={color.end} stopOpacity={1} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={enhancedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={onPieEnter}
                animationBegin={0}
                animationDuration={800}
              >
                {enhancedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#fillerGradient-${index % GRADIENT_COLORS.length})`}
                    stroke="none"
                    style={{
                      filter: activeIndex === index ? 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3))' : 'none',
                      transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend with improved design */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
            {enhancedData.map((item, index) => (
              <button
                key={index}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  activeIndex === index 
                    ? "bg-content2 scale-105" 
                    : "hover:bg-content2/50"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${GRADIENT_COLORS[index % GRADIENT_COLORS.length].start}, ${GRADIENT_COLORS[index % GRADIENT_COLORS.length].end})`,
                  }}
                />
                <span className="text-xs font-medium text-foreground/70">{item.name}</span>
                <span className="text-xs font-bold text-foreground">{item.value}</span>
              </button>
            ))}
          </div>

          {/* Total indicator */}
          <div className="text-center mt-4 pt-3 border-t border-divider">
            <span className="text-xs text-foreground/50">Total filler words: </span>
            <span className={`text-sm font-bold ${totalFillers > 20 ? 'text-danger' : totalFillers > 10 ? 'text-warning' : 'text-success'}`}>
              {totalFillers}
            </span>
            <span className="text-xs text-foreground/50 ml-1">
              {totalFillers > 20 ? '(Needs improvement)' : totalFillers > 10 ? '(Good progress)' : '(Excellent!)'}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-[280px] flex items-center justify-center">
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
                <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" />
                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              </svg>
            </div>
            <p className="text-foreground/50 font-medium">No filler word data yet</p>
            <p className="text-sm text-foreground/30 mt-1">Complete interviews to track your speech patterns</p>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
