import type { TexasLifePillarId, TexasLifeTrustStatement } from './texas-life-platform';
import { validateTexasLifePage } from './texas-life-platform';

export type TexasLifeResourceKind =
  | 'guide'
  | 'calculator'
  | 'city'
  | 'county'
  | 'agency'
  | 'park'
  | 'attraction'
  | 'school-district'
  | 'utility'
  | 'event'
  | 'law'
  | 'representative';

export type TexasLifeReviewStatus = 'draft' | 'needs-review' | 'verified' | 'stale';

export type TexasLifeResourceHealth = {
  lastReviewedAt?: string;
  officialSourceCheckedAt?: string;
  calculatorVerifiedAt?: string;
  lawCheckedAt?: string;
  brokenLinkCount: number;
  missingFields: string[];
  pendingUpdates: string[];
  reviewStatus: TexasLifeReviewStatus;
};

export type TexasLifeResourceRecord = {
  id: string;
  title: string;
  kind: TexasLifeResourceKind;
  href: string;
  pillar: TexasLifePillarId;
  summary: string;
  trust: TexasLifeTrustStatement;
  goldenRule: Partial<Record<'what' | 'why' | 'next' | 'verify' | 'else', string>>;
  journeyIds: string[];
  officialSourceUrl: string;
  nextStepIds: string[];
  health: TexasLifeResourceHealth;
};

export type TexasLifeGovernanceIssue = {
  code: string;
  message: string;
  severity: 'error' | 'warning';
};

function validDate(value?: string) {
  return !value || !Number.isNaN(Date.parse(value));
}

export function auditTexasLifeResource(resource: TexasLifeResourceRecord): TexasLifeGovernanceIssue[] {
  const issues: TexasLifeGovernanceIssue[] = [];
  const requiredText: Array<[string, string]> = [
    ['id', resource.id],
    ['title', resource.title],
    ['summary', resource.summary],
    ['href', resource.href],
    ['officialSourceUrl', resource.officialSourceUrl],
  ];

  for (const [field, value] of requiredText) {
    if (!value.trim()) issues.push({ code: `missing-${field}`, message: `${field} is required.`, severity: 'error' });
  }
  if (!resource.href.startsWith('/')) issues.push({ code: 'invalid-href', message: 'Resource href must be an internal path.', severity: 'error' });
  if (!resource.officialSourceUrl.startsWith('https://')) issues.push({ code: 'invalid-official-source', message: 'Official source must use HTTPS.', severity: 'error' });
  if (!resource.journeyIds.length) issues.push({ code: 'missing-journey', message: 'Resource must participate in at least one journey.', severity: 'error' });
  if (!resource.nextStepIds.length) issues.push({ code: 'missing-next-step', message: 'Resource must provide at least one logical next step.', severity: 'error' });

  const golden = validateTexasLifePage(resource.goldenRule);
  for (const field of golden.missing) {
    issues.push({ code: `missing-golden-${field}`, message: `Golden Rule answer “${field}” is missing.`, severity: 'error' });
  }

  if (!resource.trust.explanation.trim() || !resource.trust.authority.trim()) {
    issues.push({ code: 'incomplete-trust-framework', message: 'Trust Framework explanation and authority are required.', severity: 'error' });
  }

  if (!validDate(resource.health.lastReviewedAt) || !validDate(resource.health.officialSourceCheckedAt) || !validDate(resource.health.calculatorVerifiedAt) || !validDate(resource.health.lawCheckedAt)) {
    issues.push({ code: 'invalid-health-date', message: 'Resource health dates must be valid ISO-compatible dates.', severity: 'error' });
  }
  if (resource.health.brokenLinkCount > 0) issues.push({ code: 'broken-links', message: `${resource.health.brokenLinkCount} broken links require attention.`, severity: 'warning' });
  for (const field of resource.health.missingFields) issues.push({ code: `health-missing-${field}`, message: `Resource health reports missing field: ${field}.`, severity: 'warning' });
  for (const update of resource.health.pendingUpdates) issues.push({ code: 'pending-update', message: update, severity: 'warning' });

  return issues;
}

export function texasLifeResourceReadiness(resource: TexasLifeResourceRecord) {
  const issues = auditTexasLifeResource(resource);
  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const score = Math.max(0, Math.round(100 - errors.length * 15 - warnings.length * 4));
  return {
    publishable: errors.length === 0,
    score,
    errors,
    warnings,
  };
}

export function staleTexasLifeResources(resources: ReadonlyArray<TexasLifeResourceRecord>, now: Date, maxAgeDays = 180) {
  const cutoff = now.getTime() - maxAgeDays * 24 * 60 * 60 * 1000;
  return resources.filter((resource) => {
    if (!resource.health.lastReviewedAt) return true;
    const reviewed = Date.parse(resource.health.lastReviewedAt);
    return Number.isNaN(reviewed) || reviewed < cutoff || resource.health.reviewStatus === 'stale';
  });
}
