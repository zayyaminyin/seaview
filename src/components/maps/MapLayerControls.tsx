"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type MapLayer = {
  id: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
};

type MapLayerControlsProps = {
  layers: MapLayer[];
  onToggle: (id: string) => void;
  className?: string;
};

export function MapLayerControls({
  layers,
  onToggle,
  className,
}: MapLayerControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 p-1.5 bg-[#111827]/95 backdrop-blur-sm rounded border border-[#2a3a4a] shadow-lg",
        className
      )}
    >
      {layers.map((layer) => {
        const Icon = layer.icon;
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => onToggle(layer.id)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded transition-all duration-200",
              "text-left font-medium text-[10px]",
              layer.active
                ? "bg-[#4fb3d9]/15 text-[#4fb3d9] border border-[#4fb3d9]/30"
                : "text-[#667788] hover:text-[#e0e8f0] hover:bg-[#1a2332] border border-transparent"
            )}
          >
            <Icon className="w-3 h-3 flex-shrink-0" />
            <span>{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
}
