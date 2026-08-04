import { describe, expect, it } from 'vitest';
import type { SearchTelemetryIncident } from './search-telemetry-incidents';
import { pendingSearchTelemetryIncidentEscalations, planSearchTelemetryIncidentEscalation } from './search-telemetry-incident-escalation';

function incident(overrides: Partial<SearchTelemetryIncident> = {}): SearchTelemetryIncident {
  return {
    id: 'zero-results-high',
    anomalyCode: 'zero-results-high',
    severity: 'critical',
    status: 'open',
    openedAt: '2026-08-03T10:00:00.000Z',
    updatedAt: '2026-08-03T10:00:00.000Z',
    occurrences: 1,
    latestMessage: 'High zero-result rate.',
    ...overrides,
  };
}

describe('search incident escalation', () => {
  it('escalates an unacknowledged critical incident to its owner', () => {
    expect(planSearchTelemetryIncidentEscalation(incident(), {}, '2026-08-03T10:30:00.000Z').level).toBe('owner');
  });

  it('marks a breached critical incident urgent', () => {
    expect(planSearchTelemetryIncidentEscalation(incident(), { criticalMinutes: 30 }, '2026-08-03T11:00:00.000Z').level).toBe('urgent');
  });

  it('does not escalate a resolved incident', () => {
    const resolved = incident({ status: 'resolved', resolvedAt: '2026-08-03T10:15:00.000Z' });
    expect(planSearchTelemetryIncidentEscalation(resolved).level).toBe('none');
  });

  it('returns urgent escalations before owner escalations without mutating input', () => {
    const source = [
      incident({ id: 'critical', openedAt: '2026-08-03T09:00:00.000Z' }),
      incident({ id: 'warning', anomalyCode: 'click-through-low', severity: 'warning', openedAt: '2026-08-03T09:00:00.000Z' }),
    ];
    const result = pendingSearchTelemetryIncidentEscalations(source, { criticalMinutes: 30, warningMinutes: 30 }, '2026-08-03T10:00:00.000Z');
    expect(result.map((item) => item.level)).toEqual(['urgent', 'owner']);
    expect(source[0].id).toBe('critical');
  });
});
