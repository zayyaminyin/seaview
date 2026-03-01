"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";

// Fix default marker icons (Leaflet has a known issue in bundlers)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export type MapMarker = {
  lat: number;
  lng: number;
  label?: string;
  color?: string;
};

export type TileLayerType = "osm" | "esri-ocean";

export interface LeafletMapInnerProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  markers?: MapMarker[];
  tileLayer?: TileLayerType;
  children?: React.ReactNode;
}

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function LeafletMapInner({
  center = [0, 20],
  zoom = 2,
  className = "",
  markers = [],
  tileLayer = "osm",
  children,
}: LeafletMapInnerProps) {
  const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const esriOceanUrl =
    "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";

  const tileUrl = tileLayer === "esri-ocean" ? esriOceanUrl : osmUrl;

  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: 300 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", minHeight: 300 }}
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url={tileUrl} />
        {markers.map((m, i) => (
          <CircleMarker
            key={i}
            center={[m.lat, m.lng]}
            radius={6}
            pathOptions={{
              color: m.color ?? "#3388ff",
              fillColor: m.color ?? "#3388ff",
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            {m.label && <Popup>{m.label}</Popup>}
          </CircleMarker>
        ))}
        {children}
      </MapContainer>
    </div>
  );
}
