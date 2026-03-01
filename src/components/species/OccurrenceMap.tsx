"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch(`/api/species/${slug}/occurrences`)
      .then((r) => r.json())
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
      .catch(() => {})
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
        <div style={{ position: "absolute", top: 4, right: 4, zIndex: 1000 }}>
          <span className="pill" style={{ background: "#fff", border: "1px solid #ddd" }}>
            Loading OBIS data...
          </span>
        </div>
      )}
    </div>
  );
}
