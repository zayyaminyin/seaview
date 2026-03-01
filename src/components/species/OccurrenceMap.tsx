"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { LeafletMap } from "@/components/maps/LeafletMap";

type OccurrenceMapProps = {
  slug: string;
  center: { lat: number; lng: number };
  commonName: string;
  className?: string;
};

export function OccurrenceMap({ slug, center, commonName, className }: OccurrenceMapProps) {
  const [markers, setMarkers] = useState([
    { lat: center.lat, lng: center.lng, label: commonName, color: "#e53935" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/species/${slug}/occurrences`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load occurrences");
        return r.json();
      })
      .then((data) => {
        if (data.points?.length > 0) {
          const occMarkers = data.points.slice(0, 100).map((p: { lat: number; lng: number; date?: string }) => ({
            lat: p.lat,
            lng: p.lng,
            label: p.date || "OBIS Record",
            color: "#1565a0",
          }));
          setMarkers((prev) => [...prev, ...occMarkers]);
        }
      })
      .catch((err) => setError(err?.message ?? "Could not load occurrence data"))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className={className} style={{ position: "relative" }}>
      <LeafletMap
        center={[center.lat, center.lng]}
        zoom={3}
        className="w-full h-full"
        markers={markers}
        tileLayer="esri-ocean"
      />
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-[1000]"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex items-center gap-2 pill bg-white border border-[#ddd] shadow-sm px-3 py-2">
            <Loader2 className="w-3.5 h-3.5 text-[#1565a0] animate-spin shrink-0" />
            <span>Loading OBIS data...</span>
          </div>
        </div>
      )}
      {error && !loading && (
        <div
          className="absolute top-2 left-2 right-2 flex items-center gap-2 pill bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 z-[1000]"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[10px]">{error}</span>
        </div>
      )}
    </div>
  );
}
