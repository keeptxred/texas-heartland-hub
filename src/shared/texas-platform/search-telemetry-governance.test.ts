import { describe, expect, it } from 'vitest';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import { sharedSearchTelemetryByType } from './search-telemetry-breakdown';
import { sharedSearchTelemetryCsv, sharedSearchTelemetryJson } from './search-telemetry-export';
import { validateSharedSearchTelemetryEvent, validSharedSearchTelemetryEvents } from './search-telemetry-validation';

describe('search telemetry governance', () => {
  const events = [
    createSharedSearchTelemetryEvent({ query: 'property taxes', resultCount: 4, selectedType: 'all', clickedEntityId: 'calculator:tax', occurredAt: '2026-08-03T20:00:00.000Z' }),
    createSharedSearchTelemetryEvent({ query: 'mortgage', resultCount: 2, selectedType: 'calculator', occurredAt: '2026-08-03T19:00:00.000Z' }),
    createSharedSearchTelemetryEvent({ query: 'unknown', resultCount: 0, selectedType: 'all', occurredAt: '2026-08-03T18:00:00.000Z' }),
  ];

  it('validates well-formed events and rejects malformed events', () => {
    expect(validateSharedSearchTelemetryEvent(events[0]).valid).toBe(true);
    const invalid = { ...events[0], query: '', resultCount: -1, occurredAt: 'not-a-date' };
    expect(validateSharedSearchTelemetryEvent(invalid)).toEqual(expect.objectContaining({ valid: false }));
    expect(validSharedSearchTelemetryEvents([...events, invalid])).toHaveLength(3);
  });

  it('exports valid events to CSV and JSON', () => {
    const csv = sharedSearchTelemetryCsv(events);
    expect(csv).toContain('occurred_at,query,selected_type');
    expect(csv).toContain('property taxes');
    expect(JSON.parse(sharedSearchTelemetryJson(events))).toHaveLength(3);
  });

  it('summarizes telemetry by selected type', () => {
    expect(sharedSearchTelemetryByType(events)).toEqual([
      expect.objectContaining({ type: 'all', searches: 2, zeroResults: 1, clicks: 1, clickThroughRate: 50 }),
      expect.objectContaining({ type: 'calculator', searches: 1, zeroResults: 0, clicks: 0, clickThroughRate: 0 }),
    ]);
  });
});
