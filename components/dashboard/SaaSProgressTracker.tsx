"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";

type ProgressItem = {
  id: string;
  label: string;
  value: number;
  target: number;
};

type SaaSProgressTrackerProps = {
  items: ProgressItem[];
};

export default function SaaSProgressTracker({ items }: SaaSProgressTrackerProps) {
  return (
    <Card className="border border-divider bg-content1/80 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-5">
        <div>
          <h3 className="text-lg font-semibold">Progress Tracking</h3>
          <p className="text-sm text-foreground/60">Current status against your goals</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4 pb-5">
        {items.map((item) => (
          <div key={item.id}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-foreground/80">{item.label}</span>
              <span className="text-foreground/60">
                {item.value}% / {item.target}%
              </span>
            </div>
            <Progress
              aria-label={item.label}
              value={item.value}
              color={item.value >= item.target ? "success" : "primary"}
              classNames={{
                indicator: item.value >= item.target ? "bg-success" : "bg-primary",
                track: "bg-content2/70",
              }}
            />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}