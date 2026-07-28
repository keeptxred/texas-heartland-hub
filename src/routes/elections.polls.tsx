import { createFileRoute } from "@tanstack/react-router";
import { ElectionEmptyState, PollCard } from "@/components/elections";
import { useElectionPolls } from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionPollListPage } from "@/pages/elections";
import {
  POLL_GRADE_LABELS,
  POLL_MODE_LABELS,
  POLL_POPULATION_LABELS,
} from "@/types/elections/pollClassifications";

export const Route = createFileRoute("/elections/polls")({
  head: () => ({
    meta: [
      { title: "Texas Election Polls | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Review published Texas election polls with field dates, sample populations, sponsors, toplines, and methodology disclosures.",
      },
      {
        property: "og:title",
        content: "Texas Election Polls | KeepTXRed Election Central",
      },
      { property: "og:url", content: "/elections/polls" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/polls",
      },
    ],
  }),
  component: ElectionPollsRoute,
});

function ElectionPollsRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionPollsContent />
    </ElectionRepositoryProvider>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function ElectionPollsContent() {
  const polls = useElectionPolls({
    filters: {
      publicationStatuses: ["published"],
    },
    pagination: { page: 1, pageSize: 50 },
    sort: [{ field: "field_end_date", direction: "desc" }],
  });

  return (
    <ElectionPollListPage
      error={polls.error}
      isLoading={polls.isLoading}
      onRetry={() => void polls.refetch()}
    >
      {polls.isEmpty ? (
        <ElectionEmptyState kind="polls" />
      ) : (
        <div className="space-y-6">
          {polls.data?.items.map((poll) => {
            const question = poll.primaryQuestion;
            const raceHref = poll.race ? ELECTION_ROUTES.race(poll.race.slug) : undefined;
            const results =
              question?.responses.flatMap((response) =>
                response.percentage == null
                  ? []
                  : [
                      {
                        candidateId: response.candidateId ?? response.id,
                        candidateName: response.candidateName ?? response.label,
                        partyLabel: response.partyLabel ?? undefined,
                        percentage: response.percentage,
                      },
                    ],
              ) ?? [];

            return (
              <PollCard
                key={poll.id}
                pollster={poll.pollsterName}
                raceName={poll.race?.name ?? poll.jurisdictionName ?? poll.title}
                raceHref={raceHref}
                fieldDates={`${formatDate(poll.fieldStartDate)}–${formatDate(poll.fieldEndDate)}`}
                publishedDate={poll.releaseDate ? formatDate(poll.releaseDate) : undefined}
                sampleSize={question?.sampleSize ?? poll.methodology.sampleSize}
                populationLabel={
                  POLL_POPULATION_LABELS[question?.population ?? poll.methodology.population]
                }
                methodologyLabel={POLL_MODE_LABELS[poll.methodology.mode]}
                marginOfError={poll.methodology.marginOfError}
                grade={POLL_GRADE_LABELS[poll.pollsterGrade]}
                sponsor={
                  poll.sponsors.length > 0
                    ? poll.sponsors.map((sponsor) => sponsor.name).join(", ")
                    : undefined
                }
                results={results}
                sourceUrl={poll.methodology.methodologyUrl ?? undefined}
              />
            );
          })}
        </div>
      )}
    </ElectionPollListPage>
  );
}
