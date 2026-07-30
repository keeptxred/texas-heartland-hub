import type { ReactNode } from "react";
import {
  ElectionEmptyState,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export interface ElectionResultsListPageProps {
  children?: ReactNode;
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function ElectionResultsListPage({
  children,
  error,
  isLoading = false,
  onRetry,
}: ElectionResultsListPageProps) {
  return (
    <ElectionLayout
      title="Texas Election Results"
      description="Follow published Texas election results with reporting progress, candidate vote totals, source attribution, and certification status."
      canonicalUrl="https://keeptxred.com/elections/results"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.results} />}
      fullWidth
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
            KeepTXRed Election Central
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Texas election results
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Review published race totals, reporting progress, winner status, and source information
            for Texas elections.
          </p>
        </header>

        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Election-night totals are unofficial and may change as ballots are counted. Results are
          final only after certification by the responsible election authority.
        </aside>

        <section aria-label="Texas election results list">
          {isLoading ? (
            <ElectionLoading variant="cards" count={6} label="Loading Texas election results" />
          ) : error ? (
            <ElectionErrorState
              compact
              title="Texas election results could not be loaded"
              technicalMessage={error.message}
              retryAction={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
            />
          ) : (
            (children ?? <ElectionEmptyState kind="results" />)
          )}
        </section>
      </div>
    </ElectionLayout>
  );
}

export default ElectionResultsListPage;
