import type { SharedEntity } from './entities';
import { searchEntityCollection } from './entities';
import type { SharedSite } from './registry';
import type { SharedSearchTelemetryEvent } from './search-telemetry';

export type SharedSearchContentGap = {
  query: string;
  searches: number;
  zeroResultSearches: number;
  currentMatches: number;
  recommendation: 'create-content' | 'add-search-terms' | 'improve-ranking';
  priorityScore: number;
};

export function sharedSearchContentGaps(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
  entities: ReadonlyArray<SharedEntity>,
  site: SharedSite,
): SharedSearchContentGap[] {
  const grouped = new Map<string, SharedSearchTelemetryEvent[]>();
  for (const event of events) {
    if (!event.query) continue;
    const group = grouped.get(event.query) ?? [];
    group.push(event);
    grouped.set(event.query, group);
  }

  return [...grouped.entries()]
    .map(([query, group]) => {
      const searches = group.length;
      const zeroResultSearches = group.filter((event) => event.resultCount === 0).length;
      const currentMatches = searchEntityCollection(query, entities, site, 20).length;
      const clicks = group.filter((event) => Boolean(event.clickedEntityId)).length;
      const recommendation = currentMatches === 0
        ? 'create-content' as const
        : zeroResultSearches > 0
          ? 'add-search-terms' as const
          : clicks === 0
            ? 'improve-ranking' as const
            : null;
      if (!recommendation) return null;
      return {
        query,
        searches,
        zeroResultSearches,
        currentMatches,
        recommendation,
        priorityScore: zeroResultSearches * 10 + searches * 2 + (clicks === 0 ? 5 : 0),
      };
    })
    .filter((gap): gap is SharedSearchContentGap => Boolean(gap))
    .sort((a, b) => b.priorityScore - a.priorityScore || a.query.localeCompare(b.query));
}
