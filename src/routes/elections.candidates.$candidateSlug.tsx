import { createFileRoute } from "@tanstack/react-router";
import {
  CandidateBiographySection,
  CandidateCampaignLinks,
  CandidateRaceSection,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import {
  useElectionCandidate,
  useElectionRace,
  usePollsByCandidate,
  useResultByRace,
} from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { electionSlugs, isElectionSlug } from "@/types/elections";

export const Route = createFileRoute("/elections/candidates/$candidateSlug")({
  head: ({ params }) => {
    const validSlug = isElectionSlug(params.candidateSlug);
    const canonicalUrl = `https://keeptxred.com/elections/candidates/${params.candidateSlug}`;

    return {
      meta: [
        {
          title: validSlug
            ? "Texas Election Candidate | KeepTXRed Election Central"
            : "Invalid Election Candidate | KeepTXRed Election Central",
        },
        {
          name: "description",
          content: validSlug
            ? "View verified information for this Texas election candidate."
            : "The requested Texas election candidate URL is invalid.",
        },
        ...(validSlug ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
      ],
      links: validSlug ? [{ rel: "canonical", href: canonicalUrl }] : [],
    };
  },
  component: ElectionCandidateDetailRoute,
});

function ElectionCandidateDetailRoute() {
  const { candidateSlug } = Route.useParams();
  const validSlug = isElectionSlug(candidateSlug);

  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Candidate"
        description="Verified candidate details from KeepTXRed Election Central."
        canonicalUrl={
          validSlug ? `https://keeptxred.com/elections/candidates/${candidateSlug}` : undefined
        }
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.candidates} />}
      >
        {validSlug ? (
          <ElectionCandidateDetailData candidateSlug={candidateSlug} />
        ) : (
          <ElectionErrorState
            kind="not_found"
            title="Election candidate not found"
            message="This candidate URL is invalid. Return to the candidate list to browse published Texas election candidates."
          />
        )}
      </ElectionLayout>
    </ElectionRepositoryProvider>
  );
}

function ElectionCandidateDetailData({ candidateSlug }: { candidateSlug: string }) {
  const candidate = useElectionCandidate({
    slug: electionSlugs.candidate(candidateSlug),
  });
  const race = useElectionRace({ id: candidate.data?.primaryRaceId ?? undefined });
  const polls = usePollsByCandidate(candidate.data?.id);
  const result = useResultByRace(candidate.data?.primaryRaceId ?? undefined);
  const error = candidate.error ?? race.error ?? polls.error ?? result.error;
  const isLoading = candidate.isLoading || race.isLoading || polls.isLoading || result.isLoading;

  const handleRetry = () => {
    void candidate.refetch();
    void race.refetch();
    void polls.refetch();
    void result.refetch();
  };

  if (isLoading) {
    return <ElectionLoading variant="detail" label="Loading Texas election candidate details" />;
  }

  if (error) {
    return (
      <ElectionErrorState
        kind="service"
        title="Election candidate details could not be loaded"
        technicalMessage={error.message}
        retryAction={{ label: "Try again", onClick: handleRetry }}
      />
    );
  }

  if (candidate.isMissing || !candidate.data) {
    return (
      <ElectionErrorState
        kind="not_found"
        title="Election candidate not found"
        message="This candidate is not published or is no longer available."
      />
    );
  }

  return (
    <div className="space-y-10">
      <CandidateBiographySection candidate={candidate.data} race={race.data ?? null} />
      <CandidateCampaignLinks candidate={candidate.data} />
      <CandidateRaceSection candidate={candidate.data} race={race.data ?? null} />
    </div>
  );
}
