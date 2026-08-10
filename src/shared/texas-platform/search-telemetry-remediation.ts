import type { SearchTelemetryAnomaly } from './search-telemetry-anomalies';

export type SearchTelemetryRemediation = {
  anomalyCode: SearchTelemetryAnomaly['code'];
  priority: 'high' | 'medium';
  title: string;
  action: string;
};

export function remediationForSearchTelemetryAnomaly(
  anomaly: SearchTelemetryAnomaly,
): SearchTelemetryRemediation {
  const priority = anomaly.severity === 'critical' ? 'high' : 'medium';

  if (anomaly.code === 'zero-results-high') {
    return {
      anomalyCode: anomaly.code,
      priority,
      title: 'Reduce searches with no results',
      action: 'Review the most common zero-result searches, add missing aliases or search terms, and create resources for genuine content gaps.',
    };
  }

  if (anomaly.code === 'click-through-low') {
    return {
      anomalyCode: anomaly.code,
      priority,
      title: 'Improve search-result usefulness',
      action: 'Review ranking, result titles, summaries and type labels so the most useful destination is clear and appears first.',
    };
  }

  return {
    anomalyCode: anomaly.code,
    priority,
    title: 'Review privacy-redacted searches',
    action: 'Confirm redaction rules are working, avoid exposing raw search phrases in admin views, and check whether visitors are mistakenly entering personal information.',
  };
}

export function buildSearchTelemetryRemediationPlan(
  anomalies: ReadonlyArray<SearchTelemetryAnomaly>,
) {
  const priorityRank = { high: 0, medium: 1 } as const;
  return anomalies
    .map(remediationForSearchTelemetryAnomaly)
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || a.title.localeCompare(b.title));
}
