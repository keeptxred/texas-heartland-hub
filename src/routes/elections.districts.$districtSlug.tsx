import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

type DistrictType = "congressional" | "state_house" | "state_senate";
const TEXAS_SENATE_DISTRICTS = new Set([1, 2, 3, 4, 5, 9, 11, 13, 18, 19, 21, 22, 24, 26, 28, 31]);

interface DistrictInfo {
  type: DistrictType;
  number: number;
  name: string;
  browse: string;
  officeLevel: "federal" | "state";
}

function parseDistrictSlug(slug: string): DistrictInfo | null {
  const match = /^(congressional-district|texas-house-district|texas-senate-district)-(\d{1,3})$/.exec(slug);
  if (!match) return null;
  const number = Number(match[2]);
  if (match[1] === "congressional-district" && number >= 1 && number <= 38) {
    return { type: "congressional", number, name: `Texas Congressional District ${number}`, browse: "congressional_district", officeLevel: "federal" };
  }
  if (match[1] === "texas-house-district" && number >= 1 && number <= 150) {
    return { type: "state_house", number, name: `Texas House District ${number}`, browse: "state_house_district", officeLevel: "state" };
  }
  if (match[1] === "texas-senate-district" && TEXAS_SENATE_DISTRICTS.has(number)) {
    return { type: "state_senate", number, name: `Texas Senate District ${number}`, browse: "state_senate_district", officeLevel: "state" };
  }
  return null;
}

export const Route = createFileRoute("/elections/districts/$districtSlug")({
  head: ({ params }) => {
    const district = parseDistrictSlug(params.districtSlug);
    const canonicalUrl = `https://keeptxred.com/elections/districts/${params.districtSlug}`;
    const title = district
      ? `2026 ${district.name} Election | Candidates & Results`
      : "Texas Election District Not Found";
    const description = district
      ? `Follow the 2026 ${district.name} election, candidates, polling, forecast, and results.`
      : "The requested Texas election district URL is invalid.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: district ? "index, follow, max-image-preview:large" : "noindex, nofollow" },
        ...(district
          ? [
              { property: "og:title", content: title },
              { property: "og:description", content: description },
              { property: "og:url", content: canonicalUrl },
              { property: "og:type", content: "website" },
              { property: "og:site_name", content: "Keep TX Red" },
              { name: "twitter:card", content: "summary_large_image" },
            ]
          : []),
      ],
      links: district ? [{ rel: "canonical", href: canonicalUrl }] : [],
      scripts: district
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "@id": `${canonicalUrl}#webpage`,
                url: canonicalUrl,
                name: title,
                description,
                inLanguage: "en-US",
                isPartOf: {
                  "@type": "WebSite",
                  "@id": "https://keeptxred.com/#website",
                  name: "Keep TX Red",
                  url: "https://keeptxred.com",
                },
                about: {
                  "@type": "AdministrativeArea",
                  name: district.name,
                },
                breadcrumb: {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Election Central",
                      item: "https://keeptxred.com/elections/2026",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Texas election districts",
                      item: "https://keeptxred.com/elections/districts",
                    },
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: district.name,
                      item: canonicalUrl,
                    },
                  ],
                },
              }),
            },
          ]
        : [],
    };
  },
  component: TexasElectionDistrict,
});

function TexasElectionDistrict() {
  const { districtSlug } = Route.useParams();
  const district = parseDistrictSlug(districtSlug);
  if (!district) {
    return (
      <ElectionLayout title="Election district not found" description="Return to the district directory to choose a valid Texas election district.">
        <a href="/elections/districts" className="font-semibold text-red-700">Browse Texas election districts</a>
      </ElectionLayout>
    );
  }

  const canonicalUrl = `https://keeptxred.com/elections/districts/${districtSlug}`;
  const raceQuery = `/elections/races?browse=${district.browse}&area=${encodeURIComponent(district.name)}`;
  return (
    <ElectionLayout
      title={`2026 ${district.name} Election`}
      description={`Track published races, verified candidates, forecasts, and results for ${district.name}.`}
      canonicalUrl={canonicalUrl}
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.districts} />}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <DistrictLink href={raceQuery} title={`${district.name} races`} description="View the published election contests and election dates for this district." />
        <DistrictLink href={`/elections/candidates?officeLevel=${district.officeLevel}&q=${encodeURIComponent(district.name)}`} title="Candidates" description="Search verified candidate profiles connected to this district." />
        <DistrictLink href={`/elections/forecast?officeLevel=${district.officeLevel}`} title="Forecasts" description="Review available ratings and probabilities for covered races." />
        <DistrictLink href={`/elections/results?officeLevel=${district.officeLevel}`} title="Results" description="Follow reporting, vote totals, winners, and certification status." />
      </div>
    </ElectionLayout>
  );
}

function DistrictLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <a href={href} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-red-300">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 leading-7 text-slate-600">{description}</p>
      <span className="mt-4 inline-block font-semibold text-red-700">View coverage →</span>
    </a>
  );
}
