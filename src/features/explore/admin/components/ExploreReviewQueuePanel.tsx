/*
PATH:
src/features/explore/admin/components/ExploreReviewQueuePanel.tsx

FILE:
ExploreReviewQueuePanel.tsx
*/

import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ExploreEntity, ExploreEntityStatus } from '@/types/explore';

import {
  useExploreAdminReviewQueue,
  useExploreAdminReviewQueueCounts,
} from '../hooks/useExploreAdminReviewQueue';

const PAGE_SIZE = 25;

type ReviewStatusFilter = 'all' | Extract<ExploreEntityStatus, 'imported' | 'validated'>;

export interface ExploreReviewQueuePanelProps {
  onOpenEntity: (entityId: string) => void;
}

export function ExploreReviewQueuePanel({ onOpenEntity }: ExploreReviewQueuePanelProps) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ReviewStatusFilter>('all');
  const queueQuery = useExploreAdminReviewQueue({
    pagination: { page, pageSize: PAGE_SIZE },
    status,
  });
  const countsQuery = useExploreAdminReviewQueueCounts();

  const result = queueQuery.data;
  const entities = result?.items ?? [];
  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 1;
  const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, total);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function changeStatus(nextStatus: ReviewStatusFilter) {
    setStatus(nextStatus);
    setPage(1);
  }

  async function refresh() {
    await Promise.all([queueQuery.refetch(), countsQuery.refetch()]);
  }

  return (
    <section className="space-y-4" aria-labelledby="explore-review-queue-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="explore-review-queue-title" className="text-xl font-semibold">
            Review Queue
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review newly imported and validated records before publication.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={refresh}
          disabled={queueQuery.isFetching || countsQuery.isFetching}
        >
          {queueQuery.isFetching || countsQuery.isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Review queue status">
        <StatusTab
          label="All pending"
          count={countsQuery.total}
          active={status === 'all'}
          onClick={() => changeStatus('all')}
        />
        <StatusTab
          label="Imported"
          count={countsQuery.imported}
          active={status === 'imported'}
          onClick={() => changeStatus('imported')}
        />
        <StatusTab
          label="Validated"
          count={countsQuery.validated}
          active={status === 'validated'}
          onClick={() => changeStatus('validated')}
        />
      </div>

      {countsQuery.isError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {countsQuery.error instanceof Error
            ? countsQuery.error.message
            : 'Unable to load review queue counts.'}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
                <th className="px-4 py-3 font-medium">Visibility</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {queueQuery.isLoading ? (
                <TableMessage colSpan={6}>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading review queue
                </TableMessage>
              ) : queueQuery.isError ? (
                <TableMessage colSpan={6} tone="error">
                  {queueQuery.error.message || 'Unable to load the review queue.'}
                </TableMessage>
              ) : entities.length === 0 ? (
                <TableMessage colSpan={6}>
                  No records are waiting in this review stage.
                </TableMessage>
              ) : (
                entities.map((entity) => (
                  <ReviewQueueRow
                    key={entity.id}
                    entity={entity}
                    onOpenEntity={onOpenEntity}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

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
              disabled={page <= 1 || queueQuery.isFetching}
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
              disabled={page >= totalPages || queueQuery.isFetching}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatusTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function StatusTab({ label, count, active, onClick }: StatusTabProps) {
  return (
    <Button
      type="button"
      role="tab"
      variant={active ? 'default' : 'outline'}
      aria-selected={active}
      onClick={onClick}
    >
      {label}
      <span className="ml-2 rounded-full bg-background/20 px-2 py-0.5 text-xs">
        {count.toLocaleString()}
      </span>
    </Button>
  );
}

interface ReviewQueueRowProps {
  entity: ExploreEntity;
  onOpenEntity: (entityId: string) => void;
}

function ReviewQueueRow({ entity, onOpenEntity }: ReviewQueueRowProps) {
  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{entity.name}</p>
        <p className="max-w-md truncate text-xs text-muted-foreground">
          {entity.shortDescription || entity.summary || `/${entity.slug}`}
        </p>
      </td>
      <td className="px-4 py-3">
        <span className={statusClasses(entity.status)}>{entity.status}</span>
      </td>
      <td className="px-4 py-3">
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground">
            {Math.round(entity.sourceConfidence * 100).toLocaleString()}%
          </span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/60"
              style={{ width: `${Math.max(0, Math.min(100, entity.sourceConfidence * 100))}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 capitalize text-muted-foreground">{entity.visibility}</td>
      <td className="px-4 py-3 text-muted-foreground">{formatDate(entity.updatedAt)}</td>
      <td className="px-4 py-3 text-right">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onOpenEntity(entity.id)}
          aria-label={`Review ${entity.name}`}
        >
          Review
          <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </td>
    </tr>
  );
}

function statusClasses(status: ExploreEntityStatus) {
  const base = 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize';

  if (status === 'imported') {
    return `${base} bg-blue-100 text-blue-700`;
  }

  return `${base} bg-cyan-100 text-cyan-700`;
}

function TableMessage({
  children,
  colSpan,
  tone = 'muted',
}: {
  children: React.ReactNode;
  colSpan: number;
  tone?: 'muted' | 'error';
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={`px-4 py-12 text-center ${
          tone === 'error' ? 'text-destructive' : 'text-muted-foreground'
        }`}
      >
        {children}
      </td>
    </tr>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}
