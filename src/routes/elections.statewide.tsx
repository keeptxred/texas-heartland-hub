import { createFileRoute } from "@tanstack/react-router";
import candidatesSnapshot from "@/data/elections/2026/candidates.json";
import racesSnapshot from "@/data/elections/2026/races.json";
import { CitationTrustPanel, ElectionLayout, ElectionNavigation } from "@/components/elections";
import { TEXAS_ELECTIONS } from "@/lib/election-calendar";
import { ELECTION_ROUTES } from "@/lib/elections";

const URL = "https://keeptxred.com/elections/statewide";
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
  const candidates = race?.candidateIds.map((id) => CANDIDATE_BY_ID.get(id)).filter((candidate): candidate is (typeof PUBLISHED_CANDIDATES)[number] => Boolean(candidate)) ?? [];
  return { ...definition, race, candidates };
});
const verifiedStatewideCount = STATEWIDE_RECORDS.filter((item) => item.race).length;
const calendar2026 = TEXAS_ELECTIONS.filter((item) => item.date.startsWith("2026-"));
const calendarSource = calendar2026.find((item) => item.source)?.source;
const calendarVerified = calendar2026.map((item) => item.lastUpdated).sort().at(-1) ?? "Verification pending";

export const Route = createFileRoute("/elections/statewide")({
  head: () => ({
    meta: [
      { title: "2026 Texas Statewide Elections | Candidates, Polls & Results" },
      { name: "description", content: "Track verified 2026 Texas statewide election races and candidates for offices elected across Texas, with links to polling, forecasts and results." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "2026 Texas Statewide Elections" },
      { property: "og:description", content: "Browse verified statewide Texas races and their verified candidate profiles." },
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
      title="2026 Texas Statewide Elections"
      description="Find verified statewide Texas races and the verified candidate profiles attached to each published Election Central record."
      canonicalUrl={URL}
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.statewide} />}
    >
      <section className="mb-10">
        <p className="text-sm font-semibold text-red-700">{verifiedStatewideCount} of {STATEWIDE_RACES.length} expected statewide race records are currently published and verified.</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">2026 statewide races and candidates</h2>
        <p className="mt-2 max-w-3xl leading-7 text-slate-600">These offices are elected statewide. Candidate names below come only from published, verified candidate records attached to the corresponding verified race record.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATEWIDE_RECORDS.map((item) => (
            <article key={item.slug} className="rounded-xl border border-slate-200 bg-white p-5">
              <a href={`/elections/races/${item.slug}`} className="text-lg font-bold text-slate-950 hover:text-red-700 hover:underline">{item.name}</a>
              {item.race ? (
                item.candidates.length ? <ul className="mt-3 space-y-2">{item.candidates.map((candidate) => <li key={candidate.id}><a href={`/elections/candidates/${candidate.slug}`} className="text-sm font-semibold text-red-700 hover:underline">{candidate.fullName} →</a></li>)}</ul>
                : <p className="mt-3 text-sm text-slate-500">Race verified; no published verified candidate profiles are attached yet.</p>
              ) : <p className="mt-3 text-sm text-amber-700">Expected 2026 office; verified race record not yet published.</p>}
            </article>
          ))}
        </div>
      </section>

      <CitationTrustPanel
        sources={calendarSource ? [{ name: "Texas Secretary of State election calendar", url: calendarSource }] : [{ name: "Texas election authority record" }]}
        methodology="The statewide office list defines the expected 2026 statewide contests. A race is counted as live only when its Election Central record is both published and verified, and candidate names are shown only when their attached candidate records are also published and verified."
        lastVerified={`Election calendar last verified ${calendarVerified}. Individual race and candidate records maintain their own verification timestamps and sources.`}
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
  return <a href={href} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-red-300 hover:shadow-md"><h2 className="text-xl font-bold text-slate-950">{title}</h2><p className="mt-2 leading-7 text-slate-600">{description}</p><span className="mt-4 inline-block font-semibold text-red-700">View election coverage →</span></a>;
}
