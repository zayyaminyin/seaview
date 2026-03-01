"use client";

type TaxonomyBadgeProps = {
  kingdom?: string;
  phylum?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  className?: string;
};

export function TaxonomyBadge({
  kingdom,
  phylum,
  order,
  family,
  genus,
  species,
  className = "",
}: TaxonomyBadgeProps) {
  const parts = [
    kingdom && { rank: "K", value: kingdom },
    phylum && { rank: "P", value: phylum },
    order && { rank: "O", value: order },
    family && { rank: "F", value: family },
    genus && { rank: "G", value: genus },
    species && { rank: "S", value: species },
  ].filter(Boolean) as { rank: string; value: string }[];

  if (!parts.length) return null;

  return (
    <div className={`flex flex-wrap gap-0.5 ${className}`}>
      {parts.map((p, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          <span className="text-[7px] font-bold text-[#999] uppercase">{p.rank}:</span>
          <span className="text-[9px] text-[#333] italic">{p.value}</span>
          {i < parts.length - 1 && <span className="text-[#ccc] text-[8px] mx-0.5">›</span>}
        </span>
      ))}
    </div>
  );
}
