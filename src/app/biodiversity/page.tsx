"use client";

import { useMemo, useState } from "react";
import {
  species,
  conservationStatusInfo,
  type ConservationStatus,
  type SpeciesType,
} from "@/data/species";
import { ConservationBadge } from "@/components/species/ConservationBadge";
import { Sparkline } from "@/components/ui/Sparkline";
import { Search, Fish, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

const CONSERVATION_SEVERITY: Record<ConservationStatus, number> = {
  EX: 0,
  EW: 1,
  CR: 2,
  EN: 3,
  VU: 4,
  NT: 5,
  LC: 6,
};

const STATUS_CODES: ConservationStatus[] = [
  "LC",
  "NT",
  "VU",
  "EN",
  "CR",
  "EW",
  "EX",
];

const SPECIES_TYPE_LABELS: Record<SpeciesType, string> = {
  mammal: "Mammal",
  fish: "Fish",
  invertebrate: "Invertebrate",
  plant: "Plant",
  coral: "Coral",
  reptile: "Reptile",
  bird: "Bird",
};

const TYPES: SpeciesType[] = [
  "mammal",
  "fish",
  "invertebrate",
  "plant",
  "coral",
  "reptile",
  "bird",
];

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "increasing") return <span className="text-[#4fb3d9]">↑</span>;
  if (trend === "decreasing") return <span className="text-[#ff6b6b]">↓</span>;
  return <span className="text-[#556677]">→</span>;
}

