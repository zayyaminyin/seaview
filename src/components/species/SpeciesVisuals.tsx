"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, TooltipProps,
} from "recharts";
import { Sparkline } from "@/components/ui/Sparkline";
import type { Species, ConservationStatus } from "@/data/species";
import { conservationStatusInfo } from "@/data/species";

interface SpeciesVisualsProps {
  species: Species;
  relatedSpecies: Species[];
}

const trendColors: Record<string, { stroke: string; fill: string }> = {
  increasing: { stroke: "#1565a0", fill: "#1565a020" },
  stable: { stroke: "#607d8b", fill: "#607d8b20" },
  decreasing: { stroke: "#e65100", fill: "#e6510020" },
  unknown: { stroke: "#9e9e9e", fill: "#9e9e9e20" },
};

const statusOrder: ConservationStatus[] = ["LC", "NT", "VU", "EN", "CR", "EW", "EX"];

function PopTooltip({ active, payload, label }: TooltipProps<number, number>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-[#e0e0e0] bg-white px-2 py-1 shadow-sm">
      <p className="text-[8px] font-bold text-[#666]">{label}</p>
      <p className="text-[10px] font-bold text-black">{payload[0].value?.toLocaleString()}</p>
    </div>
  );
}

function parsePop(str: string): number | null {
  const cleaned = str.replace(/[~,]/g, "");
  const rangeMatch = cleaned.match(/([\d.]+)[–-]([\d.]+)/);
  if (rangeMatch) return Math.round((parseFloat(rangeMatch[1]) + parseFloat(rangeMatch[2])) / 2);
  const numMatch = cleaned.match(/<?([\d.]+)/);
  if (numMatch) return Math.round(parseFloat(numMatch[1]));
  return null;
}

