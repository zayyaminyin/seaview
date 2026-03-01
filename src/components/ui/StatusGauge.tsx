"use client";

type StatusGaugeProps = {
  value: number;       // 0-100
  label: string;
  unit?: string;       // e.g. "%"
  color?: string;
  size?: number;       // diameter in px
  className?: string;
};

export function StatusGauge({
  value,
  label,
  unit = "%",
  color = "#1565a0",
  size = 80,
  className = "",
}: StatusGaugeProps) {
  const radius = (size - 10) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
        {/* Value text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a1a1a">
          {value.toFixed(1)}{unit}
        </text>
      </svg>
      <span className="text-[8px] font-bold uppercase tracking-wide text-[#888] -mt-1">{label}</span>
    </div>
  );
}
