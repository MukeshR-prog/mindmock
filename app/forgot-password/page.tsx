"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";

import { FloatingElements } from "@/components";
import { MailIcon, ArrowRightIcon, ShieldIcon } from "@/components/icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    try {
      setLoading(true);
      setError("");
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-8">
      <FloatingElements />

      {/* Back to Login */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          href="/login"
          className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Login
        </Link>
      </motion.div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <span>
              Mind<span className="text-primary">Mock</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-content1/80 backdrop-blur-xl border border-divider shadow-2xl">
            <CardHeader className="flex flex-col gap-2 pt-8 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-2">
                <ShieldIcon className="text-primary" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-center">Reset Password</h1>
              <p className="text-foreground/60 text-center text-sm">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </CardHeader>

            <CardBody className="px-6 pb-8 space-y-5">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-success"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                  <p className="text-foreground/60 text-sm mb-6">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>
                  </p>
                  <Button
                    variant="bordered"
                    onPress={() => setSuccess(false)}
                  >
                    Send Another Link
                  </Button>
                </motion.div>
              ) : (
                <>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-danger/10 border border-danger/20"
                    >
                      <p className="text-sm text-danger">{error}</p>
                    </motion.div>
                  )}

                  {/* Email Input */}
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    size="lg"
                    startContent={
                      <MailIcon className="text-foreground/40" size={18} />
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    classNames={{
                      inputWrapper: "bg-content2/50",
                    }}
                  />

                  {/* Reset Button */}
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full font-semibold"
                    endContent={<ArrowRightIcon size={18} />}
                    onPress={handleReset}
                    isLoading={loading}
                  >
                    Send Reset Link
                  </Button>

                  {/* Back to Login */}
                  <p className="text-center text-foreground/60 text-sm">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
