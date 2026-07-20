import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { nextElectionHeadline } from "@/lib/election-calendar";

const NAV = [
  { to: "/texas-news", label: "Texas News" },
  { to: "/happening-now", label: "Happening Now" },
  { to: "/texas-politics", label: "Politics" },
  { to: "/houston", label: "Houston" },
  { to: "/texas-sports", label: "Sports" },
  { to: "/texas-business", label: "Business" },
  { to: "/news/non-political", label: "Non-Political" },
  { to: "/laws", label: "Laws" },
  { to: "/elections", label: "Elections" },
  { to: "/tax-calculator", label: "Property Taxes" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const electionHeadline = nextElectionHeadline();
  return (
    <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground border-b border-white/10">
      <div className="overflow-hidden border-b border-white/10 bg-tx-ink/40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-1.5">
          <span className="pl-4 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 shrink-0">Latest Texas News:</span>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-10 whitespace-nowrap animate-marquee text-[10px] font-medium tracking-[0.2em] uppercase text-white/70">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex shrink-0 gap-10 px-5">
                  <Link to="/elections" className="flex items-center gap-2 hover:text-primary transition-colors"><span className="size-1.5 rounded-full bg-primary" />{electionHeadline}</Link>
                  <Link to="/texas-politics" className="flex items-center gap-2 hover:text-primary transition-colors"><span className="size-1.5 rounded-full bg-primary" />Border Operations: Ongoing</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-hidden border-b border-white/10 bg-tx-ink/40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-1.5">
          <span className="pl-4 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 shrink-0">Texas Resources:</span>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-10 whitespace-nowrap animate-marquee text-[10px] font-medium tracking-[0.2em] uppercase text-white/70">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex shrink-0 gap-10 px-5">
                  <Link to="/tax-calculator" className="flex items-center gap-2 hover:text-primary transition-colors"><span className="size-1.5 rounded-full bg-accent" />Property Tax Calculator</Link>
                  <Link to="/register-to-vote" className="flex items-center gap-2 hover:text-primary transition-colors"><span className="size-1.5 rounded-full bg-accent" />Voter Registration Resources</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-2xl leading-none tracking-tight flex items-baseline gap-1.5 shrink-0">
          Keep <span className="text-primary">TX</span> Red
        </Link>
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 xl:gap-7 text-sm font-medium">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="whitespace-nowrap hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
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