"use client";

import { Card, CardBody } from "@heroui/card";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardStatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
  delay?: number;
}

export default function DashboardStatCard({
  icon,
  label,
  value,
  trend,
  gradient = "from-primary/20 to-secondary/20",
  delay = 0,
}: DashboardStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-content1/50 backdrop-blur-sm border border-divider hover:border-primary/30 transition-all duration-300">
        <CardBody className="p-5">
          <div className="flex items-start justify-between">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              {icon}
            </div>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  trend.isPositive ? "text-success" : "text-danger"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={trend.isPositive ? "" : "rotate-180"}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-foreground/60 text-sm">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
