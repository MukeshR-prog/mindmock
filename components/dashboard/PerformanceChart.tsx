"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { DashboardCard, TrendingIcon, ChartIcon } from "@/components";

interface TrendDataPoint {
  name: string;
  score: number;
}

interface PerformanceChartProps {
  data: TrendDataPoint[] | undefined;
  delay?: number;
}

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-content1 border border-divider rounded-xl p-4 shadow-xl backdrop-blur-lg">
        <p className="text-sm font-medium text-foreground/70 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary" />
          <p className="text-lg font-bold text-foreground">
            {payload[0].value}%
          </p>
        </div>
        <p className="text-xs text-foreground/50 mt-1">Interview Score</p>
      </div>
    );
  }
  return null;
};

// Custom dot component for better visual
const CustomDot = (props: any) => {
  const { cx, cy, index } = props;
  return (
    <g key={index}>
      {/* Outer glow */}
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="hsl(var(--heroui-primary))"
        fillOpacity={0.2}
      />
      {/* Inner circle */}
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="hsl(var(--heroui-primary))"
        stroke="white"
        strokeWidth={2}
      />
    </g>
  );
};

const CustomActiveDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <g>
      {/* Pulse animation circle */}
      <circle
        cx={cx}
        cy={cy}
        r={12}
        fill="hsl(var(--heroui-primary))"
        fillOpacity={0.3}
        className="animate-ping"
      />
      {/* Outer glow */}
      <circle
        cx={cx}
        cy={cy}
        r={10}
        fill="hsl(var(--heroui-primary))"
        fillOpacity={0.2}
      />
      {/* Main dot */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="hsl(var(--heroui-primary))"
        stroke="white"
        strokeWidth={2}
      />
    </g>
  );
};

export default function PerformanceChart({ data, delay = 0.4 }: PerformanceChartProps) {
  const hasData = data && data.length > 0;

  return (
    <DashboardCard
      title="Performance Trend"
      subtitle="Your score progression over time"
      icon={<TrendingIcon size={20} />}
      delay={delay}
      className="lg:col-span-2"
    >
      {hasData ? (
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--heroui-primary))" />
                  <stop offset="100%" stopColor="hsl(var(--heroui-secondary))" />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--heroui-divider))" 
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--heroui-divider))" }}
                dy={10}
              />
              <YAxis
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                fill="url(#scoreGradient)"
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Stats summary below chart */}
          <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-divider">
            <div className="text-center">
              <p className="text-xs text-foreground/50 uppercase tracking-wide">Highest</p>
              <p className="text-lg font-bold text-success">
                {Math.max(...data.map(d => d.score))}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground/50 uppercase tracking-wide">Average</p>
              <p className="text-lg font-bold text-primary">
                {Math.round(data.reduce((a, b) => a + b.score, 0) / data.length)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground/50 uppercase tracking-wide">Sessions</p>
              <p className="text-lg font-bold text-foreground">
                {data.length}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-content2/50 flex items-center justify-center">
              <ChartIcon size={40} className="text-foreground/30" />
            </div>
            <p className="text-foreground/50 font-medium">No performance data yet</p>
            <p className="text-sm text-foreground/30 mt-1">Complete interviews to see your progress</p>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
