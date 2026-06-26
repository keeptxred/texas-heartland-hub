import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, SectionCard } from "@/components/page-hero";
import { COUNTIES } from "@/data/counties";

export const Route = createFileRoute("/voting-locations")({
  head: () => ({
    meta: [
      { title: "Texas Voting Locations — Keep TX Red" },
      { name: "description", content: "Find your polling place, early voting locations, and ballot drop-off sites in every Texas county." },
      { property: "og:title", content: "Texas Voting Locations" },
    ],
    links: [{ rel: "canonical", href: "/voting-locations" }],
  }),
  component: VotingLocationsPage,
});

function VotingLocationsPage() {
  const [county, setCounty] = useState(COUNTIES[0].name);
  return (
    <>
      <PageHero eyebrow="Find Your Poll" title="VOTING" highlight="LOCATIONS" description="Most Texas counties operate Countywide Polling Places — vote at any open location on Election Day. Confirm before you go." />
      <div className="mx-auto max-w-4xl px-4 py-14 space-y-6">
        <SectionCard title="Look Up Your County">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground" htmlFor="county">Select County</label>
          <select
            id="county"
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            className="mt-2 h-11 w-full px-3 border-2 border-foreground/20 bg-background"
          >
            {COUNTIES.map((c) => <option key={c.slug}>{c.name}</option>)}
          </select>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(county + " TX polling locations")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-block mt-4 bg-primary text-primary-foreground px-5 py-3 text-xs font-bold uppercase tracking-widest"
          >Open {county} Locations →</a>
        </SectionCard>

        <SectionCard title="Voting Periods">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Early Voting:</strong> Roughly 17 days to 4 days before Election Day. Vote at any early-voting site in your county.</li>
            <li><strong>Election Day:</strong> 7 a.m. to 7 p.m. Anyone in line by 7 p.m. is entitled to vote.</li>
            <li><strong>Mail Ballot:</strong> Available to voters 65+, disabled, confined to jail (and otherwise eligible), or out of the county for the entire period.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Bring Your ID">
          <p>Texas requires one of seven accepted photo IDs. If yours is expired, it's still valid up to four years after expiration (no limit if you're 70+).</p>
        </SectionCard>
      </div>
    </>
  );
}