"use client";

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
};

export function SpeciesCard({ species }: SpeciesCardProps) {
  const image = species.images[0];

  return (
    <Link href={`/biodiversity/${species.slug}`} className="block">
      <motion.div
        layout
        className={cn(
          "overflow-hidden rounded-lg border border-[#e0e0e0] bg-white",
          "transition-shadow duration-200 hover:shadow-md"
        )}
      >
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={image?.url ?? "/placeholder-species.jpg"}
            alt={image?.alt ?? species.commonName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-sm text-black leading-tight">
            {species.commonName}
          </h3>
          <p className="text-xs italic text-[#666] mt-0.5">
            {species.scientificName}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <ConservationBadge
              status={species.conservationStatus}
              size="sm"
              showLabel={false}
            />
            <span className="rounded-sm bg-[#f0f0f0] px-1.5 py-0.5 text-[10px] font-medium text-[#666] uppercase">
              {typeLabels[species.type]}
            </span>
          </div>
          <p className="text-xs text-[#555] line-clamp-2 mt-2 leading-relaxed">
            {species.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
