import { createFileRoute } from "@tanstack/react-router";
import {
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
  PollDetailView,
} from "@/components/elections";
import { useElectionPoll } from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { electionSlugs, isElectionSlug } from "@/types/elections";

export const Route = createFileRoute("/elections/polls/$pollSlug")({
  head: ({ params }) => {
    const validSlug = isElectionSlug(params.pollSlug);
    const canonicalUrl = `https://keeptxred.com/elections/polls/${params.pollSlug}`;

    return {
      meta: [
        {
          title: validSlug
            ? "Texas Election Poll | KeepTXRed Election Central"
            : "Invalid Election Poll | KeepTXRed Election Central",
        },
        {
          name: "description",
          content: validSlug
            ? "Review poll toplines, sample details, sponsor, and methodology."
            : "The requested election poll URL is invalid.",
        },
        ...(validSlug
          ? [
              { name: "robots", content: "index, follow, max-image-preview:large" },
              { property: "og:url", content: canonicalUrl },
              { property: "og:type", content: "website" },
              { property: "og:site_name", content: "Keep TX Red" },
              { name: "twitter:card", content: "summary_large_image" },
            ]
          : [{ name: "robots", content: "noindex, nofollow" }]),
      ],
      links: validSlug ? [{ rel: "canonical", href: canonicalUrl }] : [],
    };
  },
  component: ElectionPollDetailRoute,
});

function ElectionPollDetailRoute() {
  const { pollSlug } = Route.useParams();
  const validSlug = isElectionSlug(pollSlug);

  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Poll"
        description="Verified poll details from KeepTXRed Election Central."
        canonicalUrl={validSlug ? `https://keeptxred.com/elections/polls/${pollSlug}` : undefined}
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.polls} />}
      >
        {validSlug ? (
          <ElectionPollDetailData pollSlug={pollSlug} />
        ) : (
          <ElectionErrorState
            kind="not_found"
            title="Election poll not found"
            message="This poll URL is invalid. Return to the poll list to browse published Texas election polls."
          />
        )}
      </ElectionLayout>
    </ElectionRepositoryProvider>
  );
}

function ElectionPollDetailData({ pollSlug }: { pollSlug: string }) {
  const poll = useElectionPoll({ slug: electionSlugs.poll(pollSlug) });

  if (poll.isLoading) {
    return <ElectionLoading variant="detail" label="Loading Texas election poll details" />;
  }

  if (poll.error) {
    return (
      <ElectionErrorState
        kind="service"
        title="Election poll details could not be loaded"
        technicalMessage={poll.error.message}
        retryAction={{ label: "Try again", onClick: () => void poll.refetch() }}
      />
    );
  }

  if (poll.isMissing || !poll.data) {
    return (
      <ElectionErrorState
        kind="not_found"
        title="Election poll not found"
        message="This poll is not published or is no longer available."
      />
    );
  }

  return <PollDetailView poll={poll.data} />;
}
