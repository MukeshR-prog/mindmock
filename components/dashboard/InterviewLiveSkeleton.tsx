"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { motion } from "framer-motion";

export default function InterviewLiveSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <Skeleton className="h-9 w-44 rounded-lg mb-3" />
          <Skeleton className="h-5 w-64 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </motion.div>

      {/* Main Interview Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Card Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div>
                  <Skeleton className="h-5 w-32 rounded-lg mb-2" />
                  <Skeleton className="h-4 w-44 rounded-lg" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              {/* Question text skeleton */}
              <div className="py-6">
                <Skeleton className="h-5 w-full rounded-lg mb-2" />
                <Skeleton className="h-5 w-4/5 rounded-lg mb-2" />
                <Skeleton className="h-5 w-3/4 rounded-lg" />
              </div>

              {/* Microphone Control Skeleton */}
              <div className="flex flex-col items-center mt-6 pt-6 border-t border-divider">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-4 w-40 rounded-lg mt-4" />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Sidebar Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Camera Preview Skeleton */}
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div>
                  <Skeleton className="h-5 w-28 rounded-lg mb-2" />
                  <Skeleton className="h-4 w-36 rounded-lg" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <Skeleton className="aspect-video w-full rounded-xl" />
            </CardBody>
          </Card>

          {/* Transcript Card Skeleton */}
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div>
                  <Skeleton className="h-5 w-24 rounded-lg mb-2" />
                  <Skeleton className="h-4 w-32 rounded-lg" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="space-y-3 max-h-[200px]">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-4 w-16 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
