"use client";

import { DashboardCard, ProgressRing, RocketIcon } from "@/components";

interface CareerReadinessCardProps {
  avgScore: number;
  avgAtsScore: number;
  improvementRate: number;
  delay?: number;
}

export default function CareerReadinessCard({
  avgScore,
  avgAtsScore,
  improvementRate,
  delay = 0.5,
}: CareerReadinessCardProps) {
  // Calculate career readiness score
  const calculateCareerReadiness = () => {
    const interviewWeight = avgScore * 0.5;
    const atsWeight = (avgAtsScore || 0) * 0.3;
    const improvementWeight = Math.min(improvementRate, 100) * 0.2;
    return Math.round(interviewWeight + atsWeight + improvementWeight);
  };

  const readinessScore = calculateCareerReadiness();

  // Get color based on score
  const getScoreColor = () => {
    if (readinessScore >= 80) return "hsl(var(--heroui-success))";
    if (readinessScore >= 60) return "hsl(var(--heroui-primary))";
    if (readinessScore >= 40) return "hsl(var(--heroui-warning))";
    return "hsl(var(--heroui-danger))";
  };

  // Get status badge
  const getStatusBadge = () => {
    if (readinessScore >= 80) return { text: "Interview Ready", color: "bg-success/20 text-success" };
    if (readinessScore >= 60) return { text: "Good Progress", color: "bg-primary/20 text-primary" };
    if (readinessScore >= 40) return { text: "Keep Practicing", color: "bg-warning/20 text-warning" };
    return { text: "Just Starting", color: "bg-danger/20 text-danger" };
  };

  const statusBadge = getStatusBadge();

  // Breakdown items
  const breakdownItems = [
    { 
      label: "Interview Skills", 
      value: avgScore, 
      weight: "50%",
      color: "from-primary to-blue-600" 
    },
    { 
      label: "Resume Score", 
      value: avgAtsScore || 0, 
      weight: "30%",
      color: "from-secondary to-pink-600" 
    },
    { 
      label: "Improvement", 
      value: Math.min(improvementRate, 100), 
      weight: "20%",
      color: "from-success to-green-600" 
    },
  ];

  return (
    <DashboardCard
      title="Career Readiness"
      subtitle="Your overall preparation score"
      icon={<RocketIcon size={20} />}
      delay={delay}
    >
      <div className="flex flex-col items-center justify-center py-4">
        {/* Status Badge */}
        <div className={`px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${statusBadge.color}`}>
          {statusBadge.text}
        </div>

        {/* Progress Ring */}
        <div className="relative">
          <ProgressRing
            value={readinessScore}
            color={getScoreColor()}
            sublabel="/100"
            size={140}
            strokeWidth={10}
          />
          {/* Decorative ring */}
          <div 
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `conic-gradient(from 0deg, ${getScoreColor()} 0%, transparent 50%)`,
              filter: "blur(20px)",
            }}
          />
        </div>

        {/* Encouraging message */}
        <p className="text-sm text-foreground/60 text-center mt-4 max-w-[200px]">
          {readinessScore >= 80
            ? "Excellent! You're ready to ace your interviews."
            : readinessScore >= 60
            ? "Great progress! A few more sessions will boost your score."
            : readinessScore >= 40
            ? "You're improving! Keep practicing regularly."
            : "Every journey starts somewhere. Keep going!"}
        </p>

        {/* Score Breakdown */}
        <div className="w-full mt-6 pt-4 border-t border-divider">
          <p className="text-xs text-foreground/50 uppercase tracking-wide text-center mb-3">
            Score Breakdown
          </p>
          <div className="space-y-2">
            {breakdownItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground/70">{item.label}</span>
                    <span className="font-medium text-foreground">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-content2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-foreground/40 w-8">{item.weight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
