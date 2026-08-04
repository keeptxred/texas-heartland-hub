import {
  buildTexasLifeFreshnessDashboard,
  summarizeTexasLifeJourneys,
  type TexasLifeFreshnessRecord,
  type TexasLifeJourneyEvent,
} from './texas-life-operations';

export type TexasLifeAdminStatus = 'healthy' | 'attention' | 'critical';

export function buildTexasLifeAdminDashboard(
  freshnessRecords: ReadonlyArray<TexasLifeFreshnessRecord>,
  journeyEvents: ReadonlyArray<TexasLifeJourneyEvent>,
  now = new Date(),
) {
  const freshness = buildTexasLifeFreshnessDashboard(freshnessRecords, now);
  const journeys = summarizeTexasLifeJourneys(journeyEvents);
  const totalStarts = journeys.reduce((sum, journey) => sum + journey.starts, 0);
  const totalCompletions = journeys.reduce((sum, journey) => sum + journey.completions, 0);
  const overallCompletionRate = totalStarts ? totalCompletions / totalStarts : 0;
  const status: TexasLifeAdminStatus = freshness.criticalIssues > 0
    ? 'critical'
    : freshness.warningIssues > 0
      ? 'attention'
      : 'healthy';

  return {
    status,
    freshness,
    journeys,
    outcomes: {
      totalStarts,
      totalCompletions,
      overallCompletionRate,
      calculatorUses: journeys.reduce((sum, journey) => sum + journey.calculatorUses, 0),
      officialResourceClicks: journeys.reduce((sum, journey) => sum + journey.officialResourceClicks, 0),
      nextActionClicks: journeys.reduce((sum, journey) => sum + journey.nextActionClicks, 0),
    },
    priorities: freshness.issues.slice(0, 10).map((issue) => ({
      resourceId: issue.resourceId,
      title: issue.title,
      href: issue.href,
      severity: issue.severity,
      action: issue.reasons.includes('broken-official-link')
        ? 'Repair the official source link before publishing or promoting this resource.'
        : issue.reasons.includes('missing-trust-framework')
          ? 'Add the TexasDefined explanation and official-authority distinction.'
          : issue.reasons.includes('incomplete-golden-rule')
            ? 'Complete all five Golden Rule answers.'
            : issue.reasons.includes('missing-next-steps')
              ? 'Add logical next actions from the Texas Decision Graph.'
              : 'Review and refresh this resource.',
    })),
  };
}
