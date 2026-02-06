"use client";

import { motion, useInView, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  value: string;
  label: string;
  delay?: number;
}

export default function StatCard({ value, label, delay = 0 }: StatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState("0");

  // Extract numeric part and suffix
  const numericMatch = value.match(/([\d.]+)/);
  const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0;
  const prefix = value.match(/^([^\d]*)/);
  const suffix = value.replace(/^[^\d]*[\d.]+/, '');
  const prefixStr = prefix ? prefix[1] : '';

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: 2000,
  });

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        springValue.set(numericValue);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, numericValue, springValue, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      const formatted = numericValue >= 1000 
        ? latest.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : numericValue % 1 === 0 
          ? Math.round(latest).toString()
          : latest.toFixed(1);
      setDisplayValue(formatted);
    });
    return unsubscribe;
  }, [springValue, numericValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.7, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      whileHover={{ scale: 1.05 }}
      className="text-center p-8 relative group"
    >
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--heroui-primary) / 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Value */}
      <motion.div
        className="relative text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--heroui-primary)) 0%, hsl(var(--heroui-secondary)) 50%, hsl(var(--heroui-primary)) 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        animate={isInView ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        } : {}}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {prefixStr}{displayValue}{suffix}
      </motion.div>

      {/* Label */}
      <motion.p 
        className="text-foreground/60 text-sm md:text-base font-medium tracking-wide uppercase"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        {label}
      </motion.p>

      {/* Decorative Line */}
      <motion.div
        className="mx-auto mt-4 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: '60%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.4 }}
      />
    </motion.div>
  );
}
