"use client";

import {
  Card,
  CardBody,
  CardHeader,
} from "@heroui/card";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Practice Interviews That <span className="text-primary">Feel Real</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-lg text-muted-foreground mb-8"
        >
          TheMindMock helps you optimize your resume and face AI-powered
          voice interviews with real-time feedback on confidence,
          communication, and technical depth.
        </motion.p>

        <div className="flex gap-4">
          <Button
            color="primary"
            size="lg"
            onPress={() => router.push("/login")}
          >
            Start Free Mock Interview
          </Button>

          <Button
            variant="bordered"
            size="lg"
            onPress={() => router.push("/login")}
          >
            Watch Demo
          </Button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="font-semibold text-lg">
              1. Upload Resume
            </CardHeader>
            <CardBody>
              Upload your resume and paste the job description. Our ATS
              engine analyzes gaps and matching skills.
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="font-semibold text-lg">
              2. Face the Interview
            </CardHeader>
            <CardBody>
              Talk to a voice-based AI interviewer that asks technical and
              behavioral questions with real follow-ups.
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="font-semibold text-lg">
              3. Improve & Repeat
            </CardHeader>
            <CardBody>
              Get confidence scores, STAR analysis, transcripts, and
              personalized model answers.
            </CardBody>
          </Card>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 bg-content1">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why TheMindMock?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Feature title="ATS Resume Scoring" />
          <Feature title="Voice-to-Voice Interview" />
          <Feature title="Confidence & STAR Analysis" />
          <Feature title="Personalized Feedback" />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Ready to Crack Your Next Interview?
        </h2>

        <Button
          color="primary"
          size="lg"
          onPress={() => router.push("/login")}
        >
          Get Started for Free
        </Button>
      </section>
    </div>
  );
}

/* Small reusable component */
function Feature({ title }: { title: string }) {
  return (
    <Card>
      <CardBody className="text-center font-medium">
        {title}
      </CardBody>
    </Card>
  );
}
