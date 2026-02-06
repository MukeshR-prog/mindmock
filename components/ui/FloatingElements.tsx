"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function FloatingElements() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const generatedParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      setMousePosition({
        x: (clientX / innerWidth) * 100,
        y: (clientY / innerHeight) * 100,
      });
      
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const gradientX = useTransform(smoothX, [-500, 500], [30, 70]);
  const gradientY = useTransform(smoothY, [-500, 500], [30, 70]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dynamic Gradient Mesh Background */}
      <motion.div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, hsl(var(--heroui-primary) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, hsl(var(--heroui-secondary) / 0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 20% 80%, hsl(var(--heroui-primary) / 0.1) 0%, transparent 40%)
          `
        }}
      />

      {/* Aurora Effect Layer 1 */}
      <motion.div
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 10, -5, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full morph-shape"
        style={{
          background: `linear-gradient(135deg, 
            hsl(var(--heroui-primary) / 0.2) 0%,
            hsl(var(--heroui-secondary) / 0.15) 50%,
            transparent 100%
          )`,
          filter: 'blur(60px)',
        }}
      />

      {/* Aurora Effect Layer 2 */}
      <motion.div
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, 80, 0],
          scale: [1, 0.9, 1.1, 1],
          rotate: [0, -15, 10, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-1/4 -right-1/4 w-[900px] h-[900px] rounded-full morph-shape"
        style={{
          background: `linear-gradient(225deg, 
            hsl(var(--heroui-secondary) / 0.2) 0%,
            hsl(var(--heroui-primary) / 0.1) 50%,
            transparent 100%
          )`,
          filter: 'blur(80px)',
        }}
      />

      {/* Animated Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--heroui-foreground) / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--heroui-foreground) / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            background: particle.id % 2 === 0 
              ? 'hsl(var(--heroui-primary) / 0.6)' 
              : 'hsl(var(--heroui-secondary) / 0.6)',
          }}
          animate={{
            y: [0, -1000],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Glowing Orbs with Mouse Interaction */}
      <motion.div
        style={{
          x: useTransform(smoothX, v => v * 0.05),
          y: useTransform(smoothY, v => v * 0.05),
        }}
        className="absolute top-1/4 left-1/4"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-64 h-64 rounded-full glow-pulse"
          style={{
            background: 'radial-gradient(circle, hsl(var(--heroui-primary) / 0.3) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      <motion.div
        style={{
          x: useTransform(smoothX, v => v * -0.03),
          y: useTransform(smoothY, v => v * -0.03),
        }}
        className="absolute top-1/2 right-1/4"
      >
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--heroui-secondary) / 0.25) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Geometric Shapes */}
      <motion.div
        animate={{
          rotate: [0, 360],
          y: [0, -20, 0],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-1/4 right-[15%] w-16 h-16 border-2 border-primary/20 rounded-xl"
        style={{
          boxShadow: '0 0 30px hsl(var(--heroui-primary) / 0.2)',
        }}
      />

      <motion.div
        animate={{
          rotate: [0, -360],
          y: [0, 30, 0],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-1/3 left-[10%] w-12 h-12 border-2 border-secondary/25 rounded-full"
        style={{
          boxShadow: '0 0 25px hsl(var(--heroui-secondary) / 0.2)',
        }}
      />

      <motion.div
        animate={{
          rotate: [45, 225, 45],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[60%] right-[25%] w-8 h-8 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg"
        style={{
          boxShadow: '0 0 20px hsl(var(--heroui-primary) / 0.3)',
        }}
      />

      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] left-[40%] w-6 h-6 border-2 border-primary/30"
        style={{
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Dotted Pattern Circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle 
            cx="100" cy="100" r="90" 
            fill="none" 
            stroke="hsl(var(--heroui-primary))" 
            strokeWidth="0.5"
            strokeDasharray="3 8"
          />
          <circle 
            cx="100" cy="100" r="70" 
            fill="none" 
            stroke="hsl(var(--heroui-secondary))" 
            strokeWidth="0.5"
            strokeDasharray="2 10"
          />
        </svg>
      </motion.div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-8 left-8 w-24 h-[1px] bg-gradient-to-r from-primary to-transparent"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute top-8 left-8 w-[1px] h-24 bg-gradient-to-b from-primary to-transparent"
        />
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute bottom-8 right-8 w-24 h-[1px] bg-gradient-to-l from-secondary to-transparent"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-8 right-8 w-[1px] h-24 bg-gradient-to-t from-secondary to-transparent"
        />
      </div>
    </div>
  );
}
