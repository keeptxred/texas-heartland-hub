import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

const URL = "https://keeptxred.com/elections/statewide";

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
