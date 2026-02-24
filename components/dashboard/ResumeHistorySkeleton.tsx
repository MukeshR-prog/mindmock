"use client";

import { Card, CardBody } from "@heroui/card";
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
        <Skeleton className="h-4 w-24 mx-auto rounded-lg" />
      </CardBody>
    </Card>
  </motion.div>
);

const ResumeCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
      <CardBody className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Icon placeholder */}
            <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              {/* Filename */}
              <Skeleton className="h-5 w-48 rounded-lg mb-2" />
              {/* Chips and date */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-lg" />
              </div>
              {/* ATS Score Progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <Skeleton className="h-4 w-10 rounded-lg" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          </div>
          {/* Button */}
          <Skeleton className="h-9 w-32 rounded-lg flex-shrink-0" />
        </div>
        {/* Keywords section */}
        <div className="mt-4 pt-4 border-t border-divider">
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-3 w-16 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-18 rounded-full" />
          </div>
        </div>
      </CardBody>
    </Card>
  </motion.div>
);

export default function ResumeHistorySkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button Skeleton */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <Skeleton className="h-8 w-40 rounded-lg" />
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
          <Skeleton className="h-5 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-44 rounded-lg" />
      </motion.div>

      {/* Stats Overview Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
      >
        <StatCardSkeleton delay={0.1} />
        <StatCardSkeleton delay={0.15} />
        <StatCardSkeleton delay={0.2} />
      </motion.div>

      {/* Resume List Skeleton */}
      <div className="space-y-4">
        <ResumeCardSkeleton delay={0.25} />
        <ResumeCardSkeleton delay={0.3} />
        <ResumeCardSkeleton delay={0.35} />
      </div>
    </main>
  );
}
