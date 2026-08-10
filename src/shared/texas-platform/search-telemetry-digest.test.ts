import { describe, expect, it } from 'vitest';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import { buildSearchTelemetryDigest, searchTelemetryDigestHeadline } from './search-telemetry-digest';

function events(count: number, resultCount: number, clicked = false) {
  return Array.from({ length: count }, (_, index) => createSharedSearchTelemetryEvent({
    query: `query ${index}`,
    resultCount,
    selectedType: 'all',
    clickedEntityId: clicked ? `resource:${index}` : undefined,
    occurredAt: `2026-08-03T23:${String(index).padStart(2, '0')}:00.000Z`,
  }));
}

describe('search telemetry digest', () => {
  it('reports healthy search when thresholds are satisfied', () => {
    const digest = buildSearchTelemetryDigest(events(20, 4, true), { generatedAt: '2026-08-04T00:00:00.000Z' });
    expect(digest.status).toBe('healthy');
    expect(digest.anomalies).toEqual([]);
    expect(searchTelemetryDigestHeadline(digest)).toBe('Search is healthy');
  });

  it('reports critical status and remediation for severe zero-result traffic', () => {
    const digest = buildSearchTelemetryDigest(events(20, 0), { generatedAt: '2026-08-04T00:00:00.000Z' });
    expect(digest.status).toBe('critical');
    expect(digest.remediation).toEqual(expect.arrayContaining([
      expect.objectContaining({ anomalyCode: 'zero-results-high', priority: 'high' }),
    ]));
    expect(searchTelemetryDigestHeadline(digest)).toBe('Search needs immediate attention');
  });

  it('honors minimum sample configuration', () => {
    const digest = buildSearchTelemetryDigest(events(3, 0), { minimumSearches: 10 });
    expect(digest.status).toBe('healthy');
  });
});
