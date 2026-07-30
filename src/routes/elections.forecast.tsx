import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ElectionEmptyState,
  ForecastListFilters,
  ForecastSummaryCard,
} from "@/components/elections";
import { useElectionCycles, useElectionForecasts } from "@/hooks/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionForecastListPage } from "@/pages/elections";
import type { ElectionCycleId, ForecastRating, OfficeLevel } from "@/types/elections";
import {
  FORECAST_COVERAGE_CATEGORIES,
  FORECAST_COVERAGE_CATEGORY_LABELS,
  isForecastInLaunchCoverage,
} from "@/types/elections/forecastProjections";
import { isForecastRating } from "@/types/elections/forecastClassifications";
import { isOfficeLevel } from "@/types/elections/raceClassifications";

interface ElectionForecastListSearch {
  source?: string;
  rating?: ForecastRating;
  officeLevel?: OfficeLevel;
  cycle?: string;
}

function parseForecastListSearch(search: Record<string, unknown>): ElectionForecastListSearch {
  return {
    source: typeof search.source === "string" && search.source ? search.source : undefined,
    rating: isForecastRating(search.rating) ? search.rating : undefined,
    officeLevel: isOfficeLevel(search.officeLevel) ? search.officeLevel : undefined,
    cycle: typeof search.cycle === "string" && search.cycle ? search.cycle : undefined,
  };
}

export const Route = createFileRoute("/elections/forecast")({
  validateSearch: parseForecastListSearch,
  head: () => ({
    meta: [
      { title: "Texas Election Forecasts | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Review published Texas election forecasts with providers, race ratings, candidate probabilities, updates, and methodology disclosures.",
      },
      {
        property: "og:title",
        content: "Texas Election Forecasts | KeepTXRed Election Central",
      },
      { property: "og:url", content: "https://keeptxred.com/elections/forecast" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "2026 Texas Election Central" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://keeptxred.com/elections/forecast",
      },
    ],
  }),
  component: ElectionForecastRoute,
});

function ElectionForecastRoute() {
  return (
    <ElectionRepositoryProvider>
      <ElectionForecastContent />
    </ElectionRepositoryProvider>
  );
}

const COMPETITIVENESS_ORDER: Record<ForecastRating, number> = {
  toss_up: 0,
  leans_republican: 1,
  leans_democratic: 1,
  likely_republican: 2,
  likely_democratic: 2,
  safe_republican: 3,
  safe_democratic: 3,
  safe_other: 3,
  unrated: 4,
};

function ElectionForecastContent() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const cycles = useElectionCycles({
    filters: {
      stateCodes: ["TX"],
      publicationStatuses: ["published"],
    },
    sort: [{ field: "election_date", direction: "desc" }],
  });
  const electionCycleId = cycles.data?.items.find((cycle) => cycle.id === search.cycle)?.id ?? null;
  const forecasts = useElectionForecasts({
    filters: {
      electionCycleIds: electionCycleId ? [electionCycleId] : undefined,
      sourceIds: search.source ? [search.source] : undefined,
      ratings: search.rating ? [search.rating] : undefined,
      officeLevels: search.officeLevel ? [search.officeLevel] : undefined,
      statuses: ["active", "final"],
      publicationStatuses: ["published"],
    },
    pagination: { page: 1, pageSize: 100 },
    sort: [{ field: "updated_at", direction: "desc" }],
  });
  const sourceOptions = Array.from(
    new Map(
      (forecasts.data?.items ?? [])
        .filter(
          (forecast): forecast is typeof forecast & { sourceId: string } =>
            forecast.sourceId !== null,
        )
        .map((forecast) => [
          forecast.sourceId,
          { value: forecast.sourceId, label: forecast.sourceName },
        ]),
    ).values(),
  ).sort((left, right) => left.label.localeCompare(right.label));
  const cycleOptions =
    cycles.data?.items.map((cycle) => ({ value: cycle.id, label: cycle.name })) ?? [];
  const error = cycles.error ?? forecasts.error;
  const launchForecasts = (forecasts.data?.items ?? []).filter(isForecastInLaunchCoverage);

  const updateSearch = (updates: Partial<ElectionForecastListSearch>) => {
    void navigate({
      search: (previous: any) => ({ ...previous, ...updates }),
      replace: true,
    });
  };

  const handleRetry = () => {
    void cycles.refetch();
    void forecasts.refetch();
  };

  return (
    <ElectionForecastListPage
      error={error}
      isLoading={cycles.isLoading || forecasts.isLoading}
      onRetry={handleRetry}
    >
      <div className="space-y-6">
        <ForecastListFilters
          sourceId={search.source ?? null}
          rating={search.rating ?? null}
          officeLevel={search.officeLevel ?? null}
          electionCycleId={electionCycleId}
          sources={sourceOptions}
          electionCycles={cycleOptions}
          onSourceChange={(source) => updateSearch({ source: source ?? undefined })}
          onRatingChange={(rating) => updateSearch({ rating: rating ?? undefined })}
          onOfficeLevelChange={(officeLevel) =>
            updateSearch({ officeLevel: officeLevel ?? undefined })
          }
          onElectionCycleChange={(cycle) => updateSearch({ cycle: cycle ?? undefined })}
        />
        {forecasts.isEmpty || launchForecasts.length === 0 ? (
          <ElectionEmptyState
            kind={search.rating || search.officeLevel ? "filters" : "forecasts"}
          />
        ) : (
          <div className="space-y-10">
            {FORECAST_COVERAGE_CATEGORIES.map((coverage) => {
              const items = launchForecasts
                .filter((forecast) => forecast.race.forecastCoverage === coverage)
                .sort(
                  (left, right) =>
                    COMPETITIVENESS_ORDER[left.rating] - COMPETITIVENESS_ORDER[right.rating] ||
                    right.updatedAt.localeCompare(left.updatedAt),
                );

              if (items.length === 0) return null;

              return (
                <section key={coverage}>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    {FORECAST_COVERAGE_CATEGORY_LABELS[coverage]}
                  </h2>
                  <div className="mt-5 grid gap-6 lg:grid-cols-2">
                    {items.map((forecast) => (
                      <ForecastSummaryCard key={forecast.id} forecast={forecast} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </ElectionForecastListPage>
  );
}
