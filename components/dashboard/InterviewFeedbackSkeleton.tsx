"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { motion } from "framer-motion";

const StatCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
      <CardBody className="p-4 text-center">
        <Skeleton className="h-8 w-16 mx-auto rounded-lg mb-2" />
        <Skeleton className="h-4 w-28 mx-auto rounded-lg" />
      </CardBody>
    </Card>
  </motion.div>
);

const ScoreCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
      <CardBody className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-5 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-16 rounded-lg mb-2" />
        <Skeleton className="h-2 w-full rounded-full" />
      </CardBody>
    </Card>
  </motion.div>
);

const FeedbackCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
      <CardHeader className="px-6 py-4">
        <div className="flex items-start gap-4 w-full">
          <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-full max-w-md rounded-lg mb-2" />
            <Skeleton className="h-5 w-3/4 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="w-5 h-5 rounded" />
          </div>
        </div>
      </CardHeader>
    </Card>
  </motion.div>
);

export default function InterviewFeedbackSkeleton() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button Skeleton */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <Skeleton className="h-8 w-48 rounded-lg" />
      </motion.div>

      {/* Header Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <Skeleton className="h-9 w-56 rounded-lg mb-2" />
          <Skeleton className="h-5 w-72 rounded-lg mb-1" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </motion.div>

      {/* Score Overview Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {/* Overall Score Ring */}
        <Card className="bg-content1/50 backdrop-blur-sm border border-divider md:col-span-1">
          <CardBody className="p-6 flex flex-col items-center justify-center">
            <Skeleton className="w-[140px] h-[140px] rounded-full" />
            <Skeleton className="h-5 w-28 rounded-lg mt-4" />
          </CardBody>
        </Card>

        {/* Individual Scores */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <ScoreCardSkeleton key={i} delay={i * 0.05} />
          ))}
        </div>
      </motion.div>

      {/* Summary Stats Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[0, 1, 2, 3].map((i) => (
          <StatCardSkeleton key={i} delay={i * 0.05} />
        ))}
      </motion.div>

      {/* Detailed Feedback Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Skeleton className="h-7 w-44 rounded-lg mb-4" />
        <div className="space-y-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <FeedbackCardSkeleton key={i} delay={i * 0.05} />
          ))}
        </div>
      </motion.div>
    </main>
  );
}
