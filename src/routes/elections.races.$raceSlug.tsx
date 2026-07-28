import { createFileRoute } from "@tanstack/react-router";
import {
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
  RaceCandidateSection,
  RaceDetailHeader,
} from "@/components/elections";
import {
  useCandidatesByRace,
  useElectionRace,
  useForecastByRace,
  usePollsByRace,
  useResultByRace,
} from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { electionSlugs, isElectionSlug } from "@/types/elections";

export const Route = createFileRoute("/elections/races/$raceSlug")({
  head: ({ params }) => {
    const validSlug = isElectionSlug(params.raceSlug);
    const canonicalUrl = `https://keeptxred.com/elections/races/${params.raceSlug}`;

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
  const validSlug = isElectionSlug(raceSlug);

  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Race"
        description="Verified race details from KeepTXRed Election Central."
        canonicalUrl={validSlug ? `https://keeptxred.com/elections/races/${raceSlug}` : undefined}
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.races} />}
      >
        {validSlug ? (
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
  const result = useResultByRace(race.data?.id);
  const error = race.error ?? candidates.error ?? polls.error ?? forecast.error ?? result.error;
  const isLoading =
    race.isLoading ||
    candidates.isLoading ||
    polls.isLoading ||
    forecast.isLoading ||
    result.isLoading;

  const handleRetry = () => {
    void race.refetch();
    void candidates.refetch();
    void polls.refetch();
    void forecast.refetch();
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
      <RaceDetailHeader race={race.data} />
      <RaceCandidateSection race={race.data} candidates={candidates.data ?? []} />
    </div>
  );
}
