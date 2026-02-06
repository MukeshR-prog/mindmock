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
  isLast?: boolean;
}

export default function StepCard({
  step,
  icon,
  title,
  description,
  delay = 0,
  isLast = false,
}: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      {/* Connecting Line */}
      {!isLast && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.3 }}
          className="hidden lg:block absolute top-8 left-[calc(100%+0.5rem)] w-[calc(100%-2rem)] h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 origin-left z-0"
        />
      )}

      {/* Step Number Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: delay + 0.1 
        }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        className="absolute -top-5 -left-5 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-xl z-20 glow-pulse"
      >
        <span className="relative z-10">{step}</span>
        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      
      <Card className="h-full bg-content1/40 backdrop-blur-xl border border-divider/50 group-hover:border-primary/40 transition-all duration-500 overflow-hidden">
        {/* Top Gradient Line */}
        <motion.div
          className="h-1 bg-gradient-to-r from-primary via-secondary to-primary"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
        />

        <CardBody className="p-6 md:p-8 pt-8 relative">
          {/* Background Pattern */}
          <div className="absolute top-4 right-4 text-8xl font-black text-foreground/[0.03] select-none">
            0{step}
          </div>

          {/* Icon */}
          <motion.div 
            className="text-primary mb-5 relative"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">{icon}</div>
          </motion.div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-foreground/60 text-sm md:text-base leading-relaxed relative z-10">
            {description}
          </p>

          {/* Bottom Decoration */}
          <motion.div
            className="mt-6 flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.4 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary/30"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
