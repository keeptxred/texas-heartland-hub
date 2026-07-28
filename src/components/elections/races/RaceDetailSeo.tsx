import { Helmet } from "react-helmet-async";
import { buildElectionSeo, buildElectionWebPageSchema, ELECTION_ROUTES } from "@/lib/elections";
import type { RaceDetail } from "@/types/elections";

export interface RaceDetailSeoProps {
  race: RaceDetail;
}

export function RaceDetailSeo({ race }: RaceDetailSeoProps) {
  const pathname = ELECTION_ROUTES.race(race.slug);
  const description =
    race.description ??
    `Follow verified candidates, polling, forecasts, and results for ${race.name} in Texas.`;
  const metadata = buildElectionSeo({
    title: race.name,
    description,
    pathname,
    pageType: "race",
    publishedTime: race.publishedAt ?? undefined,
    modifiedTime: race.updatedAt,
  });
  const webPageSchema = buildElectionWebPageSchema({
    name: race.name,
    description,
    pathname,
    pageType: "race",
    datePublished: race.publishedAt ?? undefined,
    dateModified: race.updatedAt,
    breadcrumbs: [
      { name: "Election Central", pathname: ELECTION_ROUTES.root },
      { name: "Election races", pathname: ELECTION_ROUTES.races },
      { name: race.name, pathname },
    ],
  });
  const electionEventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: race.name,
    description,
    startDate: race.electionDate,
    url: metadata.canonicalUrl,
    location: {
      "@type": "AdministrativeArea",
      name: race.districtName ?? race.stateCode,
    },
    about: {
      "@type": "GovernmentOffice",
      name: race.officeName,
    },
  };

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="robots" content={metadata.robots} />
      <link rel="canonical" href={metadata.canonicalUrl} />
      <meta property="og:type" content={metadata.openGraph.type} />
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta property="og:description" content={metadata.openGraph.description} />
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:site_name" content={metadata.openGraph.siteName} />
      <meta name="twitter:card" content={metadata.twitter.card} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      <meta property="article:modified_time" content={race.updatedAt} />
      {race.publishedAt ? (
        <meta property="article:published_time" content={race.publishedAt} />
      ) : null}
      <script type="application/ld+json">
        {JSON.stringify([webPageSchema, electionEventSchema]).replace(/</g, "\\u003c")}
      </script>
    </Helmet>
  );
}

export default RaceDetailSeo;
