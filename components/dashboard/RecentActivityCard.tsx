"use client";

import { DashboardCard, ChartIcon } from "@/components";

interface Activity {
  id: string;
  type: "interview" | "resume";
  title: string;
  score?: number;
  status: string;
  date: string;
}

interface RecentActivityCardProps {
  activities: Activity[];
  onViewAll: () => void;
  delay?: number;
}

export default function RecentActivityCard({
  activities,
  onViewAll,
  delay = 0.7,
}: RecentActivityCardProps) {
  return (
    <DashboardCard
      title="Recent Activity"
      subtitle="Your latest interviews and resumes"
      icon={<ChartIcon size={20} />}
      action={{
        label: "View All",
        onClick: onViewAll,
      }}
      delay={delay}
    >
      <div className="mt-2">
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-content2/30 hover:bg-content2/50 transition-colors"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === "interview"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary"
                  }`}
                >
                  {activity.type === "interview" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-foreground/50">{activity.date}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        activity.status === "completed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {activity.status === "completed" ? "Completed" : "In Progress"}
                    </span>
                  </div>
                </div>

                {/* Score */}
                {activity.score !== undefined && (
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        activity.score >= 80
                          ? "text-success"
                          : activity.score >= 60
                          ? "text-primary"
                          : activity.score >= 40
                          ? "text-warning"
                          : "text-danger"
                      }`}
                    >
                      {activity.score}%
                    </p>
                    <p className="text-[10px] text-foreground/40">Score</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-content2/50 flex items-center justify-center">
                <ChartIcon size={32} className="text-foreground/30" />
              </div>
              <p className="text-foreground/50 font-medium">No recent activity</p>
              <p className="text-sm text-foreground/30 mt-1">
                Start an interview or analyze a resume
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
