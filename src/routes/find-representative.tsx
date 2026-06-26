import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/find-representative")({
  head: () => ({
    meta: [
      { title: "Find Your Texas Representative — Keep TX Red" },
      { name: "description", content: "Enter your address or ZIP code to find your U.S. House district, Texas State House and Senate representatives." },
      { property: "og:title", content: "Find Your Texas Representative" },
    ],
    links: [{ rel: "canonical", href: "/find-representative" }],
  }),
  component: FindRepPage,
});

function FindRepPage() {
  const [zip, setZip] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <PageHero eyebrow="Lookup Tool" title="FIND YOUR" highlight="REPRESENTATIVE" description="Enter your ZIP code to identify your federal and state districts. We'll surface your members and direct contact lines." />
      <div className="mx-auto max-w-3xl px-4 py-14">
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="border-2 border-foreground/10 bg-card p-6 md:p-8"
        >
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground" htmlFor="zip">ZIP Code or Street Address</label>
          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <input
              id="zip"
              required
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 77002 or 123 Main St, Houston, TX"
              className="flex-1 h-12 px-4 border-2 border-foreground/20 bg-background focus:outline-none focus:border-primary"
            />
            <button type="submit" className="h-12 px-6 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90">Look Up →</button>
          </div>
        </form>

        {submitted && (
          <div className="mt-8 border-2 border-primary/30 bg-primary/5 p-6">
            <p className="text-xs uppercase tracking-widest text-primary font-bold">Results for {zip}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              For full precinct-level accuracy, confirm your districts at the official sources below — they cross-reference the Texas Legislative Council and county election rolls.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• <a className="text-primary font-semibold underline" href="https://wrm.capitol.texas.gov/home" target="_blank" rel="noopener noreferrer">Texas Legislature "Who Represents Me?"</a></li>
              <li>• <a className="text-primary font-semibold underline" href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer">U.S. House Member Finder</a></li>
              <li>• <a className="text-primary font-semibold underline" href="https://teamrv-mvp.sos.texas.gov/MVP/mvp.do" target="_blank" rel="noopener noreferrer">Texas SOS Voter Registration Lookup</a></li>
            </ul>
            <Link to="/representatives" className="inline-block mt-5 text-xs font-bold uppercase tracking-widest text-primary hover:underline">Browse Full Directory →</Link>
          </div>
        )}

        <div className="mt-10 grid sm:grid-cols-3 gap-4 text-sm">
          <Link to="/contact-legislators" className="border-2 border-foreground/10 p-5 hover:border-primary"><strong className="font-display text-xl">Contact</strong><br /><span className="text-muted-foreground text-xs">Scripts & numbers</span></Link>
          <Link to="/register-to-vote" className="border-2 border-foreground/10 p-5 hover:border-primary"><strong className="font-display text-xl">Register</strong><br /><span className="text-muted-foreground text-xs">Get on the rolls</span></Link>
          <Link to="/voting-locations" className="border-2 border-foreground/10 p-5 hover:border-primary"><strong className="font-display text-xl">Vote</strong><br /><span className="text-muted-foreground text-xs">Find your polling place</span></Link>
        </div>
      </div>
    </>
  );
}