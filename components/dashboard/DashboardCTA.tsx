"use client";

import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MicrophoneIcon, RocketIcon } from "@/components";

interface DashboardCTAProps {
  delay?: number;
}

export default function DashboardCTA({ delay = 1 }: DashboardCTAProps) {
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mt-12 text-center"
    >
      <div className="relative inline-block overflow-hidden rounded-3xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/15 to-success/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--heroui-primary)/0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--heroui-secondary)/0.2),transparent_50%)]" />
        
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-20 h-20 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border border-secondary/20 rounded-full animate-pulse delay-500" />
        
        {/* Content */}
        <div className="relative p-8 sm:p-10 border border-divider backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-3">
            <RocketIcon size={24} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Keep Improving
            </span>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Ready to improve your skills?
          </h3>
          
          <p className="text-foreground/60 mb-6 max-w-md mx-auto text-sm sm:text-base">
            Practice makes perfect. Start a new mock interview now and get instant AI-powered feedback!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              color="primary"
              className="font-semibold px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              onPress={() => router.push("/interviews/setup")}
              startContent={<MicrophoneIcon size={18} />}
            >
              Start New Interview
            </Button>
            
            <Button
              size="lg"
              variant="bordered"
              className="font-medium px-6"
              onPress={() => router.push("/resume-analyzer")}
            >
              Analyze Resume
            </Button>
          </div>

          {/* Stats teaser */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-divider/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">10+</p>
              <p className="text-xs text-foreground/50">Question Types</p>
            </div>
            <div className="w-px h-10 bg-divider" />
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">AI</p>
              <p className="text-xs text-foreground/50">Powered Feedback</p>
            </div>
            <div className="w-px h-10 bg-divider" />
            <div className="text-center">
              <p className="text-2xl font-bold text-success">24/7</p>
              <p className="text-xs text-foreground/50">Available</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
