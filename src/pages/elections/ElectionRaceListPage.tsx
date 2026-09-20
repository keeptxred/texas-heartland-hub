import type { ReactNode } from "react";
import { ElectionDirectoryTrustPanel } from "@/components/elections/ElectionDirectoryTrustPanel";
import {
  ElectionEmptyState,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export interface ElectionRaceListPageProps {
  children?: ReactNode;
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function ElectionRaceListPage({
  children,
  error,
  isLoading = false,
  onRetry,
}: ElectionRaceListPageProps) {
  return (
    <ElectionLayout
      title="Texas Election Races"
      description="Browse verified Texas statewide, congressional, legislative, county, and local election races."
      canonicalUrl="https://keeptxred.com/elections/races"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.races} />}
      fullWidth
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            KeepTXRed Election Central
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Texas election races
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Follow published races across Texas with verified election dates, candidates, ratings,
            and reporting status.
          </p>
        </header>

        <section aria-label="Texas election race list">
          {isLoading ? (
            <ElectionLoading variant="cards" count={6} label="Loading Texas election races" />
          ) : error ? (
            <ElectionErrorState
              compact
              title="Texas election races could not be loaded"
              technicalMessage={error.message}
              retryAction={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
            />
          ) : (
            (children ?? <ElectionEmptyState kind="races" />)
          )}
        </section>
        <ElectionDirectoryTrustPanel kind="races" />
      </div>
    </ElectionLayout>
  );
}

export default ElectionRaceListPage;
