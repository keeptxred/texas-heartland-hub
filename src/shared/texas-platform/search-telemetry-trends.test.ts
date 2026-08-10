import { describe, expect, it } from 'vitest';
import type { SharedSearchTelemetryEvent } from './search-telemetry';
import { compareSearchTelemetryWindows } from './search-telemetry-trends';

const event = (
  query: string,
  occurredAt: string,
  resultCount = 1,
  clickedEntityId?: string,
): SharedSearchTelemetryEvent => ({
  query,
  resultCount,
  selectedType: 'all',
  clickedEntityId,
  occurredAt,
});

describe('search telemetry trends', () => {
  it('compares current and previous windows', () => {
    const trend = compareSearchTelemetryWindows([
      event('current clicked', '2026-08-02T12:00:00.000Z', 2, 'resource:a'),
      event('current zero', '2026-08-01T12:00:00.000Z', 0),
      event('previous', '2026-07-20T12:00:00.000Z', 1),
    ], 14, new Date('2026-08-03T23:00:00.000Z'));

    expect(trend.current.searches).toBe(2);
    expect(trend.previous.searches).toBe(1);
    expect(trend.searchChange).toBe(1);
    expect(trend.zeroResultChange).toBe(1);
    expect(trend.clickThroughRateChange).toBe(50);
  });

  it('uses a minimum one-day window', () => {
    const trend = compareSearchTelemetryWindows([], 0, new Date('2026-08-03T23:00:00.000Z'));
    expect(trend.current.searches).toBe(0);
    expect(trend.previous.searches).toBe(0);
  });
});
