"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const motionComponents = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  aside: motion.aside,
  main: motion.main,
} as const;

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: keyof typeof motionComponents;
};

export function GlassCard({
  children,
  className,
  hover = false,
  as = "div",
}: GlassCardProps) {
  const MotionComponent = motionComponents[as];

  return (
    <MotionComponent
      className={cn(
        "rounded-lg border border-[#1e2d3d] bg-[#111827] transition-all duration-300",
        hover && "cursor-pointer hover:border-[#4fb3d9]/40 hover:shadow-lg hover:shadow-black/20",
        className
      )}
      whileHover={
        hover
          ? {
              scale: 1.01,
              transition: { duration: 0.2 },
              boxShadow: "0 2px 8px rgba(21, 101, 160, 0.08)",
            }
          : undefined
      }
      whileTap={hover ? { scale: 0.99 } : undefined}
    >
      {children}
    </MotionComponent>
  );
}
