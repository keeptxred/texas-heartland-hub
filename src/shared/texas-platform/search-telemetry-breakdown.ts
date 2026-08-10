import type { SharedEntityType } from './entities';
import type { SharedSearchTelemetryEvent } from './search-telemetry';

export type SearchTelemetryTypeBreakdown = {
  type: SharedEntityType | 'all';
  searches: number;
  zeroResults: number;
  clicks: number;
  clickThroughRate: number;
};

export function sharedSearchTelemetryByType(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
): SearchTelemetryTypeBreakdown[] {
  const groups = new Map<SharedEntityType | 'all', { searches: number; zeroResults: number; clicks: number }>();

  for (const event of events) {
    if (!event.query.trim()) continue;
    const group = groups.get(event.selectedType) ?? { searches: 0, zeroResults: 0, clicks: 0 };
    group.searches += 1;
    if (event.resultCount === 0) group.zeroResults += 1;
    if (event.clickedEntityId) group.clicks += 1;
    groups.set(event.selectedType, group);
  }

  return [...groups.entries()]
    .map(([type, group]) => ({
      type,
      ...group,
      clickThroughRate: group.searches ? Math.round((group.clicks / group.searches) * 100) : 0,
    }))
    .sort((a, b) => b.searches - a.searches || a.type.localeCompare(b.type));
}
