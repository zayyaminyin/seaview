"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Species } from "@/data/species";
import { ConservationBadge } from "./ConservationBadge";

type SpeciesHeroProps = {
  species: Species;
};

const trendIcons = {
  increasing: TrendingUp,
  decreasing: TrendingDown,
  stable: Minus,
  unknown: Minus,
};

const trendLabels = {
  increasing: "Population increasing",
  decreasing: "Population decreasing",
  stable: "Population stable",
  unknown: "Population trend unknown",
};

export function SpeciesHero({ species }: SpeciesHeroProps) {
  const image = species.images[0];
  const TrendIcon = trendIcons[species.populationTrend];

  const descriptionSentences = species.description
    .split(/(?<=[.!?])\s+/)
    .slice(0, 3)
    .join(" ");

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-6xl border-b border-[#1e2d3d] px-4 pb-6"
      )}
    >
      {/* Breadcrumb */}
      <nav
        className="mb-4 flex items-center gap-2 text-xs text-[#667788]"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-[#4fb3d9]">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/biodiversity" className="hover:text-[#4fb3d9]">
          Biodiversity
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate font-medium text-[#e0e8f0]">
          {species.commonName}
        </span>
      </nav>

      <div className="flex max-h-[240px] w-full gap-6">
        {/* Left: Image */}
        <div className="flex w-[40%] min-w-0 flex-shrink-0 flex-col">
          <div className="relative aspect-[4/3] overflow-hidden rounded border border-[#1e2d3d]">
            <Image
              src={image?.url ?? "/placeholder-species.jpg"}
              alt={image?.alt ?? species.commonName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
          {image?.credit && (
            <p className="mt-1 text-[10px] text-[#556677]">
              Credit: {image.credit}
            </p>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h1 className="text-2xl font-bold text-[#e0e8f0]">
            {species.commonName}
          </h1>
          <p className="mt-0.5 text-lg italic text-[#667788]">
            {species.scientificName}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ConservationBadge status={species.conservationStatus} size="md" />
            <div
              className="flex items-center gap-1.5 text-xs text-[#667788]"
              title={trendLabels[species.populationTrend]}
            >
              <TrendIcon className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="capitalize">{species.populationTrend}</span>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#8899aa]">
            {descriptionSentences}
          </p>
        </div>
      </div>
    </section>
  );
}
