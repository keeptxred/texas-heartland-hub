import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";
import { ElectionLayout, ElectionNavigation, VotingDates, type VotingDateItem } from "@/components/elections";
import { TexasVoterIdReference } from "@/components/elections/voting/TexasVoterIdReference";
import { useElectionRaces } from "@/hooks/elections";
import { TEXAS_ELECTIONS, formatElectionDate } from "@/lib/election-calendar";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";

const MY_VOTER_PORTAL = "https://goelect.txelections.civixapps.com/ivis-mvp-ui/";
const COUNTY_ELECTION_OFFICES = "https://www.sos.state.tx.us/elections/voter/county.shtml";
const WHO_REPRESENTS_ME = "https://wrm.capitol.texas.gov/home";
const calendar2026 = TEXAS_ELECTIONS.filter((election) => election.date.startsWith("2026-"));
const calendarSource = calendar2026.find((election) => election.source)?.source;
const calendarVerified = calendar2026.map((election) => election.lastUpdated).sort().at(-1) ?? "Verification pending";
const votingLogistics = [
  { to: "/elections/voting/polling-hours", title: "What time do Texas polls open?", description: "Election Day hours, how early-voting schedules differ, and where to verify current local hours." },
  { to: "/elections/voting/voter-registration-card", title: "Do I need my voter registration card?", description: "When the certificate is not required, when it can be supporting ID, and what Texas voter-ID rules actually say." },
  { to: "/elections/voting/polling-place", title: "Where is my Texas polling place?", description: "Use the official voter portal and understand early-voting locations, vote centers, and precinct assignments." },
] as const;

