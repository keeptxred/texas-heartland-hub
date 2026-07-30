import { createFileRoute } from "@tanstack/react-router";
import records from "@/data/elections/2026/polls.json";
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
    const record = records.find(
      (item) =>
        item.slug === params.pollSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );
    const validSlug = isElectionSlug(params.pollSlug);
    const indexable = validSlug && Boolean(record);
    const canonicalUrl = `https://keeptxred.com/elections/polls/${params.pollSlug}`;
    const recordName =
      record && "title" in record && typeof record.title === "string" && record.title ? record.title :
        record && "pollsterName" in record && typeof record.pollsterName === "string" && record.pollsterName ? record.pollsterName :
        "Texas Election Poll";
    const description =
      record && "description" in record && typeof record.description === "string" && record.description
        ? record.description
        : "Review poll toplines, sample details, sponsor, and methodology.";
    const title = indexable
      ? `${recordName} | KeepTXRed Election Central`
      : "Election poll not found | KeepTXRed";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "robots",
          content: indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow",
        },
        ...(indexable
          ? [
              { property: "og:title", content: title },
              { property: "og:description", content: description },
              { property: "og:url", content: canonicalUrl },
              { property: "og:type", content: "website" },
              { property: "og:site_name", content: "Keep TX Red" },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:title", content: title },
              { name: "twitter:description", content: description },
            ]
          : []),
      ],
      links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : [],
    };
  },
  component: ElectionPollDetailRoute,
});

function ElectionPollDetailRoute() {
  const { pollSlug } = Route.useParams();
  const validSlug = isElectionSlug(pollSlug);
  const indexable =
    validSlug &&
    records.some(
      (item) =>
        item.slug === pollSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );

  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Poll"
        description="Verified poll details from KeepTXRed Election Central."
        indexable={indexable}
        canonicalUrl={indexable ? `https://keeptxred.com/elections/polls/${pollSlug}` : undefined}
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.polls} />}
      >
        {indexable ? (
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
