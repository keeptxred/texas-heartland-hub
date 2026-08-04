import type { SearchTelemetryIncident } from './search-telemetry-incidents';

export type SearchTelemetryIncidentSla = {
  criticalMinutes?: number;
  warningMinutes?: number;
};

export type SearchTelemetryIncidentSlaStatus = {
  incident: SearchTelemetryIncident;
  targetMinutes: number;
  ageMinutes: number;
  breached: boolean;
  remainingMinutes: number;
};

export function evaluateSearchTelemetryIncidentSla(
  incident: SearchTelemetryIncident,
  options: SearchTelemetryIncidentSla = {},
  now = new Date().toISOString(),
): SearchTelemetryIncidentSlaStatus {
  const criticalMinutes = options.criticalMinutes ?? 60;
  const warningMinutes = options.warningMinutes ?? 1440;
  if (!Number.isFinite(criticalMinutes) || criticalMinutes <= 0) {
    throw new Error('Critical incident SLA must be greater than zero.');
  }
  if (!Number.isFinite(warningMinutes) || warningMinutes <= 0) {
    throw new Error('Warning incident SLA must be greater than zero.');
  }

  const targetMinutes = incident.severity === 'critical' ? criticalMinutes : warningMinutes;
  const endAt = incident.resolvedAt ?? now;
  const ageMs = Date.parse(endAt) - Date.parse(incident.openedAt);
  const ageMinutes = Number.isFinite(ageMs) ? Math.max(0, Math.floor(ageMs / 60000)) : 0;
  const breached = ageMinutes > targetMinutes;

  return {
    incident,
    targetMinutes,
    ageMinutes,
    breached,
    remainingMinutes: Math.max(0, targetMinutes - ageMinutes),
  };
}

export function breachedSearchTelemetryIncidentSlas(
  incidents: ReadonlyArray<SearchTelemetryIncident>,
  options: SearchTelemetryIncidentSla = {},
  now = new Date().toISOString(),
) {
  return incidents
    .filter((incident) => incident.status !== 'resolved')
    .map((incident) => evaluateSearchTelemetryIncidentSla(incident, options, now))
    .filter((status) => status.breached)
    .sort((a, b) => b.ageMinutes - a.ageMinutes || a.incident.id.localeCompare(b.incident.id));
}
