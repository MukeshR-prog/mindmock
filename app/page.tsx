"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import {
  Navbar,
  Footer,
  FeatureCard,
  StepCard,
  StatCard,
  TestimonialCard,
  AnimatedSection,
  FloatingElements,
} from "@/components";

import {
  ResumeIcon,
  MicrophoneIcon,
  BrainIcon,
  ChartIcon,
  TargetIcon,
  RocketIcon,
  MapIcon,
  VolumeIcon,
  TrendingIcon,
  CheckCircleIcon,
  PlayIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/icons";

// Animated Words Component
const AnimatedWords = ({ words }: { words: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="inline-flex items-center justify-center h-[1.2em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -30, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-flow"
          style={{ backgroundSize: '200% 200%' }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default function HomePage() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const smoothY = useSpring(heroY, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(heroOpacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(heroScale, { stiffness: 100, damping: 30 });

  const animatedWords = ["Feel Real", "Build Confidence", "Land Jobs", "Change Lives"];

  const features = [
    {
      icon: <ResumeIcon className="text-primary" size={28} />,
      title: "ATS Resume Scoring",
      description:
        "Get your resume analyzed with industry-standard ATS algorithms. Identify gaps and optimize for maximum visibility.",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: <TargetIcon className="text-primary" size={28} />,
      title: "AI Role Detector",
      description:
        "Our unique AI automatically detects your target role and tailors interview questions to match your career goals.",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: <MicrophoneIcon className="text-primary" size={28} />,
      title: "Voice-to-Voice Interview",
      description:
        "Experience realistic mock interviews with our AI interviewer. Practice speaking naturally with real-time voice interaction.",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: <BrainIcon className="text-primary" size={28} />,
      title: "AI Personality Interviewer",
      description:
        "Choose from different interviewer personalities - friendly, strict, or challenging - to prepare for any scenario.",
      gradient: "from-orange-500/20 to-amber-500/20",
    },
    {
      icon: <ChartIcon className="text-primary" size={28} />,
      title: "Career Readiness Score",
      description:
        "Get a comprehensive score based on your resume quality, interview performance, and skill alignment.",
      gradient: "from-red-500/20 to-rose-500/20",
    },
    {
      icon: <MapIcon className="text-primary" size={28} />,
      title: "Skill Gap Roadmap",
      description:
        "Receive personalized learning paths to bridge the gap between your current skills and job requirements.",
      gradient: "from-indigo-500/20 to-violet-500/20",
    },
    {
      icon: <TrendingIcon className="text-primary" size={28} />,
      title: "Interview Difficulty Adaptation",
      description:
        "Our AI adapts question difficulty based on your responses, ensuring optimal challenge level for growth.",
      gradient: "from-teal-500/20 to-cyan-500/20",
    },
    {
      icon: <VolumeIcon className="text-primary" size={28} />,
      title: "Voice Confidence Analyzer",
      description:
        "Analyze your speaking patterns, filler words, and confidence levels to improve your verbal communication.",
      gradient: "from-pink-500/20 to-fuchsia-500/20",
    },
  ];

  const steps = [
    {
      icon: <ResumeIcon className="text-primary" size={32} />,
      title: "Upload Your Resume",
      description:
        "Upload your resume in PDF or DOCX format. Our AI analyzes it against industry standards and your target job description.",
    },
    {
      icon: <BrainIcon className="text-primary" size={32} />,
      title: "AI Prepares Questions",
      description:
        "Based on your resume, experience level, and target role, our AI generates personalized interview questions.",
    },
    {
      icon: <MicrophoneIcon className="text-primary" size={32} />,
      title: "Practice with AI Interviewer",
      description:
        "Engage in voice-based mock interviews. Answer questions naturally and receive real-time follow-up questions.",
    },
    {
      icon: <ChartIcon className="text-primary" size={32} />,
      title: "Get Detailed Feedback",
      description:
        "Receive comprehensive feedback with STAR analysis, confidence scores, and personalized improvement suggestions.",
    },
  ];

  const testimonials = [
    {
      quote:
        "MindMock helped me prepare for my Google interview. The AI questions were incredibly relevant and the feedback was invaluable.",
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
    },
    {
      quote:
        "I was struggling with behavioral interviews. After practicing with MindMock, I felt confident and landed my dream job.",
      name: "Michael Roberts",
      role: "Product Manager",
      company: "Meta",
    },
    {
      quote:
        "The resume analyzer found issues I never noticed. After optimizing, my callback rate increased by 60%!",
      name: "Emily Johnson",
      role: "Data Scientist",
      company: "Amazon",
    },
  ];

  const stats = [
    { value: "50K+", label: "Mock Interviews Completed" },
    { value: "85%", label: "Success Rate" },
    { value: "500+", label: "Companies Covered" },
    { value: "4.9/5", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION - Enhanced */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: smoothOpacity, scale: smoothScale, y: smoothY }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 pb-40"
      >
        <FloatingElements />

        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 gradient-mesh opacity-50" />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10"
        >
          <Chip
            color="primary"
            variant="flat"
            size="lg"
            className="mb-6 px-4 py-2 animate-gradient-flow"
            style={{ backgroundSize: '200% 200%' }}
            startContent={
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <SparklesIcon size={16} />
              </motion.div>
            }
          >
            AI-Powered Career Preparation
          </Chip>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 max-w-5xl leading-tight tracking-tight"
        >
          Practice Interviews That{" "}
          <br className="hidden sm:block" />
          <AnimatedWords words={animatedWords} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10 max-w-2xl text-base sm:text-lg md:text-xl text-foreground/70 mb-10 px-4 leading-relaxed"
        >
          Optimize your resume, practice with AI voice interviews, and get
          real-time feedback on confidence, communication, and technical depth.
          <span className="text-primary font-medium"> Land your dream job with MindMock.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              color="primary"
              size="lg"
              className="font-semibold px-8 py-6 text-base shadow-xl shadow-primary/25 pulse-glow"
              endContent={
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRightIcon size={18} />
                </motion.span>
              }
              onPress={() => router.push("/signup")}
            >
              Start Free Mock Interview
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="bordered"
              size="lg"
              className="px-8 py-6 text-base backdrop-blur-sm bg-content1/30 hover:bg-content1/50 transition-colors"
              startContent={
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <PlayIcon size={16} />
                </motion.span>
              }
              onPress={() => router.push("/login")}
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-foreground/40 text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* STATS SECTION - Enhanced */}
      <AnimatedSection className="py-20 relative overflow-hidden" direction="scale">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-content1/50 via-content1/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--heroui-primary)/0.05)_0%,_transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground/80">
              Trusted by <span className="text-primary">thousands</span> of job seekers
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FEATURES SECTION - Enhanced */}
      <section id="features" className="py-24 md:py-36 px-4 sm:px-6 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-20" direction="up">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Chip color="secondary" variant="flat" size="sm" className="mb-6">
                ✨ Powerful Features
              </Chip>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Everything You Need to{" "}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-flow" style={{ backgroundSize: '200% 200%' }}>
                Ace Your Interview
              </span>
            </h2>
            <p className="text-foreground/60 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform combines resume optimization, AI-powered
              mock interviews, and detailed analytics to maximize your chances of landing your dream job.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={index * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - Enhanced */}
      <section
        id="how-it-works"
        className="py-24 md:py-36 px-4 sm:px-6 relative overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-content1/40 via-content1/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--heroui-primary)/0.08)_0%,_transparent_50%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-20" direction="up">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Chip color="primary" variant="flat" size="sm" className="mb-6">
                🚀 Simple Process
              </Chip>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Get Interview-Ready in{" "}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-flow" style={{ backgroundSize: '200% 200%' }}>
                4 Simple Steps
              </span>
            </h2>
            <p className="text-foreground/60 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Our streamlined process ensures you&apos;re fully prepared for any
              interview scenario, from startups to Fortune 500 companies.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <StepCard
                key={step.title}
                step={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                delay={index * 0.15}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* UNIQUE FEATURES SHOWCASE - Enhanced */}
      <section className="py-24 md:py-36 px-4 sm:px-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Content */}
            <AnimatedSection direction="right">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Chip color="warning" variant="flat" size="sm" className="mb-6">
                  🎯 Unique to MindMock
                </Chip>
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
                Resume vs{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-flow" style={{ backgroundSize: '200% 200%' }}>
                  Market Benchmark
                </span>
              </h2>
              <p className="text-foreground/60 text-base md:text-lg lg:text-xl mb-10 leading-relaxed">
                Compare your resume against thousands of successful candidates in
                your target role. See how you stack up and get actionable insights
                to improve your competitive position.
              </p>

              <ul className="space-y-5 mb-10">
                {[
                  { text: "Benchmark against successful hires", icon: "📊" },
                  { text: "Identify missing keywords and skills", icon: "🔍" },
                  { text: "Compare salary expectations", icon: "💰" },
                  { text: "Track improvement over time", icon: "📈" },
                ].map((item, index) => (
                  <motion.li
                    key={item.text}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                    className="flex items-center gap-4 group"
                  >
                    <motion.span 
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-2xl"
                    >
                      {item.icon}
                    </motion.span>
                    <span className="text-foreground/80 text-lg group-hover:text-primary transition-colors">
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  color="primary"
                  size="lg"
                  className="font-semibold shadow-xl shadow-primary/25"
                  endContent={<ArrowRightIcon size={18} />}
                  onPress={() => router.push("/signup")}
                >
                  Analyze Your Resume
                </Button>
              </motion.div>
            </AnimatedSection>

            {/* Right Illustration - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 80, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-content1/80 to-content2/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-divider/50 shadow-2xl">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
                
                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Your Resume Score</p>
                      <motion.span 
                        className="text-4xl font-extrabold text-primary"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        87/100
                      </motion.span>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl"
                    >
                      🏆
                    </motion.div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-4 bg-content2/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "87%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                        className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full relative"
                        style={{ backgroundSize: '200% 100%' }}
                      >
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        />
                      </motion.div>
                    </div>
                    <p className="text-xs text-foreground/50">Top 25% of candidates</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Market Avg", value: "72/100", color: "text-foreground" },
                      { label: "Top 10%", value: "92/100", color: "text-success" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-content1/50 backdrop-blur rounded-2xl p-4 border border-divider/30"
                      >
                        <p className="text-sm text-foreground/60 mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Success Message */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="p-4 bg-success/10 rounded-2xl border border-success/20"
                  >
                    <p className="text-success text-sm font-medium flex items-center gap-2">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ✨
                      </motion.span>
                      You&apos;re in the top 25% for Software Engineer roles!
                    </p>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 -right-6 w-24 h-24 bg-primary/30 rounded-full blur-2xl" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-6 -left-6 w-20 h-20 bg-secondary/30 rounded-full blur-2xl" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - Enhanced */}
      <section className="py-24 md:py-36 px-4 sm:px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-content1/40 via-content1/20 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-20" direction="up">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Chip color="success" variant="flat" size="sm" className="mb-6">
                💬 Success Stories
              </Chip>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Loved by{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-flow" style={{ backgroundSize: '200% 200%' }}>
                Thousands
              </span>
            </h2>
            <p className="text-foreground/60 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Join the community of successful job seekers who landed their dream
              roles with MindMock. Here&apos;s what they have to say.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION - Enhanced */}
      <section id="pricing" className="py-24 md:py-36 px-4 sm:px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20"
          >
            <div className="absolute inset-0 rounded-full border border-primary/20" />
            <div className="absolute inset-8 rounded-full border border-secondary/20" />
            <div className="absolute inset-16 rounded-full border border-primary/20" />
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16" direction="up">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Chip color="primary" variant="flat" size="sm" className="mb-6">
                💎 Pricing Plans
              </Chip>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Start{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-flow" style={{ backgroundSize: '200% 200%' }}>
                Free
              </span>
              , Upgrade Anytime
            </h2>
            <p className="text-foreground/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Get started with our free tier and unlock premium features as you grow.
              No credit card required.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <Card className="h-full bg-content1/40 backdrop-blur-xl border border-divider/50 group-hover:border-foreground/20 transition-all duration-500 overflow-hidden">
                <CardBody className="p-8 lg:p-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">Free</h3>
                    <span className="text-3xl">🎁</span>
                  </div>
                  <p className="text-foreground/60 mb-6">Perfect for getting started</p>
                  <div className="text-5xl font-extrabold mb-8">
                    $0<span className="text-lg font-normal text-foreground/60">/month</span>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {[
                      "3 Mock Interviews / month",
                      "Basic Resume Analysis",
                      "Standard AI Questions",
                      "Basic Feedback",
                    ].map((feature, i) => (
                      <motion.li 
                        key={feature} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <CheckCircleIcon className="text-success" size={18} />
                        <span className="text-foreground/80">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="bordered"
                      size="lg"
                      className="w-full font-semibold backdrop-blur-sm"
                      onPress={() => router.push("/signup")}
                    >
                      Get Started Free
                    </Button>
                  </motion.div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateY: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <Card className="h-full bg-gradient-to-br from-primary/10 via-content1/60 to-secondary/10 backdrop-blur-xl border-2 border-primary/50 relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-[inherit] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-4 right-4 z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Chip color="primary" size="sm" className="font-semibold">
                      ⭐ Popular
                    </Chip>
                  </motion.div>
                </div>
                <CardBody className="p-8 lg:p-10 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">Pro</h3>
                    <span className="text-3xl">🚀</span>
                  </div>
                  <p className="text-foreground/60 mb-6">For serious job seekers</p>
                  <div className="text-5xl font-extrabold mb-2">
                    $19<span className="text-lg font-normal text-foreground/60">/month</span>
                  </div>
                  <p className="text-primary text-sm mb-8">Save 40% with annual billing</p>

                  <ul className="space-y-4 mb-10">
                    {[
                      "Unlimited Mock Interviews",
                      "Advanced ATS Analysis",
                      "Role-Specific Questions",
                      "STAR Analysis & Scoring",
                      "Voice Confidence Analysis",
                      "Priority Support",
                    ].map((feature, i) => (
                      <motion.li 
                        key={feature} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                      >
                        <CheckCircleIcon className="text-success" size={18} />
                        <span className="text-foreground/80">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      color="primary"
                      size="lg"
                      className="w-full font-semibold shadow-xl shadow-primary/25"
                      onPress={() => router.push("/signup")}
                    >
                      Start Pro Trial
                    </Button>
                  </motion.div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Enhanced */}
      <section className="py-24 md:py-36 px-4 sm:px-6 relative overflow-hidden">
        <AnimatedSection direction="scale">
          <div className="max-w-5xl mx-auto text-center relative">
            {/* Animated Background */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[40px] blur-3xl" 
            />

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative glass-strong rounded-[40px] border border-foreground/10 p-10 md:p-20"
            >
              {/* Floating Decoration */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-xl"
              />
              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-3xl blur-xl"
              />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-24 h-24 mx-auto mb-10 rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-2xl shadow-primary/30"
              >
                <RocketIcon className="text-white" size={48} />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 tracking-tight">
                Ready to{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-flow" style={{ backgroundSize: '200% 200%' }}>
                  Ace Your Interview?
                </span>
              </h2>

              <p className="text-foreground/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                Join thousands of successful candidates who prepared with MindMock
                and landed their dream jobs. Your next career opportunity awaits.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    color="primary"
                    size="lg"
                    className="font-semibold px-12 py-7 text-lg shadow-2xl shadow-primary/30 pulse-glow"
                    endContent={
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRightIcon size={20} />
                      </motion.span>
                    }
                    onPress={() => router.push("/signup")}
                  >
                    Get Started for Free
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="light"
                    size="lg"
                    className="px-8 py-7 text-lg"
                    onPress={() => router.push("/login")}
                  >
                    Already have an account? Login
                  </Button>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex items-center justify-center gap-6 flex-wrap text-foreground/50 text-sm"
              >
                <span className="flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-success" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-success" />
                  Free forever plan
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-success" />
                  Cancel anytime
                </span>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
