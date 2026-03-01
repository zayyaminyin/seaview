"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fish } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Species } from "@/data/species";
import { SpeciesCard } from "./SpeciesCard";

type SpeciesGridProps = {
  species: Species[];
  className?: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
  exit: { opacity: 0, scale: 0.98 },
};

export function SpeciesGrid({ species, className }: SpeciesGridProps) {
  if (species.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "flex flex-col items-center justify-center py-12 px-6",
          "rounded-lg border border-[#e0e0e0] bg-white",
          className
        )}
      >
        <Fish className="mb-3 h-10 w-10 text-[#999]" strokeWidth={1.5} />
        <p className="text-sm font-medium text-[#666]">No species found</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid gap-4",
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {species.map((s) => (
          <motion.div
            key={s.slug}
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SpeciesCard species={s} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
