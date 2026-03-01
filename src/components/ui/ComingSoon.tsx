"use client";

import { Users, BookOpen, Heart, Fish, Map, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  Users,
  BookOpen,
  Heart,
  Fish,
  Map,
  BarChart3,
} as const;

type ComingSoonProps = {
  title: string;
  description: string;
  iconName: keyof typeof iconMap;
};

export function ComingSoon({ title, description: _description, iconName }: ComingSoonProps) {
  const Icon = iconMap[iconName];

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        "bg-white"
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center w-[300px] h-[200px] border border-[#e0e0e0] rounded bg-white p-4 justify-center shadow-sm">
        <div className="flex size-10 items-center justify-center">
          <Icon className="size-10 text-gray-400" strokeWidth={1.5} />
        </div>
        <h1 className="text-sm font-bold uppercase tracking-tight text-gray-900">
          {title}
        </h1>
        <span className="rounded-full border border-[#ddd] bg-[#fafafa] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-600">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
