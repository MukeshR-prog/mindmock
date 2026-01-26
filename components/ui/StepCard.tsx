"use client";

import { Card, CardBody } from "@heroui/card";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StepCardProps {
  step: number;
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export default function StepCard({
  step,
  icon,
  title,
  description,
  delay = 0,
}: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      {/* Step Number Badge */}
      <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
        {step}
      </div>
      
      <Card className="h-full bg-content1/50 backdrop-blur-sm border border-divider hover:border-primary/30 transition-all duration-300">
        <CardBody className="p-6 md:p-8 pt-8">
          <div className="text-primary mb-4">
            {icon}
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">
            {title}
          </h3>
          <p className="text-foreground/60 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </CardBody>
      </Card>
    </motion.div>
  );
}
