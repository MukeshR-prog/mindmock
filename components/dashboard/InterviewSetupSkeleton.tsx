"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { motion } from "framer-motion";

export default function InterviewSetupSkeleton() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Tabs Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Skeleton className="h-14 w-full max-w-md rounded-xl" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Setup Form Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div>
                  <Skeleton className="h-5 w-40 rounded-lg mb-2" />
                  <Skeleton className="h-4 w-56 rounded-lg" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 space-y-6">
              {/* Concept Categories Skeleton */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-48 rounded-lg" />
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} className="h-16 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Target Role Section */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-28 rounded-lg" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </CardBody>
          </Card>

          {/* Interview Settings Card Skeleton */}
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider mt-6">
            <CardHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div>
                  <Skeleton className="h-5 w-36 rounded-lg mb-2" />
                  <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 space-y-6">
              {/* Interview Type */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-28 rounded-lg" />
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-32 rounded-lg" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Sidebar Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Voice Selection Card */}
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div>
                  <Skeleton className="h-5 w-28 rounded-lg mb-2" />
                  <Skeleton className="h-4 w-40 rounded-lg" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </CardBody>
          </Card>

          {/* Camera Preview Card */}
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
              <Skeleton className="aspect-video w-full rounded-xl mb-4" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </CardBody>
          </Card>

          {/* Start Button Skeleton */}
          <Skeleton className="h-14 w-full rounded-xl" />
        </motion.div>
      </div>
    </main>
  );
}
