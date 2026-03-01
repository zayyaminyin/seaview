"use client";

import type { ConservationStatus } from "@/data/species";

const statusScale: { code: ConservationStatus; label: string; color: string }[] = [
  { code: "LC", label: "LC", color: "#15803d" },
  { code: "NT", label: "NT", color: "#65a30d" },
  { code: "VU", label: "VU", color: "#ca8a04" },
  { code: "EN", label: "EN", color: "#ea580c" },
  { code: "CR", label: "CR", color: "#dc2626" },
  { code: "EW", label: "EW", color: "#7c3aed" },
  { code: "EX", label: "EX", color: "#374151" },
];

type ThreatMeterProps = {
  status: ConservationStatus;
  threats?: string[];
  className?: string;
};

export function ThreatMeter({ status, threats, className = "" }: ThreatMeterProps) {
  const activeIdx = statusScale.findIndex((s) => s.code === status);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="relative">
        {/* Color bar segments */}
        <div className="flex h-2.5 rounded-sm overflow-hidden">
          {statusScale.map((s, i) => (
            <div
              key={s.code}
              className="flex-1 relative"
              style={{ backgroundColor: s.color, opacity: i === activeIdx ? 1 : 0.3 }}
            />
          ))}
        </div>

        {/* Pointer triangle */}
        <div
          className="absolute -bottom-[6px]"
          style={{
            left: `${((activeIdx + 0.5) / statusScale.length) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderBottom: `5px solid ${statusScale[activeIdx].color}`,
            }}
          />
        </div>
      </div>

      {/* Labels below */}
      <div className="flex mt-0.5">
        {statusScale.map((s, i) => (
          <span
            key={s.code}
            className="flex-1 text-center text-[7px] font-bold"
            style={{
              color: i === activeIdx ? s.color : "#334455",
            }}
          >
            {s.label}
          </span>
        ))}
      </div>

      {threats && threats.length > 0 && (
        <span className="text-[8px] text-[#556677]">{threats.length} active threat{threats.length !== 1 ? "s" : ""}</span>
      )}
    </div>
  );
}
