import { createFileRoute, Link } from "@tanstack/react-router";
import racesSnapshot from "@/data/elections/2026/races.json";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

const URL = "https://keeptxred.com/elections/districts";
const WHO_REPRESENTS_ME = "https://wrm.capitol.texas.gov/home";
const REDISTRICTING = "https://redistricting.capitol.texas.gov/";
const TEXAS_SENATE_DISTRICTS = [1, 2, 3, 4, 5, 9, 11, 13, 18, 19, 21, 22, 24, 26, 28, 31] as const;
const VERIFIED_RACES = racesSnapshot.filter((race) => race.publicationStatus === "published" && race.verificationStatus === "verified");

type VerifiedRace = (typeof VERIFIED_RACES)[number];

function raceForDistrict(jurisdictionType: string, districtNumber: number): VerifiedRace | null {
  const normalizedDistrictNumber = String(districtNumber);
  return VERIFIED_RACES.find((race) => race.jurisdictionType === jurisdictionType && race.districtNumber === normalizedDistrictNumber) ?? null;
}

export const Route = createFileRoute("/elections/districts/")({
  head: () => ({
    meta: [
      { title: "Texas Election Districts & 2026 Race Lookup | Congressional, House & Senate" },
      {
        name: "description",
        content:
          "Find Texas congressional, Texas House, and Texas Senate district pages and jump directly to published, verified 2026 race records when available.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Texas Election Districts & 2026 Race Lookup" },
      {
        property: "og:description",
        content: "Browse Texas congressional and legislative districts and their verified 2026 race records.",
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
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Texas Election Districts and 2026 Race Lookup",
        url: URL,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: VERIFIED_RACES.filter((race) => ["congressional_district", "state_house_district", "state_senate_district"].includes(race.jurisdictionType)).length,
          itemListElement: VERIFIED_RACES.filter((race) => ["congressional_district", "state_house_district", "state_senate_district"].includes(race.jurisdictionType)).map((race, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: race.name,
            url: `https://keeptxred.com/elections/races/${race.slug}`,
          })),
        },
      }),
    }],
  }),
  component: TexasElectionDistricts,
});

function TexasElectionDistricts() {
  return (
    <ElectionLayout
      title="Texas Election Districts"
      description="Choose a congressional, Texas House, or Texas Senate district. Each district page connects to its published, verified 2026 race when Election Central has one."
      canonicalUrl={URL}
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.districts} />}
      fullWidth
    >
      <div className="relative z-10 space-y-10 pointer-events-auto">
        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">District pages are research references, not address-specific ballot assignments. Use the official Texas Legislature <a href={WHO_REPRESENTS_ME} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Who Represents Me?</a> lookup and your county election office for an address-specific ballot.</aside>
        <DistrictGroup
          title="Texas congressional districts"
          prefix="congressional-district"
          jurisdictionType="congressional_district"
          count={38}
        />
        <DistrictGroup
          title="Texas Senate districts on the 2026 ballot"
          prefix="texas-senate-district"
          jurisdictionType="state_senate_district"
          districts={TEXAS_SENATE_DISTRICTS}
        />
        <DistrictGroup title="Texas House districts" prefix="texas-house-district" jurisdictionType="state_house_district" count={150} />
        <CitationTrustPanel
          sources={[
            { name: "Texas Legislature — Who Represents Me?", url: WHO_REPRESENTS_ME, note: "Official address-level representation lookup." },
            { name: "Texas Legislative Council — Redistricting", url: REDISTRICTING, note: "Official district-map and redistricting reference." },
          ]}
          methodology="The directory preserves every district navigation page while attaching a race link only when Election Central has a published, verified 2026 race record whose jurisdiction type and district number match that district. Missing race links are left missing rather than inferred."
          lastVerified="Race relationships are computed from the current published+verified 2026 Election Central snapshot; address-specific representation must be rechecked with the official lookup."
          title="District and race lookup sources"
        />
      </div>
    </ElectionLayout>
  );
}

function DistrictGroup({
  title,
  prefix,
  jurisdictionType,
  count,
  districts,
}: {
  title: string;
  prefix: string;
  jurisdictionType: string;
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
          const race = raceForDistrict(jurisdictionType, number);
          return (
            <div key={number} className="rounded-lg border border-slate-200 bg-white p-3">
              <Link
                to="/elections/districts/$districtSlug"
                params={{ districtSlug }}
                aria-label={`Open District ${number} election page`}
                className="relative z-10 block cursor-pointer font-semibold text-slate-800 pointer-events-auto hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
              >
                District {number}
              </Link>
              {race ? <a href={`/elections/races/${race.slug}`} className="mt-2 block text-xs font-bold text-red-700 hover:underline">2026 race →</a> : <span className="mt-2 block text-xs text-slate-500">No verified 2026 race linked</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}