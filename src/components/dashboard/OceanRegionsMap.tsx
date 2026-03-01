"use client";

import { LeafletMap } from "@/components/maps/LeafletMap";
import { oceanRegions } from "@/data/oceanRegions";

export function OceanRegionsMap({ className }: { className?: string }) {
  const markers = oceanRegions.map((r) => ({
    lat: r.coordinates.lat,
    lng: r.coordinates.lng,
    label: `${r.name}: ${r.speciesCount.toLocaleString()} species`,
    color: r.color,
  }));

  return (
    <LeafletMap
      center={[20, 0]}
      zoom={2}
      className={className || "w-full h-full"}
      markers={markers}
      tileLayer="esri-ocean"
    />
  );
}
