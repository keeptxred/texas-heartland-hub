import { describe, expect, it } from 'vitest';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import { evaluateSearchTelemetryOperations, searchTelemetryOperationsHealthy } from './search-telemetry-operations';

describe('search telemetry operations', () => {
  it('returns a healthy state for a small clean sample', () => {
    const events = [createSharedSearchTelemetryEvent({ query: 'property taxes', resultCount: 3, selectedType: 'all', clickedEntityId: 'calculator:property-tax' })];
    const state = evaluateSearchTelemetryOperations(events, {}, { now: '2026-08-03T20:00:00.000Z' });
    expect(state.digest.status).toBe('healthy');
    expect(state.incidents).toEqual([]);
    expect(state.alerts).toEqual([]);
    expect(searchTelemetryOperationsHealthy(state)).toBe(true);
  });

  it('creates incidents and alert decisions for sustained failures', () => {
    const events = Array.from({ length: 20 }, (_, index) => createSharedSearchTelemetryEvent({
      query: `missing topic ${index}`,
      resultCount: 0,
      selectedType: 'all',
      occurredAt: `2026-08-03T19:${String(index).padStart(2, '0')}:00.000Z`,
    }));
    const state = evaluateSearchTelemetryOperations(events, {}, { now: '2026-08-03T20:00:00.000Z', alertChannels: ['admin', 'log'] });
    expect(state.digest.status).toBe('critical');
    expect(state.incidents.length).toBeGreaterThan(0);
    expect(state.alerts.length).toBeGreaterThan(0);
    expect(state.alertDecisions.every((decision) => decision.shouldSend)).toBe(true);
    expect(searchTelemetryOperationsHealthy(state)).toBe(false);
  });

  it('does not mutate previous state', () => {
    const previous = { incidents: [], alertState: [] };
    evaluateSearchTelemetryOperations([], previous, { now: '2026-08-03T20:00:00.000Z' });
    expect(previous).toEqual({ incidents: [], alertState: [] });
  });
});
