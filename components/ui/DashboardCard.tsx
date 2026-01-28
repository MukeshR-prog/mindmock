"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function DashboardCard({
  title,
  subtitle,
  icon,
  action,
  children,
  delay = 0,
  className = "",
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <Card className="h-full bg-content1/50 backdrop-blur-sm border border-divider">
        <CardHeader className="flex items-center justify-between px-6 pt-5 pb-0">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {subtitle && (
                <p className="text-sm text-foreground/60">{subtitle}</p>
              )}
            </div>
          </div>
          {action && (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </CardHeader>
        <CardBody className="px-6 pb-6">{children}</CardBody>
      </Card>
    </motion.div>
  );
}
