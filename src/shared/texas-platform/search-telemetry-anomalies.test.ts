import { describe, expect, it } from 'vitest';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import { detectSharedSearchTelemetryAnomalies } from './search-telemetry-anomalies';

describe('search telemetry anomalies', () => {
  it('waits for a meaningful sample', () => {
    const events = [createSharedSearchTelemetryEvent({ query: 'taxes', resultCount: 0, selectedType: 'all' })];
    expect(detectSharedSearchTelemetryAnomalies(events)).toEqual([]);
  });

  it('detects high zero-result and low click-through rates', () => {
    const events = Array.from({ length: 20 }, (_, index) => createSharedSearchTelemetryEvent({
      query: `query ${index}`,
      resultCount: index < 12 ? 0 : 2,
      selectedType: 'all',
      clickedEntityId: index === 19 ? 'resource:one' : undefined,
    }));
    const anomalies = detectSharedSearchTelemetryAnomalies(events);
    expect(anomalies).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'zero-results-high', severity: 'critical' }),
      expect.objectContaining({ code: 'click-through-low' }),
    ]));
  });

  it('detects elevated privacy redaction', () => {
    const events = Array.from({ length: 20 }, (_, index) => ({
      ...createSharedSearchTelemetryEvent({ query: `query ${index}`, resultCount: 1, selectedType: 'all', clickedEntityId: `resource:${index}` }),
      redacted: index < 4,
    }));
    expect(detectSharedSearchTelemetryAnomalies(events)).toContainEqual(
      expect.objectContaining({ code: 'redaction-high', severity: 'critical', value: 20 }),
    );
  });
});
