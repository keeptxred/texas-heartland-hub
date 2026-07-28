import type { ReactNode } from "react";
import {
  ElectionEmptyState,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export interface ElectionForecastListPageProps {
  children?: ReactNode;
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function ElectionForecastListPage({
  children,
  error,
  isLoading = false,
  onRetry,
}: ElectionForecastListPageProps) {
  return (
    <ElectionLayout
      title="Texas Election Forecasts"
      description="Review published Texas election forecasts with source, rating, probability, and methodology disclosures."
      canonicalUrl="https://keeptxred.com/elections/forecast"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.forecast} />}
      fullWidth
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
            KeepTXRed Election Central
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Texas election forecasts
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Compare published model outlooks for Texas races with provider, rating, candidate
            probabilities, and update information.
          </p>
        </header>

        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Forecasts are model estimates, not poll results, vote totals, or guarantees. Compare
          providers, assumptions, update times, and methodology before interpreting an outlook.
        </aside>

        <section aria-label="Texas election forecast list">
          {isLoading ? (
            <ElectionLoading variant="cards" count={6} label="Loading Texas election forecasts" />
          ) : error ? (
            <ElectionErrorState
              compact
              title="Texas election forecasts could not be loaded"
              technicalMessage={error.message}
              retryAction={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
            />
          ) : (
            (children ?? <ElectionEmptyState kind="forecasts" />)
          )}
        </section>
      </div>
    </ElectionLayout>
  );
}

export default ElectionForecastListPage;
