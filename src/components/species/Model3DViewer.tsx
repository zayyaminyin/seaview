"use client";

import { memo, useState, useEffect } from "react";
import { Box, Eye, EyeOff, Loader2, Maximize2, RotateCcw, Info } from "lucide-react";

interface AnatomyItem {
  label: string;
  description: string;
}

interface Model3DViewerProps {
  sketchfabId?: string;
  fallbackImageUrl?: string;
  fallbackImageAlt?: string;
  fallbackImageCredit?: string;
  speciesName: string;
  anatomy?: AnatomyItem[];
}

export const Model3DViewer = memo(function Model3DViewer({
  sketchfabId,
  fallbackImageUrl,
  fallbackImageAlt,
  fallbackImageCredit,
  speciesName,
  anatomy,
}: Model3DViewerProps) {
  const [showAnatomy, setShowAnatomy] = useState(true);
  const [selectedPart, setSelectedPart] = useState<AnatomyItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const has3D = !!sketchfabId;

  useEffect(() => {
    if (!has3D) return;
    const t = setTimeout(() => setIframeLoaded(true), 4000);
    return () => clearTimeout(t);
  }, [has3D]);

  const embedUrl = sketchfabId
    ? `https://sketchfab.com/models/${sketchfabId}/embed?autostart=1&autospin=0.2&ui_infos=0&ui_controls=1&ui_stop=0&ui_watermark=0&ui_watermark_link=0&transparent=0&ui_hint=2&ui_theme=dark`
    : "";

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? "fixed inset-0 z-[9999] bg-white" : ""}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[#f8f9fa] border-b border-[#e0e0e0]">
        <div className="flex items-center gap-1 flex-1">
          {has3D && (
            <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-[#1565a0] bg-[#e3f2fd] px-1.5 py-0.5 rounded">
              <Box className="w-2.5 h-2.5" />
              3D Model
            </span>
          )}
          {!has3D && (
            <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-[#666] bg-[#f0f0f0] px-1.5 py-0.5 rounded">
              Specimen Photo
            </span>
          )}
          <span className="text-[8px] text-[#999] ml-1">{speciesName}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {anatomy && anatomy.length > 0 && (
            <button
              onClick={() => { setShowAnatomy(!showAnatomy); setSelectedPart(null); }}
              className={`p-1 rounded transition-colors ${showAnatomy ? "bg-[#1565a0] text-white" : "bg-[#eee] text-[#666] hover:bg-[#ddd]"}`}
              title={showAnatomy ? "Hide anatomy" : "Show anatomy"}
            >
              {showAnatomy ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          )}
          {has3D && (
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded bg-[#eee] text-[#666] hover:bg-[#ddd] transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Viewer area */}
      <div className="flex-1 min-h-0 relative bg-[#f0f2f5]">
        {has3D ? (
          <>
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f0f2f5] z-10">
                <Loader2 className="w-8 h-8 text-[#1565a0] animate-spin" />
              </div>
            )}
            <iframe
              title={`${speciesName} 3D Model`}
              src={embedUrl}
              loading="lazy"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              onLoad={() => setIframeLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2">
            {fallbackImageUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={fallbackImageUrl}
                  alt={fallbackImageAlt || speciesName}
                  className="w-full h-full object-contain"
                />
                {fallbackImageCredit && (
                  <span className="absolute bottom-1 left-1 text-[7px] text-white bg-black/50 px-1 py-0.5 rounded">
                    {fallbackImageCredit}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center text-[#999]">
                <Box className="w-8 h-8 mx-auto mb-1 opacity-30" />
                <p className="text-[10px]">No specimen available</p>
              </div>
            )}
          </div>
        )}

        {/* 3D hint overlay */}
        {has3D && (
          <div className="absolute bottom-2 left-2 pointer-events-none">
            <div className="inline-flex items-center gap-1 text-[7px] text-[#888] bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-[#ddd]">
              <RotateCcw className="w-2.5 h-2.5" />
              Drag to rotate · Scroll to zoom
            </div>
          </div>
        )}
      </div>

      {/* Anatomy panel */}
      {showAnatomy && anatomy && anatomy.length > 0 && (
        <div className="border-t border-[#e0e0e0] bg-white">
          <div className="px-2 py-1 flex items-center gap-1 border-b border-[#f0f0f0]">
            <Info className="w-3 h-3 text-[#1565a0]" />
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#888]">Body Anatomy</span>
            <span className="text-[7px] text-[#bbb] ml-auto">{anatomy.length} features</span>
          </div>
          <div className="px-2 py-1.5 grid grid-cols-2 gap-x-3 gap-y-1 max-h-[120px] overflow-y-auto">
            {anatomy.map((part, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPart(selectedPart?.label === part.label ? null : part)}
                className={`text-left rounded px-1.5 py-1 transition-all border ${
                  selectedPart?.label === part.label
                    ? "border-[#1565a0] bg-[#e3f2fd]"
                    : "border-transparent hover:bg-[#f5f7fa]"
                }`}
              >
                <div className="flex items-start gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: selectedPart?.label === part.label ? "#1565a0" : "#e8ecf0",
                      color: selectedPart?.label === part.label ? "white" : "#666",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-[#333] leading-tight">{part.label}</div>
                    {selectedPart?.label === part.label && (
                      <div className="text-[8px] text-[#666] leading-snug mt-0.5">{part.description}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
