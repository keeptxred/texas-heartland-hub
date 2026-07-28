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
          <ElectionLoading variant="detail" label="Loading Texas election race details" />
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
