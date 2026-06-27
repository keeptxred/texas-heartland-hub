import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/texas-politics", label: "Politics" },
  { to: "/texas-economy", label: "Economy" },
  { to: "/texas-law-policy", label: "Policy" },
  { to: "/elections", label: "Elections" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground border-b border-white/10">
      <div className="overflow-hidden border-b border-white/10 bg-tx-ink/40 py-1.5">
        <div className="flex gap-10 whitespace-nowrap animate-marquee text-[10px] font-medium tracking-[0.2em] uppercase text-white/70">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 gap-10 px-5">
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />2026 Primary Countdown: 142 Days</span>
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-accent" />Property Tax Relief: Phase II Active</span>
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />Border Operations: Ongoing</span>
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-accent" />Voter ID Required Statewide</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl leading-none tracking-tight flex items-baseline gap-1.5">
          Keep <span className="text-primary">TX</span> Red
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="w-6 h-0.5 bg-current mb-1.5" />
          <div className="w-6 h-0.5 bg-current mb-1.5" />
          <div className="w-4 h-0.5 bg-current ml-auto" />
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-white/10 bg-secondary px-6 py-4 flex flex-col gap-3 text-sm font-medium">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-1" activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}