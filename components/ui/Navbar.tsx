"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-divider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-sm md:text-lg font-bold">M</span>
            </div>
            <span className="hidden sm:inline">
              Mind<span className="text-primary">Mock</span>
            </span>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-foreground/70 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-foreground/70 hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-foreground/70 hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="light"
              size="sm"
              className="hidden sm:flex"
              onPress={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              color="primary"
              size="sm"
              className="font-semibold"
              onPress={() => router.push("/signup")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
