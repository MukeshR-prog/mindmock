"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuthStore } from "@/store/authStore";
import {
  DashboardNavbar,
  DashboardStatCard,
  DashboardCard,
  ProgressRing,
  ActivityList,
  QuickActions,
  GradientText,
  ChartIcon,
  ResumeIcon,
  MicrophoneIcon,
  TrendingIcon,
  TargetIcon,
  SparklesIcon,
  RocketIcon,
  AwardIcon,
} from "@/components";

interface DashboardData {
  totalInterviews: number;
  avgScore: number;
  bestScore: number;
  improvementRate: number;
  avgAtsScore: number;
  totalResumes: number;
  trendData: Array<{ name: string; score: number }>;
  radarData: Array<{ skill: string; score: number }>;
  fillerData: Array<{ name: string; value: number; color: string }>;
  comparisonData: Array<{ skill: string; you: number; average: number }>;
}

interface ResumeData {
  _id: string;
  fileName: string;
  targetRole: string;
  atsScore: number;
  createdAt: string;
}

interface InterviewData {
  _id: string;
  status: string;
  targetRole?: string;
  overallScore?: number;
  createdAt: string;
}

interface Activity {
  id: string;
  type: "interview" | "resume";
  title: string;
  score?: number;
  status: string;
  date: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const headers = {
          firebaseUid: user.uid,
        };

        // Fetch all data in parallel
        const [dashboardRes, resumesRes, interviewsRes] = await Promise.all([
          fetch("/api/dashboard", { headers }),
          fetch("/api/resume/list", { headers }),
          fetch("/api/interviews/list", { headers }),
        ]);

        if (!dashboardRes.ok) throw new Error("Failed to fetch dashboard data");

        const dashboardJson = await dashboardRes.json();
        setDashboardData(dashboardJson);

        // Process recent activities
        const activities: Activity[] = [];

        if (resumesRes.ok) {
          const resumesJson = await resumesRes.json();
          const resumes: ResumeData[] = resumesJson.resumes || [];

          resumes.forEach((resume) => {
            activities.push({
              id: resume._id,
              type: "resume",
              title: resume.targetRole || resume.fileName || "Resume",
              score: resume.atsScore,
              status: "completed",
              date: new Date(resume.createdAt).toLocaleDateString(),
            });
          });
        }

        // Process interviews
        if (interviewsRes.ok) {
          const interviewsJson = await interviewsRes.json();
          const interviews: InterviewData[] = interviewsJson.interviews || [];

          interviews.forEach((interview) => {
            activities.push({
              id: interview._id,
              type: "interview",
              title: interview.targetRole || "Mock Interview",
              score: interview.overallScore,
              status: interview.status === "completed" ? "completed" : "in-progress",
              date: new Date(interview.createdAt).toLocaleDateString(),
            });
          });
        }

        // Sort by date and take recent 5
        activities.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentActivities(activities.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const quickActions = [
    {
      title: "Start Interview",
      description: "Practice with AI-powered mock interviews",
      icon: <MicrophoneIcon size={24} />,
      href: "/interviews/setup",
      color: "from-primary to-blue-600",
    },
    {
      title: "Analyze Resume",
      description: "Get instant ATS score and suggestions",
      icon: <ResumeIcon size={24} />,
      href: "/resume-analyzer",
      color: "from-secondary to-pink-600",
    },
    {
      title: "View History",
      description: "Review past interviews and feedback",
      icon: <ChartIcon size={24} />,
      href: "/interviews/history",
      color: "from-success to-green-600",
    },
  ];

  // Calculate career readiness score
  const calculateCareerReadiness = () => {
    if (!dashboardData) return 0;
    const interviewWeight = dashboardData.avgScore * 0.5;
    const atsWeight = (dashboardData.avgAtsScore || 0) * 0.3;
    const improvementWeight = Math.min(dashboardData.improvementRate, 100) * 0.2;
    return Math.round(interviewWeight + atsWeight + improvementWeight);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-foreground/60">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-danger"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-foreground/60 mb-4">{error}</p>
            <Button color="primary" onPress={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back,{" "}
            <GradientText>
              {user?.displayName || user?.email?.split("@")[0] || "User"}
            </GradientText>
            ! 👋
          </h1>
          <p className="text-foreground/60">
            Here&apos;s an overview of your career preparation progress.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <section className="mb-8">
          <QuickActions actions={quickActions} />
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardStatCard
            icon={<MicrophoneIcon size={24} className="text-primary" />}
            label="Total Interviews"
            value={dashboardData?.totalInterviews || 0}
            gradient="from-primary/20 to-blue-500/20"
            delay={0}
          />
          <DashboardStatCard
            icon={<TargetIcon size={24} className="text-secondary" />}
            label="Average Score"
            value={`${dashboardData?.avgScore || 0}%`}
            trend={
              dashboardData?.improvementRate
                ? {
                    value: dashboardData.improvementRate,
                    isPositive: dashboardData.improvementRate > 0,
                  }
                : undefined
            }
            gradient="from-secondary/20 to-pink-500/20"
            delay={0.1}
          />
          <DashboardStatCard
            icon={<AwardIcon size={24} className="text-success" />}
            label="Best Score"
            value={`${dashboardData?.bestScore || 0}%`}
            gradient="from-success/20 to-green-500/20"
            delay={0.2}
          />
          <DashboardStatCard
            icon={<ResumeIcon size={24} className="text-warning" />}
            label="ATS Score"
            value={`${dashboardData?.avgAtsScore || 0}%`}
            gradient="from-warning/20 to-orange-500/20"
            delay={0.3}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Trend Chart */}
          <DashboardCard
            title="Performance Trend"
            subtitle="Your score progression over time"
            icon={<TrendingIcon size={20} />}
            delay={0.4}
            className="lg:col-span-2"
          >
            {dashboardData?.trendData && dashboardData.trendData.length > 0 ? (
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-divider))" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--heroui-content1))",
                        border: "1px solid hsl(var(--heroui-divider))",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--heroui-primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--heroui-primary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "hsl(var(--heroui-primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-foreground/40">
                <div className="text-center">
                  <ChartIcon size={48} className="mx-auto mb-3 opacity-40" />
                  <p>Complete interviews to see your progress</p>
                </div>
              </div>
            )}
          </DashboardCard>

