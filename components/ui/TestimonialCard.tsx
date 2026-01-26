"use client";

import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  delay?: number;
}

export default function TestimonialCard({
  quote,
  name,
  role,
  company,
  avatar,
  delay = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full bg-content1/50 backdrop-blur-sm border border-divider">
        <CardBody className="p-6 md:p-8">
          {/* Quote Icon */}
          <svg
            className="w-10 h-10 text-primary/30 mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          
          <p className="text-foreground/80 text-base md:text-lg leading-relaxed mb-6 italic">
            "{quote}"
          </p>
          
          <div className="flex items-center gap-4">
            <Avatar
              name={name}
              src={avatar}
              size="md"
              className="ring-2 ring-primary/20"
            />
            <div>
              <h4 className="font-semibold text-foreground">{name}</h4>
              <p className="text-foreground/60 text-sm">
                {role} at {company}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
