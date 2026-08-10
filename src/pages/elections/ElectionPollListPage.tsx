import type { ReactNode } from "react";
import {
  ElectionEmptyState,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import { buildElectionCollectionSchema, ELECTION_ROUTES } from "@/lib/elections";
import { TEXAS_POLLING_REFERENCE_SOURCES } from "@/lib/elections/pollingSources";

const POLL_PAGE_DESCRIPTION =
  "Review published Texas election polls with field dates, samples, sponsors, and methodology disclosures.";

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
      description={POLL_PAGE_DESCRIPTION}
      canonicalUrl="https://keeptxred.com/elections/polls"
      schema={buildElectionCollectionSchema({
        name: "Texas Election Polls",
        description: POLL_PAGE_DESCRIPTION,
        pathname: ELECTION_ROUTES.polls,
        itemType: "Dataset",
      })}
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

        <section
          aria-labelledby="polling-source-network"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
              Source transparency
            </p>
            <h2 id="polling-source-network" className="mt-2 text-2xl font-bold text-slate-950">
              Texas polling source network
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              KeepTXRed reviews original pollster releases and cross-checks major public indexes,
              including RealClearPolling. Aggregator pages help identify missing polls; their
              averages are not copied into the KeepTXRed average. Every poll shown below links to
              its original topline or methodology source.
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {TEXAS_POLLING_REFERENCE_SOURCES.map((source) => (
              <article key={source.url} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-950">{source.name}</h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                    {source.role}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{source.description}</p>
                <a
                  className="mt-3 inline-flex text-sm font-bold text-red-700 underline-offset-4 hover:underline"
                  href={source.url}
                  rel={source.url.startsWith("https://keeptxred.com") ? undefined : "noopener noreferrer"}
                  target={source.url.startsWith("https://keeptxred.com") ? undefined : "_blank"}
                >
                  Review source
                  <span className="sr-only">: {source.name}</span>
                </a>
              </article>
            ))}
          </div>
        </section>

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
