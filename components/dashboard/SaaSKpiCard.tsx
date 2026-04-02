"use client";

import type { ReactNode } from "react";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

type SaaSKpiCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  note: string;
  trend?: number;
};

export default function SaaSKpiCard({
  label,
  value,
  icon,
  note,
  trend,
}: SaaSKpiCardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <Card className="border border-divider bg-content1/80 backdrop-blur-sm">
      <CardBody className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">{icon}</div>
          {typeof trend === "number" ? (
            <Chip
              size="sm"
              variant="flat"
              color={isPositive ? "success" : "danger"}
            >
              {isPositive ? "+" : ""}
              {trend}%
            </Chip>
          ) : null}
        </div>

        <p className="text-xs uppercase tracking-[0.18em] text-foreground/50">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-foreground/60">{note}</p>
      </CardBody>
    </Card>
  );
}