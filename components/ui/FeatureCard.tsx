"use client";

import { Card, CardBody } from "@heroui/card";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: string;
  delay?: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  gradient = "from-primary/20 to-secondary/20",
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        className="group h-full bg-content1/50 backdrop-blur-sm border border-divider hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
      >
        <CardBody className="p-6 md:p-8">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
          >
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
