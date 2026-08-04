import type { TexasLifePillarId } from './texas-life-platform';

export type TexasLifeAudience = 'resident' | 'moving' | 'business' | 'visitor';
export type TexasLifeDifficulty = 'easy' | 'moderate' | 'advanced';

export type TexasLifeAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  estimatedMinutes?: number;
  difficulty: TexasLifeDifficulty;
  officialAction: boolean;
  audiences?: TexasLifeAudience[];
};

export type TexasLifeOfficialResource = {
  agencyName: string;
  purpose: string;
  officialUrl: string;
  phone?: string;
  hours?: string;
  fees?: string;
  forms?: Array<{ label: string; href: string }>;
  onlineServices?: Array<{ label: string; href: string }>;
};

export type TexasLifeChange = {
  id: string;
  title: string;
  summary: string;
  effectiveDate?: string;
  sourceUrl: string;
  type: 'law' | 'deadline' | 'form' | 'fee' | 'agency';
};

export type TexasLifeRelationshipReason =
  | 'same-journey'
  | 'frequently-used-together'
  | 'same-city'
  | 'same-county'
  | 'same-agency'
  | 'same-law'
  | 'strongly-related';

export type TexasLifeRelationship = {
  sourceId: string;
  targetId: string;
  reason: TexasLifeRelationshipReason;
  weight: number;
};

export type TexasLifeCalculatorDefinition = {
  id: string;
  title: string;
  explanation: string;
  interpretation: string;
  officialReferences: Array<{ label: string; href: string }>;
  relatedGuides: string[];
  relatedCalculators: string[];
  nextActions: TexasLifeAction[];
};

export type TexasLifeResourceGovernance = {
  resourceId: string;
  pillar: TexasLifePillarId;
  journeys: string[];
  hasTrustFramework: boolean;
  goldenRuleComplete: boolean;
  officialSources: string[];
  nextActions: TexasLifeAction[];
  usesSharedComponents: boolean;
};

function isInternalOrHttps(href: string) {
  return href.startsWith('/') || href.startsWith('https://');
}

export function validateTexasLifeAction(action: TexasLifeAction) {
  const errors: string[] = [];
  if (!action.id.trim()) errors.push('Action id is required.');
  if (!action.title.trim()) errors.push('Action title is required.');
  if (!action.description.trim()) errors.push('Action description is required.');
  if (!isInternalOrHttps(action.href)) errors.push('Action href must be internal or HTTPS.');
  if (action.estimatedMinutes !== undefined && (!Number.isInteger(action.estimatedMinutes) || action.estimatedMinutes < 1)) {
    errors.push('Estimated minutes must be a positive integer.');
  }
  return { valid: errors.length === 0, errors };
}

export function validateOfficialResource(resource: TexasLifeOfficialResource) {
  const errors: string[] = [];
  if (!resource.agencyName.trim()) errors.push('Agency name is required.');
  if (!resource.purpose.trim()) errors.push('Purpose is required.');
  if (!resource.officialUrl.startsWith('https://')) errors.push('Official URL must use HTTPS.');
  for (const link of [...(resource.forms ?? []), ...(resource.onlineServices ?? [])]) {
    if (!link.label.trim() || !link.href.startsWith('https://')) errors.push('Official links require labels and HTTPS URLs.');
  }
  return { valid: errors.length === 0, errors };
}

export function actionCardsForAudience(actions: ReadonlyArray<TexasLifeAction>, audience: TexasLifeAudience) {
  return actions
    .filter((action) => !action.audiences?.length || action.audiences.includes(audience))
    .map((action) => ({ ...action, audiences: action.audiences ? [...action.audiences] : undefined }));
}

export function rankedRelationships(
  relationships: ReadonlyArray<TexasLifeRelationship>,
  sourceId: string,
  limit = 6,
) {
  if (!Number.isInteger(limit) || limit < 0) throw new Error('Relationship limit must be a non-negative integer.');
  return relationships
    .filter((relationship) => relationship.sourceId === sourceId && relationship.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.targetId.localeCompare(b.targetId))
    .slice(0, limit)
    .map((relationship) => ({ ...relationship }));
}

export function recentTexasLifeChanges(changes: ReadonlyArray<TexasLifeChange>, asOf: Date, days = 365) {
  if (!Number.isInteger(days) || days < 1) throw new Error('Change window must be a positive integer.');
  const cutoff = new Date(asOf);
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  return changes
    .filter((change) => change.sourceUrl.startsWith('https://'))
    .filter((change) => !change.effectiveDate || new Date(`${change.effectiveDate}T00:00:00Z`) >= cutoff)
    .sort((a, b) => (b.effectiveDate ?? '').localeCompare(a.effectiveDate ?? ''))
    .map((change) => ({ ...change }));
}

export function validateCalculatorDefinition(calculator: TexasLifeCalculatorDefinition) {
  const errors: string[] = [];
  if (!calculator.id.trim()) errors.push('Calculator id is required.');
  if (!calculator.title.trim()) errors.push('Calculator title is required.');
  if (!calculator.explanation.trim()) errors.push('Calculator explanation is required.');
  if (!calculator.interpretation.trim()) errors.push('Calculator interpretation is required.');
  if (!calculator.officialReferences.length || calculator.officialReferences.some((reference) => !reference.href.startsWith('https://'))) {
    errors.push('At least one HTTPS official reference is required.');
  }
  if (!calculator.nextActions.length || calculator.nextActions.some((action) => !validateTexasLifeAction(action).valid)) {
    errors.push('At least one valid next action is required.');
  }
  return { valid: errors.length === 0, errors };
}

export function evaluateTexasLifeGovernance(governance: TexasLifeResourceGovernance) {
  const missing: string[] = [];
  if (!governance.resourceId.trim()) missing.push('resource-id');
  if (!governance.journeys.length) missing.push('journey');
  if (!governance.hasTrustFramework) missing.push('trust-framework');
  if (!governance.goldenRuleComplete) missing.push('golden-rule');
  if (!governance.officialSources.length || governance.officialSources.some((source) => !source.startsWith('https://'))) missing.push('official-source');
  if (!governance.nextActions.length || governance.nextActions.some((action) => !validateTexasLifeAction(action).valid)) missing.push('next-action');
  if (!governance.usesSharedComponents) missing.push('shared-components');
  return {
    publishable: missing.length === 0,
    missing,
    score: Math.round(((7 - missing.length) / 7) * 100),
  };
}
