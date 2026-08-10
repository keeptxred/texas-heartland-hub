import { describe, expect, it } from 'vitest';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import {
  compareSearchTelemetryAnomalySnapshots,
  createSearchTelemetryAnomalySnapshot,
  latestSearchTelemetryAnomalySnapshot,
} from './search-telemetry-anomaly-history';

function events(count: number, resultCount: number, clicked = false) {
  return Array.from({ length: count }, (_, index) => createSharedSearchTelemetryEvent({
    query: `query ${index}`,
    resultCount,
    selectedType: 'all',
    clickedEntityId: clicked ? `resource:${index}` : undefined,
    occurredAt: `2026-08-03T${String(index).padStart(2, '0')}:00:00.000Z`,
  }));
}

describe('search telemetry anomaly history', () => {
  it('creates immutable anomaly snapshots', () => {
    const source = events(20, 0);
    const snapshot = createSearchTelemetryAnomalySnapshot(source, '2026-08-03T20:00:00.000Z');
    expect(snapshot.capturedAt).toBe('2026-08-03T20:00:00.000Z');
    expect(snapshot.anomalies.length).toBeGreaterThan(0);
    expect(source).toHaveLength(20);
  });

  it('identifies introduced, resolved and persisted anomalies', () => {
    const previous = createSearchTelemetryAnomalySnapshot(events(20, 0), '2026-08-03T19:00:00.000Z');
    const current = createSearchTelemetryAnomalySnapshot(events(20, 4, false), '2026-08-03T20:00:00.000Z');
    const change = compareSearchTelemetryAnomalySnapshots(previous, current);
    expect(change.resolved.length).toBeGreaterThan(0);
    expect(change.introduced.length + change.persisted.length).toBe(current.anomalies.length);
  });

  it('returns the newest snapshot without mutating history', () => {
    const older = createSearchTelemetryAnomalySnapshot([], '2026-08-01T00:00:00.000Z');
    const newer = createSearchTelemetryAnomalySnapshot([], '2026-08-03T00:00:00.000Z');
    const history = [older, newer];
    expect(latestSearchTelemetryAnomalySnapshot(history)).toBe(newer);
    expect(history).toEqual([older, newer]);
  });
});
