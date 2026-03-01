"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(
  () => import("./LeafletMapInner").then((m) => m.LeafletMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#eee] animate-pulse min-h-[300px]" />
    ),
  }
);

export { LeafletMap };
export type { LeafletMapInnerProps, MapMarker, TileLayerType } from "./LeafletMapInner";
