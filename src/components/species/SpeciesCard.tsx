"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Species } from "@/data/species";
import { ConservationBadge } from "./ConservationBadge";

type SpeciesCardProps = {
  species: Species;
};

const typeLabels: Record<Species["type"], string> = {
  mammal: "Mammal",
  fish: "Fish",
  invertebrate: "Invertebrate",
  plant: "Plant",
  coral: "Coral",
  reptile: "Reptile",
  bird: "Bird",
};

export const SpeciesCard = memo(function SpeciesCard({ species }: SpeciesCardProps) {
  const image = species.images[0];

  return (
    <Link href={`/biodiversity/${species.slug}`} className="block">
      <motion.div
        layout
        className={cn(
          "overflow-hidden rounded-lg border border-[#1e2d3d] bg-[#111827]",
          "transition-shadow duration-200 hover:shadow-lg hover:shadow-black/20 hover:border-[#2a3a4a]"
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={image?.url ?? "/placeholder-species.jpg"}
            alt={image?.alt ?? species.commonName}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-sm text-[#e0e8f0] leading-tight">
            {species.commonName}
          </h3>
          <p className="text-xs italic text-[#667788] mt-0.5">
            {species.scientificName}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <ConservationBadge
              status={species.conservationStatus}
              size="sm"
              showLabel={false}
            />
            <span className="rounded-sm bg-[#1a2332] px-1.5 py-0.5 text-[10px] font-medium text-[#8899aa] uppercase">
              {typeLabels[species.type]}
            </span>
          </div>
          <p className="text-xs text-[#8899aa] line-clamp-2 mt-2 leading-relaxed">
            {species.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
});
