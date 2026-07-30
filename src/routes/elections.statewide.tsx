import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
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

export const Route = createFileRoute("/elections/statewide")({
  head: () => ({
    meta: [
      { title: "2026 Texas Statewide Elections | Candidates, Polls & Results" },
      {
        name: "description",
        content:
          "Track 2026 Texas statewide election races, candidates, polling, forecasts, and results for offices elected across Texas.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "2026 Texas Statewide Elections" },
      {
        property: "og:description",
        content: "Browse verified statewide Texas races and follow their candidates, polls, forecasts, and results.",
      },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "2026 Texas statewide election races",
          url: URL,
          numberOfItems: STATEWIDE_RACES.length,
          itemListElement: STATEWIDE_RACES.map((race, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: race.name,
            url: `https://keeptxred.com/elections/races/${race.slug}`,
          })),
        }),
      },
    ],
  }),
  component: TexasStatewideElections,
});

function TexasStatewideElections() {
  return (
    <ElectionLayout
      title="2026 Texas Statewide Elections"
      description="Find verified statewide Texas races and follow candidate profiles, polling, forecasts, and election results."
      canonicalUrl={URL}
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.statewide} />}
    >
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-950">2026 statewide races</h2>
        <p className="mt-2 max-w-3xl leading-7 text-slate-600">
          These offices are elected by voters across Texas. Choose a race for its verified candidates,
          polling, forecast coverage, and results.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STATEWIDE_RACES.map((race) => (
            <a
              key={race.slug}
              href={`/elections/races/${race.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 hover:border-red-300 hover:text-red-700"
            >
              {race.name}
            </a>
          ))}
        </div>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        <ElectionSeoLink
          href="/elections/races?officeLevel=state"
          title="Browse statewide races"
          description="View published races for statewide Texas offices, including candidates and election dates."
        />
        <ElectionSeoLink
          href="/elections/candidates?officeLevel=state"
          title="Statewide candidates"
          description="Review verified profiles for candidates seeking statewide Texas office."
        />
        <ElectionSeoLink
          href="/elections/polls"
          title="Texas election polls"
          description="Compare available statewide polling, sample details, sponsors, and methodology."
        />
        <ElectionSeoLink
          href="/elections/results?officeLevel=state"
          title="Statewide election results"
          description="Follow vote totals, reporting status, winners, and certification."
        />
      </div>
    </ElectionLayout>
  );
}

function ElectionSeoLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <a href={href} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-red-300 hover:shadow-md">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 leading-7 text-slate-600">{description}</p>
      <span className="mt-4 inline-block font-semibold text-red-700">View election coverage →</span>
    </a>
  );
}
