"use client";

import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  type: "interview" | "resume";
  title: string;
  score?: number;
  status: string;
  date: string;
}

interface ActivityListProps {
  activities: Activity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === "interview") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center text-foreground/40">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex items-center gap-4 p-3 rounded-xl bg-content2/50 hover:bg-content2 transition-colors"
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              activity.type === "interview"
                ? "bg-primary/10 text-primary"
                : "bg-secondary/10 text-secondary"
            }`}
          >
            {getTypeIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{activity.title}</p>
            <p className="text-xs text-foreground/60">{activity.date}</p>
          </div>
          <div className="flex items-center gap-2">
            {activity.score !== undefined && (
              <span className="text-sm font-semibold text-primary">
                {activity.score}/100
              </span>
            )}
            <Chip size="sm" color={getStatusColor(activity.status)} variant="flat">
              {activity.status}
            </Chip>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
