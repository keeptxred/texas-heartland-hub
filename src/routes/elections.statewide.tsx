import { createFileRoute } from "@tanstack/react-router";
import candidatesSnapshot from "@/data/elections/2026/candidates.json";
import racesSnapshot from "@/data/elections/2026/races.json";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { TEXAS_ELECTIONS } from "@/lib/election-calendar";
import { ELECTION_ROUTES } from "@/lib/elections";
import { formatElectionTitle } from "@/lib/elections/seo";
import {
  certified2026StatewideChoices,
  normalizeOfficialCandidateName,
  OFFICIAL_2026_STATEWIDE_ROSTER_CHECKED,
  OFFICIAL_2026_STATEWIDE_ROSTER_SOURCE,
  OFFICIAL_2026_ELECTION_INFORMATION_SOURCE,
} from "@/lib/elections/2026-statewide-official-ballot";

const URL = "https://keeptxred.com/elections/statewide";
const PAGE_TITLE = formatElectionTitle("Texas 2026 Statewide Races & Candidates");
const STATEWIDE_RACES = [
  { slug: "2026-us-senate", name: "U.S. Senate" },
  { slug: "2026-governor", name: "Governor" },
  { slug: "2026-lieutenant-governor", name: "Lieutenant Governor" },
  { slug: "2026-attorney-general", name: "Attorney General" },
  { slug: "2026-comptroller", name: "Comptroller of Public Accounts" },
  { slug: "2026-land-commissioner", name: "Land Commissioner" },
  { slug: "2026-agriculture-commissioner", name: "Agriculture Commissioner" },
  { slug: "2026-railroad-commissioner", name: "Railroad Commissioner" },
  { slug: "2026-texas-supreme-court-place-1", name: "Texas Supreme Court Place 1" },
  { slug: "2026-texas-supreme-court-place-2", name: "Texas Supreme Court Place 2" },
  { slug: "2026-texas-supreme-court-place-7", name: "Texas Supreme Court Place 7" },
  { slug: "2026-texas-supreme-court-place-8", name: "Texas Supreme Court Place 8" },
  { slug: "2026-court-of-criminal-appeals-place-3", name: "Court of Criminal Appeals Place 3" },
  { slug: "2026-court-of-criminal-appeals-place-4", name: "Court of Criminal Appeals Place 4" },
  { slug: "2026-court-of-criminal-appeals-place-9", name: "Court of Criminal Appeals Place 9" },
] as const;

const PUBLISHED_CANDIDATES = candidatesSnapshot.filter((candidate) => candidate.publicationStatus === "published" && candidate.verificationStatus === "verified");
const CANDIDATE_BY_ID = new Map(PUBLISHED_CANDIDATES.map((candidate) => [candidate.id, candidate] as const));
const PUBLISHED_RACE_BY_SLUG = new Map(racesSnapshot.filter((race) => race.publicationStatus === "published" && race.verificationStatus === "verified").map((race) => [race.slug, race] as const));
const STATEWIDE_RECORDS = STATEWIDE_RACES.map((definition) => {
  const race = PUBLISHED_RACE_BY_SLUG.get(definition.slug);
  const publishedProfiles = race?.candidateIds.map((id) => CANDIDATE_BY_ID.get(id))
    .filter((candidate): candidate is (typeof PUBLISHED_CANDIDATES)[number] => Boolean(candidate)) ?? [];
  // A published profile is not evidence that its candidate qualified for the
  // November 2026 ballot. Independents can be rejected and write-ins can have
  // a different status. Begin with the Secretary of State's official roster.
  const candidates = certified2026StatewideChoices(definition.slug).map((entry) => {
    const profiles = publishedProfiles.filter(
      (profile) => normalizeOfficialCandidateName(profile.fullName) === normalizeOfficialCandidateName(entry.name),
    );
    // A duplicate name can correspond to separate, conflicting filing statuses.
    // Show the official name once, but do not link to an ambiguous profile.
    return { ...entry, verifiedProfile: profiles.length === 1 ? profiles[0] : null };
  });
  return { ...definition, race, candidates };
});
const verifiedStatewideCount = STATEWIDE_RECORDS.filter((item) => item.race).length;
const calendar2026 = TEXAS_ELECTIONS.filter((item) => item.date.startsWith("2026-"));
const calendarSource = calendar2026.find((item) => item.source)?.source;
const calendarVerified = calendar2026.map((item) => item.lastUpdated).sort().at(-1) ?? "Verification pending";

export const Route = createFileRoute("/elections/statewide")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: "Texas 2026 statewide election candidates and races: U.S. Senate, governor, attorney general, courts and more. Verify your own ballot with Texas election officials." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: "Explore the 2026 Texas statewide races and candidate listings, then confirm current ballot details with the official Texas voter portal." },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "2026 Texas Election Central" },
      { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "2026 Texas statewide election races",
        url: URL,
        numberOfItems: verifiedStatewideCount,
        itemListElement: STATEWIDE_RECORDS.filter((item) => item.race).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: `https://keeptxred.com/elections/races/${item.slug}`,
        })),
      }),
    }],
  }),
  component: TexasStatewideElections,
});

