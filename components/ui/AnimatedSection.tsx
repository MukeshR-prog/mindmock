"use client";

import { motion, useInView, Variants } from "framer-motion";
import { ReactNode, useRef } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';
  staggerChildren?: boolean;
}

const getVariants = (direction: string): Variants => {
  const variants: Record<string, Variants> = {
    up: {
      hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
    down: {
      hidden: { opacity: 0, y: -60, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
    left: {
      hidden: { opacity: 0, x: 60, filter: 'blur(10px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
    },
    right: {
      hidden: { opacity: 0, x: -60, filter: 'blur(10px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
      visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    },
    blur: {
      hidden: { opacity: 0, filter: 'blur(20px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  };
  return variants[direction] || variants.up;
};

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = 'up',
  staggerChildren = false,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const variants = getVariants(direction);

  const containerVariants: Variants = staggerChildren ? {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  } : variants;

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
