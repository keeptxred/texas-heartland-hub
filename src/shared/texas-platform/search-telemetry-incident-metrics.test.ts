import { describe, expect, it } from 'vitest';
import type { SearchTelemetryIncident } from './search-telemetry-incidents';
import { activeSearchTelemetryIncidents, summarizeSearchTelemetryIncidents } from './search-telemetry-incident-metrics';
import { breachedSearchTelemetryIncidentSlas, evaluateSearchTelemetryIncidentSla } from './search-telemetry-incident-sla';

const incidents: SearchTelemetryIncident[] = [
  {
    id: 'zero-results-high', anomalyCode: 'zero-results-high', severity: 'critical', status: 'open',
    openedAt: '2026-08-03T10:00:00.000Z', updatedAt: '2026-08-03T10:00:00.000Z', occurrences: 2,
    latestMessage: 'High zero-result rate.',
  },
  {
    id: 'click-through-low', anomalyCode: 'click-through-low', severity: 'warning', status: 'acknowledged',
    openedAt: '2026-08-03T11:00:00.000Z', updatedAt: '2026-08-03T11:30:00.000Z', acknowledgedAt: '2026-08-03T11:30:00.000Z', occurrences: 1,
    latestMessage: 'Low click-through rate.',
  },
  {
    id: 'redaction-high', anomalyCode: 'redaction-high', severity: 'warning', status: 'resolved',
    openedAt: '2026-08-03T08:00:00.000Z', updatedAt: '2026-08-03T09:00:00.000Z', resolvedAt: '2026-08-03T09:00:00.000Z', occurrences: 1,
    latestMessage: 'High redaction rate.',
  },
];

describe('search incident metrics', () => {
  it('summarizes lifecycle, severity and resolution duration', () => {
    const summary = summarizeSearchTelemetryIncidents(incidents);
    expect(summary).toEqual(expect.objectContaining({
      total: 3, open: 1, acknowledged: 1, resolved: 1, criticalActive: 1, warningActive: 1,
      averageResolutionMinutes: 60,
    }));
    expect(summary.oldestActive?.id).toBe('zero-results-high');
  });

  it('returns only active incidents without mutating the source', () => {
    const active = activeSearchTelemetryIncidents(incidents);
    expect(active.map((incident) => incident.id)).toEqual(['zero-results-high', 'click-through-low']);
    expect(incidents).toHaveLength(3);
  });
});

describe('search incident SLAs', () => {
  it('marks a critical incident breached after its target', () => {
    const status = evaluateSearchTelemetryIncidentSla(incidents[0], {}, '2026-08-03T11:30:00.000Z');
    expect(status).toEqual(expect.objectContaining({ targetMinutes: 60, ageMinutes: 90, breached: true, remainingMinutes: 0 }));
  });

  it('keeps a warning incident within its default target', () => {
    const status = evaluateSearchTelemetryIncidentSla(incidents[1], {}, '2026-08-03T12:00:00.000Z');
    expect(status.breached).toBe(false);
    expect(status.remainingMinutes).toBe(1380);
  });

  it('returns active breached incidents in oldest-first breach order', () => {
    const breaches = breachedSearchTelemetryIncidentSlas(incidents, { criticalMinutes: 30, warningMinutes: 30 }, '2026-08-03T12:00:00.000Z');
    expect(breaches.map((entry) => entry.incident.id)).toEqual(['zero-results-high', 'click-through-low']);
  });

  it('rejects invalid SLA settings', () => {
    expect(() => evaluateSearchTelemetryIncidentSla(incidents[0], { criticalMinutes: 0 })).toThrow();
  });
});
