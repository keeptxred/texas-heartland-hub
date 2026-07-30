import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

const URL = "https://keeptxred.com/elections/legislative";

export const Route = createFileRoute("/elections/legislative")({
  head: () => ({
    meta: [
      { title: "2026 Texas Legislative Elections | House & Senate Races" },
      {
        name: "description",
        content:
          "Track 2026 Texas House and Texas Senate election races, legislative candidates, district contests, forecasts, and results.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "2026 Texas Legislative Elections" },
      {
        property: "og:description",
        content: "Browse Texas House and Senate races, candidates, forecasts, and results by legislative district.",
      },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: TexasLegislativeElections,
});

function TexasLegislativeElections() {
  return (
    <ElectionLayout
      title="2026 Texas Legislative Elections"
      description="Browse Texas House and Texas Senate contests by district, with verified candidates, race ratings, forecasts, and results."
      canonicalUrl={URL}
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.legislative} />}
    >
      <section className="mb-10 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-slate-950">Find your 2026 legislative district race</h2>
        <p className="mt-2 leading-7 text-slate-600">
          Browse every Texas House district, each Texas Senate district on the 2026 ballot, and all
          38 congressional districts from the district directory.
        </p>
        <a
          href="/elections/districts"
          className="mt-4 inline-flex rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
        >
          Browse Texas election districts
        </a>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        <ElectionSeoLink
          href="/elections/races?browse=state_house_district"
          title="Texas House races"
          description="Browse published Texas House contests and select a district to review its candidates and status."
        />
        <ElectionSeoLink
          href="/elections/races?browse=state_senate_district"
          title="Texas Senate races"
          description="Browse published Texas Senate contests by district."
        />
        <ElectionSeoLink
          href="/elections/candidates?officeLevel=state"
          title="Legislative candidates"
          description="Search verified candidate profiles for state-level Texas races."
        />
        <ElectionSeoLink
          href="/elections/forecast?officeLevel=state"
          title="Legislative forecasts"
          description="Review ratings and probabilities for covered Texas legislative races."
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
