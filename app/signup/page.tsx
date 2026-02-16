"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Checkbox } from "@heroui/checkbox";
import { motion } from "framer-motion";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FloatingElements } from "@/components";
import {
  GoogleIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  RocketIcon,
  CheckCircleIcon,
  UserIcon,
} from "@/components/icons";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loadingBtnSignup, setLoadingBtnSignup] = useState(false);
  const [loadingBtnGoogle, setLoadingBtnGoogle] = useState(false);  
  const [error, setError] = useState("");

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
  ];

  const handleSignup = async () => {
    try {
      setLoadingBtnSignup(true);
      setError("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!agreeTerms) {
        setError("Please agree to the Terms of Service");
        return;
      }

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      // Create user in MongoDB
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firebaseUid: user.uid,
          name: name,
        }),
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during signup");
      }
    } finally {
      setLoadingBtnSignup(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoadingBtnGoogle(true);
      setError("");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firebaseUid: user.uid,
          name: user.displayName,
        }),
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during signup");
      }
    } finally {
      setLoadingBtnGoogle(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      <FloatingElements />

      {/* Left Side - Benefits */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex-col justify-center px-12 xl:px-20 relative"
      >
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-2xl font-bold">M</span>
            </div>
            <span className="text-3xl font-bold">
              Mind<span className="text-primary">Mock</span>
            </span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Start Your Journey to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Career Success
            </span>
          </h2>

          <p className="text-foreground/60 text-lg mb-10">
            Join thousands of professionals who have transformed their interview
            skills with our AI-powered platform.
          </p>

          <div className="space-y-5">
            {[
              "AI-powered mock interviews",
              "ATS-optimized resume analysis",
              "Real-time feedback & coaching",
              "Track your progress over time",
            ].map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircleIcon className="text-primary" size={18} />
                </div>
                <span className="text-foreground/80 text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 relative z-10">
        {/* Back to Home - Mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-6 left-6 z-20 lg:hidden"
        >
          <Link
            href="/"
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
            Back
          </Link>
        </motion.div>

        <div className="w-full max-w-md">
          {/* Logo - Mobile Only */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 lg:hidden"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white text-lg font-bold">M</span>
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
              <CardHeader className="flex flex-col gap-2 pt-6 pb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-1">
                  <RocketIcon className="text-primary" size={24} />
                </div>
                <h1 className="text-xl font-bold text-center">
                  Create Your Account
                </h1>
                <p className="text-foreground/60 text-center text-sm">
                  Start your free trial today
                </p>
              </CardHeader>

              <CardBody className="px-6 pb-6 space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-danger/10 border border-danger/20"
                  >
                    <p className="text-sm text-danger">{error}</p>
                  </motion.div>
                )}

                {/* Google Sign Up */}
                <Button
                  variant="bordered"
                  size="lg"
                  className="w-full font-medium cursor-pointer"
                  startContent={<GoogleIcon size={20} />}
                  onPress={handleGoogleSignup}
                  isLoading={loadingBtnGoogle}
                >
                  Continue with Google
                </Button>

                <div className="flex items-center gap-4">
                  <Divider className="flex-1" />
                  <span className="text-foreground/40 text-sm">or</span>
                  <Divider className="flex-1" />
                </div>

                {/* Name Input */}
                <Input
                  type="text"
                  label="Full Name"
                  placeholder="Enter your name"
                  variant="bordered"
                  size="lg"
                  startContent={
                    <UserIcon className="text-foreground/40" size={18} />
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  classNames={{
                    inputWrapper: "bg-content2/50",
                  }}
                />

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

                {/* Password Input */}
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Create a password"
                  variant="bordered"
                  size="lg"
                  startContent={
                    <LockIcon className="text-foreground/40" size={18} />
                  }
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  classNames={{
                    inputWrapper: "bg-content2/50",
                  }}
                />

                {/* Password Requirements */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-wrap gap-2"
                  >
                    {passwordRequirements.map((req) => (
                      <span
                        key={req.label}
                        className={`text-xs px-2 py-1 rounded-full ${
                          req.met
                            ? "bg-success/20 text-success"
                            : "bg-content2 text-foreground/40"
                        }`}
                      >
                        {req.label}
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* Confirm Password Input */}
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  variant="bordered"
                  size="lg"
                  startContent={
                    <LockIcon className="text-foreground/40" size={18} />
                  }
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  }
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  classNames={{
                    inputWrapper: "bg-content2/50",
                  }}
                />

                {/* Terms Checkbox */}
                <Checkbox
                  size="sm"
                  isSelected={agreeTerms}
                  onValueChange={setAgreeTerms}
                  classNames={{
                    label: "text-sm text-foreground/60",
                  }}
                >
                  I agree to the{" "}
                  <Link href="#" className="text-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary">
                    Privacy Policy
                  </Link>
                </Checkbox>

                {/* Sign Up Button */}
                <Button
                  color="primary"
                  size="lg"
                  className="w-full font-semibold cursor-pointer"
                  endContent={<ArrowRightIcon size={18} />}
                  onPress={handleSignup}
                  isLoading={loadingBtnSignup}
                  isDisabled={!agreeTerms}
                >
                  Create Account
                </Button>

                <Divider />

                {/* Login Link */}
                <p className="text-center text-foreground/60 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
