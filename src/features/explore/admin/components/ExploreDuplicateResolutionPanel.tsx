/*
PATH:
src/features/explore/admin/components/ExploreDuplicateResolutionPanel.tsx

FILE:
ExploreDuplicateResolutionPanel.tsx
*/

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ExploreEntity } from '@/types/explore';
import type {
  ExploreDuplicateCandidate,
  ExploreDuplicateCandidateStatus,
} from '@/repositories/explore/DuplicateCandidateRepository';

import {
  useExploreAdminDuplicateCandidates,
  useResolveExploreAdminDuplicateCandidate,
} from '../hooks/useExploreAdminDuplicateCandidates';

const PAGE_SIZE = 10;
const SIMILARITY_OPTIONS = [0.9, 0.8, 0.7, 0.5] as const;

type ResolutionStatus = Extract<ExploreDuplicateCandidateStatus, 'not_duplicate' | 'deferred'>;

export interface ExploreDuplicateResolutionPanelProps {
  onOpenEntity: (entityId: string) => void;
}

export function ExploreDuplicateResolutionPanel({
  onOpenEntity,
}: ExploreDuplicateResolutionPanelProps) {
  const [page, setPage] = useState(1);
  const [minimumSimilarity, setMinimumSimilarity] = useState<number>(0.7);
  const [selectedCandidate, setSelectedCandidate] =
    useState<ExploreDuplicateCandidate | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const candidatesQuery = useExploreAdminDuplicateCandidates({
    filters: { status: 'pending', minimumSimilarity },
    pagination: { page, pageSize: PAGE_SIZE },
  });
  const resolveMutation = useResolveExploreAdminDuplicateCandidate();

  const result = candidatesQuery.data;
  const candidates = result?.items ?? [];
  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 0;
  const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, total);

  useEffect(() => {
    if (page > Math.max(1, totalPages)) {
      setPage(Math.max(1, totalPages));
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (
      selectedCandidate &&
      !candidates.some((candidate) => candidate.id === selectedCandidate.id)
    ) {
      setSelectedCandidate(null);
      setResolutionNotes('');
    }
  }, [candidates, selectedCandidate]);

  const selectedMatchSummary = useMemo(() => {
    if (!selectedCandidate) return null;

    return selectedCandidate.matchingFields.length > 0
      ? selectedCandidate.matchingFields.join(', ')
      : 'No matching fields were recorded.';
  }, [selectedCandidate]);

  function changeMinimumSimilarity(value: number) {
    setMinimumSimilarity(value);
    setPage(1);
    setSelectedCandidate(null);
    setResolutionNotes('');
  }

  function selectCandidate(candidate: ExploreDuplicateCandidate) {
    setSelectedCandidate(candidate);
    setResolutionNotes(candidate.resolutionNotes ?? '');
  }

  async function resolve(status: ResolutionStatus) {
    if (!selectedCandidate) return;

    try {
      await resolveMutation.mutateAsync({
        candidateId: selectedCandidate.id,
        input: {
          status,
          resolutionNotes: resolutionNotes.trim() || null,
        },
      });

      toast.success(
        status === 'not_duplicate'
          ? 'Candidate marked as not a duplicate.'
          : 'Candidate deferred for later review.',
      );
      setSelectedCandidate(null);
      setResolutionNotes('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to resolve duplicate candidate.');
    }
  }

  return (
    <section className="space-y-5" aria-labelledby="explore-duplicate-resolution-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="explore-duplicate-resolution-title" className="text-xl font-semibold">
            Duplicate Resolution
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Compare similarity candidates before dismissing or deferring them. Entity merges require
            the dedicated merge service so relationships and source attribution remain intact.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => candidatesQuery.refetch()}
          disabled={candidatesQuery.isFetching}
        >
          {candidatesQuery.isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Minimum duplicate similarity">
        {SIMILARITY_OPTIONS.map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={minimumSimilarity === option ? 'default' : 'outline'}
            onClick={() => changeMinimumSimilarity(option)}
          >
            {Math.round(option * 100)}%+
          </Button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-hidden rounded-xl border bg-card">
          {candidatesQuery.isLoading ? (
            <PanelMessage>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden="true" />
              Loading duplicate candidates
            </PanelMessage>
          ) : candidatesQuery.isError ? (
            <PanelMessage tone="error">
              {candidatesQuery.error.message || 'Unable to load duplicate candidates.'}
            </PanelMessage>
          ) : candidates.length === 0 ? (
            <PanelMessage>No pending candidates meet this similarity threshold.</PanelMessage>
          ) : (
            <div className="divide-y">
              {candidates.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => selectCandidate(candidate)}
                  className={`w-full p-4 text-left transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                    selectedCandidate?.id === candidate.id ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {candidate.entityA.name}
                        <span className="mx-2 text-muted-foreground">↔</span>
                        {candidate.entityB.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {candidate.matchingFields.length > 0
                          ? `Matches: ${candidate.matchingFields.join(', ')}`
                          : 'No matching-field summary'}
                      </p>
                    </div>
                    <SimilarityBadge score={candidate.similarityScore} />
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {firstItem.toLocaleString()}–{lastItem.toLocaleString()} of{' '}
              {total.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || candidatesQuery.isFetching}
              >
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
                Previous
              </Button>
              <span className="min-w-24 text-center text-sm text-muted-foreground">
                Page {page.toLocaleString()} of {Math.max(1, totalPages).toLocaleString()}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= totalPages || candidatesQuery.isFetching}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        <aside className="rounded-xl border bg-card p-5">
          {selectedCandidate ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">Candidate comparison</h3>
                  <SimilarityBadge score={selectedCandidate.similarityScore} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Matching fields: {selectedMatchSummary}
                </p>
              </div>

              <div className="grid gap-3">
                <EntityComparisonCard
                  label="Record A"
                  entity={selectedCandidate.entityA}
                  onOpenEntity={onOpenEntity}
                />
                <EntityComparisonCard
                  label="Record B"
                  entity={selectedCandidate.entityB}
                  onOpenEntity={onOpenEntity}
                />
              </div>

              <div>
                <label htmlFor="duplicate-resolution-notes" className="text-sm font-medium">
                  Resolution notes
                </label>
                <Textarea
                  id="duplicate-resolution-notes"
                  className="mt-2 min-h-28"
                  value={resolutionNotes}
                  onChange={(event) => setResolutionNotes(event.target.value)}
                  placeholder="Record the reason for this decision."
                  disabled={resolveMutation.isPending}
                />
              </div>

              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                <div className="flex gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <p>
                    Do not mark records as merged here. A merge must transfer relationships,
                    sources, media, observations, aliases, and slug history atomically.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => resolve('deferred')}
                  disabled={resolveMutation.isPending}
                >
                  Defer
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() => resolve('not_duplicate')}
                  disabled={resolveMutation.isPending}
                >
                  {resolveMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : null}
                  Not a duplicate
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-72 items-center justify-center text-center text-sm text-muted-foreground">
              Select a candidate to compare both records and record a resolution.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function SimilarityBadge({ score }: { score: number }) {
  const percentage = Math.round(Math.max(0, Math.min(1, score)) * 100);
  const classes =
    percentage >= 90
      ? 'bg-red-100 text-red-700'
      : percentage >= 75
        ? 'bg-amber-100 text-amber-800'
        : 'bg-slate-100 text-slate-700';

  return (
    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {percentage}% similar
    </span>
  );
}

function EntityComparisonCard({
  label,
  entity,
  onOpenEntity,
}: {
  label: string;
  entity: ExploreEntity;
  onOpenEntity: (entityId: string) => void;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 font-semibold">{entity.name}</p>
          <p className="mt-1 break-all text-xs text-muted-foreground">/{entity.slug}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onOpenEntity(entity.id)}
          aria-label={`Open ${entity.name}`}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <ComparisonValue label="Status" value={entity.status} />
        <ComparisonValue label="Visibility" value={entity.visibility} />
        <ComparisonValue
          label="Confidence"
          value={`${Math.round(entity.sourceConfidence * 100)}%`}
        />
        <ComparisonValue label="Updated" value={formatDate(entity.updatedAt)} />
      </dl>
      <p className="mt-4 line-clamp-4 text-sm text-muted-foreground">
        {entity.shortDescription || entity.summary || 'No description available.'}
      </p>
    </div>
  );
}

function ComparisonValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 capitalize text-foreground">{value}</dd>
    </div>
  );
}

function PanelMessage({
  children,
  tone = 'muted',
}: {
  children: ReactNode;
  tone?: 'muted' | 'error';
}) {
  return (
    <div
      className={`px-5 py-16 text-center text-sm ${
        tone === 'error' ? 'text-destructive' : 'text-muted-foreground'
      }`}
    >
      {children}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}
