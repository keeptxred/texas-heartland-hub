import { describe, expect, it } from 'vitest';
import {
  acknowledgeSearchTelemetryIncident,
  reconcileSearchTelemetryIncidents,
  resolveSearchTelemetryIncident,
  upsertSearchTelemetryIncident,
} from './search-telemetry-incidents';
import type { SearchTelemetryAnomaly } from './search-telemetry-anomalies';

const anomaly: SearchTelemetryAnomaly = {
  code: 'zero-results-high',
  severity: 'warning',
  message: '30% of searches returned no results.',
  value: 30,
};

describe('search telemetry incidents', () => {
  it('opens, updates and reopens incidents', () => {
    const opened = upsertSearchTelemetryIncident(anomaly, undefined, '2026-08-03T00:00:00.000Z');
    expect(opened.status).toBe('open');
    const updated = upsertSearchTelemetryIncident({ ...anomaly, severity: 'critical' }, opened, '2026-08-03T01:00:00.000Z');
    expect(updated.severity).toBe('critical');
    expect(updated.occurrences).toBe(2);
    const reopened = upsertSearchTelemetryIncident(anomaly, resolveSearchTelemetryIncident(updated), '2026-08-04T00:00:00.000Z');
    expect(reopened.status).toBe('open');
    expect(reopened.resolvedAt).toBeUndefined();
  });

  it('acknowledges and resolves incidents immutably', () => {
    const opened = upsertSearchTelemetryIncident(anomaly, undefined, '2026-08-03T00:00:00.000Z');
    const acknowledged = acknowledgeSearchTelemetryIncident(opened, '2026-08-03T01:00:00.000Z');
    const resolved = resolveSearchTelemetryIncident(acknowledged, '2026-08-03T02:00:00.000Z');
    expect(acknowledged.status).toBe('acknowledged');
    expect(resolved.status).toBe('resolved');
    expect(opened.status).toBe('open');
  });

  it('reconciles active, resolved and newly introduced anomalies', () => {
    const existing = upsertSearchTelemetryIncident(anomaly, undefined, '2026-08-03T00:00:00.000Z');
    const clickAnomaly: SearchTelemetryAnomaly = {
      code: 'click-through-low', severity: 'critical', message: 'CTR is 0%.', value: 0,
    };
    const reconciled = reconcileSearchTelemetryIncidents([existing], [clickAnomaly], '2026-08-04T00:00:00.000Z');
    expect(reconciled.find((incident) => incident.anomalyCode === 'zero-results-high')?.status).toBe('resolved');
    expect(reconciled[0].anomalyCode).toBe('click-through-low');
    expect(reconciled[0].status).toBe('open');
  });
});
