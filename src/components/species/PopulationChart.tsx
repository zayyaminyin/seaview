"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";
import type { PopulationTrend } from "@/data/species";

type PopulationChartProps = {
  data: { year: number; estimate: number }[];
  trend: PopulationTrend;
  className?: string;
  /** When true, hides title and fills container height for cockpit/panel layouts */
  compact?: boolean;
};

const trendColors = {
  increasing: {
    stroke: "#1565a0",
    fill: "#1565a020",
    fillGradient: "url(#blueGradient)",
  },
  stable: {
    stroke: "#607d8b",
    fill: "#607d8b20",
    fillGradient: "url(#grayGradient)",
  },
  decreasing: {
    stroke: "#e65100",
    fill: "#e6510020",
    fillGradient: "url(#orangeGradient)",
  },
  unknown: {
    stroke: "#9e9e9e",
    fill: "#9e9e9e20",
    fillGradient: "url(#slateGradient)",
  },
};

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, number>) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded border border-[#e0e0e0] bg-white px-3 py-2 shadow-sm"
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#666]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-black">
        {payload[0].value?.toLocaleString()} individuals
      </p>
    </div>
  );
}

export function PopulationChart({
  data,
  trend,
  className,
  compact = false,
}: PopulationChartProps) {
  const colors = trendColors[trend];

  const chartContent = (
    <div className={cn("w-full", compact ? "flex-1 min-h-0 h-full" : "h-[200px]")}>
      <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="blueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#1565a0" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#1565a0" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient
                id="grayGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#607d8b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#607d8b" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient
                id="orangeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#e65100" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#e65100" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient
                id="slateGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#9e9e9e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#9e9e9e" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="year"
              stroke="#9e9e9e"
              fontSize={10}
              tickLine={false}
              axisLine={true}
              tick={{ fill: "#666" }}
            />
            <YAxis
              stroke="#9e9e9e"
              fontSize={10}
              tickLine={false}
              axisLine={true}
              tick={{ fill: "#666" }}
              tickFormatter={(v) =>
                v >= 1e6
                  ? `${(v / 1e6).toFixed(1)}M`
                  : v >= 1e3
                    ? `${(v / 1e3).toFixed(0)}K`
                    : String(v)
              }
            />
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e0e0e0"
              vertical={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#e0e0e0", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="estimate"
              stroke={colors.stroke}
              strokeWidth={2}
              fill={colors.fillGradient}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
  );

  if (compact) {
    return (
      <div className={cn("flex-1 min-h-0 flex flex-col w-full", className)}>
        {chartContent}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-[#e0e0e0] bg-white p-4",
        className
      )}
    >
      <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wide text-[#666]">
        Population Trend
      </h3>
      {chartContent}
    </div>
  );
}
