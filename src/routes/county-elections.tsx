import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";
import { PageHero } from "@/components/page-hero";
import { COUNTIES } from "@/data/counties";

const URL = "https://keeptxred.com/county-elections";
const COUNTY_DIRECTORY = "https://www.sos.state.tx.us/elections/voter/county.shtml";
const ELECTION_CALENDAR = "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml";
const VOTER_PORTAL = "https://teamrv-mvp.sos.texas.gov/MVP/mvp.do";
const EARLY_VOTING = "https://www.sos.state.tx.us/elections/pamphlets/earlyvote.shtml";
const REVIEWED = "2026-11-24";

export const Route = createFileRoute("/county-elections")({
  head: () => ({
    meta: [
      { title: "Texas County Election Offices & Ballot Resources | Keep TX Red" },
      {
        name: "description",
        content:
          "Find Texas county election resources, official ballot links, county election offices, registration resources, and district information.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Texas County Election Offices & Ballot Resources" },
      {
        property: "og:description",
        content:
          "Browse Texas counties and continue to official county election offices, ballot research, voter registration, and district information.",
      },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Texas county election offices", url: URL, dateModified: REVIEWED, isBasedOn: [COUNTY_DIRECTORY, ELECTION_CALENDAR, VOTER_PORTAL, EARLY_VOTING] }) }],
  }),
  component: CountyElectionsPage,
});

function CountyElectionsPage() {
  const [query, setQuery] = useState("");
  const counties = useMemo(() => {
    const term = query.trim().toLowerCase().replace(/\s+county$/, "");
    return COUNTIES.filter((county) => !term || county.name.toLowerCase().includes(term));
  }, [query]);
  return (
    <>
      <PageHero
        eyebrow="Local Elections"
        title="TEXAS COUNTY"
        highlight="ELECTION RESOURCES"
        description="Texas counties administer elections locally. Find your county and continue to official election-office, ballot, and voter resources."
      />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <section className="mb-10 rounded-2xl border bg-card p-6" aria-labelledby="which-office">
          <h2 id="which-office" className="text-2xl font-bold">Which election office should you contact?</h2>
          <p className="mt-3 leading-7">Start with your county of residence. The county voter registrar handles registration records and address changes. The office administering the election can answer questions about polling places, sample ballots and election administration. In some local elections, a city, school district or other political subdivision may administer its own election.</p>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            <div><dt className="font-semibold">Registration or address problem</dt><dd className="mt-1 text-sm leading-6">Check the <a className="text-primary underline" href={VOTER_PORTAL}>state voter portal</a>, then contact your county registrar.</dd></div>
            <div><dt className="font-semibold">Polling place or sample ballot</dt><dd className="mt-1 text-sm leading-6">Use the county website listed in the official directory. Confirm your specific election and address.</dd></div>
            <div><dt className="font-semibold">Early voting</dt><dd className="mt-1 text-sm leading-6">Check the <a className="text-primary underline" href={EARLY_VOTING}>state early-voting guidance</a> and local locations and hours.</dd></div>
            <div><dt className="font-semibold">Next election</dt><dd className="mt-1 text-sm leading-6">Check the <a className="text-primary underline" href={ELECTION_CALENDAR}>official election calendar</a>. A statewide calendar date does not mean every county or voter has a contest on that date.</dd></div>
          </dl>
        </section>
        <section className="mb-10 grid gap-5 md:grid-cols-3" aria-label="County election resources">
          <ElectionResource
            href="/issues/texas-election-law"
            title="Texas election law"
            description="Understand the laws behind elections and voting in Texas."
          />
          <ElectionResource
            href="/districts"
            title="Texas legislative districts"
            description="Browse congressional, Texas House, and Texas Senate district pages."
          />
          <ElectionResource
            href="/register-to-vote"
            title="Texas voter registration"
            description="Learn about voter registration and official ballot resources."
          />
        </section>

        <section aria-labelledby="county-directory-heading">
          <h2 id="county-directory-heading" className="font-display text-3xl tracking-tight">
            Texas county directory
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Select the official Texas county-election-office directory to locate the responsible
            election authority for any of Texas&apos; 254 counties.
          </p>
          <a
            href={COUNTY_DIRECTORY}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground"
          >
            Open the official Texas county election office directory
          </a>

          <p className="mt-4 text-sm text-muted-foreground">The county list below helps you identify the correct county name. All directory links lead to the Secretary of State’s statewide list, not individual county webpages; select your county there to obtain the current official contact details.</p>
          <label htmlFor="county-filter" className="mt-6 block font-semibold">Find a county by name</label>
          <input id="county-filter" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: Harris" className="mt-2 w-full max-w-md rounded-md border bg-background px-4 py-3" />
          <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">{counties.length} of {COUNTIES.length} counties</p>
          {counties.length === 0 ? <p className="mt-4">No matching county. Try a shorter name.</p> : null}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {counties.map((county) => (
              <article key={county.slug} className="rounded-md border bg-card p-4">
                <h3 className="font-display text-lg tracking-tight">{county.name} County</h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {county.region}
                </p>
                <a
                  href={COUNTY_DIRECTORY}
                  className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  Official statewide directory →
                </a>
              </article>
            ))}
          </div>
        </section>
        <CitationTrustPanel className="mt-10" title="Official election sources" lastVerified="November 24, 2026" sources={[
          { name: "Texas Secretary of State — County election duties", url: COUNTY_DIRECTORY, note: "County election-office contact details and roles." },
          { name: "Texas Secretary of State — Important election dates", url: ELECTION_CALENDAR, note: "Statewide election calendar." },
          { name: "Texas Secretary of State — My Voter Portal", url: VOTER_PORTAL, note: "Registration and election information." },
          { name: "Texas Secretary of State — Early voting FAQ", url: EARLY_VOTING, note: "State guidance for early voting." },
        ]} methodology="County names are drawn from the site’s county inventory. Contact details remain with the official state directory rather than being duplicated and allowed to become outdated. Election-specific information must be confirmed with the administering office." />
      </main>
    </>
  );
}

function ElectionResource({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a href={href} className="rounded-xl border bg-card p-6 shadow-sm hover:border-primary">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </a>
  );
}
