"use client";

import { ExternalLink } from "lucide-react";

type LinkItem = {
  label: string;
  url: string;
  color: string;
  bgColor: string;
};

type ExternalLinksProps = {
  wikipediaSlug?: string;
  iucnUrl?: string;
  gbifUrl?: string;
  obisUrl?: string;
  className?: string;
  compact?: boolean;
};

export function ExternalLinks({
  wikipediaSlug,
  iucnUrl,
  gbifUrl,
  obisUrl,
  className = "",
  compact = false,
}: ExternalLinksProps) {
  const links: LinkItem[] = [];

  if (wikipediaSlug) {
    links.push({
      label: "Wikipedia",
      url: `https://en.wikipedia.org/wiki/${wikipediaSlug}`,
      color: "#333",
      bgColor: "#f5f5f5",
    });
  }

  if (iucnUrl) {
    links.push({
      label: "IUCN Red List",
      url: iucnUrl,
      color: "#c62828",
      bgColor: "#fef2f2",
    });
  }

  if (gbifUrl) {
    links.push({
      label: "GBIF",
      url: gbifUrl,
      color: "#4caf50",
      bgColor: "#f1f8e9",
    });
  }

  if (obisUrl) {
    links.push({
      label: "OBIS",
      url: obisUrl,
      color: "#1565a0",
      bgColor: "#e3f2fd",
    });
  }

  if (!links.length) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded transition-all hover:opacity-80"
          style={{
            background: link.bgColor,
            color: link.color,
            border: `1px solid ${link.color}22`,
            padding: compact ? "1px 4px" : "2px 6px",
            fontSize: compact ? "8px" : "9px",
            fontWeight: 700,
            letterSpacing: "0.03em",
            textDecoration: "none",
          }}
        >
          <ExternalLink size={compact ? 7 : 8} strokeWidth={2.5} />
          {link.label}
        </a>
      ))}
    </div>
  );
}
