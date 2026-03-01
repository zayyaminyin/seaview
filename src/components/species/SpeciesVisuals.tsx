"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, TooltipProps,
} from "recharts";
import { Sparkline } from "@/components/ui/Sparkline";
import type { Species, ConservationStatus } from "@/data/species";
import { conservationStatusInfo } from "@/data/species";

interface SpeciesVisualsProps {
  species: Species;
  relatedSpecies: Species[];
}

const trendColors: Record<string, { stroke: string; glow: string }> = {
  increasing: { stroke: "#00bfa5", glow: "#00bfa5" },
  stable: { stroke: "#5c9ecf", glow: "#5c9ecf" },
  decreasing: { stroke: "#ff6b35", glow: "#ff6b35" },
  unknown: { stroke: "#7788aa", glow: "#7788aa" },
};

const statusOrder: ConservationStatus[] = ["LC", "NT", "VU", "EN", "CR", "EW", "EX"];

const threatBarColors = ["#ff4444", "#ff6b35", "#ff9800", "#ffb74d", "#ffd54f"];

function DarkTooltip({ active, payload, label }: TooltipProps<number, number>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ad-tooltip">
      <p className="ad-tooltip-label">{label}</p>
      <p className="ad-tooltip-value">{payload[0].value?.toLocaleString()}</p>
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

function formatNum(v: number): string {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return String(v);
}

export function SpeciesVisuals({ species: s, relatedSpecies }: SpeciesVisualsProps) {
  const colors = trendColors[s.populationTrend] || trendColors.unknown;
  const statusIdx = statusOrder.indexOf(s.conservationStatus);

  const popData = s.populationData;
  const firstPop = popData[0]?.estimate || 1;
  const lastPop = popData[popData.length - 1]?.estimate || 1;
  const changePct = Math.round(((lastPop - firstPop) / firstPop) * 100);

  const radarData = [
    { axis: "Population", value: statusIdx <= 2 ? 80 - statusIdx * 10 : 30 + (4 - statusIdx) * 5 },
    { axis: "Resilience", value: s.populationTrend === "increasing" ? 85 : s.populationTrend === "stable" ? 60 : 30 },
    { axis: "Habitat", value: Math.min(100, s.oceanRegions.length * 15) },
    { axis: "Genetics", value: Math.max(20, 70 - statusIdx * 12) },
    { axis: "Threats", value: Math.min(100, s.threats.length * 22) },
  ];

  const threatData = s.threats.slice(0, 5).map((t, i) => ({
    name: t.length > 22 ? t.slice(0, 20) + "…" : t,
    severity: Math.max(25, 100 - i * 15 + (statusIdx >= 3 ? 20 : 0)),
    color: threatBarColors[i] || threatBarColors[4],
  }));

  const riskScore = Math.round(
    (statusIdx / 6) * 40 +
    (s.populationTrend === "decreasing" ? 30 : s.populationTrend === "unknown" ? 15 : 0) +
    Math.min(30, s.threats.length * 6)
  );

  const compSpecies = [
    { name: s.commonName, pop: parsePop(s.estimatedPopulation) || lastPop, status: s.conservationStatus, isCurrent: true },
    ...relatedSpecies.slice(0, 4).map((rs) => ({
      name: rs.commonName,
      pop: parsePop(rs.estimatedPopulation) || rs.populationData[rs.populationData.length - 1]?.estimate || 0,
      status: rs.conservationStatus,
      isCurrent: false,
    })),
  ].filter(d => d.pop > 0);

  const maxCompPop = Math.max(...compSpecies.map(d => d.pop), 1);

  const radarAccent = conservationStatusInfo[s.conservationStatus]?.color || "#5c9ecf";

  return (
    <div className="analytics-dark flex flex-col h-full gap-[4px] p-[4px]">

      {/* ROW 1: Population Trend (2/3) + Risk Radar (1/3) */}
      <div className="flex gap-[4px] flex-1 min-h-0" style={{ flex: "3 1 0" }}>

        {/* Population Trend - Hero Chart */}
        <div className="ad-card" style={{ flex: "2 1 0" }}>
          <div className="ad-card-header">
            <span>Population Trend</span>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold"
                style={{ color: changePct >= 0 ? "#00bfa5" : "#ff6b35" }}
              >
                {changePct >= 0 ? "+" : ""}{changePct}%
                <span className="text-[8px] font-normal text-[#556677] ml-1">since 2000</span>
              </span>
              <Sparkline
                data={popData.map((d) => d.estimate)}
                width={44}
                height={12}
                strokeColor={colors.stroke}
              />
            </div>
          </div>
          <div className="ad-card-body">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={popData} margin={{ top: 8, right: 10, left: -5, bottom: 2 }}>
                <defs>
                  <linearGradient id="darkPopGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.35} />
                    <stop offset="80%" stopColor={colors.stroke} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#2a3a4a"
                  fontSize={8}
                  tickLine={false}
                  tick={{ fill: "#556677" }}
                />
                <YAxis
                  stroke="#2a3a4a"
                  fontSize={8}
                  tickLine={false}
                  tick={{ fill: "#556677" }}
                  tickFormatter={formatNum}
                />
                <Tooltip content={<DarkTooltip />} cursor={{ stroke: "#2a3a4a" }} />
                <Area
                  type="monotone"
                  dataKey="estimate"
                  stroke={colors.stroke}
                  strokeWidth={2}
                  fill="url(#darkPopGrad)"
                  style={{ filter: `drop-shadow(0 0 4px ${colors.glow}40)` }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Radar */}
        <div className="ad-card" style={{ flex: "1 1 0" }}>
          <div className="ad-card-header">
            <span>Risk Profile</span>
            <span className="text-[9px] font-bold" style={{ color: radarAccent }}>
              {s.conservationStatus}
            </span>
          </div>
          <div className="ad-card-body">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="60%">
                <PolarGrid stroke="#1e2d3d" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fontSize: 8, fill: "#667788" }}
                />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar
                  dataKey="value"
                  stroke={radarAccent}
                  fill={radarAccent}
                  fillOpacity={0.2}
                  strokeWidth={1.5}
                  style={{ filter: `drop-shadow(0 0 4px ${radarAccent}60)` }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 2: Metrics Strip */}
      <div className="flex gap-[4px] flex-shrink-0">
        <div className="ad-stat flex-1">
          <span className="ad-stat-label">Change</span>
          <span className="ad-stat-value" style={{ color: changePct >= 0 ? "#00bfa5" : "#ff6b35" }}>
            {changePct >= 0 ? "+" : ""}{changePct}%
          </span>
        </div>
        <div className="ad-stat flex-1">
          <span className="ad-stat-label">Est. Pop.</span>
          <span className="ad-stat-value">{s.estimatedPopulation}</span>
        </div>
        <div className="ad-stat flex-1">
          <span className="ad-stat-label">Risk Score</span>
          <span
            className="ad-stat-value"
            style={{ color: riskScore >= 70 ? "#ff4444" : riskScore >= 40 ? "#ff9800" : "#00bfa5" }}
          >
            {riskScore}/100
          </span>
        </div>
        <div className="ad-stat flex-1">
          <span className="ad-stat-label">Threats</span>
          <span className="ad-stat-value">{s.threats.length}</span>
        </div>
      </div>

      {/* ROW 3: Threat Impact (1/2) + Species Comparison (1/2) */}
      <div className="flex gap-[4px] flex-1 min-h-0" style={{ flex: "2 1 0" }}>

        {/* Threat Impact Bars */}
        <div className="ad-card" style={{ flex: "1 1 0" }}>
          <div className="ad-card-header">
            <span>Threat Impact</span>
          </div>
          <div className="ad-card-body overflow-y-auto px-2.5 py-2 flex flex-col justify-center gap-[3px]">
            {threatData.map((t, i) => (
              <div key={i} className="ad-bar-row">
                <span className="ad-bar-label">{t.name}</span>
                <div className="ad-bar-track">
                  <div
                    className="ad-bar-fill"
                    style={{
                      width: `${t.severity}%`,
                      background: `linear-gradient(90deg, ${t.color}cc, ${t.color})`,
                      boxShadow: `0 0 6px ${t.color}40`,
                    }}
                  />
                </div>
                <span className="ad-bar-value">{t.severity}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Species Comparison - Horizontal Bars */}
        <div className="ad-card" style={{ flex: "1 1 0" }}>
          <div className="ad-card-header">
            <span>Species Comparison</span>
          </div>
          <div className="ad-card-body overflow-y-auto px-2.5 py-2 flex flex-col justify-center gap-[3px]">
            {compSpecies.length > 0 ? (
              compSpecies.map((sp, i) => {
                const barColor = conservationStatusInfo[sp.status]?.color || "#5c9ecf";
                const pct = (sp.pop / maxCompPop) * 100;
                return (
                  <div key={i} className="ad-bar-row">
                    <span
                      className="ad-bar-label"
                      style={{ color: sp.isCurrent ? "#e0e8f0" : "#667788", fontWeight: sp.isCurrent ? 700 : 400 }}
                    >
                      {sp.name.length > 14 ? sp.name.slice(0, 12) + "…" : sp.name}
                    </span>
                    <div className="ad-bar-track">
                      <div
                        className="ad-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: sp.isCurrent
                            ? `linear-gradient(90deg, ${barColor}cc, ${barColor})`
                            : `linear-gradient(90deg, ${barColor}66, ${barColor}88)`,
                          boxShadow: sp.isCurrent ? `0 0 6px ${barColor}40` : "none",
                        }}
                      />
                    </div>
                    <span className="ad-bar-value">{formatNum(sp.pop)}</span>
                  </div>
                );
              })
            ) : (
              <span className="text-[9px] text-[#556677] text-center">No comparison data</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