          {/* Career Readiness */}
          <DashboardCard
            title="Career Readiness"
            subtitle="Your overall preparation score"
            icon={<RocketIcon size={20} />}
            delay={0.5}
          >
            <div className="flex flex-col items-center justify-center py-6">
              <ProgressRing
                value={calculateCareerReadiness()}
                color="hsl(var(--heroui-primary))"
                sublabel="/100"
                size={160}
                strokeWidth={12}
              />
              <div className="mt-6 text-center">
                <p className="text-sm text-foreground/60">
                  {calculateCareerReadiness() >= 80
                    ? "Excellent! You're ready to ace your interviews."
                    : calculateCareerReadiness() >= 60
                    ? "Good progress! Keep practicing."
                    : "Keep going! Practice makes perfect."}
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Skills & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skills Radar */}
          <DashboardCard
            title="Skills Overview"
            subtitle="Performance across different areas"
            icon={<SparklesIcon size={20} />}
            delay={0.6}
          >
            {dashboardData?.radarData && dashboardData.radarData.length > 0 ? (
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dashboardData.radarData}>
                    <PolarGrid stroke="hsl(var(--heroui-divider))" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                    />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(var(--heroui-primary))"
                      fill="hsl(var(--heroui-primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-foreground/40">
                <div className="text-center">
                  <TargetIcon size={48} className="mx-auto mb-3 opacity-40" />
                  <p>Complete interviews to see skill breakdown</p>
                </div>
              </div>
            )}
          </DashboardCard>

          {/* Recent Activity */}
          <DashboardCard
            title="Recent Activity"
            subtitle="Your latest interviews and resumes"
            icon={<ChartIcon size={20} />}
            action={{
              label: "View All",
              onClick: () => router.push("/interviews/history"),
            }}
            delay={0.7}
          >
            <div className="mt-2">
              <ActivityList activities={recentActivities} />
            </div>
          </DashboardCard>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Filler Words Analysis */}
          <DashboardCard
            title="Filler Words Usage"
            subtitle="Words to reduce in your speech"
            delay={0.8}
          >
            {dashboardData?.fillerData && dashboardData.fillerData.length > 0 ? (
              <div className="h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.fillerData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData.fillerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--heroui-content1))",
                        border: "1px solid hsl(var(--heroui-divider))",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-foreground/40">
                <div className="text-center">
                  <p>No filler word data available yet</p>
                </div>
              </div>
            )}
            {dashboardData?.fillerData && dashboardData.fillerData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {dashboardData.fillerData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-foreground/70">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>

          {/* Skills Comparison */}
          <DashboardCard
            title="Skills Comparison"
            subtitle="Your scores vs. average candidates"
            delay={0.9}
          >
            {dashboardData?.comparisonData && dashboardData.comparisonData.length > 0 ? (
              <div className="h-[280px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.comparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-divider))" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis
                      type="category"
                      dataKey="skill"
                      tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--heroui-content1))",
                        border: "1px solid hsl(var(--heroui-divider))",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="you" fill="hsl(var(--heroui-primary))" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="average" fill="hsl(var(--heroui-content3))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-foreground/40">
                <div className="text-center">
                  <p>Complete interviews to see comparison</p>
                </div>
              </div>
            )}
            {dashboardData?.comparisonData && dashboardData.comparisonData.length > 0 && (
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-foreground/70">You</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-content3" />
                  <span className="text-sm text-foreground/70">Average</span>
                </div>
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-divider">
            <h3 className="text-xl font-bold mb-2">Ready to improve your skills?</h3>
            <p className="text-foreground/60 mb-6">
              Practice makes perfect. Start a new mock interview now!
            </p>
            <Button
              size="lg"
              color="primary"
              className="font-semibold px-8"
              onPress={() => router.push("/interviews/setup")}
            >
              Start New Interview
            </Button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
