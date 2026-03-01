"use client";

import { LeafletMap } from "@/components/maps/LeafletMap";
import { species, conservationStatusInfo } from "@/data/species";
import { oceanRegions } from "@/data/oceanRegions";

export function HomeMap({ className }: { className?: string }) {
  const speciesMarkers = species.map((s) => ({
    lat: s.coordinates.lat,
    lng: s.coordinates.lng,
    label: `${s.commonName} — ${conservationStatusInfo[s.conservationStatus].label} — ${s.estimatedPopulation}`,
    color: conservationStatusInfo[s.conservationStatus].color,
  }));

  const regionMarkers = oceanRegions.map((r) => ({
    lat: r.coordinates.lat,
    lng: r.coordinates.lng,
    label: `📍 ${r.name}\n${r.speciesCount.toLocaleString()} species · ${r.endangeredCount} at risk`,
    color: r.color,
  }));

  return (
    <div className={`relative ${className || "w-full h-full"}`}>
      <LeafletMap
        center={[15, 0]}
        zoom={2}
        className="w-full h-full"
        markers={[...regionMarkers, ...speciesMarkers]}
        tileLayer="esri-ocean"
      />

      {/* Map legend overlay */}
      <div className="absolute bottom-2 left-2 z-[1000] bg-[#111827]/90 backdrop-blur-sm border border-[#2a3a4a] rounded px-2 py-1.5 pointer-events-auto">
        <div className="text-[7px] font-bold uppercase tracking-wider text-[#556677] mb-1">Conservation Status</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {(["CR", "EN", "VU", "NT", "LC"] as const).map((code) => {
            const info = conservationStatusInfo[code];
            const count = species.filter((s) => s.conservationStatus === code).length;
            return (
              <div key={code} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: info.color }} />
                <span className="text-[7px] text-[#8899aa]">{info.label}</span>
                <span className="text-[7px] text-[#556677]">({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Species count overlay */}
      <div className="absolute top-2 right-2 z-[1000] bg-[#111827]/90 backdrop-blur-sm border border-[#2a3a4a] rounded px-2.5 py-1.5 pointer-events-auto">
        <div className="text-[12px] font-extrabold text-[#4fb3d9]">{species.length}</div>
        <div className="text-[7px] font-bold uppercase text-[#556677]">Species Tracked</div>
        <div className="text-[12px] font-extrabold text-[#ff6b6b] mt-0.5">{species.filter((s) => ["EN", "CR", "VU"].includes(s.conservationStatus)).length}</div>
        <div className="text-[7px] font-bold uppercase text-[#556677]">At Risk</div>
      </div>
    </div>
  );
}
