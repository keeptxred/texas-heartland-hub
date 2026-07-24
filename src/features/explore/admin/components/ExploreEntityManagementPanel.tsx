import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type {
  ExploreEntity,
  ExploreEntityStatus,
  ExploreVisibility,
} from '@/types/explore';

import { useExploreAdminEntities } from '../hooks/useExploreAdminEntities';

const PAGE_SIZE = 25;

const ENTITY_STATUSES: Array<{ value: ExploreEntityStatus; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'imported', label: 'Imported' },
  { value: 'validated', label: 'Validated' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'published', label: 'Published' },
  { value: 'verified', label: 'Verified' },
  { value: 'archived', label: 'Archived' },
];

const VISIBILITIES: Array<{ value: ExploreVisibility; label: string }> = [
  { value: 'internal', label: 'Internal' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'public', label: 'Public' },
];

export interface ExploreEntityManagementPanelProps {
  onOpenEntity?: (entityId: string) => void;
}

export function ExploreEntityManagementPanel({
  onOpenEntity,
}: ExploreEntityManagementPanelProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ExploreEntityStatus | ''>('');
  const [visibility, setVisibility] = useState<ExploreVisibility | ''>('');
  const [featured, setFeatured] = useState<'all' | 'featured' | 'standard'>('all');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setQuery(searchInput.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const filters = useMemo(
    () => ({
      ...(query ? { query } : {}),
      ...(status ? { status } : {}),
      ...(visibility ? { visibility } : {}),
      ...(featured === 'featured' ? { featured: true } : {}),
      ...(featured === 'standard' ? { featured: false } : {}),
    }),
    [featured, query, status, visibility],
  );

  const entitiesQuery = useExploreAdminEntities({
    filters,
    pagination: { page, pageSize: PAGE_SIZE },
  });

  const result = entitiesQuery.data;
  const entities = result?.items ?? [];
  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 0;
  const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, total);

  function resetFilters() {
    setSearchInput('');
    setQuery('');
    setStatus('');
    setVisibility('');
    setFeatured('all');
    setPage(1);
  }

  return (
    <section className="space-y-4" aria-labelledby="explore-entity-management-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="explore-entity-management-title" className="text-xl font-semibold">
            Entity Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter, review, and open Explore Texas records.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => entitiesQuery.refetch()}
          disabled={entitiesQuery.isFetching}
        >
          {entitiesQuery.isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-1.5 md:col-span-2 xl:col-span-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </span>
          <span className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name, slug, or summary"
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </span>
        </label>

        <FilterSelect
          label="Status"
          value={status}
          onChange={(value) => {
            setStatus(value as ExploreEntityStatus | '');
            setPage(1);
          }}
          options={ENTITY_STATUSES}
          allLabel="All statuses"
        />

        <FilterSelect
          label="Visibility"
          value={visibility}
          onChange={(value) => {
            setVisibility(value as ExploreVisibility | '');
            setPage(1);
          }}
          options={VISIBILITIES}
          allLabel="All visibility"
        />

        <FilterSelect
          label="Featured"
          value={featured}
          onChange={(value) => {
            setFeatured(value as 'all' | 'featured' | 'standard');
            setPage(1);
          }}
          options={[
            { value: 'featured', label: 'Featured only' },
            { value: 'standard', label: 'Not featured' },
          ]}
          allLabel="All entities"
          allValue="all"
        />

        <div className="flex items-end md:col-span-2 xl:col-span-5">
          <Button type="button" variant="ghost" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Visibility</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entitiesQuery.isLoading ? (
                <TableMessage colSpan={6}>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading entities
                </TableMessage>
              ) : entitiesQuery.isError ? (
                <TableMessage colSpan={6} tone="error">
                  {entitiesQuery.error.message || 'Unable to load Explore Texas entities.'}
                </TableMessage>
              ) : entities.length === 0 ? (
                <TableMessage colSpan={6}>No entities match the selected filters.</TableMessage>
              ) : (
                entities.map((entity) => (
                  <EntityRow key={entity.id} entity={entity} onOpenEntity={onOpenEntity} />
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
              disabled={page <= 1 || entitiesQuery.isFetching}
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
              disabled={page >= totalPages || entitiesQuery.isFetching}
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

interface EntityRowProps {
  entity: ExploreEntity;
  onOpenEntity?: (entityId: string) => void;
}

function EntityRow({ entity, onOpenEntity }: EntityRowProps) {
  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="flex items-start gap-2">
          {entity.featured ? (
            <Star className="mt-0.5 h-4 w-4 fill-current text-amber-500" aria-label="Featured" />
          ) : null}
          <div className="min-w-0">
            <p className="font-medium text-foreground">{entity.name}</p>
            <p className="truncate text-xs text-muted-foreground">/{entity.slug}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge value={entity.status} />
      </td>
      <td className="px-4 py-3 capitalize text-muted-foreground">{entity.visibility}</td>
      <td className="px-4 py-3 text-muted-foreground">
        {Math.round(entity.sourceConfidence * 100).toLocaleString()}%
      </td>
      <td className="px-4 py-3 text-muted-foreground">{formatDate(entity.updatedAt)}</td>
      <td className="px-4 py-3 text-right">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onOpenEntity?.(entity.id)}
          disabled={!onOpenEntity}
          aria-label={`Open ${entity.name}`}
        >
          Open
          <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </td>
    </tr>
  );
}

function StatusBadge({ value }: { value: ExploreEntityStatus }) {
  const classes: Record<ExploreEntityStatus, string> = {
    draft: 'bg-slate-100 text-slate-700',
    imported: 'bg-blue-100 text-blue-700',
    validated: 'bg-cyan-100 text-cyan-700',
    reviewed: 'bg-violet-100 text-violet-700',
    published: 'bg-emerald-100 text-emerald-700',
    verified: 'bg-green-100 text-green-700',
    archived: 'bg-zinc-200 text-zinc-700',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${classes[value]}`}>
      {value}
    </span>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  allLabel: string;
  allValue?: string;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
  allValue = '',
}: FilterSelectProps) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value={allValue}>{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
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

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown' : dateFormatter.format(date);
}
