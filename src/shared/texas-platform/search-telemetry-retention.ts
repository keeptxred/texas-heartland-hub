import type { SharedSearchTelemetryEvent } from './search-telemetry';

export const DEFAULT_SEARCH_TELEMETRY_RETENTION_DAYS = 90;
export const MAX_SEARCH_TELEMETRY_EVENTS = 10_000;

export function retainRecentSearchTelemetry(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
  options: { now?: Date; retentionDays?: number; maxEvents?: number } = {},
) {
  const now = options.now ?? new Date();
  const retentionDays = Math.max(1, options.retentionDays ?? DEFAULT_SEARCH_TELEMETRY_RETENTION_DAYS);
  const maxEvents = Math.max(0, options.maxEvents ?? MAX_SEARCH_TELEMETRY_EVENTS);
  const cutoff = now.getTime() - retentionDays * 24 * 60 * 60 * 1000;

  return events
    .filter((event) => {
      const occurredAt = Date.parse(event.occurredAt);
      return Number.isFinite(occurredAt) && occurredAt >= cutoff && occurredAt <= now.getTime();
    })
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
    .slice(0, maxEvents);
}

export function searchTelemetryForWindow(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
  days: number,
  now = new Date(),
) {
  return retainRecentSearchTelemetry(events, {
    now,
    retentionDays: Math.max(1, days),
    maxEvents: events.length,
  });
}
