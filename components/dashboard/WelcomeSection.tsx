"use client";

import { motion } from "framer-motion";
import { GradientText } from "@/components";

interface WelcomeSectionProps {
  userName: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Welcome back,{" "}
        <GradientText>{userName}</GradientText>
        ! 👋
      </h1>
      <p className="text-foreground/60">
        Here&apos;s an overview of your career preparation progress.
      </p>
    </motion.div>
  );
}
