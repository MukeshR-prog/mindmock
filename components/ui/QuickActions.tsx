"use client";

import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@/components/icons";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`p-5 rounded-2xl border border-divider bg-gradient-to-br ${action.color} cursor-pointer group hover:shadow-lg transition-all duration-300`}
          onClick={() => router.push(action.href)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              {action.icon}
            </div>
            <ArrowRightIcon
              size={20}
              className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </div>
          <h4 className="text-lg font-semibold text-white mb-1">
            {action.title}
          </h4>
          <p className="text-sm text-white/70">{action.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
