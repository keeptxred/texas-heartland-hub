import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ElectionEmptyState, ResultListFilters, ResultSummaryCard } from "@/components/elections";
import { useElectionCycles, useElectionResults } from "@/hooks/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionResultsListPage } from "@/pages/elections";
import type {
  CertificationStatus,
  ElectionResultSummary,
  OfficeLevel,
  ResultReportingStatus,
} from "@/types/elections";
import { isOfficeLevel } from "@/types/elections/raceClassifications";
import {
  isCertificationStatus,
  isResultReportingStatus,
} from "@/types/elections/resultClassifications";

interface ResultSearch {
  officeLevel?: OfficeLevel;
  reporting?: ResultReportingStatus;
  certification?: CertificationStatus;
  cycle?: string;
}

function parseResultSearch(search: Record<string, unknown>): ResultSearch {
  return {
    officeLevel: isOfficeLevel(search.officeLevel) ? search.officeLevel : undefined,
    reporting: isResultReportingStatus(search.reporting) ? search.reporting : undefined,
    certification: isCertificationStatus(search.certification) ? search.certification : undefined,
    cycle: typeof search.cycle === "string" && search.cycle ? search.cycle : undefined,
  };
}

export const Route = createFileRoute("/elections/results")({
  validateSearch: parseResultSearch,
  head: () => ({
    meta: [
      { title: "Texas Election Results | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Follow published Texas election results with reporting progress, candidate vote totals, source attribution, and certification status.",
      },
      {
        property: "og:title",
        content: "Texas Election Results | KeepTXRed Election Central",
      },
      { property: "og:url", content: "/elections/results" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/results",
      },
    ],
  }),
  component: ElectionResultsRoute,
});

function ElectionResultsRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionResultsContent />
    </ElectionRepositoryProvider>
  );
}

function ElectionResultsContent() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const cycles = useElectionCycles({
    filters: { stateCodes: ["TX"], publicationStatuses: ["published"] },
    sort: [{ field: "election_date", direction: "desc" }],
  });
  const cycleId = cycles.data?.items.find((cycle) => cycle.id === search.cycle)?.id ?? null;
  const results = useElectionResults({
    filters: {
      electionCycleIds: cycleId ? [cycleId] : undefined,
      officeLevels: search.officeLevel ? [search.officeLevel] : undefined,
      reportingStatuses: search.reporting ? [search.reporting] : undefined,
      certificationStatuses: search.certification ? [search.certification] : undefined,
      publicationStatuses: ["published"],
    },
    pagination: { page: 1, pageSize: 100 },
    sort: [
      { field: "election_date", direction: "desc" },
      { field: "reporting_percentage", direction: "desc" },
    ],
  });
  const groupedResults = (results.data?.items ?? []).reduce((groups, result) => {
    const electionDate = result.race.electionDate;
    const group = groups.get(electionDate);
    if (group) group.push(result);
    else groups.set(electionDate, [result]);
    return groups;
  }, new Map<string, ElectionResultSummary[]>());
  const updateSearch = (updates: Partial<ResultSearch>) => {
    void navigate({
      search: (previous: any) => ({ ...previous, ...updates }),
      replace: true,
    });
  };

  return (
    <ElectionResultsListPage
      error={cycles.error ?? results.error}
      isLoading={cycles.isLoading || results.isLoading}
      onRetry={() => {
        void cycles.refetch();
        void results.refetch();
      }}
    >
      <div className="space-y-8">
        <ResultListFilters
          officeLevel={search.officeLevel ?? null}
          reportingStatus={search.reporting ?? null}
          certificationStatus={search.certification ?? null}
          electionCycleId={cycleId}
          electionCycles={
            cycles.data?.items.map((cycle) => ({
              value: cycle.id,
              label: cycle.name,
            })) ?? []
          }
          onOfficeLevelChange={(value) => updateSearch({ officeLevel: value ?? undefined })}
          onReportingStatusChange={(value) => updateSearch({ reporting: value ?? undefined })}
          onCertificationStatusChange={(value) =>
            updateSearch({ certification: value ?? undefined })
          }
          onElectionCycleChange={(value) => updateSearch({ cycle: value ?? undefined })}
        />
        {results.isEmpty ? (
          <ElectionEmptyState kind="filters" />
        ) : (
          <div className="space-y-12">
            {Array.from(groupedResults.entries()).map(([electionDate, items]) => {
              const reporting = items.filter((result) => !isCompletedResult(result));
              const completed = items.filter(isCompletedResult);

              return (
                <section key={electionDate} aria-labelledby={`election-${electionDate}`}>
                  <h2
                    id={`election-${electionDate}`}
                    className="text-2xl font-bold tracking-tight text-slate-950"
                  >
                    {formatElectionDate(electionDate)}
                  </h2>
                  <div className="mt-6 space-y-8">
                    {reporting.length > 0 ? (
                      <ResultGroup title="Reporting now" results={reporting} />
                    ) : null}
                    {completed.length > 0 ? (
                      <ResultGroup title="Completed reporting" results={completed} />
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </ElectionResultsListPage>
  );
}

function ResultGroup({
  title,
  results,
}: {
  title: string;
  results: readonly ElectionResultSummary[];
}) {
  return (
    <section>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {results.map((result) => (
          <ResultSummaryCard key={result.id} result={result} />
        ))}
      </div>
    </section>
  );
}

function isCompletedResult(result: ElectionResultSummary) {
  return (
    result.reportingStatus === "complete" ||
    result.status === "final_unofficial" ||
    result.status === "certified"
  );
}

function formatElectionDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
