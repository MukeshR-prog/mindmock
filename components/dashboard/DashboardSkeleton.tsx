"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { motion } from "framer-motion";

const SkeletonCard = ({ 
  height = "h-[300px]", 
  className = "",
  delay = 0 
}: { 
  height?: string;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    <Card className="h-full bg-content1/50 backdrop-blur-sm border border-divider overflow-hidden">
      <CardHeader className="flex items-center justify-between px-6 pt-5 pb-0">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 rounded-lg mb-2" />
            <Skeleton className="h-3 w-48 rounded-lg" />
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-6 pb-6">
        <div className={`${height} flex items-center justify-center`}>
          <div className="w-full h-full relative">
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-content2/50 to-transparent skeleton-shimmer" />
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        </div>
      </CardBody>
    </Card>
  </motion.div>
);

const StatCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="bg-content1/50 backdrop-blur-sm border border-divider overflow-hidden">
      <CardBody className="p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-2xl" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 rounded-lg mb-2" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      </CardBody>
    </Card>
  </motion.div>
);

const QuickActionSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[0, 1, 2].map((i) => (
      <Skeleton key={i} className="h-24 rounded-2xl" />
    ))}
  </div>
);

export default function DashboardSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Skeleton className="h-8 w-72 rounded-lg mb-3" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </motion.div>

      {/* Quick Actions Skeleton */}
      <section className="mb-8">
        <QuickActionSkeleton />
      </section>

      {/* Stats Grid Skeleton */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <StatCardSkeleton key={i} delay={i * 0.1} />
        ))}
      </section>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <SkeletonCard 
          className="lg:col-span-2" 
          height="h-[300px]" 
          delay={0.4} 
        />
        <SkeletonCard 
          height="h-[300px]" 
          delay={0.5} 
        />
      </div>

      {/* Skills & Activity Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SkeletonCard height="h-[300px]" delay={0.6} />
        <SkeletonCard height="h-[300px]" delay={0.7} />
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard height="h-[280px]" delay={0.8} />
        <SkeletonCard height="h-[280px]" delay={0.9} />
      </div>

      {/* CTA Skeleton */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-12 flex justify-center"
      >
        <Skeleton className="h-40 w-[400px] rounded-3xl" />
      </motion.section>
    </main>
  );
}
