"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Navbar, DashboardNavbar, GradientText } from "@/components";

export default function NotFoundPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while checking auth
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20"></div>
        </div>
      </div>
    );
  }

  const handleGoHome = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Show appropriate navbar based on auth state */}
      {user ? <DashboardNavbar /> : <Navbar />}

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg w-full"
        >
          <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
            <CardBody className="p-8 sm:p-12">
              {/* 404 Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-5xl font-bold">
                    <GradientText>404</GradientText>
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl sm:text-3xl font-bold mb-3"
              >
                <GradientText>Page Not Found</GradientText>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-foreground/60 mb-8"
              >
                Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                {!user && (
                  <span className="block mt-2">
                    If you were trying to access a protected page, please log in first.
                  </span>
                )}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button
                  color="primary"
                  size="lg"
                  onPress={handleGoHome}
                  className="font-semibold"
                >
                  {user ? "Go to Dashboard" : "Go to Home"}
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  onPress={handleGoBack}
                  className="font-semibold"
                >
                  Go Back
                </Button>
              </motion.div>

              {/* Additional Links for Authenticated Users */}
              {user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-divider"
                >
                  <p className="text-sm text-foreground/50 mb-4">
                    Quick navigation:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => router.push("/interviews/setup")}
                    >
                      Start Interview
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => router.push("/resume-analyzer")}
                    >
                      Analyze Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => router.push("/interviews/history")}
                    >
                      Interview History
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Login prompt for unauthenticated users */}
              {!user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-divider"
                >
                  <p className="text-sm text-foreground/50 mb-4">
                    Have an account?
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => router.push("/login")}
                    >
                      Log In
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => router.push("/signup")}
                    >
                      Sign Up
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardBody>
          </Card>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 text-foreground/30 text-sm"
          >
            Error Code: 404 | Page Not Found
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
