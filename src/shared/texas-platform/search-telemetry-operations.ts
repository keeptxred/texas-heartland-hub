import type { SharedSearchTelemetryEvent } from './search-telemetry';
import { buildSearchTelemetryDigest, type SearchTelemetryDigest } from './search-telemetry-digest';
import { reconcileSearchTelemetryIncidents, type SearchTelemetryIncident } from './search-telemetry-incidents';
import { buildSearchTelemetryAlerts, type SearchTelemetryAlert } from './search-telemetry-alerts';
import { reconcileSearchTelemetryAlertState, type SearchTelemetryAlertState } from './search-telemetry-alert-state';
import { incidentMetrics, type SearchTelemetryIncidentMetrics } from './search-telemetry-incident-metrics';
import { escalationPlanForSearchTelemetryIncidents, type SearchTelemetryEscalation } from './search-telemetry-incident-sla';

export type SearchTelemetryOperationsState = {
  digest: SearchTelemetryDigest;
  incidents: SearchTelemetryIncident[];
  alerts: SearchTelemetryAlert[];
  alertState: SearchTelemetryAlertState[];
  metrics: SearchTelemetryIncidentMetrics;
  escalations: SearchTelemetryEscalation[];
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
    alertChannels?: ReadonlyArray<'admin' | 'email' | 'log'>;
    cooldownMs?: number;
  } = {},
): SearchTelemetryOperationsState {
  const now = options.now ?? new Date().toISOString();
  const digest = buildSearchTelemetryDigest(events);
  const incidents = reconcileSearchTelemetryIncidents(previous.incidents ?? [], digest.anomalies, now);
  const alerts = buildSearchTelemetryAlerts(digest.anomalies, options.alertChannels);
  const alertState = reconcileSearchTelemetryAlertState(
    previous.alertState ?? [],
    alerts,
    now,
    options.cooldownMs,
  );
  return {
    digest,
    incidents,
    alerts,
    alertState,
    metrics: incidentMetrics(incidents),
    escalations: escalationPlanForSearchTelemetryIncidents(incidents, now),
    evaluatedAt: now,
  };
}

export function searchTelemetryOperationsHealthy(state: SearchTelemetryOperationsState) {
  return state.digest.health === 'healthy'
    && state.metrics.activeCritical === 0
    && state.escalations.length === 0;
}