function TexasStatewideElections() {
  return (
    <ElectionLayout
      title="Texas 2026 Statewide Election Races & Candidates"
      description="Compare 2026 Texas statewide offices, races and candidate records. Check the source and last-verified date before relying on a listing, and confirm your ballot with the Texas Secretary of State."
      canonicalUrl={URL}
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.statewide} />}
    >
      <aside aria-label="2026 Texas statewide election voting dates and record freshness" className="mb-8 rounded-xl border border-border bg-card p-5 text-sm leading-7 text-foreground">
        <p className="font-bold">November 3, 2026: Texas general election</p>
        <p>Statewide early voting runs October 19–30, 2026. Candidate and race records on this page were verified on their individual source dates, not necessarily today; they must not be treated as an official voter-specific ballot.</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-semibold">
          <a href="https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Official Texas election dates ↗</a>
          <a href="https://www.votetexas.gov/voting/where" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Official polling-place lookup ↗</a>
          <a href="/elections/voting" className="text-primary hover:underline">KTR voter ID and voting guide →</a>
        </div>
      </aside>
      <section className="mb-10">
        <p className="text-sm font-semibold text-primary">{verifiedStatewideCount} of {STATEWIDE_RACES.length} expected statewide race records are currently published and verified.</p>
        <h2 className="mt-2 text-2xl font-bold text-foreground">2026 statewide races and candidates</h2>
        <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">The names and ballot appearances below are checked against the Texas Secretary of State's November 2026 election listing. Printed ballot choices and certified write-ins are identified separately. Rejected independent filings are not listed as ballot choices. Only unambiguous, previously verified KTR candidate profiles are linked.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATEWIDE_RECORDS.map((item) => (
            <article key={item.slug} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <a href={`/elections/races/${item.slug}`} className="text-lg font-bold text-foreground hover:text-primary hover:underline">{item.name}</a>
              {item.race ? (
                item.candidates.length ? (
                  <ul className="mt-3 space-y-3">
                    {item.candidates.map((candidate) => (
                      <li key={`${item.slug}:${normalizeOfficialCandidateName(candidate.name)}`} className="text-sm">
                        {candidate.verifiedProfile ? (
                          <a href={`/elections/candidates/${candidate.verifiedProfile.slug}`} className="font-semibold text-primary hover:underline">{candidate.name} →</a>
                        ) : <span className="font-semibold text-foreground">{candidate.name}</span>}
                        <span className="ml-2 inline-block text-xs text-muted-foreground">{candidate.appearance === "write-in" ? "Certified write-in" : "Printed on ballot"}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-3 text-sm text-muted-foreground">The official roster has no matched general-election names for this office. Verify the source before relying on the listing.</p>
              ) : <p className="mt-3 text-sm text-amber-700">Expected 2026 office; verified race record not yet published. Use the Secretary of State roster for the official ballot.</p>}
            </article>
          ))}
        </div>
      </section>

      <CitationTrustPanel
        sources={[
          { name: "Texas Secretary of State — November 2026 official election listing", url: OFFICIAL_2026_STATEWIDE_ROSTER_SOURCE },
          { name: "Texas Secretary of State — current election and final ballot certification", url: OFFICIAL_2026_ELECTION_INFORMATION_SOURCE },
          { name: "Texas Secretary of State — independent filing decisions", url: "https://www.sos.state.tx.us/elections/laws/independent-declarations-2026.shtml" },
          ...(calendarSource ? [{ name: "Texas Secretary of State election calendar", url: calendarSource }] : []),
        ]}
        methodology="Ballot names are drawn from the Secretary of State's November 2026 general-election listing, not from all candidate filings. Printed choices and certified write-ins are distinguished, rejected independent filings are excluded, and duplicate public profiles are not linked when identity/status is ambiguous. The KTR race and candidate detail records retain their own publication, verification and source-date checks."
        lastVerified={`Official 2026 statewide ballot roster checked ${OFFICIAL_2026_STATEWIDE_ROSTER_CHECKED}. Election calendar last verified ${calendarVerified}. Individual KTR race and candidate profiles have separate verification timestamps and may be older.`}
        title="Statewide race directory sources"
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <ElectionSeoLink href="/elections/races?officeLevel=state" title="Browse statewide races" description="View published races for statewide Texas offices, including candidates and election dates." />
        <ElectionSeoLink href="/elections/candidates?officeLevel=state" title="Statewide candidates" description="Review verified profiles for candidates seeking statewide Texas office." />
        <ElectionSeoLink href="/elections/polls" title="Texas election polls" description="Compare available statewide polling, sample details, sponsors, and methodology." />
        <ElectionSeoLink href="/elections/results?officeLevel=state" title="Statewide election results" description="Follow vote totals, reporting status, winners, and certification." />
      </div>
    </ElectionLayout>
  );
}

function ElectionSeoLink({ href, title, description }: { href: string; title: string; description: string }) {
  return <a href={href} className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"><h2 className="text-xl font-bold text-foreground">{title}</h2><p className="mt-2 leading-7 text-muted-foreground">{description}</p><span className="mt-4 inline-block font-semibold text-primary">View election coverage →</span></a>;
}
