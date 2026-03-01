"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

type TrendLineChartProps = {
  data: { year: number; [key: string]: number }[];
  dataKeys: { key: string; color: string; label: string }[];
  title: string;
  className?: string;
};

const TOOLTIP_BORDER = "#e0e0e0";
const AXIS_COLOR = "#666";
const GRID_COLOR = "#e5e5e5";

function CustomTooltip({
  active,
  payload,
  label,
  dataKeys,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; value?: number; color?: string }>;
  label?: string | number;
  dataKeys: { key: string; color: string; label: string }[];
}) {
  if (!active || !payload?.length || label === undefined) return null;

  const labelMap = Object.fromEntries(dataKeys.map((k) => [k.key, k.label]));

  return (
    <div
      className="px-3 py-2 rounded border bg-white shadow-sm min-w-[120px]"
      style={{ borderColor: TOOLTIP_BORDER }}
    >
      <div className="text-[#666] text-xs font-medium mb-2">{label}</div>
      <div className="space-y-1">
        {payload.map((entry, i) => {
          const dk = String(entry.dataKey ?? "");
          return (
            <div key={dk || i} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[#1a1a1a] text-xs">
                {labelMap[dk] ?? dk}: {(entry.value ?? 0).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TrendLineChart({
  data,
  dataKeys,
  title,
  className,
}: TrendLineChartProps) {
  return (
    <div className={cn("h-full w-full min-h-0", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <defs>
            {dataKeys.map((dk) => (
              <linearGradient
                key={dk.key}
                id={`gradient-${dk.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={dk.color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={dk.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
          <XAxis
            dataKey="year"
            stroke={AXIS_COLOR}
            tick={{ fill: AXIS_COLOR, fontSize: 10 }}
            axisLine={{ stroke: GRID_COLOR }}
            tickLine={{ stroke: GRID_COLOR }}
          />
          <YAxis
            stroke={AXIS_COLOR}
            tick={{ fill: AXIS_COLOR, fontSize: 10 }}
            axisLine={{ stroke: GRID_COLOR }}
            tickLine={{ stroke: GRID_COLOR }}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active}
                payload={payload as Array<{
                  dataKey?: string | number;
                  value?: number;
                  color?: string;
                }>}
                label={label}
                dataKeys={dataKeys}
              />
            )}
          />
          <Legend
            wrapperStyle={{ paddingTop: 4 }}
            formatter={(value, entry) => {
              const dk = dataKeys.find((k) => k.label === value || k.key === value);
              return (
                <span className="text-[#666] text-[10px]">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle"
                    style={{
                      backgroundColor:
                        dk?.color ??
                        (entry as { payload?: { color: string } }).payload
                          ?.color ??
                        "#999",
                    }}
                  />
                  {dk?.label ?? value}
                </span>
              );
            }}
          />
          {dataKeys.map((dk) => (
            <Area
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.label}
              stroke={dk.color}
              strokeWidth={2}
              fill={`url(#gradient-${dk.key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
