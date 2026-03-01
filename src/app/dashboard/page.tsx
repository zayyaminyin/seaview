"use client";

import { useMemo } from "react";
import { Fish, AlertTriangle, Globe, Shield } from "lucide-react";
import { species, conservationStatusInfo } from "@/data/species";
import { yearlyStats, summaryStats } from "@/data/statistics";
import { oceanRegions } from "@/data/oceanRegions";
import { Sparkline } from "@/components/ui/Sparkline";
import { StatusGauge } from "@/components/ui/StatusGauge";
import { StatusDonutChart } from "@/components/dashboard/StatusDonutChart";
import { TrendLineChart } from "@/components/dashboard/TrendLineChart";
import { SpeciesBarChart } from "@/components/dashboard/SpeciesBarChart";
import { OceanRegionsMap } from "@/components/dashboard/OceanRegionsMap";

const typeColors: Record<string, string> = {
  mammal: "#0ea5e9",
  fish: "#14b8a6",
  invertebrate: "#a78bfa",
  plant: "#22c55e",
  coral: "#f97316",
  reptile: "#eab308",
};

export default function DashboardPage() {
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    species.forEach((s) => {
      const info = conservationStatusInfo[s.conservationStatus];
      const label = info.label;
      counts[label] = (counts[label] ?? 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      color:
        Object.values(conservationStatusInfo).find((i) => i.label === status)
          ?.color ?? "#94a3b8",
    }));
  }, []);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    species.forEach((s) => {
      const typeLabel = s.type.charAt(0).toUpperCase() + s.type.slice(1);
      counts[typeLabel] = (counts[typeLabel] ?? 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      color: typeColors[type.toLowerCase()] ?? "#14b8a6",
    }));
  }, []);

  const tempData = useMemo(
    () =>
      yearlyStats.map((y) => ({
        year: y.year,
        anomaly: y.oceanTempAnomaly,
      })),
    []
  );

  const coralData = useMemo(
    () =>
      yearlyStats.map((y) => ({
        year: y.year,
        coverage: y.coralCoverage,
      })),
    []
  );

  const endangeredTrendData = useMemo(
    () =>
      yearlyStats.map((y) => ({
        year: y.year,
        count: y.endangeredCount,
      })),
    []
  );

  const latestYear = yearlyStats[yearlyStats.length - 1];
  const prevYear = yearlyStats[yearlyStats.length - 2];
  const speciesDelta = latestYear.totalSpeciesTracked - prevYear.totalSpeciesTracked;
  const endangeredDelta = latestYear.endangeredCount - prevYear.endangeredCount;
  const coralDelta = +(latestYear.coralCoverage - prevYear.coralCoverage).toFixed(1);
  const mpaDelta = +(latestYear.marinProtectedArea - prevYear.marinProtectedArea).toFixed(1);

  return (
    <div
      className="viewport-page bg-[#f4f5f7]"
      style={{
        height: "calc(100vh - 40px)",
        gridTemplateRows: "auto auto 1fr 1fr 1fr",
      }}
    >
      {/* Top: 4 mini-stats with sparklines */}
      <div className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <div className="mini-stat flex-1 bg-white border border-[#e0e0e0] rounded">
            <div className="flex items-center justify-between">
              <span className="mini-stat-label">Total Species</span>
              <Sparkline
                data={yearlyStats.map((y) => y.totalSpeciesTracked)}
                width={60}
                height={18}
                strokeColor="#1565a0"
                fillColor="#1565a0"
              />
            </div>
            <span className="mini-stat-value flex items-center gap-1.5">
              <Fish className="w-3.5 h-3.5 text-[#1565a0]" />
              {summaryStats.totalSpecies.toLocaleString()}
            </span>
            <span className="text-[8px] font-bold" style={{ color: speciesDelta >= 0 ? "#2e7d32" : "#c62828" }}>
              {speciesDelta >= 0 ? "+" : ""}{speciesDelta.toLocaleString()} YoY
            </span>
          </div>
          <div className="mini-stat flex-1 bg-white border border-[#e0e0e0] rounded">
            <div className="flex items-center justify-between">
              <span className="mini-stat-label">Endangered</span>
              <Sparkline
                data={yearlyStats.map((y) => y.endangeredCount)}
                width={60}
                height={18}
                strokeColor="#c62828"
                fillColor="#c62828"
              />
            </div>
            <span className="mini-stat-value flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#c62828]" />
              {summaryStats.totalEndangered.toLocaleString()}
            </span>
            <span className="text-[8px] font-bold" style={{ color: endangeredDelta > 0 ? "#c62828" : "#2e7d32" }}>
              {endangeredDelta >= 0 ? "+" : ""}{endangeredDelta.toLocaleString()} YoY
            </span>
          </div>
          <div className="mini-stat flex-1 bg-white border border-[#e0e0e0] rounded">
            <div className="flex items-center justify-between">
              <span className="mini-stat-label">Coral Coverage</span>
              <Sparkline
                data={yearlyStats.map((y) => y.coralCoverage)}
                width={60}
                height={18}
                strokeColor="#f97316"
                fillColor="#f97316"
              />
            </div>
            <span className="mini-stat-value flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#f97316]" />
              {yearlyStats[yearlyStats.length - 1].coralCoverage}%
            </span>
            <span className="text-[8px] font-bold" style={{ color: coralDelta >= 0 ? "#2e7d32" : "#c62828" }}>
              {coralDelta >= 0 ? "+" : ""}{coralDelta}% YoY
            </span>
          </div>
          <div className="mini-stat flex-1 bg-white border border-[#e0e0e0] rounded">
            <div className="flex items-center justify-between">
              <span className="mini-stat-label">MPA Coverage</span>
              <Sparkline
                data={yearlyStats.map((y) => y.marinProtectedArea)}
                width={60}
                height={18}
                strokeColor="#2e7d32"
                fillColor="#2e7d32"
              />
            </div>
            <span className="mini-stat-value flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#2e7d32]" />
              {summaryStats.marineProtectedAreaPct}%
            </span>
            <span className="text-[8px] font-bold" style={{ color: mpaDelta >= 0 ? "#2e7d32" : "#c62828" }}>
              {mpaDelta >= 0 ? "+" : ""}{mpaDelta}% YoY
            </span>
          </div>
        </div>
      </div>

      {/* StatusGauge row */}
      <div className="flex gap-2 justify-center items-center bg-white border border-[#e0e0e0] rounded px-4 py-2">
        <StatusGauge
          value={summaryStats.marineProtectedAreaPct}
          label="MPA Coverage"
          color="#2e7d32"
          size={80}
        />
        <StatusGauge
          value={yearlyStats[yearlyStats.length - 1].coralCoverage}
          label="Coral Coverage"
          color="#f97316"
          size={80}
        />
        <StatusGauge
          value={(summaryStats.totalEndangered / summaryStats.totalSpecies) * 100}
          label="Endangered %"
          color="#c62828"
          size={80}
        />
        <span className="text-[8px] text-[#aaa] self-center ml-auto">Data: NOAA, IUCN Red List, GBIF • Feb 2026</span>
      </div>

      {/* Row 1: Donut | Bar | Temp Anomaly */}
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 min-h-0">
        <div className="panel min-h-0" style={{ borderLeft: "3px solid #1565a0" }}>
          <div className="panel-header">Species by Status</div>
          <div className="panel-body-flush">
            <StatusDonutChart data={statusData} className="h-full w-full" />
          </div>
        </div>
        <div className="panel min-h-0" style={{ borderLeft: "3px solid #14b8a6" }}>
          <div className="panel-header">Species by Type</div>
          <div className="panel-body-flush">
            <SpeciesBarChart data={typeData} className="h-full w-full" />
          </div>
        </div>
        <div className="panel min-h-0" style={{ borderLeft: "3px solid #c62828" }}>
          <div className="panel-header">Ocean Temp Anomaly</div>
          <div className="panel-body-flush">
            <TrendLineChart
              data={tempData}
              dataKeys={[
                { key: "anomaly", color: "#1565a0", label: "°C Anomaly" },
              ]}
              title=""
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Coral | Endangered Trend */}
      <div className="grid grid-cols-[1fr_1fr] gap-2 min-h-0">
        <div className="panel min-h-0" style={{ borderLeft: "3px solid #f97316" }}>
          <div className="panel-header">Coral Coverage</div>
          <div className="panel-body-flush">
            <TrendLineChart
              data={coralData}
              dataKeys={[
                { key: "coverage", color: "#f97316", label: "% Coverage" },
              ]}
              title=""
              className="h-full w-full"
            />
          </div>
        </div>
        <div className="panel min-h-0" style={{ borderLeft: "3px solid #c62828" }}>
          <div className="panel-header">Endangered Trend</div>
          <div className="panel-body-flush">
            <TrendLineChart
              data={endangeredTrendData}
              dataKeys={[
                {
                  key: "count",
                  color: "#c62828",
                  label: "Endangered Count",
                },
              ]}
              title=""
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Map (2 cols) | Ocean Regions table */}
      <div className="grid grid-cols-[2fr_1fr] gap-2 min-h-0">
        <div className="panel min-h-0 flex flex-col" style={{ borderLeft: "3px solid #1565a0" }}>
          <div className="panel-header">Ocean Regions Map</div>
          <div className="panel-body-flush flex-1 min-h-0">
            <OceanRegionsMap className="w-full h-full min-h-[200px]" />
          </div>
        </div>
        <div className="panel min-h-0 flex flex-col" style={{ borderLeft: "3px solid #1565a0" }}>
          <div className="panel-header">Ocean Regions</div>
          <div className="panel-body overflow-y-auto flex-1 min-h-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Species</th>
                  <th>Endangered</th>
                </tr>
              </thead>
              <tbody>
                {oceanRegions.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
                        style={{ backgroundColor: r.color }}
                      />
                      {r.name}
                    </td>
                    <td>{r.speciesCount.toLocaleString()}</td>
                    <td className="text-[#c62828] font-medium">
                      {r.endangeredCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