export default function BiodiversityPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConservationStatus | null>(
    null
  );
  const [typeFilter, setTypeFilter] = useState<SpeciesType | null>(null);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<"a-z" | "endangered">("a-z");

  const regions = useMemo(() => {
    const set = new Set<string>();
    species.forEach((s) => s.oceanRegions.forEach((r) => set.add(r)));
    return Array.from(set).sort();
  }, []);

  const filteredSpecies = useMemo(() => {
    let result = [...species];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.commonName.toLowerCase().includes(q) ||
          s.scientificName.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      result = result.filter((s) => s.conservationStatus === statusFilter);
    }

    if (typeFilter) {
      result = result.filter((s) => s.type === typeFilter);
    }

    if (regionFilter) {
      result = result.filter((s) => s.oceanRegions.includes(regionFilter));
    }

    if (sortMode === "a-z") {
      result.sort((a, b) =>
        a.commonName.localeCompare(b.commonName, undefined, {
          sensitivity: "base",
        })
      );
    } else {
      result.sort(
        (a, b) =>
          CONSERVATION_SEVERITY[a.conservationStatus] -
          CONSERVATION_SEVERITY[b.conservationStatus]
      );
    }

    return result;
  }, [
    searchQuery,
    statusFilter,
    typeFilter,
    regionFilter,
    sortMode,
  ]);

  const toggleStatus = (code: ConservationStatus) => {
    setStatusFilter((prev) => (prev === code ? null : code));
  };

  const toggleType = (t: SpeciesType) => {
    setTypeFilter((prev) => (prev === t ? null : t));
  };

  const toggleRegion = (r: string) => {
    setRegionFilter((prev) => (prev === r ? null : r));
  };

  return (
    <div
      style={{ height: "calc(100vh - 40px)" }}
      className="flex gap-1 p-1 overflow-hidden"
    >
      {/* LEFT SIDEBAR */}
      <div className="panel w-[280px] shrink-0 flex flex-col">
        <div className="panel-header" style={{ borderLeft: "3px solid #4fb3d9" }}>
          <Filter className="panel-icon shrink-0" size={12} />
          <span>Filters</span>
          <span className="ml-auto text-[8px] font-normal normal-case text-[#445566] tracking-normal">{species.length} total</span>
        </div>
        <div className="panel-body flex flex-col gap-2 overflow-y-auto">
          {/* Search */}
          <div className="relative shrink-0">
            <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 text-[#445566]"
              size={12}
            />
            <input
              type="text"
              placeholder="Search species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-6 pl-7 pr-2 text-[10px] border border-[#2a3a4a] rounded bg-[#0f1520] text-[#c0c8d0] placeholder-[#445566] focus:outline-none focus:ring-1 focus:ring-[#4fb3d9] focus:border-[#4fb3d9]"
            />
          </div>

          {/* STATUS */}
          <div>
            <div className="text-[9px] font-bold uppercase text-[#556677] mb-1">
              Status
            </div>
            <div className="flex flex-wrap gap-1">
              {STATUS_CODES.map((code) => {
                const info = conservationStatusInfo[code];
                const active = statusFilter === code;
                return (
                  <button
                    key={code}
                    onClick={() => toggleStatus(code)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border transition-colors ${
                      active
                        ? "text-white border-transparent"
                        : "bg-[#0f1520] border-[#2a3a4a] text-[#8899aa] hover:border-[#4a5a6a]"
                    }`}
                    style={
                      active
                        ? { backgroundColor: info.color }
                        : undefined
                    }
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TYPE */}
          <div>
            <div className="text-[9px] font-bold uppercase text-[#556677] mb-1">
              Type
            </div>
            <div className="flex flex-wrap gap-1">
              {TYPES.map((t) => {
                const active = typeFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border transition-colors ${
                      active
                        ? "bg-[#1565a0] text-white border-transparent"
                        : "bg-[#0f1520] border-[#2a3a4a] text-[#8899aa] hover:border-[#4a5a6a]"
                    }`}
                  >
                    {SPECIES_TYPE_LABELS[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* REGION */}
          <div>
            <div className="text-[9px] font-bold uppercase text-[#556677] mb-1">
              Region
            </div>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {regions.map((r) => {
                const active = regionFilter === r;
                return (
                  <button
                    key={r}
                    onClick={() => toggleRegion(r)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border transition-colors truncate max-w-full ${
                      active
                        ? "bg-[#1565a0] text-white border-transparent"
                        : "bg-[#0f1520] border-[#2a3a4a] text-[#8899aa] hover:border-[#4a5a6a]"
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SORT */}
          <div>
            <div className="text-[9px] font-bold uppercase text-[#556677] mb-1">
              Sort
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setSortMode("a-z")}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border transition-colors ${
                  sortMode === "a-z"
                    ? "bg-[#1565a0] text-white border-transparent"
                    : "bg-[#0f1520] border-[#2a3a4a] text-[#8899aa] hover:border-[#4a5a6a]"
                }`}
              >
                A-Z
              </button>
              <button
                onClick={() => setSortMode("endangered")}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border transition-colors ${
                  sortMode === "endangered"
                    ? "bg-[#1565a0] text-white border-transparent"
                    : "bg-[#0f1520] border-[#2a3a4a] text-[#8899aa] hover:border-[#4a5a6a]"
                }`}
              >
                Endangered
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-auto pt-2 border-t border-[#1e2d3d] text-[10px] text-[#8899aa]">
            {filteredSpecies.length} of {species.length} species
            <div className="text-[9px] text-[#667788] space-y-0.5 mt-1">
              {STATUS_CODES.map(code => {
                const count = filteredSpecies.filter(s => s.conservationStatus === code).length;
                if (count === 0) return null;
                const info = conservationStatusInfo[code];
                return (
                  <div key={code} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                    <span>{info.label}: {count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="panel flex-1 flex flex-col min-w-0">
        <div className="panel-header" style={{ borderLeft: "3px solid #4fb3d9" }}>
          <Fish className="panel-icon shrink-0" size={12} />
          <span>Marine Species</span>
          <span className="ml-auto text-[8px] font-normal normal-case text-[#445566] tracking-normal">{filteredSpecies.length} shown</span>
        </div>
        <div className="panel-body overflow-y-auto p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10"></th>
                <th>Common Name</th>
                <th>Scientific Name</th>
                <th>Status</th>
                <th>Type</th>
                <th>Regions</th>
                <th>Population</th>
                <th>Pop. Est.</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecies.map((s) => (
                <tr
                  key={s.slug}
                  className="h-7 cursor-pointer"
                  onClick={() => router.push(`/biodiversity/${s.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/biodiversity/${s.slug}`);
                    }
                  }}
                >
                  <td className="w-10 p-0.5">
                    <div className="w-9 h-9 rounded overflow-hidden bg-[#1a2332] flex-shrink-0 border border-[#2a3a4a]">
                      {s.images[0] ? (
                        <img
                          src={s.images[0].url}
                          alt={s.commonName}
                          className="w-9 h-9 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-9 h-9 flex items-center justify-center text-[#334455] text-xs">?</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="font-bold text-[11px] text-[#e0e8f0] block truncate">
                      {s.commonName}
                    </span>
                  </td>
                  <td className="text-[10px] text-[#667788] italic truncate max-w-[140px]">
                    {s.scientificName}
                  </td>
                  <td>
                    <ConservationBadge
                      status={s.conservationStatus}
                      size="sm"
                      showLabel={false}
                      className="text-[9px] px-1 py-0"
                    />
                  </td>
                  <td>
                    <span className="pill tag">{SPECIES_TYPE_LABELS[s.type]}</span>
                  </td>
                  <td className="text-[10px] text-[#667788] truncate max-w-[120px]">
                    {s.oceanRegions.join(", ")}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Sparkline
                        data={s.populationData.map(d => d.estimate)}
                        width={50}
                        height={14}
                        strokeColor={s.populationTrend === "decreasing" ? "#ff6b6b" : s.populationTrend === "increasing" ? "#4fb3d9" : "#667788"}
                      />
                      <TrendIcon trend={s.populationTrend} />
                    </div>
                  </td>
                  <td className="text-[9px] text-[#8899aa]">{s.estimatedPopulation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
