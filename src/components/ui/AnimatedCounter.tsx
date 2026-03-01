"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
  useInView,
} from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function AnimatedCounter({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    formatNumber(Math.round(latest))
  );
  const [displayValue, setDisplayValue] = useState("0");

  useMotionValueEvent(rounded, "change", (latest) => setDisplayValue(latest));

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, value, {
      duration: duration / 1000,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [isInView, value, duration, count]);

  return (
    <span ref={ref} className={cn("text-inherit", className)}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
