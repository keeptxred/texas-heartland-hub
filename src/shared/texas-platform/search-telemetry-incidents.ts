import type { SearchTelemetryAnomaly } from './search-telemetry-anomalies';

export type SearchTelemetryIncident = {
  id: string;
  anomalyCode: SearchTelemetryAnomaly['code'];
  severity: SearchTelemetryAnomaly['severity'];
  status: 'open' | 'acknowledged' | 'resolved';
  openedAt: string;
  updatedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  occurrences: number;
  latestMessage: string;
};

export function upsertSearchTelemetryIncident(
  anomaly: SearchTelemetryAnomaly,
  previous?: SearchTelemetryIncident,
  now = new Date().toISOString(),
): SearchTelemetryIncident {
  if (!previous) {
    return {
      id: anomaly.code,
      anomalyCode: anomaly.code,
      severity: anomaly.severity,
      status: 'open',
      openedAt: now,
      updatedAt: now,
      occurrences: 1,
      latestMessage: anomaly.message,
    };
  }

  return {
    ...previous,
    severity: anomaly.severity,
    status: previous.status === 'resolved' ? 'open' : previous.status,
    openedAt: previous.status === 'resolved' ? now : previous.openedAt,
    updatedAt: now,
    resolvedAt: undefined,
    occurrences: previous.occurrences + 1,
    latestMessage: anomaly.message,
  };
}

export function acknowledgeSearchTelemetryIncident(
  incident: SearchTelemetryIncident,
  acknowledgedAt = new Date().toISOString(),
): SearchTelemetryIncident {
  if (incident.status === 'resolved') return { ...incident };
  return { ...incident, status: 'acknowledged', acknowledgedAt, updatedAt: acknowledgedAt };
}

export function resolveSearchTelemetryIncident(
  incident: SearchTelemetryIncident,
  resolvedAt = new Date().toISOString(),
): SearchTelemetryIncident {
  return { ...incident, status: 'resolved', resolvedAt, updatedAt: resolvedAt };
}

export function reconcileSearchTelemetryIncidents(
  incidents: ReadonlyArray<SearchTelemetryIncident>,
  anomalies: ReadonlyArray<SearchTelemetryAnomaly>,
  now = new Date().toISOString(),
) {
  const anomalyByCode = new Map(anomalies.map((anomaly) => [anomaly.code, anomaly]));
  const incidentByCode = new Map(incidents.map((incident) => [incident.anomalyCode, incident]));
  const reconciled = incidents.map((incident) => {
    const anomaly = anomalyByCode.get(incident.anomalyCode);
    return anomaly ? upsertSearchTelemetryIncident(anomaly, incident, now) : resolveSearchTelemetryIncident(incident, now);
  });
  for (const anomaly of anomalies) {
    if (!incidentByCode.has(anomaly.code)) reconciled.push(upsertSearchTelemetryIncident(anomaly, undefined, now));
  }
  return reconciled.sort((a, b) => {
    const statusRank = { open: 0, acknowledged: 1, resolved: 2 } as const;
    const severityRank = { critical: 0, warning: 1 } as const;
    return statusRank[a.status] - statusRank[b.status]
      || severityRank[a.severity] - severityRank[b.severity]
      || Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
}
