import type { SharedSearchTelemetryEvent } from './search-telemetry';

export type SharedSearchInsight = {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  query?: string;
  count?: number;
};

export function sharedSearchInsights(events: ReadonlyArray<SharedSearchTelemetryEvent>): SharedSearchInsight[] {
  const byQuery = new Map<string, SharedSearchTelemetryEvent[]>();
  for (const event of events) {
    if (!event.query) continue;
    const group = byQuery.get(event.query) ?? [];
    group.push(event);
    byQuery.set(event.query, group);
  }

  const insights: SharedSearchInsight[] = [];
  for (const [query, group] of byQuery) {
    const searches = group.length;
    const zeroResults = group.filter((event) => event.resultCount === 0).length;
    const clicks = group.filter((event) => Boolean(event.clickedEntityId)).length;

    if (zeroResults >= 3) {
      insights.push({
        id: `zero:${query}`,
        priority: zeroResults >= 10 ? 'high' : 'medium',
        title: `Add or improve results for “${query}”`,
        description: `${zeroResults} searches returned no results. Add an entity, alias, search term or provider record that answers this need.`,
        query,
        count: zeroResults,
      });
      continue;
    }

    if (searches >= 5 && clicks === 0) {
      insights.push({
        id: `noclick:${query}`,
        priority: searches >= 15 ? 'high' : 'medium',
        title: `Improve result quality for “${query}”`,
        description: `${searches} searches produced results but no recorded clicks. Review ranking, titles and summaries.`,
        query,
        count: searches,
      });
    }
  }

  return insights.sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 } as const;
    return priority[a.priority] - priority[b.priority] || (b.count ?? 0) - (a.count ?? 0) || a.title.localeCompare(b.title);
  });
}
