import { Link } from "@tanstack/react-router";

const COLUMNS = [
  {
    heading: "Newsroom",
    links: [
      { to: "/news", label: "Texas News" },
      { to: "/elections", label: "Elections" },
      { to: "/legislative-updates", label: "Legislative Updates" },
      { to: "/candidate-guides", label: "Candidate Guides" },
    ],
  },
  {
    heading: "Take Action",
    links: [
      { to: "/register-to-vote", label: "Register to Vote" },
      { to: "/find-representative", label: "Find Your Rep" },
      { to: "/contact-legislators", label: "Contact Legislators" },
      { to: "/voting-locations", label: "Voting Locations" },
      { to: "/county-elections", label: "County Elections" },
    ],
  },
  {
    heading: "Know the Law",
    links: [
      { to: "/representatives", label: "Representatives" },
      { to: "/texas-laws", label: "Texas Laws Explained" },
      { to: "/laws-to-know", label: "Laws You Should Know" },
      { to: "/tax-calculator", label: "Property Tax Calculator" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/privacy", label: "Privacy Policy" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-16">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="size-12 rounded-full border border-white/20 grid place-items-center mb-5">
              <span className="font-display text-2xl text-accent leading-none">★</span>
            </div>
            <h4 className="font-display text-3xl tracking-tight mb-3">KEEP TEXAS RED</h4>
            <p className="text-sm text-white/60 max-w-xs">
              The premier conservative voice for the Lone Star State. Independent reporting, voter tools, and taxpayer data.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h5 className="font-display text-sm tracking-[0.25em] uppercase text-accent mb-4">{col.heading}</h5>
              <ul className="space-y-2 text-sm text-white/70">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-[10px] text-white/40 uppercase tracking-[0.25em] leading-relaxed">
          &copy; {new Date().getFullYear()} keeptxred.com — All rights reserved
          <br />
          <span className="not-italic normal-case tracking-normal text-white/40">Independent commentary. Not authorized by any candidate or candidate's committee.</span>
        </div>
      </div>
    </footer>
  );
}