"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MAPBOX_TOKEN } from "@/lib/mapbox";

type OceanMapProps = {
  className?: string;
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
};

export function OceanMap({
  className,
  center = [0, 20],
  zoom = 2,
  children,
}: OceanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [hasToken, setHasToken] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setHasToken(false);
      setLoaded(true);
      return;
    }

    let mounted = true;

    const initMap = async () => {
      try {
        // @ts-expect-error dynamic CSS import
        await import("mapbox-gl/dist/mapbox-gl.css");
        const mapboxgl = (await import("mapbox-gl")).default;

        if (!containerRef.current || !mounted) return;

        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [center[0], center[1]],
          zoom,
        });

        mapRef.current = map;
        setHasToken(true);
      } catch {
        setHasToken(false);
      } finally {
        if (mounted) setLoaded(true);
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (mapRef.current && typeof (mapRef.current as { remove?: () => void }).remove === "function") {
        (mapRef.current as { remove: () => void }).remove();
      }
    };
  }, [center[0], center[1], zoom]);

  if (!loaded) {
    return (
      <div
        className={cn(
          "relative w-full h-full bg-[#eee] animate-pulse",
          className
        )}
      />
    );
  }

  if (!hasToken) {
    return (
      <div
        className={cn(
          "relative w-full h-full overflow-hidden bg-[#eee]",
          className
        )}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("w-full h-full", className)} />
  );
}
