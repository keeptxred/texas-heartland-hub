import { createFileRoute } from "@tanstack/react-router";
import {
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { isElectionSlug } from "@/types/elections";

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
          <ElectionLoading variant="detail" label="Loading Texas election candidate details" />
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
