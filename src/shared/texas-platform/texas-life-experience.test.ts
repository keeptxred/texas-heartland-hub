import { describe, expect, it } from 'vitest';
import {
  actionCardsForAudience,
  evaluateTexasLifeGovernance,
  rankedRelationships,
  recentTexasLifeChanges,
  validateCalculatorDefinition,
  validateOfficialResource,
  validateTexasLifeAction,
  type TexasLifeAction,
} from './texas-life-experience';

const action: TexasLifeAction = {
  id: 'homestead',
  title: 'Apply for a homestead exemption',
  description: 'Review eligibility and continue to the official application.',
  href: '/homestead-exemption',
  estimatedMinutes: 15,
  difficulty: 'easy',
  officialAction: true,
  audiences: ['resident', 'moving'],
};

describe('Texas Life experience systems', () => {
  it('validates action cards and rejects unsafe links', () => {
    expect(validateTexasLifeAction(action).valid).toBe(true);
    expect(validateTexasLifeAction({ ...action, href: 'javascript:alert(1)' }).valid).toBe(false);
  });

  it('filters actions by audience without mutating source data', () => {
    const actions = [action, { ...action, id: 'visitor', audiences: ['visitor'] as const }];
    const result = actionCardsForAudience(actions, 'resident');
    expect(result.map((item) => item.id)).toEqual(['homestead']);
    expect(actions).toHaveLength(2);
  });

  it('validates official resources and HTTPS links', () => {
    expect(validateOfficialResource({
      agencyName: 'County Appraisal District',
      purpose: 'Reviews and decides homestead exemption applications.',
      officialUrl: 'https://example.gov',
      forms: [{ label: 'Application', href: 'https://example.gov/form' }],
    }).valid).toBe(true);
    expect(validateOfficialResource({ agencyName: '', purpose: '', officialUrl: 'http://example.gov' }).valid).toBe(false);
  });

  it('ranks weighted relationships for the current resource', () => {
    const ranked = rankedRelationships([
      { sourceId: 'home', targetId: 'tax', reason: 'same-journey', weight: 90 },
      { sourceId: 'home', targetId: 'mortgage', reason: 'strongly-related', weight: 100 },
      { sourceId: 'other', targetId: 'ignored', reason: 'same-law', weight: 100 },
    ], 'home');
    expect(ranked.map((item) => item.targetId)).toEqual(['mortgage', 'tax']);
  });

  it('returns recent verified changes in date order', () => {
    const result = recentTexasLifeChanges([
      { id: 'old', title: 'Old', summary: 'Old change', effectiveDate: '2020-01-01', sourceUrl: 'https://example.gov/old', type: 'law' },
      { id: 'new', title: 'New', summary: 'New change', effectiveDate: '2026-07-01', sourceUrl: 'https://example.gov/new', type: 'fee' },
      { id: 'unsafe', title: 'Unsafe', summary: 'Unsafe', effectiveDate: '2026-08-01', sourceUrl: 'http://example.gov', type: 'form' },
    ], new Date('2026-08-03T00:00:00Z'), 365);
    expect(result.map((item) => item.id)).toEqual(['new']);
  });

  it('requires calculator interpretation, official references, and next actions', () => {
    expect(validateCalculatorDefinition({
      id: 'property-tax',
      title: 'Property Tax Calculator',
      explanation: 'Estimate a property tax bill.',
      interpretation: 'Use the estimate to compare locations and plan costs.',
      officialReferences: [{ label: 'Comptroller', href: 'https://comptroller.texas.gov' }],
      relatedGuides: ['homestead'],
      relatedCalculators: ['affordability'],
      nextActions: [action],
    }).valid).toBe(true);
  });

  it('scores publication governance and lists missing standards', () => {
    const complete = evaluateTexasLifeGovernance({
      resourceId: 'guide:homestead',
      pillar: 'do',
      journeys: ['buying-home'],
      hasTrustFramework: true,
      goldenRuleComplete: true,
      officialSources: ['https://comptroller.texas.gov'],
      nextActions: [action],
      usesSharedComponents: true,
    });
    expect(complete.publishable).toBe(true);
    expect(complete.score).toBe(100);

    const incomplete = evaluateTexasLifeGovernance({
      resourceId: '',
      pillar: 'learn',
      journeys: [],
      hasTrustFramework: false,
      goldenRuleComplete: false,
      officialSources: [],
      nextActions: [],
      usesSharedComponents: false,
    });
    expect(incomplete.publishable).toBe(false);
    expect(incomplete.missing).toContain('official-source');
  });
});
