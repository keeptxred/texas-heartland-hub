import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

const URL = "https://keeptxred.com/elections/districts";

export const Route = createFileRoute("/elections/districts")({
  head: () => ({
    meta: [
      { title: "Texas Election Districts | Congressional, House & Senate" },
      {
        name: "description",
        content:
          "Find 2026 Texas election coverage by congressional district, Texas House district, or Texas Senate district.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Texas Election Districts" },
      {
        property: "og:description",
        content: "Browse Texas congressional and legislative election districts.",
      },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: TexasElectionDistricts,
});

function TexasElectionDistricts() {
  return (
    <ElectionLayout
      title="Texas Election Districts"
      description="Choose a congressional, Texas House, or Texas Senate district to find its 2026 races, candidates, forecasts, and results."
      canonicalUrl={URL}
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.districts} />}
      fullWidth
    >
      <div className="space-y-10">
        <DistrictGroup title="Texas congressional districts" prefix="congressional-district" count={38} />
        <DistrictGroup title="Texas Senate districts" prefix="texas-senate-district" count={31} />
        <DistrictGroup title="Texas House districts" prefix="texas-house-district" count={150} />
      </div>
    </ElectionLayout>
  );
}

function DistrictGroup({ title, prefix, count }: { title: string; prefix: string; count: number }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: count }, (_, index) => index + 1).map((number) => (
          <a
            key={number}
            href={`/elections/districts/${prefix}-${number}`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 hover:border-red-300 hover:text-red-700"
          >
            District {number}
          </a>
        ))}
      </div>
    </section>
  );
}
