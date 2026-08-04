import type { SharedSearchTelemetryEvent } from './search-telemetry';
import { detectSearchTelemetryAnomalies, type SearchTelemetryAnomaly } from './search-telemetry-anomalies';

export type SearchTelemetryAnomalySnapshot = {
  capturedAt: string;
  anomalies: SearchTelemetryAnomaly[];
};

export type SearchTelemetryAnomalyChange = {
  introduced: SearchTelemetryAnomaly[];
  resolved: SearchTelemetryAnomaly[];
  persisted: SearchTelemetryAnomaly[];
};

export function createSearchTelemetryAnomalySnapshot(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
  capturedAt = new Date().toISOString(),
): SearchTelemetryAnomalySnapshot {
  return {
    capturedAt,
    anomalies: detectSearchTelemetryAnomalies(events),
  };
}

function anomalyKey(anomaly: SearchTelemetryAnomaly) {
  return anomaly.code;
}

export function compareSearchTelemetryAnomalySnapshots(
  previous: SearchTelemetryAnomalySnapshot,
  current: SearchTelemetryAnomalySnapshot,
): SearchTelemetryAnomalyChange {
  const previousByKey = new Map(previous.anomalies.map((anomaly) => [anomalyKey(anomaly), anomaly]));
  const currentByKey = new Map(current.anomalies.map((anomaly) => [anomalyKey(anomaly), anomaly]));

  return {
    introduced: current.anomalies.filter((anomaly) => !previousByKey.has(anomalyKey(anomaly))),
    resolved: previous.anomalies.filter((anomaly) => !currentByKey.has(anomalyKey(anomaly))),
    persisted: current.anomalies.filter((anomaly) => previousByKey.has(anomalyKey(anomaly))),
  };
}

export function latestSearchTelemetryAnomalySnapshot(
  snapshots: ReadonlyArray<SearchTelemetryAnomalySnapshot>,
) {
  return [...snapshots].sort((a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt))[0];
}
