"use client";

import { Card, CardBody } from "@heroui/card";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      350px circle at ${smoothX}px ${smoothY}px,
      hsl(var(--heroui-primary) / 0.1),
      transparent 80%
    )
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Card
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group h-full bg-content1/40 backdrop-blur-xl border border-divider/50 hover:border-primary/40 transition-all duration-500 relative overflow-hidden"
        style={{ boxShadow: '0 8px 32px hsl(var(--heroui-primary) / 0.05)' }}
      >
        {/* Spotlight Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: spotlightBackground }}
        />

        {/* Gradient Border Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-[inherit] blur-sm" />
        </div>

        <CardBody className="p-6 md:p-8 relative z-10">
          {/* Icon Container */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 relative`}
          >
            {/* Icon Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/40 to-secondary/40 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative z-10">{icon}</div>
          </motion.div>

          {/* Title with Animated Underline */}
          <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          
          {/* Animated Underline */}
          <motion.div
            className="h-0.5 bg-gradient-to-r from-primary to-secondary mb-4 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: delay + 0.3 }}
          />

          <p className="text-foreground/60 text-sm md:text-base leading-relaxed">
            {description}
          </p>

          {/* Hover Arrow */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
          >
            <span>Learn more</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
