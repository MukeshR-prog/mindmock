"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useAuthStore } from "@/store/authStore";
import {
  SaaSKpiCard,
  SaaSProgressTracker,
  SaaSActivityFeed,
  SaaSDashboardSidebar,
  SaaSDashboardTopbar,
  MicrophoneIcon,
  TargetIcon,
  AwardIcon,
  ChartIcon,
} from "@/components";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

const SaaSAnalyticsPanel = dynamic(
  () => import("@/components/dashboard/SaaSAnalyticsPanel"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[340px] items-center justify-center rounded-2xl border border-divider bg-content1/80">
        <Spinner label="Loading charts" color="primary" />
      </div>
    ),
  }
);

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
  createdAt: string;
}

const fetcher = async ([url, firebaseUid]: [string, string]) => {
  const response = await fetch(url, {
    headers: { firebaseUid },
  });

  if (!response.ok) {
    const fallback = `Failed to fetch ${url}`;
    let message = fallback;
    try {
      const json = await response.json();
      message = json?.error || fallback;
    } catch {
      message = fallback;
    }
    throw new Error(message);
  }

  return response.json();
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const { data: dashboardData, error: dashboardError, isLoading: dashboardLoading } =
    useSWR<DashboardData>(user ? ["/api/dashboard", user.uid] : null, fetcher, {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    });

  const { data: resumesJson, error: resumeError, isLoading: resumeLoading } = useSWR<{
    resumes: ResumeData[];
  }>(user ? ["/api/resume/list", user.uid] : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  const { data: interviewsJson, error: interviewError, isLoading: interviewLoading } =
    useSWR<{ interviews: InterviewData[] }>(
      user ? ["/api/interviews/list", user.uid] : null,
      fetcher,
      {
        revalidateOnFocus: false,
        dedupingInterval: 30000,
      }
    );

  const loading = dashboardLoading || resumeLoading || interviewLoading;
  const error = dashboardError || resumeError || interviewError;

  // Get user display name
  const userName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "user@example.com";

  const interviews = interviewsJson?.interviews || [];
  const resumes = resumesJson?.resumes || [];

  const completionRate = useMemo(() => {
    if (!interviews.length) return 0;
    const completed = interviews.filter((item) => item.status === "completed").length;
    return Math.round((completed / interviews.length) * 100);
  }, [interviews]);

  const totalTests = (dashboardData?.totalInterviews || 0) + (dashboardData?.totalResumes || 0);

  const recentActivities = useMemo<Activity[]>(() => {
    const activities: Activity[] = [];

    resumes.forEach((resume) => {
      activities.push({
        id: resume._id,
        type: "resume",
        title: resume.targetRole || resume.fileName || "Resume",
        score: resume.atsScore,
        status: "completed",
        createdAt: resume.createdAt,
      });
    });

    interviews.forEach((interview) => {
      activities.push({
        id: interview._id,
        type: "interview",
        title: interview.targetRole || "Mock Interview",
        score: interview.overallScore,
        status: interview.status === "completed" ? "completed" : "in-progress",
        createdAt: interview.createdAt,
      });
    });

    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [interviews, resumes]);

  const progressItems = useMemo(
    () => [
      {
        id: "interview-score",
        label: "Interview mastery",
        value: dashboardData?.avgScore || 0,
        target: 85,
      },
      {
        id: "ats-readiness",
        label: "ATS readiness",
        value: dashboardData?.avgAtsScore || 0,
        target: 80,
      },
      {
        id: "completion",
        label: "Completion rate",
        value: completionRate,
        target: 90,
      },
    ],
    [dashboardData?.avgAtsScore, dashboardData?.avgScore, completionRate]
  );

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  // Loading state with skeleton
  if (authLoading || (loading && !dashboardData)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" color="primary" label="Preparing your dashboard" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
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
            <p className="text-foreground/60 mb-4">{error.message}</p>
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
      <SaaSDashboardSidebar
        pathname={"/dashboard"}
        isOpen={sidebarOpen}
        userName={userName}
        userEmail={userEmail}
        userPhotoUrl={user?.photoURL}
        onNavigate={(href) => router.push(href)}
        onLogout={handleLogout}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-72">
        <SaaSDashboardTopbar
          userName={userName}
          userPhotoUrl={user?.photoURL}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SaaSKpiCard
              label="Total Tests"
              value={`${totalTests}`}
              note="Interviews + resumes"
              icon={<ChartIcon size={20} />}
            />
            <SaaSKpiCard
              label="Average Score"
              value={`${dashboardData?.avgScore || 0}%`}
              note="Interview quality"
              icon={<TargetIcon size={20} />}
              trend={dashboardData?.improvementRate || 0}
            />
            <SaaSKpiCard
              label="Completion Rate"
              value={`${completionRate}%`}
              note="Completed interview sessions"
              icon={<MicrophoneIcon size={20} />}
            />
            <SaaSKpiCard
              label="Best Score"
              value={`${dashboardData?.bestScore || 0}%`}
              note="Personal best"
              icon={<AwardIcon size={20} />}
            />
          </section>

          <SaaSAnalyticsPanel
            trendData={dashboardData?.trendData || []}
            comparisonData={dashboardData?.comparisonData || []}
            distributionData={dashboardData?.fillerData || []}
          />

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <SaaSProgressTracker items={progressItems} />
            <SaaSActivityFeed
              activities={recentActivities}
              onViewAll={() => router.push("/interviews/history")}
            />
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Button color="primary" className="h-14" onPress={() => router.push("/interviews/setup")}>
              Start Mock Interview
            </Button>
            <Button variant="flat" className="h-14" onPress={() => router.push("/resume-analyzer")}>
              Analyze Resume
            </Button>
            <Button variant="flat" className="h-14" onPress={() => router.push("/interviews/history")}>
              Interview History
            </Button>
            <Button variant="flat" className="h-14" onPress={() => router.push("/resume-analyzer/history")}>
              Resume History
            </Button>
          </section>
        </main>
      </div>
    </div>
  );
}
