"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { motion } from "framer-motion";

export default function ResumeAnalyzerSkeleton() {
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
        className="mb-8"
      >
        <Skeleton className="h-9 w-56 rounded-lg mb-3" />
        <Skeleton className="h-5 w-96 max-w-full rounded-lg" />
      </motion.div>

      {/* Upload Section Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
          <CardHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-5 w-32 rounded-lg mb-2" />
                <Skeleton className="h-4 w-48 rounded-lg" />
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-6 pb-6 space-y-5">
            {/* Drag and Drop Area Skeleton */}
            <div className="border-2 border-dashed border-divider rounded-2xl p-8">
              <div className="flex flex-col items-center">
                <Skeleton className="w-16 h-16 rounded-2xl mb-4" />
                <Skeleton className="h-5 w-52 rounded-lg mb-2" />
                <Skeleton className="h-4 w-40 rounded-lg" />
              </div>
            </div>

            {/* Job Description Textarea Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-lg" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>

            {/* Options Row Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded-lg" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>

            {/* Analyze Button Skeleton */}
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardBody>
        </Card>
      </motion.div>
    </main>
  );
}
