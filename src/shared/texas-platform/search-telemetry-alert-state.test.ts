import { describe, expect, it } from 'vitest';
import { evaluateSearchTelemetryAlert, resolveMissingSearchTelemetryAlerts } from './search-telemetry-alert-state';
import type { SearchTelemetryAlert } from './search-telemetry-alerts';

const alert: SearchTelemetryAlert = {
  id: 'zero-results-high|admin',
  anomalyCode: 'zero-results-high',
  severity: 'warning',
  channel: 'admin',
  title: 'Search needs attention',
  message: '30% of searches returned no results.',
};

describe('search telemetry alert state', () => {
  it('sends a new alert and stores its state', () => {
    const decision = evaluateSearchTelemetryAlert(alert, undefined, { now: '2026-08-03T00:00:00.000Z' });
    expect(decision.shouldSend).toBe(true);
    expect(decision.reason).toBe('new');
    expect(decision.state.occurrences).toBe(1);
  });

  it('suppresses repeated alerts during cooldown', () => {
    const first = evaluateSearchTelemetryAlert(alert, undefined, { now: '2026-08-03T00:00:00.000Z' });
    const next = evaluateSearchTelemetryAlert(alert, first.state, {
      now: '2026-08-03T01:00:00.000Z',
      cooldownMs: 6 * 60 * 60 * 1000,
      previousSeverity: 'warning',
    });
    expect(next.shouldSend).toBe(false);
    expect(next.reason).toBe('cooldown-active');
    expect(next.state.occurrences).toBe(2);
  });

  it('sends again after cooldown and immediately on escalation', () => {
    const first = evaluateSearchTelemetryAlert(alert, undefined, { now: '2026-08-03T00:00:00.000Z' });
    const expired = evaluateSearchTelemetryAlert(alert, first.state, {
      now: '2026-08-03T07:00:00.000Z',
      cooldownMs: 6 * 60 * 60 * 1000,
      previousSeverity: 'warning',
    });
    expect(expired.reason).toBe('cooldown-expired');

    const critical = { ...alert, severity: 'critical' as const };
    const escalated = evaluateSearchTelemetryAlert(critical, first.state, {
      now: '2026-08-03T01:00:00.000Z',
      previousSeverity: 'warning',
    });
    expect(escalated.shouldSend).toBe(true);
    expect(escalated.reason).toBe('escalated');
  });

  it('marks missing alerts resolved without mutating input', () => {
    const state = evaluateSearchTelemetryAlert(alert, undefined, { now: '2026-08-03T00:00:00.000Z' }).state;
    const resolved = resolveMissingSearchTelemetryAlerts([state], [], '2026-08-04T00:00:00.000Z');
    expect(resolved[0].status).toBe('resolved');
    expect(state.status).toBe('active');
  });

  it('rejects invalid cooldown settings', () => {
    expect(() => evaluateSearchTelemetryAlert(alert, undefined, { cooldownMs: -1 })).toThrow(
      'cooldown must be zero or greater',
    );
  });
});
