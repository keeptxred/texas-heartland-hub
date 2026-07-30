import { createFileRoute } from "@tanstack/react-router";
import records from "@/data/elections/2026/results.json";
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
    const record = records.find(
      (item) =>
        item.slug === params.resultSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );
    const validSlug = isElectionSlug(params.resultSlug);
    const indexable = validSlug && Boolean(record);
    const canonicalUrl = `https://keeptxred.com/elections/results/${params.resultSlug}`;
    const recordName =
      record && "title" in record && typeof record.title === "string" && record.title ? record.title :
        record && "raceName" in record && typeof record.raceName === "string" && record.raceName ? record.raceName :
        "Texas Election Result";
    const description =
      record && "description" in record && typeof record.description === "string" && record.description
        ? record.description
        : "Review published Texas election vote totals, reporting, winner, certification, and source information.";
    const title = indexable
      ? `${recordName} | KeepTXRed Election Central`
      : "Election result not found | KeepTXRed";

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
  component: ElectionResultDetailRoute,
});

function ElectionResultDetailRoute() {
  const { resultSlug } = Route.useParams();
  const valid = isElectionSlug(resultSlug);
  const indexable =
    valid &&
    records.some(
      (item) =>
        item.slug === resultSlug &&
        item.publicationStatus === "published" &&
        item.verificationStatus === "verified",
    );
  return (
    <ElectionRepositoryProvider>
      <ElectionLayout
        title="Texas Election Result"
        description="Published result details from KeepTXRed Election Central."
        indexable={indexable}
        canonicalUrl={indexable ? `https://keeptxred.com/elections/results/${resultSlug}` : undefined}
        navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.results} />}
      >
        {indexable ? (
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
