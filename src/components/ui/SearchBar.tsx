"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#556677]"
        aria-hidden
      />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-lg border border-[#2a3a4a] bg-[#111827] py-2.5 pl-9 pr-4 text-sm text-[#e0e8f0]",
          "placeholder:text-[#556677] focus:border-[#4fb3d9] focus:outline-none focus:ring-1 focus:ring-[#4fb3d9]"
        )}
      />
    </div>
  );
}
