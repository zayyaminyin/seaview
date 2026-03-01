"use client";

import { Search } from "lucide-react";
import { LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";

type FilterOption = {
  label: string;
  value: string;
};

type Filter = {
  label: string;
  value: string;
  options: FilterOption[];
};

type FilterBarProps = {
  filters: Filter[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

export function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <LayoutGroup>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#556677]"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search species..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "w-full rounded border border-[#2a3a4a] bg-[#0f1520] py-2 pl-9 pr-3 text-sm text-[#e0e8f0]",
              "placeholder:text-[#556677] focus:border-[#4fb3d9] focus:outline-none focus:ring-1 focus:ring-[#4fb3d9]"
            )}
          />
        </div>

        <div className="flex overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex min-w-max gap-4">
            {filters.map((filter) => (
              <div key={filter.value} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#556677]">
                  {filter.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {filter.options.map((option) => {
                    const isActive =
                      activeFilters[filter.value] === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          onFilterChange(filter.value, option.value)
                        }
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                          isActive
                            ? "border-[#4fb3d9] bg-[#1565a0] text-white"
                            : "border-[#2a3a4a] bg-[#111827] text-[#8899aa] hover:border-[#4a5a6a]"
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}
