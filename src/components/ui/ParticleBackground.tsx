"use client";

export function ParticleBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: `radial-gradient(circle, #f0f0f0 1px, transparent 1px)`,
        backgroundSize: "16px 16px",
      }}
      aria-hidden
    />
  );
}
