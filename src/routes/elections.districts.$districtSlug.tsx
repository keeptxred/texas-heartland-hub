import { createFileRoute, Link } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import candidates from "@/data/elections/2026/candidates.json";
import races from "@/data/elections/2026/races.json";
import { ELECTION_ROUTES } from "@/lib/elections";
import { RelatedAuthorityContent } from "@/components/authority/RelatedAuthorityContent";
import { getRelatedAuthorityContent } from "@/lib/authority-relationships";

type DistrictType = "congressional" | "state_house" | "state_senate";
const TEXAS_SENATE_DISTRICTS = new Set([1, 2, 3, 4, 5, 9, 11, 13, 18, 19, 21, 22, 24, 26, 28, 31]);

interface DistrictInfo {
  type: DistrictType;
  number: number;
  name: string;
  browse: string;
  officeLevel: "federal" | "state";
  raceSlug: string;
}

function parseDistrictSlug(slug: string): DistrictInfo | null {
  const match = /^(congressional-district|texas-house-district|texas-senate-district)-(\d{1,3})$/.exec(slug);
  if (!match) return null;
  const number = Number(match[2]);
  if (match[1] === "congressional-district" && number >= 1 && number <= 38) {
    return { type: "congressional", number, name: `Texas Congressional District ${number}`, browse: "congressional_district", officeLevel: "federal", raceSlug: `2026-us-house-district-${number}` };
  }
  if (match[1] === "texas-house-district" && number >= 1 && number <= 150) {
    return { type: "state_house", number, name: `Texas House District ${number}`, browse: "state_house_district", officeLevel: "state", raceSlug: `2026-texas-house-district-${number}` };
  }
  if (match[1] === "texas-senate-district" && TEXAS_SENATE_DISTRICTS.has(number)) {
    return { type: "state_senate", number, name: `Texas Senate District ${number}`, browse: "state_senate_district", officeLevel: "state", raceSlug: `2026-texas-senate-district-${number}` };
  }
  return null;
}

function getPublishedRace(raceSlug: string) {
  return races.find(
    (race) =>
      race.slug === raceSlug &&
      race.publicationStatus === "published" &&
      race.verificationStatus === "verified",
  );
}

function formatElectionDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export const Route = createFileRoute("/elections/districts/$districtSlug")({
  loader: ({ params }) => getRelatedAuthorityContent("district", params.districtSlug, 12).catch(() => []),
  head: ({ params }) => {
    const district = parseDistrictSlug(params.districtSlug);
    const race = district ? getPublishedRace(district.raceSlug) : null;
    const raceCandidates = race
      ? candidates.filter(
          (candidate) =>
            race.candidateIds.includes(candidate.id) &&
            candidate.publicationStatus === "published" &&
            candidate.verificationStatus === "verified",
        )
      : [];
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
      { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "2026 Texas Election Central" },
      { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
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
                "@graph": [
                  {
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
                    about: { "@id": `${canonicalUrl}#district` },
                    ...(raceCandidates.length
                      ? { mainEntity: { "@id": `${canonicalUrl}#candidates` } }
                      : {}),
                  },
                  {
                    "@type": "AdministrativeArea",
                    "@id": `${canonicalUrl}#district`,
                    name: district.name,
                    containedInPlace: {
                      "@type": "State",
                      name: "Texas",
                    },
                  },
                  ...(race
                    ? [
                        {
                          "@type": "Event",
                          "@id": `${canonicalUrl}#election`,
                          name: race.name,
                          startDate: race.electionDate,
                          eventStatus: "https://schema.org/EventScheduled",
                          location: { "@id": `${canonicalUrl}#district` },
                          url: `https://keeptxred.com/elections/races/${race.slug}`,
                        },
                      ]
                    : []),
                  ...(raceCandidates.length
                    ? [
                        {
                          "@type": "ItemList",
                          "@id": `${canonicalUrl}#candidates`,
                          name: `${district.name} candidates`,
                          numberOfItems: raceCandidates.length,
                          itemListElement: raceCandidates.map((candidate, index) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            url: `https://keeptxred.com/elections/candidates/${candidate.slug}`,
                            name: candidate.fullName,
                          })),
                        },
                      ]
                    : []),
                  {
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
                ],
              }).replace(/</g, "\\u003c"),
            },
          ]
        : [],
    };
  },
  component: TexasElectionDistrict,
});

