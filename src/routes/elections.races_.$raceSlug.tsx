import { createFileRoute } from "@tanstack/react-router";
import races from "@/data/elections/2026/races.json";
import {
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
  RaceCandidateSection,
  RaceAuthoritySection,
  RaceDetailHeader,
  RaceDetailSeo,
  RaceForecastSection,
  RaceInternalLinks,
  RacePollingSection,
  RaceResultsSection,
} from "@/components/elections";
import {
  useCandidatesByRace,
  useElectionForecast,
  useElectionRace,
  useForecastByRace,
  usePollsByRace,
  useRelatedElectionRaces,
  useResultByRace,
} from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { electionSlugs, isElectionSlug } from "@/types/elections";

export const Route = createFileRoute("/elections/races_/$raceSlug")({
  head: ({ params }) => {
    const record = races.find(
      (item) =>
        item.slug === params.raceSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );
    const validSlug = isElectionSlug(params.raceSlug);
    const indexable = validSlug && Boolean(record);
    const canonicalUrl = `https://keeptxred.com/elections/races/${params.raceSlug}`;
    const recordName =
      record && "fullName" in record && typeof record.fullName === "string"
        ? record.fullName
        : record && "name" in record && typeof record.name === "string"
          ? record.name
          : "Texas Election Race";
    const recordDescription =
      record && "biography" in record && typeof record.biography === "string" && record.biography
        ? record.biography
        : record && "description" in record && typeof record.description === "string" && record.description
          ? record.description
          : record
            ? `Follow verified candidates, election dates, polling, forecasts, results, district geography, and official sources for ${recordName}.`
            : "View verified details for this Texas election race.";
    const title = indexable
      ? `${recordName} | KeepTXRed Election Central`
      : "Election race not found | KeepTXRed";

    return {
      meta: [
        { title },
        { name: "description", content: recordDescription },
        {
          name: "robots",
          content: indexable ? "index, follow, max-image-preview:large" : "noindex, follow",
        },
        ...(indexable
          ? [
              { property: "og:title", content: title },
              { property: "og:description", content: recordDescription },
              { property: "og:url", content: canonicalUrl },
              { property: "og:type", content: "website" },
              { property: "og:site_name", content: "Keep TX Red" },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:title", content: title },
              { name: "twitter:description", content: recordDescription },
              { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { property: "og:image:alt", content: "2026 Texas Election Central" },
              { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
            ]
          : []),
      ],
      links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : [],
      scripts: indexable
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Event",
                name: recordName,
                description: recordDescription,
                url: canonicalUrl,
                startDate:
                  record && "electionDate" in record && typeof record.electionDate === "string"
                    ? record.electionDate
                    : "2026-11-03",
                eventStatus: "https://schema.org/EventScheduled",
                eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                location: {
                  "@type": "AdministrativeArea",
                  name:
                    record && "districtName" in record && typeof record.districtName === "string"
                      ? record.districtName
                      : "Texas",
                },
                organizer: {
                  "@type": "GovernmentOrganization",
                  name: "Texas election authorities",
                },
              }).replace(/</g, "\\u003c"),
            },
          ]
        : [],
    };
  },
  component: ElectionRaceDetailRoute,
});

function ElectionRaceDetailRoute() {
  const { raceSlug } = Route.useParams();
  const validSlug = isElectionSlug(raceSlug);
  const indexable =
    validSlug &&
    races.some(
      (item) =>
        item.slug === raceSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );

  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Race"
        description="Verified race details from KeepTXRed Election Central."
        indexable={indexable}
        canonicalUrl={indexable ? `https://keeptxred.com/elections/races/${raceSlug}` : undefined}
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.races} />}
      >
        {indexable ? (
          <ElectionRaceDetailData raceSlug={raceSlug} />
        ) : (
          <ElectionErrorState
            title="Invalid election race URL"
            message="This race URL is not valid. Return to the race list to browse published Texas election races."
          />
        )}
      </ElectionLayout>
    </ElectionRepositoryProvider>
  );
}

function ElectionRaceDetailData({ raceSlug }: { raceSlug: string }) {
  const race = useElectionRace({ slug: electionSlugs.race(raceSlug) });
  const candidates = useCandidatesByRace(race.data?.id);
  const polls = usePollsByRace(race.data?.id);
  const forecast = useForecastByRace(race.data?.id);
  const forecastDetail = useElectionForecast(
    forecast.data?.id ? { id: forecast.data.id } : undefined,
  );
  const result = useResultByRace(race.data?.id);
  const relatedRaces = useRelatedElectionRaces(race.data?.relatedRaceIds ?? []);
  const error =
    race.error ??
    candidates.error ??
    polls.error ??
    forecast.error ??
    forecastDetail.error ??
    relatedRaces.error ??
    result.error;
  const isLoading =
    race.isLoading ||
    candidates.isLoading ||
    polls.isLoading ||
    forecast.isLoading ||
    forecastDetail.isLoading ||
    relatedRaces.isLoading ||
    result.isLoading;

  const handleRetry = () => {
    void race.refetch();
    void candidates.refetch();
    void polls.refetch();
    void forecast.refetch();
    void forecastDetail.refetch();
    void relatedRaces.refetch();
    void result.refetch();
  };

  if (isLoading) {
    return <ElectionLoading variant="detail" label="Loading Texas election race details" />;
  }

  if (error) {
    return (
      <ElectionErrorState
        kind="service"
        title="Election race details could not be loaded"
        technicalMessage={error.message}
        retryAction={{ label: "Try again", onClick: handleRetry }}
      />
    );
  }

  if (race.isMissing || !race.data) {
    return (
      <ElectionErrorState
        kind="not_found"
        title="Election race not found"
        message="This race is not published or is no longer available."
      />
    );
  }

  return (
    <div className="space-y-10">
      <RaceDetailSeo race={race.data} />
      <RaceDetailHeader race={race.data} />
      <RaceAuthoritySection race={race.data} />
      <RaceCandidateSection race={race.data} candidates={candidates.data ?? []} />
      <RacePollingSection
        race={race.data}
        polls={polls.data?.items ?? []}
        hasStaleData={polls.hasStaleData}
      />
      <RaceForecastSection forecast={forecastDetail.data ?? null} />
      <RaceResultsSection result={result.data ?? null} isPreElection={result.isPreElection} />
      <RaceInternalLinks candidates={candidates.data ?? []} relatedRaces={relatedRaces.data} />
    </div>
  );
}
