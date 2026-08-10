import { describe, expect, it } from 'vitest';
import { buildSearchTelemetryRemediationPlan, remediationForSearchTelemetryAnomaly } from './search-telemetry-remediation';

describe('search telemetry remediation', () => {
  it('maps zero-result anomalies to content and alias work', () => {
    const remediation = remediationForSearchTelemetryAnomaly({
      code: 'zero-results-high',
      severity: 'critical',
      message: '50% returned no results',
      value: 50,
    });
    expect(remediation.priority).toBe('high');
    expect(remediation.action).toContain('aliases');
  });

  it('maps click-through anomalies to ranking and presentation work', () => {
    const remediation = remediationForSearchTelemetryAnomaly({
      code: 'click-through-low',
      severity: 'warning',
      message: 'Click-through is low',
      value: 8,
    });
    expect(remediation.priority).toBe('medium');
    expect(remediation.action).toContain('ranking');
  });

  it('sorts high-priority work before medium-priority work without mutating input', () => {
    const anomalies = [
      { code: 'click-through-low' as const, severity: 'warning' as const, message: 'low', value: 8 },
      { code: 'redaction-high' as const, severity: 'critical' as const, message: 'high', value: 25 },
    ];
    const plan = buildSearchTelemetryRemediationPlan(anomalies);
    expect(plan[0].priority).toBe('high');
    expect(anomalies[0].code).toBe('click-through-low');
  });
});
