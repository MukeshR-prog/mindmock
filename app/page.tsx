"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

export default function HomePage() {
  const router = useRouter();

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

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 pb-16">
        <FloatingElements />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Chip
            color="primary"
            variant="flat"
            size="lg"
            className="mb-6"
            startContent={<SparklesIcon size={16} />}
          >
            AI-Powered Career Preparation
          </Chip>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-5xl leading-tight"
        >
          Practice Interviews That{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Feel Real
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-2xl text-base sm:text-lg md:text-xl text-foreground/70 mb-10 px-4"
        >
          Optimize your resume, practice with AI voice interviews, and get
          real-time feedback on confidence, communication, and technical depth.
          Land your dream job with MindMock.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            color="primary"
            size="lg"
            className="font-semibold px-8 py-6 text-base"
            endContent={<ArrowRightIcon size={18} />}
            onPress={() => router.push("/signup")}
          >
            Start Free Mock Interview
          </Button>

          <Button
            variant="bordered"
            size="lg"
            className="px-8 py-6 text-base"
            startContent={<PlayIcon size={16} />}
            onPress={() => router.push("/login")}
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-foreground/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <AnimatedSection className="py-16 bg-content1/50 border-y border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Chip color="secondary" variant="flat" size="sm" className="mb-4">
              Features
            </Chip>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ace Your Interview
              </span>
            </h2>
            <p className="text-foreground/60 text-base md:text-lg max-w-2xl mx-auto">
              Our comprehensive platform combines resume optimization, AI-powered
              mock interviews, and detailed analytics to maximize your chances.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        className="py-20 md:py-32 px-4 sm:px-6 bg-content1/30"
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Chip color="primary" variant="flat" size="sm" className="mb-4">
              How It Works
            </Chip>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Get Interview-Ready in{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                4 Simple Steps
              </span>
            </h2>
            <p className="text-foreground/60 text-base md:text-lg max-w-2xl mx-auto">
              Our streamlined process ensures you're fully prepared for any
              interview scenario.
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
              />
            ))}
          </div>
        </div>
      </section>

      {/* UNIQUE FEATURES SHOWCASE */}
      <section className="py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <AnimatedSection>
              <Chip color="warning" variant="flat" size="sm" className="mb-4">
                Unique to MindMock
              </Chip>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Resume vs{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Market Benchmark
                </span>
              </h2>
              <p className="text-foreground/60 text-base md:text-lg mb-8">
                Compare your resume against thousands of successful candidates in
                your target role. See how you stack up and get actionable insights
                to improve your competitive position.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Benchmark against successful hires",
                  "Identify missing keywords and skills",
                  "Compare salary expectations",
                  "Track improvement over time",
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircleIcon className="text-success" size={20} />
                    <span className="text-foreground/80">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                color="primary"
                size="lg"
                className="font-semibold"
                onPress={() => router.push("/signup")}
              >
                Analyze Your Resume
              </Button>
            </AnimatedSection>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-content1 to-content2 rounded-3xl p-8 border border-divider">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">Your Score</span>
                    <span className="text-2xl font-bold text-primary">87/100</span>
                  </div>
                  <div className="h-3 bg-content2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "87%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-content1/50 rounded-xl p-4">
                      <p className="text-sm text-foreground/60 mb-1">Market Avg</p>
                      <p className="text-xl font-semibold">72/100</p>
                    </div>
                    <div className="bg-content1/50 rounded-xl p-4">
                      <p className="text-sm text-foreground/60 mb-1">Top 10%</p>
                      <p className="text-xl font-semibold">92/100</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-success/10 rounded-xl border border-success/20">
                    <p className="text-success text-sm font-medium">
                      ✨ You&apos;re in the top 25% for Software Engineer roles!
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 md:py-32 px-4 sm:px-6 bg-content1/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Chip color="success" variant="flat" size="sm" className="mb-4">
              Testimonials
            </Chip>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Loved by{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
            <p className="text-foreground/60 text-base md:text-lg max-w-2xl mx-auto">
              Join the community of successful job seekers who landed their dream
              roles with MindMock.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Chip color="primary" variant="flat" size="sm" className="mb-4">
              Pricing
            </Chip>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Start{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Free
              </span>
              , Upgrade Anytime
            </h2>
            <p className="text-foreground/60 text-base md:text-lg max-w-2xl mx-auto">
              Get started with our free tier and unlock premium features as you grow.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full bg-content1/50 border border-divider">
                <CardBody className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-foreground/60 mb-6">Perfect for getting started</p>
                  <div className="text-4xl font-bold mb-6">
                    $0<span className="text-lg font-normal text-foreground/60">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      "3 Mock Interviews / month",
                      "Basic Resume Analysis",
                      "Standard AI Questions",
                      "Basic Feedback",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircleIcon className="text-success" size={18} />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="bordered"
                    size="lg"
                    className="w-full font-semibold"
                    onPress={() => router.push("/signup")}
                  >
                    Get Started Free
                  </Button>
                </CardBody>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/50 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Chip color="primary" size="sm">
                    Popular
                  </Chip>
                </div>
                <CardBody className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <p className="text-foreground/60 mb-6">For serious job seekers</p>
                  <div className="text-4xl font-bold mb-6">
                    $19<span className="text-lg font-normal text-foreground/60">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Unlimited Mock Interviews",
                      "Advanced ATS Analysis",
                      "Role-Specific Questions",
                      "STAR Analysis & Scoring",
                      "Voice Confidence Analysis",
                      "Priority Support",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircleIcon className="text-success" size={18} />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    color="primary"
                    size="lg"
                    className="w-full font-semibold"
                    onPress={() => router.push("/signup")}
                  >
                    Start Pro Trial
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 md:py-32 px-4 sm:px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl blur-3xl" />

            <div className="relative bg-content1/80 backdrop-blur-xl rounded-3xl border border-divider p-8 md:p-16">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
              >
                <RocketIcon className="text-white" size={40} />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Ace Your Interview?
                </span>
              </h2>

              <p className="text-foreground/60 text-base md:text-lg max-w-xl mx-auto mb-10">
                Join thousands of successful candidates who prepared with MindMock
                and landed their dream jobs. Your next career opportunity awaits.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  color="primary"
                  size="lg"
                  className="font-semibold px-10 py-6 text-base"
                  endContent={<ArrowRightIcon size={18} />}
                  onPress={() => router.push("/signup")}
                >
                  Get Started for Free
                </Button>
                <Button
                  variant="light"
                  size="lg"
                  className="px-8 py-6 text-base"
                  onPress={() => router.push("/login")}
                >
                  Already have an account? Login
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
