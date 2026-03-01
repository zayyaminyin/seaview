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
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999]"
        aria-hidden
      />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-lg border border-[#ccc] bg-white py-2.5 pl-9 pr-4 text-sm",
          "placeholder:text-gray-500 focus:border-ocean-500 focus:outline-none focus:ring-1 focus:ring-ocean-500"
        )}
      />
    </div>
  );
}
