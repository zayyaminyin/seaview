"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Fish,
  BarChart3,
  Map,
  Users,
  BookOpen,
  Heart,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/biodiversity", label: "Biodiversity", icon: Fish },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/explore", label: "Explore", icon: Map },
  { href: "/community", label: "Community", icon: Users },
  { href: "/research", label: "Research", icon: BookOpen },
  { href: "/actions", label: "Actions", icon: Heart },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-black/20 md:hidden"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed top-0 left-0 z-[70] h-full w-64 md:hidden",
          "bg-white border-r border-[#ddd]"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex h-full flex-col">
          {/* Header with close button */}
          <div className="flex h-12 items-center justify-between border-b border-[#ddd] px-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1565a0]">
              SEAVIEW
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#555] hover:text-[#1565a0] transition-colors"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-0.5 p-3" aria-label="Main">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors",
                    "text-[#555] hover:text-[#1565a0]",
                    isActive &&
                      "text-[#1565a0] bg-[#f0f9fd] border-l-[3px] border-l-[#1565a0]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
}
