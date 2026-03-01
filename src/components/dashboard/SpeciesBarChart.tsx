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

const AXIS_COLOR = "#556677";
const GRID_COLOR = "#1e2d3d";

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
      className="px-3 py-2 rounded border bg-[#111827] shadow-lg min-w-[120px]"
      style={{ borderColor: "#2a3a4a" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-[#e0e8f0] font-medium text-xs">{item.type}</span>
      </div>
      <div className="text-[#667788] text-[11px] mt-1">
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
            axisLine={{ stroke: GRID_COLOR }}
            tickLine={{ stroke: GRID_COLOR }}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <YAxis
            type="category"
            dataKey="type"
            width={55}
            stroke={AXIS_COLOR}
            tick={{ fill: AXIS_COLOR, fontSize: 10 }}
            axisLine={{ stroke: GRID_COLOR }}
            tickLine={{ stroke: GRID_COLOR }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill="#4fb3d9"
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
