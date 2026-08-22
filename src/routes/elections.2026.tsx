import { createFileRoute, Link } from "@tanstack/react-router";
import candidatesSnapshot from "@/data/elections/2026/candidates.json";
import racesSnapshot from "@/data/elections/2026/races.json";
import { ElectionMasterReference } from "@/components/elections/ElectionMasterReference";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionHomePage } from "@/pages/elections";

const ELECTION_CENTRAL_URL = "https://keeptxred.com/elections/2026";
const ELECTION_CENTRAL_TITLE =
  "2026 Texas Election Central | Races, Candidates, Polls & Results";
const ELECTION_CENTRAL_DESCRIPTION =
  "Track verified 2026 Texas election races, candidate profiles, polls, forecasts, results, key dates, and voting information in Keep TX Red Election Central.";

const PUBLISHED_RACES = racesSnapshot.filter(
  (race) => race.publicationStatus === "published" && race.verificationStatus === "verified",
);
const PUBLISHED_CANDIDATES = candidatesSnapshot.filter(
  (candidate) =>
    candidate.publicationStatus === "published" && candidate.verificationStatus === "verified",
);
const CANDIDATE_BY_ID = new Map(PUBLISHED_CANDIDATES.map((candidate) => [candidate.id, candidate]));

const PRIORITY_CANDIDATES = [
  ...new Map(
    PUBLISHED_RACES.slice(0, 10).flatMap((race) =>
      race.candidateIds.flatMap((candidateId) => {
        const candidate = CANDIDATE_BY_ID.get(candidateId);
        return candidate ? [[candidate.slug, candidate] as const] : [];
      }),
    ),
  ).values(),
].slice(0, 12);

function districtPathForRaceSlug(slug: string): { slug: string; label: string } | null {
  const patterns: Array<[RegExp, string, string]> = [
    [/^2026-us-house-district-(\d{1,2})$/, "congressional-district", "Congressional District"],
    [/^2026-texas-house-district-(\d{1,3})$/, "texas-house-district", "Texas House District"],
    [/^2026-texas-senate-district-(\d{1,2})$/, "texas-senate-district", "Texas Senate District"],
  ];
  for (const [pattern, prefix, label] of patterns) {
    const match = pattern.exec(slug);
    if (match) return { slug: `${prefix}-${match[1]}`, label: `${label} ${match[1]}` };
  }
  return null;
}

const PRIORITY_DISTRICTS = [
  ...new Map(
    PUBLISHED_RACES.flatMap((race) => {
      const district = districtPathForRaceSlug(race.slug);
      return district ? [[district.slug, district] as const] : [];
    }),
  ).values(),
].slice(0, 12);

const electionCentralSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${ELECTION_CENTRAL_URL}#webpage`,
  url: ELECTION_CENTRAL_URL,
  name: ELECTION_CENTRAL_TITLE,
  description: ELECTION_CENTRAL_DESCRIPTION,
  inLanguage: "en-US",
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://keeptxred.com/#website",
    url: "https://keeptxred.com",
    name: "Keep TX Red",
  },
  about: [
    { "@type": "Thing", name: "2026 Texas elections" },
    { "@type": "Thing", name: "Voting in Texas" },
  ],
  mainEntity: {
    "@type": "ItemList",
    name: "2026 Texas Election Central resources",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Texas election races", url: "https://keeptxred.com/elections/races" },
      { "@type": "ListItem", position: 2, name: "Texas election candidates", url: "https://keeptxred.com/elections/candidates" },
      { "@type": "ListItem", position: 3, name: "Texas election polls", url: "https://keeptxred.com/elections/polls" },
      { "@type": "ListItem", position: 4, name: "Texas election forecasts", url: "https://keeptxred.com/elections/forecast" },
      { "@type": "ListItem", position: 5, name: "Texas election results", url: "https://keeptxred.com/elections/results" },
      { "@type": "ListItem", position: 6, name: "Texas voting information", url: "https://keeptxred.com/elections/voting" },
      { "@type": "ListItem", position: 7, name: "Texas statewide elections", url: "https://keeptxred.com/elections/statewide" },
      { "@type": "ListItem", position: 8, name: "Texas legislative elections", url: "https://keeptxred.com/elections/legislative" },
      { "@type": "ListItem", position: 9, name: "Texas election districts", url: "https://keeptxred.com/elections/districts" },
    ],
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Keep TX Red", item: "https://keeptxred.com" },
      { "@type": "ListItem", position: 2, name: "2026 Texas Election Central", item: ELECTION_CENTRAL_URL },
    ],
  },
};

export const Route = createFileRoute("/elections/2026")({
  head: () => ({
    meta: [
      { title: ELECTION_CENTRAL_TITLE },
      { name: "description", content: ELECTION_CENTRAL_DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: ELECTION_CENTRAL_TITLE },
      { property: "og:description", content: ELECTION_CENTRAL_DESCRIPTION },
      { property: "og:url", content: ELECTION_CENTRAL_URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "2026 Texas Election Central" },
      { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ELECTION_CENTRAL_TITLE },
      { name: "twitter:description", content: ELECTION_CENTRAL_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: ELECTION_CENTRAL_URL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(electionCentralSchema) }],
  }),
  component: ElectionCentral2026Route,
});

function ElectionCentral2026Route() {
  return (
    <ElectionRepositoryProvider>
      <ElectionHomePage />
      <ElectionMasterReference />
      <PriorityElectionLinks />
    </ElectionRepositoryProvider>
  );
}

function PriorityElectionLinks() {
  return (
    <section className="border-t border-border bg-background" aria-labelledby="priority-election-pages">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Explore verified election pages</p>
          <h2 id="priority-election-pages" className="mt-2 font-display text-3xl leading-none tracking-tight text-foreground">Candidate and district pages</h2>
          <p className="mt-3 leading-7 text-muted-foreground">These links point directly to published, verified Election Central records so voters and search engines can reach important detail pages without relying on filters or search forms.</p>
        </div>

        {PRIORITY_CANDIDATES.length ? (
          <div className="mt-8">
            <div className="flex items-end justify-between gap-4"><h3 className="text-lg font-bold text-foreground">Verified candidate profiles</h3><Link to="/elections/candidates" className="text-sm font-semibold text-primary hover:underline">Browse all candidates →</Link></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{PRIORITY_CANDIDATES.map((candidate) => <Link key={candidate.id} to="/elections/candidates/$candidateSlug" params={{ candidateSlug: candidate.slug }} className="rounded-lg border border-border bg-muted/30 px-4 py-3 font-semibold text-foreground hover:border-primary hover:text-primary">{candidate.fullName}</Link>)}</div>
          </div>
        ) : null}

        {PRIORITY_DISTRICTS.length ? (
          <div className="mt-8">
            <div className="flex items-end justify-between gap-4"><h3 className="text-lg font-bold text-foreground">Active 2026 district pages</h3><Link to="/elections/districts" className="text-sm font-semibold text-primary hover:underline">Browse all districts →</Link></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{PRIORITY_DISTRICTS.map((district) => <Link key={district.slug} to="/elections/districts/$districtSlug" params={{ districtSlug: district.slug }} className="rounded-lg border border-border bg-muted/30 px-4 py-3 font-semibold text-foreground hover:border-primary hover:text-primary">{district.label}</Link>)}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
