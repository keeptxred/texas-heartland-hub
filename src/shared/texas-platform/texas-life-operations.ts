export type TexasLifeFreshnessRecord = {
  resourceId: string;
  title: string;
  href: string;
  lastReviewedAt?: string;
  reviewEveryDays: number;
  brokenOfficialLinks?: number;
  hasTrustFramework: boolean;
  goldenRuleComplete: boolean;
  hasNextSteps: boolean;
  updatedAt?: string;
};

export type TexasLifeFreshnessIssue = {
  resourceId: string;
  title: string;
  href: string;
  severity: 'critical' | 'warning';
  reasons: string[];
};

export function buildTexasLifeFreshnessDashboard(
  records: ReadonlyArray<TexasLifeFreshnessRecord>,
  now = new Date(),
) {
  const issues: TexasLifeFreshnessIssue[] = records.flatMap((record) => {
    const reasons: string[] = [];
    let severity: TexasLifeFreshnessIssue['severity'] = 'warning';
    const reviewed = record.lastReviewedAt ? Date.parse(record.lastReviewedAt) : Number.NaN;
    const dueAt = Number.isNaN(reviewed)
      ? Number.NEGATIVE_INFINITY
      : reviewed + record.reviewEveryDays * 86_400_000;
    if (!Number.isInteger(record.reviewEveryDays) || record.reviewEveryDays <= 0 || now.getTime() > dueAt) reasons.push('review-due');
    if ((record.brokenOfficialLinks ?? 0) > 0) {
      reasons.push('broken-official-link');
      severity = 'critical';
    }
    if (!record.hasTrustFramework) reasons.push('missing-trust-framework');
    if (!record.goldenRuleComplete) reasons.push('incomplete-golden-rule');
    if (!record.hasNextSteps) reasons.push('missing-next-steps');
    if (!reasons.length) return [];
    return [{ resourceId: record.resourceId, title: record.title, href: record.href, severity, reasons }];
  }).sort((a, b) => (a.severity === b.severity ? a.title.localeCompare(b.title) : a.severity === 'critical' ? -1 : 1));

  const recentlyUpdated = [...records]
    .filter((record) => record.updatedAt && !Number.isNaN(Date.parse(record.updatedAt)))
    .sort((a, b) => Date.parse(b.updatedAt!) - Date.parse(a.updatedAt!))
    .slice(0, 10)
    .map((record) => ({ ...record }));

  return {
    totalResources: records.length,
    healthyResources: records.length - issues.length,
    criticalIssues: issues.filter((issue) => issue.severity === 'critical').length,
    warningIssues: issues.filter((issue) => issue.severity === 'warning').length,
    issues,
    recentlyUpdated,
  };
}

export type TexasLifeJourneyEventType =
  | 'journey-started'
  | 'journey-step-viewed'
  | 'journey-completed'
  | 'calculator-used'
  | 'official-resource-clicked'
  | 'next-action-clicked';

export type TexasLifeJourneyEvent = {
  journeyId: string;
  sessionId: string;
  type: TexasLifeJourneyEventType;
  stepId?: string;
  resourceId?: string;
  occurredAt: string;
};

export function summarizeTexasLifeJourneys(events: ReadonlyArray<TexasLifeJourneyEvent>) {
  const valid = events.filter((event) => event.journeyId.trim()
    && event.sessionId.trim()
    && !Number.isNaN(Date.parse(event.occurredAt)));
  const journeyIds = [...new Set(valid.map((event) => event.journeyId))];

  return journeyIds.map((journeyId) => {
    const journeyEvents = valid.filter((event) => event.journeyId === journeyId);
    const startedSessions = new Set(journeyEvents.filter((event) => event.type === 'journey-started').map((event) => event.sessionId));
    const completedSessions = new Set(journeyEvents.filter((event) => event.type === 'journey-completed').map((event) => event.sessionId));
    const stepViews = new Map<string, number>();
    for (const event of journeyEvents) {
      if (event.type !== 'journey-step-viewed' || !event.stepId) continue;
      stepViews.set(event.stepId, (stepViews.get(event.stepId) ?? 0) + 1);
    }
    const dropOffStep = [...stepViews.entries()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))[0]?.[0];
    return {
      journeyId,
      starts: startedSessions.size,
      completions: completedSessions.size,
      completionRate: startedSessions.size ? completedSessions.size / startedSessions.size : 0,
      calculatorUses: journeyEvents.filter((event) => event.type === 'calculator-used').length,
      officialResourceClicks: journeyEvents.filter((event) => event.type === 'official-resource-clicked').length,
      nextActionClicks: journeyEvents.filter((event) => event.type === 'next-action-clicked').length,
      dropOffStep,
    };
  }).sort((a, b) => b.starts - a.starts || a.journeyId.localeCompare(b.journeyId));
}
