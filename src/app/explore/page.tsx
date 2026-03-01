"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, Satellite, Mountain, Shield } from "lucide-react";
import { species, conservationStatusInfo } from "@/data/species";
import { SearchBar } from "@/components/ui/SearchBar";
import { Sparkline } from "@/components/ui/Sparkline";
import { MapLayerControls } from "@/components/maps/MapLayerControls";
import { LeafletMap } from "@/components/maps/LeafletMap";
import { cn } from "@/lib/utils";
import type { Species, ConservationStatus } from "@/data/species";
import type { MapLayer } from "@/components/maps/MapLayerControls";

const layerOptions: Omit<MapLayer, "active">[] = [
  { id: "satellite", label: "Satellite", icon: Satellite },
  { id: "bathymetry", label: "Bathymetry", icon: Mountain },
  { id: "species", label: "Species", icon: Fish },
  { id: "protected", label: "Protected", icon: Shield },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [layers, setLayers] = useState<MapLayer[]>(
    layerOptions.map((l) => ({ ...l, active: false }))
  );

  const filteredSpecies = useMemo(() => {
    if (!searchQuery.trim()) return species;
    const q = searchQuery.toLowerCase();
    return species.filter(
      (s) =>
        s.commonName.toLowerCase().includes(q) ||
        s.scientificName.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const speciesMarkers = useMemo(
    () =>
      species.map((s) => ({
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
        label: `${s.commonName} — ${conservationStatusInfo[s.conservationStatus].label} — ${s.estimatedPopulation}`,
        color: conservationStatusInfo[s.conservationStatus].color,
      })),
    []
  );

  const toggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eee]">
      {/* Map Container - Real Leaflet map with Esri Ocean tiles */}
      <div className="absolute inset-0">
        <LeafletMap
          center={[20, 0]}
          zoom={2}
          className="w-full h-full"
          markers={speciesMarkers}
          tileLayer="esri-ocean"
        />
      </div>

      {/* Overlay Controls - pointer-events-none so map is clickable; panels use pointer-events-auto */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0">
          {/* Top-left: Search - 200px wide, glass-like */}
          <div className="absolute top-2 left-2 w-[200px]">
            {selectedSpecies && (
              <div className="absolute top-12 left-2 w-[240px] pointer-events-auto bg-white/95 backdrop-blur-sm border border-[#ddd] rounded shadow-md p-3 z-10">
                <div className="flex items-start gap-2 mb-2">
                  {selectedSpecies.images[0] && (
                    <img
                      src={selectedSpecies.images[0].url}
                      alt={selectedSpecies.commonName}
                      className="w-16 h-16 rounded object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[12px] font-bold text-black truncate">{selectedSpecies.commonName}</h4>
                    <p className="text-[9px] italic text-[#666] truncate">{selectedSpecies.scientificName}</p>
                    <span
                      className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold"
                      style={{
                        backgroundColor: conservationStatusInfo[selectedSpecies.conservationStatus].bgColor,
                        color: conservationStatusInfo[selectedSpecies.conservationStatus].color,
                      }}
                    >
                      {conservationStatusInfo[selectedSpecies.conservationStatus].label}
                    </span>
                  </div>
                </div>
                <p className="text-[9px] text-[#555] line-clamp-3 mb-2">{selectedSpecies.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[8px] font-bold uppercase text-[#888]">Population</span>
                  <Sparkline
                    data={selectedSpecies.populationData.map((d: { estimate: number }) => d.estimate)}
                    width={80}
                    height={16}
                    strokeColor={selectedSpecies.populationTrend === "decreasing" ? "#c62828" : "#1565a0"}
                  />
                </div>
                <div className="flex gap-1 text-[8px]">
                  <span className="text-[#888]">Est:</span>
                  <span className="font-bold text-[#333]">{selectedSpecies.estimatedPopulation}</span>
                </div>
                <a
                  href={`/biodiversity/${selectedSpecies.slug}`}
                  className="block mt-2 text-center text-[9px] font-bold text-ocean-700 hover:underline"
                >
                  View Full Profile →
                </a>
              </div>
            )}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search species..."
              className="pointer-events-auto bg-white/90 backdrop-blur-sm border border-[#ddd]"
            />
          </div>

          {/* Right side: Species list panel - 220px, narrow, scrollable */}
          <aside className="absolute top-2 right-2 bottom-2 w-[220px] pointer-events-auto flex flex-col gap-1">
            <MapLayerControls
              layers={layers}
              onToggle={toggleLayer}
              className="pointer-events-auto flex-shrink-0"
            />
            <div className="flex-1 min-h-0 bg-white/95 backdrop-blur-sm border border-[#ddd] rounded shadow-sm overflow-hidden flex flex-col">
              <div className="px-2 py-1.5 border-b border-[#e8e8e8] flex-shrink-0">
                <h3 className="font-semibold text-[#1a1a1a] text-[10px] flex items-center gap-1.5 uppercase tracking-wider">
                  <Fish className="w-3 h-3 text-[#1565a0]" />
                  Species
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-1.5 scrollbar-hide">
                {filteredSpecies.length === 0 ? (
                  <p className="text-[#999] text-[10px] py-4 text-center">
                    No species found
                  </p>
                ) : (
                  <div className="space-y-0.5">
                    <AnimatePresence mode="popLayout">
                      {filteredSpecies.map((s) => (
                        <motion.div
                          key={s.slug}
                          layout
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          onClick={() =>
                            setSelectedSpecies(
                              selectedSpecies?.slug === s.slug ? null : s
                            )
                          }
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all text-left",
                            selectedSpecies?.slug === s.slug
                              ? "bg-ocean-700/15 border border-ocean-700/30"
                              : "hover:bg-[#f5f5f5] border border-transparent"
                          )}
                        >
                          <div className="w-7 h-7 rounded overflow-hidden bg-[#eee] flex-shrink-0">
                            {s.images[0] && (
                              <img
                                src={s.images[0].url}
                                alt={s.commonName}
                                className="w-7 h-7 object-cover"
                                loading="lazy"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold truncate block">{s.commonName}</span>
                            <span className="text-[8px] text-[#888] italic truncate block">{s.scientificName}</span>
                          </div>
                          <span
                            className="flex-shrink-0 px-1 py-0.5 rounded text-[8px] font-bold"
                            style={{
                              backgroundColor: conservationStatusInfo[s.conservationStatus].bgColor,
                              color: conservationStatusInfo[s.conservationStatus].color,
                            }}
                          >
                            {s.conservationStatus}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Bottom center: Stats summary */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-auto bg-white/95 backdrop-blur-sm rounded border border-[#ddd] px-3 py-1.5 flex gap-4">
            <div className="text-center">
              <div className="text-[12px] font-bold text-[#1565a0]">{species.length}</div>
              <div className="text-[7px] uppercase font-bold text-[#888]">Species</div>
            </div>
            <div className="text-center">
              <div className="text-[12px] font-bold text-[#c62828]">
                {species.filter((s) => ["EN", "CR", "VU"].includes(s.conservationStatus)).length}
              </div>
              <div className="text-[7px] uppercase font-bold text-[#888]">At Risk</div>
            </div>
            <div className="text-center">
              <div className="text-[12px] font-bold text-[#333]">
                {new Set(species.flatMap((s) => s.oceanRegions)).size}
              </div>
              <div className="text-[7px] uppercase font-bold text-[#888]">Regions</div>
            </div>
          </div>

          {/* Bottom-left: Legend panel - tiny */}
          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded border border-[#ddd] p-2 pointer-events-auto">
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#888] mb-1.5">
              Conservation Status
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {Object.entries(conservationStatusInfo).map(([code, info]) => (
                <div key={code} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: info.color }}
                  />
                  <span className="text-[9px] text-[#666]">
                    {info.label} ({species.filter((s) => s.conservationStatus === (code as ConservationStatus)).length})
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
