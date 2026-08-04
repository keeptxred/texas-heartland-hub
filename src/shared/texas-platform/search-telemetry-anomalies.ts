import type { SharedSearchTelemetryEvent } from './search-telemetry';
import { summarizeSharedSearchTelemetry } from './search-telemetry';

export type SearchTelemetryAnomaly = {
  code: 'zero-results-high' | 'click-through-low' | 'redaction-high';
  severity: 'warning' | 'critical';
  message: string;
  value: number;
};

export function detectSharedSearchTelemetryAnomalies(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
  options: { minimumSearches?: number; zeroResultWarningRate?: number; clickThroughWarningRate?: number; redactionWarningRate?: number } = {},
): SearchTelemetryAnomaly[] {
  const minimumSearches = options.minimumSearches ?? 20;
  const summary = summarizeSharedSearchTelemetry(events);
  if (summary.searches < minimumSearches) return [];

  const zeroResultRate = summary.searches ? Math.round((summary.zeroResultSearches / summary.searches) * 100) : 0;
  const redactedCount = events.filter((event) => Boolean((event as SharedSearchTelemetryEvent & { redacted?: boolean }).redacted)).length;
  const redactionRate = summary.searches ? Math.round((redactedCount / summary.searches) * 100) : 0;
  const anomalies: SearchTelemetryAnomaly[] = [];

  const zeroThreshold = options.zeroResultWarningRate ?? 25;
  const clickThreshold = options.clickThroughWarningRate ?? 10;
  const redactionThreshold = options.redactionWarningRate ?? 5;

  if (zeroResultRate >= zeroThreshold) {
    anomalies.push({
      code: 'zero-results-high',
      severity: zeroResultRate >= 50 ? 'critical' : 'warning',
      message: `${zeroResultRate}% of searches returned no results.`,
      value: zeroResultRate,
    });
  }
  if (summary.clickThroughRate <= clickThreshold) {
    anomalies.push({
      code: 'click-through-low',
      severity: summary.clickThroughRate === 0 ? 'critical' : 'warning',
      message: `Search click-through rate is ${summary.clickThroughRate}%.`,
      value: summary.clickThroughRate,
    });
  }
  if (redactionRate >= redactionThreshold) {
    anomalies.push({
      code: 'redaction-high',
      severity: redactionRate >= 20 ? 'critical' : 'warning',
      message: `${redactionRate}% of searches required privacy redaction.`,
      value: redactionRate,
    });
  }
  return anomalies;
}
