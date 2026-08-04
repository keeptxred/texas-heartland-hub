import type { SharedSearchTelemetryEvent } from './search-telemetry';
import { buildSearchTelemetryDigest, type SearchTelemetryDigest } from './search-telemetry-digest';
import { reconcileSearchTelemetryIncidents, type SearchTelemetryIncident } from './search-telemetry-incidents';
import { createSearchTelemetryAlerts, type SearchTelemetryAlert, type SearchTelemetryAlertChannel } from './search-telemetry-alerts';
import { evaluateSearchTelemetryAlert, resolveMissingSearchTelemetryAlerts, type SearchTelemetryAlertDecision, type SearchTelemetryAlertState } from './search-telemetry-alert-state';
import { summarizeSearchTelemetryIncidents, type SearchTelemetryIncidentMetrics } from './search-telemetry-incident-metrics';
import { breachedSearchTelemetryIncidentSlas, type SearchTelemetryIncidentSlaStatus } from './search-telemetry-incident-sla';

export type SearchTelemetryOperationsState = {
  digest: SearchTelemetryDigest;
  incidents: SearchTelemetryIncident[];
  alerts: SearchTelemetryAlert[];
  alertDecisions: SearchTelemetryAlertDecision[];
  alertState: SearchTelemetryAlertState[];
  metrics: SearchTelemetryIncidentMetrics;
  breachedSlas: SearchTelemetryIncidentSlaStatus[];
  evaluatedAt: string;
};

export function evaluateSearchTelemetryOperations(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
  previous: {
    incidents?: ReadonlyArray<SearchTelemetryIncident>;
    alertState?: ReadonlyArray<SearchTelemetryAlertState>;
  } = {},
  options: {
    now?: string;
    alertChannels?: ReadonlyArray<SearchTelemetryAlertChannel>;
    cooldownMs?: number;
  } = {},
): SearchTelemetryOperationsState {
  const now = options.now ?? new Date().toISOString();
  const digest = buildSearchTelemetryDigest(events, { generatedAt: now });
  const incidents = reconcileSearchTelemetryIncidents(previous.incidents ?? [], digest.anomalies, now);
  const alerts = createSearchTelemetryAlerts(digest.anomalies, { channels: options.alertChannels, createdAt: now });
  const previousByKey = new Map((previous.alertState ?? []).map((state) => [state.key, state]));
  const alertDecisions = alerts.map((alert) => evaluateSearchTelemetryAlert(
    alert,
    previousByKey.get(`${alert.key.replace(':', '|')}`),
    { now, cooldownMs: options.cooldownMs },
  ));
  const activeState = alertDecisions.map((decision) => decision.state);
  const alertState = resolveMissingSearchTelemetryAlerts(
    [...activeState, ...(previous.alertState ?? []).filter((state) => !activeState.some((active) => active.key === state.key))],
    alerts,
    now,
  );

  return {
    digest,
    incidents,
    alerts,
    alertDecisions,
    alertState,
    metrics: summarizeSearchTelemetryIncidents(incidents),
    breachedSlas: breachedSearchTelemetryIncidentSlas(incidents, {}, now),
    evaluatedAt: now,
  };
}

export function searchTelemetryOperationsHealthy(state: SearchTelemetryOperationsState) {
  return state.digest.status === 'healthy'
    && state.metrics.criticalActive === 0
    && state.breachedSlas.length === 0;
}
