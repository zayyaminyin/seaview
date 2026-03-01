"use client";

import { cn } from "@/lib/utils";
import {
  conservationStatusInfo,
  type ConservationStatus,
} from "@/data/species";

type ConservationBadgeProps = {
  status: ConservationStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

export function ConservationBadge({
  status,
  size = "md",
  showLabel = true,
  className,
}: ConservationBadgeProps) {
  const info = conservationStatusInfo[status];

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-2.5 py-1",
  };

  const borderColor = info.color;
  const bgColor = `${info.color}40`;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border font-bold",
        sizeClasses[size],
        status === "CR" && "border-l-[3px]",
        className
      )}
      style={{
        backgroundColor: bgColor,
        borderColor,
      }}
    >
      <span style={{ color: borderColor }}>{status}</span>
      {showLabel && (
        <span className="ml-1 font-normal text-[#8899aa]">{info.label}</span>
      )}
    </span>
  );
}
