"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

type ActivityItem = {
  id: string;
  type: "interview" | "resume";
  title: string;
  status: string;
  score?: number;
  createdAt: string;
};

type SaaSActivityFeedProps = {
  activities: ActivityItem[];
  onViewAll: () => void;
};

export default function SaaSActivityFeed({ activities, onViewAll }: SaaSActivityFeedProps) {
  return (
    <Card className="border border-divider bg-content1/80 backdrop-blur-sm">
      <CardHeader className="flex items-center justify-between pt-5">
        <div>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-foreground/60">Latest interview and resume updates</p>
        </div>
        <Button size="sm" variant="light" color="primary" onPress={onViewAll}>
          View all
        </Button>
      </CardHeader>
      <CardBody className="space-y-3 pb-5">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-divider p-6 text-center text-foreground/60">
            No activity yet. Start an interview or analyze a resume.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-xl border border-divider/70 bg-content2/40 p-3"
            >
              <div>
                <p className="font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-foreground/55">
                  {new Date(activity.createdAt).toLocaleString()} • {activity.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-foreground/45">{activity.type}</p>
                <p className="text-sm font-semibold text-foreground">
                  {typeof activity.score === "number" ? `${activity.score}%` : "-"}
                </p>
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}