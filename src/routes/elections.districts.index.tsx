import { createFileRoute, Link } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

const URL = "https://keeptxred.com/elections/districts";
const TEXAS_SENATE_DISTRICTS = [1, 2, 3, 4, 5, 9, 11, 13, 18, 19, 21, 22, 24, 26, 28, 31] as const;

export const Route = createFileRoute("/elections/districts/")({
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
      {
        property: "og:image",
        content: "https://keeptxred.com/images/elections/election-central-social.jpg",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "2026 Texas Election Central" },
      {
        name: "twitter:image",
        content: "https://keeptxred.com/images/elections/election-central-social.jpg",
      },
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
      <div className="relative z-10 space-y-10 pointer-events-auto">
        <DistrictGroup
          title="Texas congressional districts"
          prefix="congressional-district"
          count={38}
        />
        <DistrictGroup
          title="Texas Senate districts on the 2026 ballot"
          prefix="texas-senate-district"
          districts={TEXAS_SENATE_DISTRICTS}
        />
        <DistrictGroup title="Texas House districts" prefix="texas-house-district" count={150} />
      </div>
    </ElectionLayout>
  );
}

function DistrictGroup({
  title,
  prefix,
  count,
  districts,
}: {
  title: string;
  prefix: string;
  count?: number;
  districts?: readonly number[];
}) {
  const districtNumbers = districts ?? Array.from({ length: count ?? 0 }, (_, index) => index + 1);
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {districtNumbers.map((number) => {
          const districtSlug = `${prefix}-${number}`;
          return (
            <Link
              key={number}
              to="/elections/districts/$districtSlug"
              params={{ districtSlug }}
              aria-label={`Open District ${number} election page`}
              className="relative z-10 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 pointer-events-auto hover:border-red-300 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
            >
              District {number}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
