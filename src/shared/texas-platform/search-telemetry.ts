import type { SharedEntityType } from './entities';
import { normalizeResourceSearchQuery } from './search-params';

export type SharedSearchTelemetryEvent = {
  query: string;
  resultCount: number;
  selectedType: SharedEntityType | 'all';
  clickedEntityId?: string;
  occurredAt: string;
};

export type SharedSearchTelemetrySummary = {
  searches: number;
  zeroResultSearches: number;
  clickThroughSearches: number;
  clickThroughRate: number;
  topQueries: Array<{ query: string; count: number }>;
  topZeroResultQueries: Array<{ query: string; count: number }>;
};

export function createSharedSearchTelemetryEvent(
  input: Omit<SharedSearchTelemetryEvent, 'query' | 'occurredAt'> & { query: string; occurredAt?: string },
): SharedSearchTelemetryEvent {
  return {
    ...input,
    query: normalizeResourceSearchQuery(input.query).toLowerCase(),
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  };
}

export function summarizeSharedSearchTelemetry(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
  topLimit = 10,
): SharedSearchTelemetrySummary {
  const queryCounts = new Map<string, number>();
  const zeroResultCounts = new Map<string, number>();
  let zeroResultSearches = 0;
  let clickThroughSearches = 0;

  for (const event of events) {
    if (!event.query) continue;
    queryCounts.set(event.query, (queryCounts.get(event.query) ?? 0) + 1);
    if (event.resultCount === 0) {
      zeroResultSearches += 1;
      zeroResultCounts.set(event.query, (zeroResultCounts.get(event.query) ?? 0) + 1);
    }
    if (event.clickedEntityId) clickThroughSearches += 1;
  }

  const searches = [...queryCounts.values()].reduce((sum, count) => sum + count, 0);
  return {
    searches,
    zeroResultSearches,
    clickThroughSearches,
    clickThroughRate: searches ? Math.round((clickThroughSearches / searches) * 100) : 0,
    topQueries: rankedCounts(queryCounts, topLimit),
    topZeroResultQueries: rankedCounts(zeroResultCounts, topLimit),
  };
}

function rankedCounts(counts: ReadonlyMap<string, number>, limit: number) {
  return [...counts.entries()]
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count || a.query.localeCompare(b.query))
    .slice(0, Math.max(0, limit));
}
