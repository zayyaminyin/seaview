"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

type StatCardProps = {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend: "up" | "down" | "stable";
  trendValue: string;
  className?: string;
};

const trendConfig = {
  up: {
    icon: TrendingUp,
    color: "text-emerald-600",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-600",
  },
  stable: {
    icon: Minus,
    color: "text-[#999]",
  },
};

export function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  const config = trendConfig[trend];
  const TrendIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-lg p-4 border border-[#e0e0e0] relative",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#888] mb-1">
            {title}
          </p>
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            className="text-xl font-bold text-[#1a1a1a] tabular-nums"
          />
          <div className="flex items-center gap-1 mt-2">
            <TrendIcon className={cn("w-3 h-3", config.color)} />
            <span className={cn("text-[10px] font-medium", config.color)}>
              {trendValue}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Icon className="w-4 h-4 text-[#999]" />
        </div>
      </div>
    </motion.div>
  );
}
