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
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group h-full"
    >
      <Card className="h-full bg-content1/40 backdrop-blur-xl border border-divider/50 group-hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
        {/* Gradient Background on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Top Accent */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
        />

        <CardBody className="p-6 md:p-8 relative z-10">
          {/* Quote Icon with Glow */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              delay: delay + 0.1 
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <svg
              className="w-12 h-12 text-primary/40 mb-6 relative z-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </motion.div>
          
          {/* Quote Text */}
          <motion.p 
            className="text-foreground/80 text-base md:text-lg leading-relaxed mb-8 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            <span className="text-primary/60 text-2xl font-serif">&ldquo;</span>
            {quote}
            <span className="text-primary/60 text-2xl font-serif">&rdquo;</span>
          </motion.p>
          
          {/* Divider Line */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-divider to-transparent mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: delay + 0.3 }}
          />

          {/* Author Info */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="relative"
            >
              {/* Avatar Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-50 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
              <Avatar
                name={name}
                src={avatar}
                size="md"
                className="relative z-10 ring-2 ring-content1"
              />
            </motion.div>
            <div>
              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {name}
              </h4>
              <p className="text-foreground/60 text-sm flex items-center gap-1">
                {role}
                <span className="text-primary">@</span>
                <span className="text-primary/80 font-medium">{company}</span>
              </p>
            </div>
          </motion.div>

          {/* Star Rating */}
          <motion.div 
            className="flex gap-1 mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.svg
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.5 + i * 0.1 }}
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            ))}
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