function TexasElectionDistrict() {
  const { districtSlug } = Route.useParams();
  const scoredRelated = Route.useLoaderData();
  const district = parseDistrictSlug(districtSlug);
  if (!district) {
    return (
      <ElectionLayout title="Election district not found" description="Return to the district directory to choose a valid Texas election district." indexable={false}>
        <a href="/elections/districts" className="font-semibold text-red-700">Browse Texas election districts</a>
      </ElectionLayout>
    );
  }

  const canonicalUrl = `https://keeptxred.com/elections/districts/${districtSlug}`;
  const race = getPublishedRace(district.raceSlug);
  const raceCandidates = race
    ? candidates.filter(
        (candidate) =>
          race.candidateIds.includes(candidate.id) &&
          candidate.publicationStatus === "published" &&
          candidate.verificationStatus === "verified",
      )
    : [];
  return (
    <ElectionLayout
      title={`2026 ${district.name} Election`}
      description={`Track published races, verified candidates, forecasts, and results for ${district.name}.`}
      canonicalUrl={canonicalUrl}
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.districts} />}
    >
      <div className="space-y-10">
        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <DistrictFact label="District" value={district.name} />
          <DistrictFact label="Office level" value={district.officeLevel === "federal" ? "Federal" : "Texas state"} />
          <DistrictFact label="Election date" value={race ? formatElectionDate(race.electionDate) : "Not published"} />
          <DistrictFact label="Term" value={race ? `${race.termLengthYears} years` : "Not published"} />
        </section>

        <section aria-labelledby="district-race-heading">
          <h2 id="district-race-heading" className="text-2xl font-bold text-slate-950">
            2026 district race
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            This page connects the official district geography to its verified 2026 race,
            candidate profiles, voting dates, forecasts, and results.
          </p>
          {race ? (
            <Link
              to="/elections/races/$raceSlug"
              params={{ raceSlug: race.slug }}
              className="mt-5 block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-red-300"
            >
              <h3 className="text-xl font-bold text-slate-950">{race.name}</h3>
              <p className="mt-2 text-slate-600">
                {raceCandidates.length} verified candidate{raceCandidates.length === 1 ? "" : "s"} ·
                Election Day {formatElectionDate(race.electionDate)}
              </p>
              <span className="mt-4 inline-block font-semibold text-red-700">View race overview →</span>
            </Link>
          ) : (
            <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
              A verified 2026 race record has not been published for this district.
            </p>
          )}
        </section>

        {raceCandidates.length ? (
          <section aria-labelledby="district-candidates-heading">
            <h2 id="district-candidates-heading" className="text-2xl font-bold text-slate-950">
              Verified candidates
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {raceCandidates.map((candidate) => (
                <Link
                  key={candidate.id}
                  to="/elections/candidates/$candidateSlug"
                  params={{ candidateSlug: candidate.slug }}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-red-300"
                >
                  <h3 className="text-lg font-bold text-slate-950">{candidate.fullName}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {candidate.partyLabel} · {candidate.status.replaceAll("_", " ")}
                  </p>
                  <span className="mt-3 inline-block text-sm font-semibold text-red-700">
                    View candidate profile →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {race?.counties.length ? (
          <section aria-labelledby="district-counties-heading">
            <h2 id="district-counties-heading" className="text-2xl font-bold text-slate-950">
              Counties in this district
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              District boundaries may include all or part of a county. Confirm your exact ballot
              with your county election office.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {race.counties.map((county) => (
                <a
                  key={county.id}
                  href={`https://keeptxred.com/explore/county/${county.slug}`}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-red-300 hover:text-red-700"
                >
                  {county.name}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="district-authority-heading" className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 id="district-authority-heading" className="text-2xl font-bold text-slate-950">
            Official sources and district geography
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            Race scope is verified against the Texas Secretary of State. District-to-county
            geography uses the U.S. Census Bureau TIGERweb legislative boundary service. County
            coverage does not replace an address-specific official sample ballot.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {race ? (
              <>
                <a href={race.source.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-red-700 hover:underline">
                  Texas Secretary of State race source
                </a>
                {race.geographySource ? <a href={race.geographySource.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-red-700 hover:underline">
                  Census district geography source
                </a> : null}
                {race.countyElectionLinkSource ? <a href={race.countyElectionLinkSource.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-red-700 hover:underline">
                  Official county election directory
                </a> : null}
              </>
            ) : null}
          </div>
        </section>

        <RelatedAuthorityContent items={scoredRelated} title="Related bills, representatives, elections, and news" />

        <section aria-labelledby="district-resources-heading">
          <h2 id="district-resources-heading" className="text-2xl font-bold text-slate-950">
            Related election resources
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <DistrictLink href="/register-to-vote" title="Register to vote" description="Review Texas voter-registration requirements and deadlines." />
            <DistrictLink href="/voting-locations" title="Voting locations" description="Find official local voting-location resources." />
            <DistrictLink href="/find-representative" title="Find your representatives" description="Look up the officials connected to your address." />
            <DistrictLink href="/county-elections" title="County elections" description="Open county election offices, ballot resources, and local guidance." />
            <DistrictLink href={`/elections/forecast?officeLevel=${district.officeLevel}`} title="Forecasts" description="Review available ratings and probabilities for covered races." />
            <DistrictLink href={`/elections/results?officeLevel=${district.officeLevel}`} title="Results" description="Follow reporting, vote totals, winners, and certification status." />
          </div>
        </section>
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

function DistrictFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-bold text-slate-950">{value}</dd>
    </div>
  );
}
