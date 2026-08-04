import type { SearchTelemetryAnomaly } from './search-telemetry-anomalies';

export type SearchTelemetryAlertChannel = 'admin' | 'email' | 'log';

export type SearchTelemetryAlert = {
  key: string;
  title: string;
  message: string;
  severity: SearchTelemetryAnomaly['severity'];
  channel: SearchTelemetryAlertChannel;
  createdAt: string;
};

export function createSearchTelemetryAlerts(
  anomalies: ReadonlyArray<SearchTelemetryAnomaly>,
  options: { channels?: ReadonlyArray<SearchTelemetryAlertChannel>; createdAt?: string } = {},
): SearchTelemetryAlert[] {
  const channels = options.channels?.length ? [...new Set(options.channels)] : ['admin'];
  const createdAt = options.createdAt ?? new Date().toISOString();

  return anomalies.flatMap((anomaly) =>
    channels.map((channel) => ({
      key: `${anomaly.code}:${channel}`,
      title: alertTitle(anomaly),
      message: anomaly.message,
      severity: anomaly.severity,
      channel,
      createdAt,
    })),
  );
}

export function deduplicateSearchTelemetryAlerts(
  alerts: ReadonlyArray<SearchTelemetryAlert>,
  existingKeys: ReadonlySet<string>,
) {
  return alerts.filter((alert) => !existingKeys.has(alert.key));
}

export function sortSearchTelemetryAlerts(alerts: ReadonlyArray<SearchTelemetryAlert>) {
  const severityPriority: Record<SearchTelemetryAlert['severity'], number> = {
    critical: 0,
    warning: 1,
  };
  return [...alerts].sort(
    (a, b) => severityPriority[a.severity] - severityPriority[b.severity]
      || Date.parse(b.createdAt) - Date.parse(a.createdAt)
      || a.key.localeCompare(b.key),
  );
}

function alertTitle(anomaly: SearchTelemetryAnomaly) {
  if (anomaly.code === 'zero-results-high') return 'Too many searches return no results';
  if (anomaly.code === 'click-through-low') return 'Search results receive too few clicks';
  return 'Search privacy redactions are elevated';
}
