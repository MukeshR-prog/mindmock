"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { useAuthStore } from "@/store/authStore";
import {
  DashboardNavbar,
  DashboardStatCard,
  QuickActions,
  DashboardSkeleton,
  WelcomeSection,
  PerformanceChart,
  SkillsRadarChart,
  FillerWordsChart,
  SkillsComparisonChart,
  CareerReadinessCard,
  RecentActivityCard,
  DashboardCTA,
  MicrophoneIcon,
  TargetIcon,
  AwardIcon,
  ResumeIcon,
  ChartIcon,
} from "@/components";

// Types
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch dashboard data
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

  // Quick actions configuration
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
      title: "Interview History",
      description: "Review past interviews and feedback",
      icon: <ChartIcon size={24} />,
      href: "/interviews/history",
      color: "from-success to-green-600",
    },
    {
      title: "Resume History",
      description: "View all your analyzed resumes",
      icon: <ResumeIcon size={24} />,
      href: "/resume-analyzer/history",
      color: "from-warning to-orange-600",
    },
  ];

  // Get user display name
  const userName = user?.displayName || user?.email?.split("@")[0] || "User";

  // Loading state with skeleton
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <DashboardSkeleton />
      </div>
    );
  }

  // Error state
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
            <Button color="primary" className="cursor-pointer" onPress={() => window.location.reload()}>
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
        <WelcomeSection userName={userName} />

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

        {/* Main Content Grid - Performance & Career Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <PerformanceChart data={dashboardData?.trendData} delay={0.4} />
          <CareerReadinessCard
            avgScore={dashboardData?.avgScore || 0}
            avgAtsScore={dashboardData?.avgAtsScore || 0}
            improvementRate={dashboardData?.improvementRate || 0}
            delay={0.5}
          />
        </div>

        {/* Skills & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SkillsRadarChart data={dashboardData?.radarData} delay={0.6} />
          <RecentActivityCard
            activities={recentActivities}
            onViewAll={() => router.push("/interviews/history")}
            delay={0.7}
          />
        </div>

        {/* Charts Row - Filler Words & Skills Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FillerWordsChart data={dashboardData?.fillerData} delay={0.8} />
          <SkillsComparisonChart data={dashboardData?.comparisonData} delay={0.9} />
        </div>

        {/* Call to Action */}
        <DashboardCTA delay={1} />
      </main>
    </div>
  );
}
