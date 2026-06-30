import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { to: "/texas-news", label: "Texas News" },
  { to: "/dashboard", label: "Happening Now" },
  { to: "/texas-politics", label: "Politics" },
  { to: "/houston", label: "Houston" },
  { to: "/texas-sports", label: "Sports" },
  { to: "/texas-business", label: "Business" },
  { to: "/news/non-political", label: "Non-Political" },
  { to: "/elections", label: "Elections" },
  { to: "/tax-calculator", label: "Property Taxes" },
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
              <Link to="/elections" className="flex items-center gap-2 hover:text-primary transition-colors"><span className="size-1.5 rounded-full bg-primary" />2026 Primary Countdown: 142 Days</Link>
              <Link to="/tax-calculator" className="flex items-center gap-2 hover:text-primary transition-colors"><span className="size-1.5 rounded-full bg-accent" />Property Tax Relief: Phase II Active</Link>
              <Link to="/texas-politics" className="flex items-center gap-2 hover:text-primary transition-colors"><span className="size-1.5 rounded-full bg-primary" />Border Operations: Ongoing</Link>
              <Link to="/register-to-vote" className="flex items-center gap-2 hover:text-primary transition-colors"><span className="size-1.5 rounded-full bg-accent" />Voter ID Required Statewide</Link>
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
            <Link key={n.to} to={n.to} className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
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
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-1" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}