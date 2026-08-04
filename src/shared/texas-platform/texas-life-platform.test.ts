import { describe, expect, it } from 'vitest';
import {
  BUYING_HOME_DECISION_GRAPH,
  TEXAS_LIFE_EDITORIAL_PRINCIPLES,
  TEXAS_LIFE_PAGE_STANDARDS,
  TEXAS_LIFE_PILLARS,
  TEXAS_LIFE_PLATFORM_VISION,
  TEXAS_LIFE_SUCCESS_METRICS,
  TEXAS_LIFE_VISION,
  createTrustStatement,
  nextDecisionSteps,
  texasLifePillar,
  validateTexasLifePage,
} from './texas-life-platform';

describe('Texas Life platform', () => {
  it('keeps the approved vision statements', () => {
    expect(TEXAS_LIFE_VISION).toContain('live, work, invest, travel, and thrive in Texas');
    expect(TEXAS_LIFE_PLATFORM_VISION).toContain('most trusted digital guide for living in Texas');
  });

  it('defines all five visitor pillars', () => {
    expect(TEXAS_LIFE_PILLARS.map((pillar) => pillar.id)).toEqual([
      'learn', 'decide', 'do', 'discover', 'stay-informed',
    ]);
    expect(TEXAS_LIFE_PILLARS.every((pillar) => pillar.examples.length >= 6)).toBe(true);
  });

  it('enforces the five-question golden rule', () => {
    expect(TEXAS_LIFE_PAGE_STANDARDS.map((standard) => standard.id)).toEqual([
      'what', 'why', 'next', 'verify', 'else',
    ]);
    expect(validateTexasLifePage({ what: 'A', why: 'B', next: 'C', verify: 'D', else: 'E' })).toEqual({ complete: true, missing: [] });
    expect(validateTexasLifePage({ what: 'A' }).missing).toEqual(['why', 'next', 'verify', 'else']);
  });

  it('builds natural decision paths', () => {
    expect(nextDecisionSteps(BUYING_HOME_DECISION_GRAPH, 'mortgage')[0]?.id).toBe('property-taxes');
    expect(nextDecisionSteps(BUYING_HOME_DECISION_GRAPH, 'community-events')).toEqual([]);
  });

  it('distinguishes explanation from official authority', () => {
    const statement = createTrustStatement({
      explanation: 'TexasDefined explains eligibility and the application steps.',
      authority: 'The county appraisal district approves or denies the application.',
      authorityName: 'County appraisal district',
      authorityUrl: 'https://example.gov',
    });
    expect(statement.authority).toContain('approves or denies');
    expect(() => createTrustStatement({ explanation: 'Explanation', authority: 'Decision', authorityUrl: 'http://example.gov' })).toThrow(/HTTPS/);
  });

  it('preserves editorial and outcome standards', () => {
    expect(TEXAS_LIFE_EDITORIAL_PRINCIPLES).toContain('Plain English first.');
    expect(TEXAS_LIFE_SUCCESS_METRICS).toEqual([
      'resource-found', 'next-step-clicked', 'official-source-visited', 'task-return-visit',
    ]);
    expect(texasLifePillar('do')?.prompt).toBe('Help me accomplish something.');
  });
});
