import type { SearchTelemetryIncident } from './search-telemetry-incidents';

export type SearchTelemetryIncidentMetrics = {
  total: number;
  open: number;
  acknowledged: number;
  resolved: number;
  criticalActive: number;
  warningActive: number;
  oldestActive?: SearchTelemetryIncident;
  averageResolutionMinutes?: number;
};

export function summarizeSearchTelemetryIncidents(
  incidents: ReadonlyArray<SearchTelemetryIncident>,
): SearchTelemetryIncidentMetrics {
  let open = 0;
  let acknowledged = 0;
  let resolved = 0;
  let criticalActive = 0;
  let warningActive = 0;
  let resolutionTotalMs = 0;
  let resolutionCount = 0;
  let oldestActive: SearchTelemetryIncident | undefined;

  for (const incident of incidents) {
    if (incident.status === 'open') open += 1;
    if (incident.status === 'acknowledged') acknowledged += 1;
    if (incident.status === 'resolved') resolved += 1;

    if (incident.status !== 'resolved') {
      if (incident.severity === 'critical') criticalActive += 1;
      else warningActive += 1;
      if (!oldestActive || Date.parse(incident.openedAt) < Date.parse(oldestActive.openedAt)) {
        oldestActive = incident;
      }
    }

    if (incident.resolvedAt) {
      const duration = Date.parse(incident.resolvedAt) - Date.parse(incident.openedAt);
      if (Number.isFinite(duration) && duration >= 0) {
        resolutionTotalMs += duration;
        resolutionCount += 1;
      }
    }
  }

  return {
    total: incidents.length,
    open,
    acknowledged,
    resolved,
    criticalActive,
    warningActive,
    oldestActive,
    averageResolutionMinutes: resolutionCount
      ? Math.round(resolutionTotalMs / resolutionCount / 60000)
      : undefined,
  };
}

export function activeSearchTelemetryIncidents(
  incidents: ReadonlyArray<SearchTelemetryIncident>,
) {
  return incidents.filter((incident) => incident.status !== 'resolved');
}
