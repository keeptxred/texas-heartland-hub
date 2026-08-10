import type { SharedSearchTelemetryEvent } from './search-telemetry';
import { summarizeSharedSearchTelemetry } from './search-telemetry';
import { detectSharedSearchTelemetryAnomalies } from './search-telemetry-anomalies';
import { buildSearchTelemetryRemediationPlan } from './search-telemetry-remediation';

export type SearchTelemetryDigest = {
  generatedAt: string;
  summary: ReturnType<typeof summarizeSharedSearchTelemetry>;
  anomalies: ReturnType<typeof detectSharedSearchTelemetryAnomalies>;
  remediation: ReturnType<typeof buildSearchTelemetryRemediationPlan>;
  status: 'healthy' | 'attention' | 'critical';
};

export function buildSearchTelemetryDigest(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
  options: Parameters<typeof detectSharedSearchTelemetryAnomalies>[1] & { generatedAt?: string } = {},
): SearchTelemetryDigest {
  const { generatedAt = new Date().toISOString(), ...anomalyOptions } = options;
  const summary = summarizeSharedSearchTelemetry(events);
  const anomalies = detectSharedSearchTelemetryAnomalies(events, anomalyOptions);
  const remediation = buildSearchTelemetryRemediationPlan(anomalies);
  const status = anomalies.some((anomaly) => anomaly.severity === 'critical')
    ? 'critical'
    : anomalies.length
      ? 'attention'
      : 'healthy';

  return { generatedAt, summary, anomalies, remediation, status };
}

export function searchTelemetryDigestHeadline(digest: SearchTelemetryDigest) {
  if (digest.status === 'critical') return 'Search needs immediate attention';
  if (digest.status === 'attention') return 'Search has items to review';
  return 'Search is healthy';
}
