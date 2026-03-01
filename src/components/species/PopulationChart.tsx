"use client";

import { useMemo, memo } from "react";
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
  compact?: boolean;
};

const trendColors = {
  increasing: {
    stroke: "#4fb3d9",
    fill: "#4fb3d920",
    fillGradient: "url(#blueGradient)",
  },
  stable: {
    stroke: "#667788",
    fill: "#66778820",
    fillGradient: "url(#grayGradient)",
  },
  decreasing: {
    stroke: "#ff6b6b",
    fill: "#ff6b6b20",
    fillGradient: "url(#orangeGradient)",
  },
  unknown: {
    stroke: "#556677",
    fill: "#55667720",
    fillGradient: "url(#slateGradient)",
  },
};

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, number>) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded border border-[#2a3a4a] bg-[#111827] px-3 py-2 shadow-lg"
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#667788]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-[#e0e8f0]">
        {payload[0].value?.toLocaleString()} individuals
      </p>
    </div>
  );
});

const formatYAxisTick = (v: number) =>
  v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : String(v);

export const PopulationChart = memo(function PopulationChart({
  data,
  trend,
  className,
  compact = false,
}: PopulationChartProps) {
  const colors = useMemo(() => trendColors[trend], [trend]);
  const chartMargin = useMemo(() => ({ top: 10, right: 10, left: 0, bottom: 0 }), []);

  const chartContent = (
    <div className={cn("w-full", compact ? "flex-1 min-h-0 h-full" : "h-[200px]")}>
      <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={chartMargin}
          >
            <defs>
              <linearGradient
                id="blueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#4fb3d9" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4fb3d9" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient
                id="grayGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#667788" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#667788" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient
                id="orangeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient
                id="slateGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#556677" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#556677" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="year"
              stroke="#334455"
              fontSize={10}
              tickLine={false}
              axisLine={true}
              tick={{ fill: "#556677" }}
            />
            <YAxis
              stroke="#334455"
              fontSize={10}
              tickLine={false}
              axisLine={true}
              tick={{ fill: "#556677" }}
              tickFormatter={formatYAxisTick}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e2d3d"
              vertical={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#2a3a4a", strokeWidth: 1 }}
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
        "rounded-lg border border-[#1e2d3d] bg-[#111827] p-4",
        className
      )}
    >
      <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wide text-[#667788]">
        Population Trend
      </h3>
      {chartContent}
    </div>
  );
});
