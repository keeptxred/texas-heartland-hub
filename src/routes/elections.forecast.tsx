import { createFileRoute } from "@tanstack/react-router";
import { ElectionEmptyState, ForecastSummaryCard } from "@/components/elections";
import { useElectionForecasts } from "@/hooks/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionForecastListPage } from "@/pages/elections";
import type { ForecastRating } from "@/types/elections/forecastClassifications";
import { OFFICE_LEVELS, OFFICE_LEVEL_LABELS } from "@/types/elections/raceClassifications";

export const Route = createFileRoute("/elections/forecast")({
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
      { property: "og:url", content: "/elections/forecast" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const forecasts = useElectionForecasts({
    filters: {
      statuses: ["active", "final"],
      publicationStatuses: ["published"],
    },
    pagination: { page: 1, pageSize: 100 },
    sort: [{ field: "updated_at", direction: "desc" }],
  });

  return (
    <ElectionForecastListPage
      error={forecasts.error}
      isLoading={forecasts.isLoading}
      onRetry={() => void forecasts.refetch()}
    >
      {forecasts.isEmpty ? (
        <ElectionEmptyState kind="forecasts" />
      ) : (
        <div className="space-y-10">
          {OFFICE_LEVELS.map((officeLevel) => {
            const items = (forecasts.data?.items ?? [])
              .filter((forecast) => forecast.race.officeLevel === officeLevel)
              .sort(
                (left, right) =>
                  COMPETITIVENESS_ORDER[left.rating] - COMPETITIVENESS_ORDER[right.rating] ||
                  right.updatedAt.localeCompare(left.updatedAt),
              );

            if (items.length === 0) return null;

            return (
              <section key={officeLevel}>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                  {OFFICE_LEVEL_LABELS[officeLevel]}
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
    </ElectionForecastListPage>
  );
}
