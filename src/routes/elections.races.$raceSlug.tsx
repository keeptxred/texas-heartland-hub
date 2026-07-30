import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
  RaceCandidateSection,
  RaceDetailHeader,
  RaceDetailSeo,
  RaceForecastSection,
  RaceInternalLinks,
  RacePollingSection,
  RaceResultsSection,
} from "@/components/elections";
import racesJson from "@/data/elections/2026/races.json";
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
import { findRaceStoredSlug, raceSeoSlug } from "@/lib/elections/seoSlugs";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { electionSlugs, isElectionSlug } from "@/types/elections";

const races = racesJson as readonly { slug: string }[];

export const Route = createFileRoute("/elections/races/$raceSlug")({
  beforeLoad: ({ params }) => {
    const storedSlug = findRaceStoredSlug(params.raceSlug, races);
    if (!storedSlug) return;

    const canonicalSlug = raceSeoSlug(storedSlug);
    if (params.raceSlug !== canonicalSlug) {
      throw redirect({
        to: "/elections/races/$raceSlug",
        params: { raceSlug: canonicalSlug },
        replace: true,
        statusCode: 301,
      });
    }
  },
  head: ({ params }) => {
    const canonicalSlug = raceSeoSlug(params.raceSlug);
    const validSlug = isElectionSlug(canonicalSlug);
    const canonicalUrl = `https://keeptxred.com/elections/races/${canonicalSlug}`;

    return {
      meta: [
        {
          title: validSlug
            ? "Texas Election Race | KeepTXRed Election Central"
            : "Invalid Election Race | KeepTXRed Election Central",
        },
        {
          name: "description",
          content: validSlug
            ? "View verified details for this Texas election race."
            : "The requested Texas election race URL is invalid.",
        },
        ...(validSlug ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
      ],
      links: validSlug ? [{ rel: "canonical", href: canonicalUrl }] : [],
    };
  },
  component: ElectionRaceDetailRoute,
});

function ElectionRaceDetailRoute() {
  const { raceSlug } = Route.useParams();
  const storedSlug = findRaceStoredSlug(raceSlug, races);
  const validSlug = Boolean(storedSlug && isElectionSlug(raceSlug));
  const canonicalSlug = storedSlug ? raceSeoSlug(storedSlug) : raceSlug;

  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Race"
        description="Verified race details from KeepTXRed Election Central."
        canonicalUrl={validSlug ? `https://keeptxred.com/elections/races/${canonicalSlug}` : undefined}
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.races} />}
      >
        {validSlug && storedSlug ? (
          <ElectionRaceDetailData raceSlug={storedSlug} />
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