export const Route = createFileRoute("/elections/voting")({
  head: () => ({
    meta: [
      { title: "Texas Voting Dates, Voter ID, Ballot Research & Official Resources | KeepTXRed" },
      { name: "description", content: "Review the 2026 Texas election calendar, current voter-ID categories, browse published races by ZIP, county or district, and continue to official Texas voter resources." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Texas Voting Dates, Voter ID & Ballot Research | KeepTXRed Election Central" },
      { property: "og:url", content: "https://keeptxred.com/elections/voting" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "2026 Texas Election Central" },
      { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/voting" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ElectionRepositoryProvider>
      <VotingResearch />
    </ElectionRepositoryProvider>
  );
}

function VotingResearch() {
  const [zip, setZip] = useState("");
  const [county, setCounty] = useState("");
  const [district, setDistrict] = useState("");
  const races = useElectionRaces({
    filters: { stateCodes: ["TX"], publicationStatuses: ["published"] },
    pagination: { page: 1, pageSize: 500 },
    sort: [{ field: "name", direction: "asc" }],
  });
  const items = races.data?.items ?? [];
  const counties = useMemo(
    () => Array.from(new Set(items.flatMap((race) => race.counties.map((item) => item.name)))).sort(),
    [items],
  );
  const districts = useMemo(
    () =>
      Array.from(
        new Set(
          items.flatMap((race) =>
            race.districtName &&
            (race.jurisdictionType === "congressional_district" ||
              race.jurisdictionType === "state_house_district" ||
              race.jurisdictionType === "state_senate_district")
              ? [race.districtName]
              : [],
          ),
        ),
      ).sort(),
    [items],
  );
  const normalizedZip = /^\d{5}$/.test(zip) ? zip : "";
  const matches = items.filter((race) => {
    if (normalizedZip && !race.zipCodes.includes(normalizedZip)) return false;
    if (county && !race.counties.some((item) => item.name === county)) return false;
    if (district && race.districtName !== district) return false;
    return Boolean(normalizedZip || county || district);
  });
  const votingDates: VotingDateItem[] = calendar2026.map((election) => ({
    id: `${election.type}-${election.date}`,
    label: election.name,
    date: formatElectionDate(election),
    description: election.description,
    status: electionDateStatus(election.date),
    actionLabel: "Official election calendar",
    actionHref: election.source,
  }));
  const hasBallotFilters = Boolean(zip || county || district);
  const clearBallotFilters = () => {
    setZip("");
    setCounty("");
    setDistrict("");
  };

  return (
    <ElectionLayout
      title="Texas Voting Dates, Voter ID & Ballot Research"
      description="Use the 2026 election calendar and voter-ID reference for statewide orientation, browse public race records by ZIP, county or district, then confirm registration, ballot assignment and local details with an official election authority."
      canonicalUrl="https://keeptxred.com/elections/voting"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.voting} />}
    >
      <div className="space-y-8">
        <VotingDates dates={votingDates} title="2026 Texas election dates" description="Statewide primary, runoff and general-election dates from the centralized Texas election calendar. Local and special elections may use additional dates." />

        <TexasVoterIdReference />

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="voting-logistics-heading">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Fast answers for voting logistics</p>
          <h2 id="voting-logistics-heading" className="mt-2 font-display text-3xl leading-none tracking-tight text-foreground">The questions voters need answered before they leave home</h2>
          <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">These focused guides give the statewide rule first, explain where county practice can differ, and link directly to the Texas Secretary of State or local election authority for voter-specific confirmation.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {votingLogistics.map((item) => (
              <Link key={item.to} to={item.to} className="group rounded-xl border border-border bg-muted/30 p-5 transition hover:border-primary hover:bg-background">
                <h3 className="font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-primary">Open answer →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm" aria-labelledby="voter-requirements-reference">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">What to verify before voting</p>
          <h2 id="voter-requirements-reference" className="mt-2 font-display text-3xl leading-none tracking-tight text-foreground">Registration, ballot, identification and local voting details</h2>
          <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">Election Central does not decide an individual voter’s eligibility or ballot. Before voting, use official resources to verify your registration status and assigned ballot, the current identification or alternative-document rules that apply to you, voting locations and hours, and any mail-ballot requirements or deadlines.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <OfficialLink href={MY_VOTER_PORTAL} label="Texas My Voter Portal" />
            <OfficialLink href={COUNTY_ELECTION_OFFICES} label="Texas county election offices" />
            <OfficialLink href={WHO_REPRESENTS_ME} label="Who Represents Me?" />
          </div>
        </section>

        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">Election Central does not collect an address or determine an individual voter&apos;s ballot. ZIP results can overlap multiple districts. Always confirm with the official Texas voter portal or your county election office.</aside>

        <section aria-labelledby="ballot-browse-heading" className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Ballot research</p>
              <h2 id="ballot-browse-heading" className="mt-1 text-xl font-bold text-foreground">Browse published races</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Use ZIP, county, or district as a browsing aid for Election Central records. This does not determine your official ballot.</p>
            </div>
            {hasBallotFilters ? (
              <button type="button" onClick={clearBallotFilters} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">Clear ballot filters</button>
            ) : null}
          </div>
          <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-3">
            <label className="text-sm font-semibold text-foreground">
              Texas ZIP code
              <input inputMode="numeric" maxLength={5} pattern="[0-9]{5}" value={zip} onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="5-digit ZIP" className="mt-2 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>
            <Selection label="County" value={county} options={counties} onChange={setCounty} />
            <Selection label="Congressional or legislative district" value={district} options={districts} onChange={setDistrict} />
          </div>
          {zip && !normalizedZip ? <p className="mt-3 text-sm font-semibold text-destructive">Enter a five-digit ZIP code.</p> : null}
          {normalizedZip || county || district ? (
            matches.length > 0 ? (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {matches.map((race) => <li key={race.id}><a href={ELECTION_ROUTES.race(race.slug)} className="block rounded-lg border border-border bg-muted/30 p-4 font-semibold text-primary transition hover:border-primary hover:bg-background hover:underline">{race.name}</a></li>)}
              </ul>
            ) : <p className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">No published Election Central races match this selection. Use the official links above to confirm your ballot.</p>
          ) : null}
        </section>

        <CitationTrustPanel
          sources={[
            ...(calendarSource ? [{ name: "Texas Secretary of State election calendar", url: calendarSource, note: "Statewide election-date reference." }] : []),
            { name: "Texas My Voter Portal", url: MY_VOTER_PORTAL, note: "Official voter-status and ballot research starting point." },
            { name: "Texas county election offices", url: COUNTY_ELECTION_OFFICES, note: "Official local election authority directory." },
          ]}
          methodology="Election dates are read from the centralized Texas calendar. ZIP, county and district filters only browse published Election Central race records and do not determine an address-specific ballot. Registration, identification, mail-ballot and local voting requirements are intentionally delegated to official voter and county election resources rather than inferred by this site."
          lastVerified={`Centralized 2026 election calendar last verified ${calendarVerified}. Local voter and ballot details must be checked with the official authority at the time of voting.`}
          title="Voting reference sources and methodology"
        />
      </div>
    </ElectionLayout>
  );
}

function electionDateStatus(date: string): VotingDateItem["status"] {
  const target = Date.parse(`${date}T23:59:59-05:00`);
  return Number.isFinite(target) && target < Date.now() ? "complete" : "upcoming";
}

function Selection({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-semibold text-foreground">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
        <option value="">All</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function OfficialLink({ href, label }: { href: string; label: string }) {
  return <a className="rounded-xl border border-border bg-muted/30 p-5 font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-background hover:underline" href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>;
}
