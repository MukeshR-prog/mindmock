"use client";

import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
  via?: string;
}

export default function GradientText({
  children,
  className = "",
  from = "from-primary",
  to = "to-secondary",
  via,
}: GradientTextProps) {
  const viaClass = via ? `via-${via}` : "";
  
  return (
    <span
      className={`bg-gradient-to-r ${from} ${viaClass} ${to} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
