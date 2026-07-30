import type { ReactNode } from "react";
import {
  ElectionEmptyState,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export interface ElectionCandidateListPageProps {
  children?: ReactNode;
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function ElectionCandidateListPage({
  children,
  error,
  isLoading = false,
  onRetry,
}: ElectionCandidateListPageProps) {
  return (
    <ElectionLayout
      title="Texas Election Candidates"
      description="Browse verified candidate information for published Texas election races."
      canonicalUrl="https://keeptxred.com/elections/candidates"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.candidates} />}
      fullWidth
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
            KeepTXRed Election Central
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Texas election candidates
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Review published candidate profiles with verified party, filing, incumbency, and race
            information.
          </p>
        </header>

        <section aria-label="Texas election candidate list">
          {isLoading ? (
            <ElectionLoading variant="cards" count={6} label="Loading Texas election candidates" />
          ) : error ? (
            <ElectionErrorState
              compact
              title="Texas election candidates could not be loaded"
              technicalMessage={error.message}
              retryAction={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
            />
          ) : (
            (children ?? <ElectionEmptyState kind="candidates" />)
          )}
        </section>
      </div>
    </ElectionLayout>
  );
}

export default ElectionCandidateListPage;
