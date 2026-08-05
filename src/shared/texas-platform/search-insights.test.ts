import { afterEach, describe, expect, it } from 'vitest';
import { sharedSearchInsights } from './search-insights';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import {
  clearSharedSearchTelemetrySinksForTests,
  recordSharedSearchTelemetry,
  registerSharedSearchTelemetrySink,
} from './search-telemetry-store';

afterEach(() => clearSharedSearchTelemetrySinksForTests());

function event(query: string, resultCount: number, clickedEntityId?: string) {
  return createSharedSearchTelemetryEvent({ query, resultCount, selectedType: 'all', clickedEntityId, occurredAt: '2026-08-03T00:00:00.000Z' });
}

describe('shared search insights', () => {
  it('prioritizes repeated zero-result searches', () => {
    const insights = sharedSearchInsights([
      event('permit help', 0), event('permit help', 0), event('permit help', 0),
      event('mortgage', 2, 'resource:mortgage'),
    ]);
    expect(insights[0]).toEqual(expect.objectContaining({ id: 'zero:permit help', priority: 'medium', count: 3 }));
  });

  it('flags searches with results but no clicks', () => {
    const insights = sharedSearchInsights(Array.from({ length: 5 }, () => event('property records', 4)));
    expect(insights[0]).toEqual(expect.objectContaining({ id: 'noclick:property records', count: 5 }));
  });

  it('does not mutate the source event collection', () => {
    const events = [event('taxes', 1, 'resource:taxes')];
    const copy = [...events];
    sharedSearchInsights(events);
    expect(events).toEqual(copy);
  });
});

describe('shared search telemetry sinks', () => {
  it('records through every registered sink and isolates failures', async () => {
    const recorded: string[] = [];
    registerSharedSearchTelemetrySink({ id: 'memory', record: (value) => { recorded.push(value.query); } });
    registerSharedSearchTelemetrySink({ id: 'failure', record: () => { throw new Error('unavailable'); } });
    const result = await recordSharedSearchTelemetry(event('Texas laws', 2));
    expect(recorded).toEqual(['texas laws']);
    expect(result).toEqual([
      { id: 'memory', status: 'fulfilled' },
      { id: 'failure', status: 'rejected' },
    ]);
  });

  it('normalizes sink ids and rejects duplicates', () => {
    registerSharedSearchTelemetrySink({ id: ' analytics ', record: () => undefined });
    expect(() => registerSharedSearchTelemetrySink({ id: 'analytics', record: () => undefined })).toThrow('already registered');
  });
});
