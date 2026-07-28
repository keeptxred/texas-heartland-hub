import type { ReactNode } from "react";
import {
  ElectionEmptyState,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export interface ElectionPollListPageProps {
  children?: ReactNode;
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function ElectionPollListPage({
  children,
  error,
  isLoading = false,
  onRetry,
}: ElectionPollListPageProps) {
  return (
    <ElectionLayout
      title="Texas Election Polls"
      description="Review published Texas election polls with field dates, samples, sponsors, and methodology disclosures."
      canonicalUrl="https://keeptxred.com/elections/polls"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.polls} />}
      fullWidth
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
            KeepTXRed Election Central
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Texas election polls
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Compare qualifying public polls with their field dates, samples, sponsors, toplines, and
            available methodology.
          </p>
        </header>

        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Polls are snapshots of a surveyed population, not predictions or election results. Compare
          field dates, sample populations, question wording, sponsors, and methodology before
          drawing conclusions.
        </aside>

        <section aria-label="Texas election poll list">
          {isLoading ? (
            <ElectionLoading variant="cards" count={5} label="Loading Texas election polls" />
          ) : error ? (
            <ElectionErrorState
              compact
              title="Texas election polls could not be loaded"
              technicalMessage={error.message}
              retryAction={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
            />
          ) : (
            (children ?? <ElectionEmptyState kind="polls" />)
          )}
        </section>
      </div>
    </ElectionLayout>
  );
}

export default ElectionPollListPage;
