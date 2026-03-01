"use client";

import Link from "next/link";
import {
  species,
  conservationStatusInfo,
  type Species,
  type ConservationStatus,
} from "@/data/species";
import { summaryStats, yearlyStats } from "@/data/statistics";
import { oceanRegions } from "@/data/oceanRegions";
import { ConservationBadge } from "@/components/species/ConservationBadge";
import { Sparkline } from "@/components/ui/Sparkline";
import { StatusGauge } from "@/components/ui/StatusGauge";
import { HomeMap } from "@/components/dashboard/HomeMap";
import {
  Fish,
  Map,
  BarChart3,
  Globe,
  Shield,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const featuredSpecies: Species[] = species;

const statusOrder: ConservationStatus[] = ["CR", "EN", "VU", "NT", "LC", "EW", "EX"];
const statusCounts = statusOrder.reduce(
  (acc, s) => {
    acc[s] = species.filter((sp) => sp.conservationStatus === s).length;
    return acc;
  },
  {} as Record<ConservationStatus, number>
);

const endangeredCount = species.filter((s) =>
  (["EN", "CR", "VU"] as ConservationStatus[]).includes(s.conservationStatus)
).length;
const criticalCount = species.filter((s) => s.conservationStatus === "CR").length;
const latestYear = yearlyStats[yearlyStats.length - 1];

const quickLinks = [
  { href: "/biodiversity", label: "Species Catalog", icon: Fish, desc: `${species.length} marine species tracked`, color: "#1565a0" },
  { href: "/dashboard", label: "Ocean Dashboard", icon: BarChart3, desc: "NOAA & IUCN real-time data", color: "#2e7d32" },
  { href: "/explore", label: "Interactive Map", icon: Map, desc: "Esri ocean basemap + OBIS", color: "#6a1b9a" },
];

export default function HomePage() {
  return (
    <div
      className="h-full overflow-hidden bg-[#f4f5f7] p-1"
      style={{
        display: "grid",
        gap: "4px",
        gridTemplateRows: "auto 1fr auto",
        gridTemplateColumns: "1fr",
      }}
    >
      {/* ROW 1: KPI Strip */}
      <div className="flex gap-1">
        {[
          { label: "Species Tracked", value: summaryStats.totalSpecies.toLocaleString(), icon: Fish, color: "#1565a0", spark: yearlyStats.map(y => y.totalSpeciesTracked) },
          { label: "Endangered", value: summaryStats.totalEndangered.toLocaleString(), icon: AlertTriangle, color: "#c62828", spark: yearlyStats.map(y => y.endangeredCount) },
          { label: "MPA Coverage", value: `${summaryStats.marineProtectedAreaPct}%`, icon: Shield, color: "#2e7d32", spark: yearlyStats.map(y => y.marinProtectedArea) },
          { label: "Coral Coverage", value: `${latestYear.coralCoverage}%`, icon: Globe, color: "#ef6c00", spark: yearlyStats.map(y => y.coralCoverage) },
          { label: "Temp Anomaly", value: `+${latestYear.oceanTempAnomaly}°C`, icon: TrendingUp, color: "#d32f2f", spark: yearlyStats.map(y => y.oceanTempAnomaly) },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex-1 bg-white border border-[#e0e0e0] rounded px-2.5 py-1.5 flex items-center gap-2"
              style={{ borderLeft: `3px solid ${stat.color}` }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[8px] font-bold uppercase tracking-wider text-[#999]">{stat.label}</div>
                <div className="text-[15px] font-extrabold text-[#1a1a1a] leading-tight flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: stat.color }} />
                  {stat.value}
                </div>
              </div>
              <Sparkline data={stat.spark} width={55} height={18} strokeColor={stat.color} fillColor={stat.color} />
            </div>
          );
        })}
      </div>

      {/* ROW 2: Main Content */}
      <div className="grid grid-cols-[1fr_1fr_180px] gap-1 min-h-0">

        {/* Column 1: Featured Species */}
        <div className="panel min-h-0 flex flex-col">
          <div className="panel-header" style={{ borderLeft: "3px solid #1565a0" }}>
            <Fish className="panel-icon" size={12} />
            Featured Species
            <span className="ml-auto text-[8px] text-[#aaa] normal-case font-normal tracking-normal">Click row</span>
          </div>
          <div className="panel-body p-0 overflow-y-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-9" />
                  <th>Species</th>
                  <th>Status</th>
                  <th>Population</th>
                  <th>25yr Trend</th>
                </tr>
              </thead>
              <tbody>
                {featuredSpecies.map((s) => (
                  <tr key={s.slug} className="cursor-pointer" onClick={() => window.location.href = `/biodiversity/${s.slug}`}>
                    <td className="p-0.5">
                      {s.images[0] && (
                        <div className="w-7 h-7 rounded overflow-hidden bg-[#eee]">
                          <img src={s.images[0].url} alt={s.commonName} className="w-7 h-7 object-cover" loading="lazy" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="text-[10px] font-bold text-[#1a1a1a] truncate max-w-[160px]">{s.commonName}</div>
                      <div className="text-[7px] italic text-[#999] truncate max-w-[160px]">{s.scientificName}</div>
                    </td>
                    <td><ConservationBadge status={s.conservationStatus} size="sm" showLabel={false} /></td>
                    <td className="text-[9px] text-[#555]">{s.estimatedPopulation}</td>
                    <td>
                      <Sparkline
                        data={s.populationData.map((d: { estimate: number }) => d.estimate)}
                        width={55}
                        height={14}
                        strokeColor={s.populationTrend === "decreasing" ? "#c62828" : s.populationTrend === "increasing" ? "#1565a0" : "#888"}
                        fillColor={s.populationTrend === "decreasing" ? "#c62828" : s.populationTrend === "increasing" ? "#1565a0" : "#888"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 2: BIG Map — center stage */}
        <div className="panel min-h-0 flex flex-col">
          <div className="panel-header" style={{ borderLeft: "3px solid #1565a0" }}>
            <Globe className="panel-icon" size={12} />
            Global Ocean Biodiversity
            <span className="ml-auto text-[8px] text-[#aaa] normal-case font-normal tracking-normal">{species.length} species · {oceanRegions.length} regions</span>
          </div>
          <div className="panel-body-flush flex-1 min-h-0">
            <HomeMap className="w-full h-full" />
          </div>
        </div>

        {/* Column 3: Conservation + Quick Links */}
        <div className="flex flex-col gap-1 min-h-0">

          {/* Conservation Gauge */}
          <div className="panel flex-shrink-0">
            <div className="panel-header">
              <AlertTriangle className="panel-icon" size={12} />
              Risk
            </div>
            <div className="panel-body flex flex-col items-center gap-1.5 py-2">
              <StatusGauge
                value={Math.round((endangeredCount / species.length) * 100)}
                label="At Risk"
                color="#c62828"
                size={80}
              />
              <div className="w-full space-y-0.5">
                {statusOrder.map((code) => {
                  const count = statusCounts[code];
                  if (count === 0) return null;
                  const info = conservationStatusInfo[code];
                  const pct = Math.round((count / species.length) * 100);
                  return (
                    <div key={code} className="flex items-center gap-1">
                      <span className="text-[7px] font-bold w-4" style={{ color: info.color }}>{code}</span>
                      <div className="flex-1 h-1.5 bg-[#eee] rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${pct}%`, backgroundColor: info.color }} />
                      </div>
                      <span className="text-[7px] font-medium text-[#888] w-3 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[6px] text-[#bbb] self-start">IUCN Red List 2024</p>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="panel flex-1 min-h-0">
            <div className="panel-header">Navigate</div>
            <div className="panel-body flex flex-col gap-1">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-2 py-1.5 rounded border border-[#e8e8e8] hover:border-[#1565a0] hover:bg-[#f0f7ff] transition-all group"
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${link.color}15` }}>
                      <Icon className="w-3 h-3" style={{ color: link.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-bold text-[#333]">{link.label}</div>
                      <div className="text-[7px] text-[#999]">{link.desc}</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#ccc] group-hover:text-[#1565a0] transition-colors flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ROW 3: Status bar */}
      <div className="flex items-center justify-between px-2 py-0.5 bg-white border border-[#e0e0e0] rounded text-[8px] text-[#aaa]">
        <span>Data: NOAA, IUCN Red List, GBIF, OBIS</span>
        <span>32 species • 10 regions • 5 oceans</span>
        <span>Last updated: Feb 2026</span>
      </div>
    </div>
  );
}
