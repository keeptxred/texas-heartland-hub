import type { SearchTelemetryAlert } from './search-telemetry-alerts';

export type SearchTelemetryAlertState = {
  key: string;
  firstSeenAt: string;
  lastSeenAt: string;
  lastSentAt?: string;
  occurrences: number;
  status: 'active' | 'resolved';
};

export type SearchTelemetryAlertDecision = {
  alert: SearchTelemetryAlert;
  shouldSend: boolean;
  reason: 'new' | 'escalated' | 'cooldown-expired' | 'cooldown-active';
  state: SearchTelemetryAlertState;
};

function alertKey(alert: SearchTelemetryAlert) {
  return `${alert.anomalyCode}|${alert.channel}`;
}

function severityRank(severity: SearchTelemetryAlert['severity']) {
  return severity === 'critical' ? 1 : 0;
}

export function evaluateSearchTelemetryAlert(
  alert: SearchTelemetryAlert,
  previous: SearchTelemetryAlertState | undefined,
  options: { now?: string; cooldownMs?: number; previousSeverity?: SearchTelemetryAlert['severity'] } = {},
): SearchTelemetryAlertDecision {
  const now = options.now ?? new Date().toISOString();
  const cooldownMs = options.cooldownMs ?? 6 * 60 * 60 * 1000;
  if (!Number.isFinite(cooldownMs) || cooldownMs < 0) {
    throw new Error('Search telemetry alert cooldown must be zero or greater.');
  }

  const key = alertKey(alert);
  if (!previous) {
    return {
      alert,
      shouldSend: true,
      reason: 'new',
      state: { key, firstSeenAt: now, lastSeenAt: now, lastSentAt: now, occurrences: 1, status: 'active' },
    };
  }

  const escalated = options.previousSeverity
    ? severityRank(alert.severity) > severityRank(options.previousSeverity)
    : false;
  const lastSent = previous.lastSentAt ? Date.parse(previous.lastSentAt) : Number.NaN;
  const expired = !Number.isFinite(lastSent) || Date.parse(now) - lastSent >= cooldownMs;
  const shouldSend = escalated || expired;

  return {
    alert,
    shouldSend,
    reason: escalated ? 'escalated' : expired ? 'cooldown-expired' : 'cooldown-active',
    state: {
      ...previous,
      key,
      lastSeenAt: now,
      lastSentAt: shouldSend ? now : previous.lastSentAt,
      occurrences: previous.occurrences + 1,
      status: 'active',
    },
  };
}

export function resolveMissingSearchTelemetryAlerts(
  states: ReadonlyArray<SearchTelemetryAlertState>,
  activeAlerts: ReadonlyArray<SearchTelemetryAlert>,
  resolvedAt = new Date().toISOString(),
) {
  const activeKeys = new Set(activeAlerts.map(alertKey));
  return states.map((state) => activeKeys.has(state.key)
    ? { ...state }
    : { ...state, lastSeenAt: resolvedAt, status: 'resolved' as const });
}
