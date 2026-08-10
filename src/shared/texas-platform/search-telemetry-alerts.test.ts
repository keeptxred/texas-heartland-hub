import { describe, expect, it } from 'vitest';
import {
  createSearchTelemetryAlerts,
  deduplicateSearchTelemetryAlerts,
  sortSearchTelemetryAlerts,
} from './search-telemetry-alerts';

const anomalies = [
  { code: 'zero-results-high' as const, severity: 'critical' as const, message: '55% returned no results.', value: 55 },
  { code: 'click-through-low' as const, severity: 'warning' as const, message: 'CTR is 8%.', value: 8 },
];

describe('search telemetry alerts', () => {
  it('creates one alert per anomaly and channel', () => {
    const alerts = createSearchTelemetryAlerts(anomalies, {
      channels: ['admin', 'email'],
      createdAt: '2026-08-03T23:00:00.000Z',
    });
    expect(alerts).toHaveLength(4);
    expect(alerts[0]).toEqual(expect.objectContaining({
      key: 'zero-results-high:admin',
      severity: 'critical',
      channel: 'admin',
    }));
  });

  it('deduplicates repeated channels and defaults to admin', () => {
    expect(createSearchTelemetryAlerts(anomalies.slice(0, 1), { channels: ['admin', 'admin'] })).toHaveLength(1);
    expect(createSearchTelemetryAlerts(anomalies.slice(0, 1))[0].channel).toBe('admin');
  });

  it('filters alerts already delivered', () => {
    const alerts = createSearchTelemetryAlerts(anomalies);
    expect(deduplicateSearchTelemetryAlerts(alerts, new Set(['zero-results-high:admin']))).toEqual([
      expect.objectContaining({ key: 'click-through-low:admin' }),
    ]);
  });

  it('sorts critical alerts first without mutating input', () => {
    const alerts = createSearchTelemetryAlerts([...anomalies].reverse());
    const original = [...alerts];
    expect(sortSearchTelemetryAlerts(alerts)[0].severity).toBe('critical');
    expect(alerts).toEqual(original);
  });
});
