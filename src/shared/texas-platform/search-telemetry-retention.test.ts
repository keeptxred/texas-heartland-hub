import { describe, expect, it } from 'vitest';
import type { SharedSearchTelemetryEvent } from './search-telemetry';
import {
  retainRecentSearchTelemetry,
  searchTelemetryForWindow,
} from './search-telemetry-retention';

const event = (query: string, occurredAt: string): SharedSearchTelemetryEvent => ({
  query,
  resultCount: 1,
  selectedType: 'all',
  occurredAt,
});

describe('search telemetry retention', () => {
  const now = new Date('2026-08-03T23:00:00.000Z');

  it('removes expired, future and invalid events', () => {
    const retained = retainRecentSearchTelemetry([
      event('current', '2026-08-01T12:00:00.000Z'),
      event('expired', '2026-04-01T12:00:00.000Z'),
      event('future', '2026-08-04T12:00:00.000Z'),
      event('invalid', 'not-a-date'),
    ], { now, retentionDays: 90 });

    expect(retained.map((item) => item.query)).toEqual(['current']);
  });

  it('returns newest events first and enforces the cap', () => {
    const retained = retainRecentSearchTelemetry([
      event('older', '2026-08-01T12:00:00.000Z'),
      event('newest', '2026-08-03T12:00:00.000Z'),
      event('middle', '2026-08-02T12:00:00.000Z'),
    ], { now, maxEvents: 2 });

    expect(retained.map((item) => item.query)).toEqual(['newest', 'middle']);
  });

  it('supports reporting windows without mutating the source', () => {
    const events = [
      event('today', '2026-08-03T12:00:00.000Z'),
      event('last-month', '2026-07-01T12:00:00.000Z'),
    ];
    const result = searchTelemetryForWindow(events, 7, now);
    expect(result.map((item) => item.query)).toEqual(['today']);
    expect(events.map((item) => item.query)).toEqual(['today', 'last-month']);
  });
});
