import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-16">
      <div className="mx-auto max-w-6xl px-4 py-14 text-center">
        <div className="size-12 rounded-full border border-white/20 grid place-items-center mx-auto mb-5">
          <span className="font-display text-2xl text-accent leading-none">★</span>
        </div>
        <h4 className="font-display text-4xl tracking-tight mb-3">KEEP TEXAS RED</h4>
        <p className="text-sm text-white/60 max-w-md mx-auto mb-8">
          The premier conservative voice for the Lone Star State. Independent reporting, election coverage, and tools for taxpayers.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-xs font-semibold uppercase tracking-widest text-accent">
          <Link to="/news">Newsroom</Link>
          <Link to="/elections">Voter Guide</Link>
          <Link to="/tax-calculator">Tax Portal</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="text-[10px] text-white/40 uppercase tracking-[0.25em] leading-relaxed">
          &copy; {new Date().getFullYear()} keeptxred.com — All rights reserved
          <br />
          <span className="not-italic">Independent commentary. Not authorized by any candidate or candidate's committee.</span>
        </div>
      </div>
    </footer>
  );
}