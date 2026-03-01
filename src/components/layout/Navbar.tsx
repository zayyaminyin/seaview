"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves, Menu, X, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/biodiversity", label: "Species" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/explore", label: "Map" },
  { href: "/community", label: "Community" },
  { href: "/research", label: "Research" },
  { href: "/actions", label: "Actions" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <header className="h-10 w-full flex items-center px-3 gap-3 z-50 relative"
        style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #1b2a4a 40%, #1e3a5f 100%)" }}>
        
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#4fb3d9] to-[#1565a0] flex items-center justify-center">
            <Waves className="w-3 h-3 text-white" />
          </div>
          <span className="text-[12px] font-extrabold text-white tracking-wider uppercase">
            Seaview
          </span>
        </Link>

        <div className="h-4 w-px bg-white/15 hidden md:block" />

        <nav className="hidden md:flex items-center gap-0.5" aria-label="Main">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-all duration-200",
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/90"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-[#4fb3d9] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Status indicator */}
        <div className="hidden lg:flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-[#4caf50]" />
          <span className="text-[8px] text-white/40 uppercase tracking-wider">Live</span>
        </div>

        <div className="hidden lg:block h-3 w-px bg-white/15" />

        <span className="text-[9px] text-white/30 font-mono hidden lg:block">{time} UTC</span>
        
        <div className="hidden lg:block h-3 w-px bg-white/15" />
        
        <span className="text-[9px] text-white/30 hidden lg:block">Ocean Discovery Platform</span>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1 text-white/70 hover:text-white transition-opacity duration-200"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {mobileOpen && (
        <div
          className="absolute top-10 left-0 right-0 z-40 md:hidden nav-mobile-menu"
          style={{ background: "linear-gradient(180deg, #1b2a4a, #0f1f3d)" }}
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2 text-[11px] font-semibold uppercase tracking-wider border-b border-white/5 transition-colors duration-150",
                  isActive ? "bg-white/15 text-white" : "text-white/50 active:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
