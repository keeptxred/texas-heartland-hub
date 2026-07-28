import { createFileRoute } from "@tanstack/react-router";
import {
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
  ResultDetailView,
} from "@/components/elections";
import { useElectionResult } from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { electionSlugs, isElectionSlug } from "@/types/elections";

export const Route = createFileRoute("/elections/results/$resultSlug")({
  head: ({ params }) => {
    const valid = isElectionSlug(params.resultSlug);
    const canonicalUrl = `https://keeptxred.com/elections/results/${params.resultSlug}`;
    return {
      meta: [
        {
          title: valid
            ? "Texas Election Result | KeepTXRed Election Central"
            : "Invalid Election Result | KeepTXRed Election Central",
        },
        {
          name: "description",
          content: valid
            ? "Review published Texas election vote totals, reporting, winner, certification, and source information."
            : "The requested Texas election result URL is invalid.",
        },
        ...(valid ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
      ],
      links: valid ? [{ rel: "canonical", href: canonicalUrl }] : [],
    };
  },
  component: ElectionResultDetailRoute,
});

function ElectionResultDetailRoute() {
  const { resultSlug } = Route.useParams();
  const valid = isElectionSlug(resultSlug);
  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Result"
        description="Published result details from KeepTXRed Election Central."
        canonicalUrl={valid ? `https://keeptxred.com/elections/results/${resultSlug}` : undefined}
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.results} />}
      >
        {valid ? (
          <ElectionResultData resultSlug={resultSlug} />
        ) : (
          <ElectionErrorState
            kind="not_found"
            title="Election result not found"
            message="This result URL is invalid. Return to the result list to browse published Texas election results."
          />
        )}
      </ElectionLayout>
    </ElectionRepositoryProvider>
  );
}

function ElectionResultData({ resultSlug }: { resultSlug: string }) {
  const result = useElectionResult({ slug: electionSlugs.result(resultSlug) });
  if (result.isLoading) {
    return <ElectionLoading variant="detail" label="Loading Texas election result details" />;
  }
  if (result.error) {
    return (
      <ElectionErrorState
        kind="service"
        title="Election result details could not be loaded"
        technicalMessage={result.error.message}
        retryAction={{ label: "Try again", onClick: () => void result.refetch() }}
      />
    );
  }
  if (result.isMissing || !result.data) {
    return (
      <ElectionErrorState
        kind="not_found"
        title="Election result not found"
        message="This result is not published or is no longer available."
      />
    );
  }
  return <ResultDetailView result={result.data} />;
}