export function SpeciesVisuals({ species: s, relatedSpecies }: SpeciesVisualsProps) {
  const colors = trendColors[s.populationTrend] || trendColors.unknown;
  const statusIdx = statusOrder.indexOf(s.conservationStatus);

  const threatData = s.threats.map((t, i) => ({
    name: t.length > 18 ? t.slice(0, 16) + "…" : t,
    severity: Math.max(30, 100 - i * 15 + (statusIdx >= 3 ? 20 : 0)),
    fill: i === 0 ? "#c62828" : i === 1 ? "#e65100" : i === 2 ? "#ef6c00" : "#ffa000",
  }));

  const statusData = statusOrder.map((code) => ({
    name: code,
    value: code === s.conservationStatus ? 1 : 0,
    color: conservationStatusInfo[code].color,
  }));

  const radarData = [
    { axis: "Pop. Size", value: statusIdx <= 2 ? 80 - statusIdx * 10 : 30 + (4 - statusIdx) * 5, max: 100 },
    { axis: "Resilience", value: s.populationTrend === "increasing" ? 85 : s.populationTrend === "stable" ? 60 : 30, max: 100 },
    { axis: "Habitat", value: s.oceanRegions.length * 15, max: 100 },
    { axis: "Genetic Div.", value: Math.max(20, 70 - statusIdx * 12), max: 100 },
    { axis: "Threat Lvl", value: Math.min(100, s.threats.length * 22), max: 100 },
  ];

  const popData = s.populationData;
  const firstPop = popData[0]?.estimate || 1;
  const lastPop = popData[popData.length - 1]?.estimate || 1;
  const changePct = Math.round(((lastPop - firstPop) / firstPop) * 100);

  const compData = [
    { name: s.commonName.length > 12 ? s.commonName.slice(0, 10) + "…" : s.commonName, pop: parsePop(s.estimatedPopulation) || lastPop, fill: conservationStatusInfo[s.conservationStatus].color },
    ...relatedSpecies.slice(0, 3).map((rs) => ({
      name: rs.commonName.length > 12 ? rs.commonName.slice(0, 10) + "…" : rs.commonName,
      pop: parsePop(rs.estimatedPopulation) || rs.populationData[rs.populationData.length - 1]?.estimate || 0,
      fill: conservationStatusInfo[rs.conservationStatus].color,
    })),
  ];

  const decadeAvgs = [
    { period: "2000–04", avg: Math.round(popData.slice(0, 5).reduce((a, d) => a + d.estimate, 0) / 5) },
    { period: "2005–09", avg: Math.round(popData.slice(5, 10).reduce((a, d) => a + d.estimate, 0) / 5) },
    { period: "2010–14", avg: Math.round(popData.slice(10, 15).reduce((a, d) => a + d.estimate, 0) / 5) },
    { period: "2015–19", avg: Math.round(popData.slice(15, 20).reduce((a, d) => a + d.estimate, 0) / 5) },
    { period: "2020–24", avg: Math.round(popData.slice(20, 25).reduce((a, d) => a + d.estimate, 0) / Math.min(5, popData.slice(20).length || 1)) },
  ];

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-[3px] h-full p-[3px]">

      {/* 1. Population trend (top-left, spans 2 cols) */}
      <div className="col-span-2 flex flex-col min-h-0 bg-white rounded border border-[#eee]">
        <div className="flex items-center justify-between px-2 py-0.5 border-b border-[#f0f0f0]">
          <span className="text-[8px] font-bold uppercase tracking-wider text-[#888]">Population Trend</span>
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold ${changePct >= 0 ? "text-[#1565a0]" : "text-[#c62828]"}`}>
              {changePct >= 0 ? "+" : ""}{changePct}% since 2000
            </span>
            <Sparkline data={popData.map((d) => d.estimate)} width={40} height={10} strokeColor={colors.stroke} />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={popData} margin={{ top: 5, right: 8, left: -5, bottom: 0 }}>
              <defs>
                <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={colors.stroke} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="year" stroke="#ccc" fontSize={8} tickLine={false} />
              <YAxis stroke="#ccc" fontSize={8} tickLine={false} tickFormatter={(v) => v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : String(v)} />
              <Tooltip content={<PopTooltip />} cursor={{ stroke: "#ddd" }} />
              <Area type="monotone" dataKey="estimate" stroke={colors.stroke} strokeWidth={1.5} fill="url(#popGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Vulnerability radar (top-right) */}
      <div className="flex flex-col min-h-0 bg-white rounded border border-[#eee]">
        <div className="px-2 py-0.5 border-b border-[#f0f0f0]">
          <span className="text-[8px] font-bold uppercase tracking-wider text-[#888]">Risk Profile</span>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="65%">
              <PolarGrid stroke="#e8e8e8" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 7, fill: "#888" }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar dataKey="value" stroke={conservationStatusInfo[s.conservationStatus].color} fill={conservationStatusInfo[s.conservationStatus].color} fillOpacity={0.25} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Threat severity bars (bottom-left) */}
      <div className="flex flex-col min-h-0 bg-white rounded border border-[#eee]">
        <div className="px-2 py-0.5 border-b border-[#f0f0f0]">
          <span className="text-[8px] font-bold uppercase tracking-wider text-[#888]">Threat Impact</span>
        </div>
        <div className="flex-1 min-h-0 px-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={threatData} layout="vertical" margin={{ top: 4, right: 4, left: 0, bottom: 2 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 7, fill: "#666" }} width={70} tickLine={false} axisLine={false} />
              <Bar dataKey="severity" radius={[0, 3, 3, 0]} barSize={8}>
                {threatData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. 5-year averages (bottom-center) */}
      <div className="flex flex-col min-h-0 bg-white rounded border border-[#eee]">
        <div className="px-2 py-0.5 border-b border-[#f0f0f0]">
          <span className="text-[8px] font-bold uppercase tracking-wider text-[#888]">5-Year Averages</span>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={decadeAvgs} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="period" fontSize={7} tick={{ fill: "#888" }} tickLine={false} />
              <YAxis fontSize={7} tick={{ fill: "#aaa" }} tickLine={false} tickFormatter={(v) => v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : String(v)} />
              <Tooltip content={<PopTooltip />} cursor={{ fill: "#f5f5f5" }} />
              <Bar dataKey="avg" fill={colors.stroke} radius={[2, 2, 0, 0]} barSize={16} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Population comparison with related species (bottom-right) */}
      <div className="flex flex-col min-h-0 bg-white rounded border border-[#eee]">
        <div className="px-2 py-0.5 border-b border-[#f0f0f0]">
          <span className="text-[8px] font-bold uppercase tracking-wider text-[#888]">Pop. Comparison</span>
        </div>
        <div className="flex-1 min-h-0 flex items-center justify-center">
          {compData.filter(d => d.pop > 0).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compData.filter(d => d.pop > 0)}
                  dataKey="pop"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="65%"
                  strokeWidth={1}
                  stroke="#fff"
                >
                  {compData.filter(d => d.pop > 0).map((entry, i) => (
                    <Cell key={i} fill={entry.fill} fillOpacity={i === 0 ? 1 : 0.5} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => value.toLocaleString()}
                  contentStyle={{ fontSize: 9, borderRadius: 4, padding: "2px 6px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-[8px] text-[#aaa]">No data</span>
          )}
        </div>
        <div className="px-1.5 pb-1 flex flex-wrap gap-1 justify-center">
          {compData.filter(d => d.pop > 0).map((d, i) => (
            <span key={i} className="flex items-center gap-0.5 text-[6px] text-[#888]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.fill, opacity: i === 0 ? 1 : 0.5 }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
