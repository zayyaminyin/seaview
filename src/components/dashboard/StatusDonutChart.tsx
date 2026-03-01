"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

type StatusDonutChartProps = {
  data: { status: string; count: number; color: string }[];
  className?: string;
};

function CustomTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: { payload: { status: string; count: number; color: string } }[];
  total: number;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";

  return (
    <div
      className="px-3 py-2 rounded border bg-white shadow-sm min-w-[140px]"
      style={{ borderColor: "#ddd" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-[#1a1a1a] font-medium text-xs">{item.status}</span>
      </div>
      <div className="text-[#666] text-[11px] mt-1">
        {item.count.toLocaleString()} species ({percentage}%)
      </div>
    </div>
  );
}

export function StatusDonutChart({ data, className }: StatusDonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className={cn("relative h-full w-full min-h-0", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip total={total} />} />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 8 }}
            formatter={(value, entry) => (
              <span className="text-[#666] text-[10px]">
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                  style={{
                    backgroundColor:
                      (entry as { payload?: { color: string } }).payload
                        ?.color ?? "#999",
                  }}
                />
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[#1a1a1a] font-bold text-sm">
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
