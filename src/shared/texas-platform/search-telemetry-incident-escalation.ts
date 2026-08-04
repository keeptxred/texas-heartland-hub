import type { SearchTelemetryIncident } from './search-telemetry-incidents';
import { evaluateSearchTelemetryIncidentSla, type SearchTelemetryIncidentSla } from './search-telemetry-incident-sla';

export type SearchTelemetryIncidentEscalation = {
  incidentId: string;
  level: 'none' | 'owner' | 'urgent';
  reason: string;
};

export function planSearchTelemetryIncidentEscalation(
  incident: SearchTelemetryIncident,
  options: SearchTelemetryIncidentSla = {},
  now = new Date().toISOString(),
): SearchTelemetryIncidentEscalation {
  if (incident.status === 'resolved') {
    return { incidentId: incident.id, level: 'none', reason: 'Incident is resolved.' };
  }

  const sla = evaluateSearchTelemetryIncidentSla(incident, options, now);
  if (incident.severity === 'critical' && sla.breached) {
    return { incidentId: incident.id, level: 'urgent', reason: 'Critical incident exceeded its response target.' };
  }
  if (sla.breached) {
    return { incidentId: incident.id, level: 'owner', reason: 'Incident exceeded its response target.' };
  }
  if (incident.severity === 'critical' && incident.status === 'open') {
    return { incidentId: incident.id, level: 'owner', reason: 'Critical incident requires acknowledgment.' };
  }
  return { incidentId: incident.id, level: 'none', reason: 'Incident is within its response target.' };
}

export function pendingSearchTelemetryIncidentEscalations(
  incidents: ReadonlyArray<SearchTelemetryIncident>,
  options: SearchTelemetryIncidentSla = {},
  now = new Date().toISOString(),
) {
  const levelRank = { urgent: 0, owner: 1, none: 2 } as const;
  return incidents
    .map((incident) => planSearchTelemetryIncidentEscalation(incident, options, now))
    .filter((escalation) => escalation.level !== 'none')
    .sort((a, b) => levelRank[a.level] - levelRank[b.level] || a.incidentId.localeCompare(b.incidentId));
}
