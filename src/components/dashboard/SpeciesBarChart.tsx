"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

type SpeciesBarChartProps = {
  data: { type: string; count: number; color: string }[];
  className?: string;
};

const AXIS_COLOR = "#666";
const GRID_COLOR = "#eeeeee";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { type: string; count: number; color: string } }[];
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div
      className="px-3 py-2 rounded border bg-white shadow-sm min-w-[120px]"
      style={{ borderColor: "#ddd" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-[#1a1a1a] font-medium text-xs">{item.type}</span>
      </div>
      <div className="text-[#666] text-[11px] mt-1">
        {item.count.toLocaleString()} species
      </div>
    </div>
  );
}

export function SpeciesBarChart({ data, className }: SpeciesBarChartProps) {
  const chartData = useMemo(
    () => [...data].sort((a, b) => b.count - a.count),
    [data]
  );

  return (
    <div className={cn("h-full w-full min-h-0", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 8, left: 60, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID_COLOR}
            horizontal={false}
          />
          <XAxis
            type="number"
            stroke={AXIS_COLOR}
            tick={{ fill: AXIS_COLOR, fontSize: 10 }}
            axisLine={{ stroke: "#e0e0e0" }}
            tickLine={{ stroke: "#e0e0e0" }}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <YAxis
            type="category"
            dataKey="type"
            width={55}
            stroke={AXIS_COLOR}
            tick={{ fill: AXIS_COLOR, fontSize: 10 }}
            axisLine={{ stroke: "#e0e0e0" }}
            tickLine={{ stroke: "#e0e0e0" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill="#1565a0"
            fillOpacity={0.85}
            radius={[0, 4, 4, 0]}
            maxBarSize={28}
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
