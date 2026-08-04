import { describe, expect, it } from 'vitest';
import { createTexasLifeBlueprint, validateTexasLifeBlueprint } from './texas-life-page-blueprint';
import { summarizeTexasLifeOutcomes } from './texas-life-outcomes';

const completePage = {
  id: 'homestead-exemption',
  title: 'Texas Homestead Exemption',
  pillar: 'do' as const,
  what: 'A property-tax exemption for a qualifying primary residence.',
  why: 'It can reduce the taxable value of a home.',
  next: 'Confirm eligibility and apply through the county appraisal district.',
  verify: 'Check the appraisal district instructions and state guidance.',
  else: 'Deadlines, local procedures, and available exemptions can differ.',
  trust: {
    explanation: 'TexasDefined explains eligibility and the application process.',
    authority: 'The county appraisal district approves or denies the application.',
    authorityName: 'County appraisal district',
    authorityUrl: 'https://comptroller.texas.gov/taxes/property-tax/exemptions/',
  },
  nextSteps: [
    { title: 'Estimate property taxes', href: '/tax-calculator' },
    { title: 'Find your county', href: '/texas-resources/type/county' },
  ],
};

describe('Texas Life page blueprint', () => {
  it('accepts a page that follows the Golden Rule and trust framework', () => {
    expect(validateTexasLifeBlueprint(completePage)).toEqual({ complete: true, missing: [], errors: [] });
    expect(createTexasLifeBlueprint(completePage).title).toBe('Texas Homestead Exemption');
  });

  it('identifies missing Golden Rule answers', () => {
    const result = validateTexasLifeBlueprint({ ...completePage, next: '', verify: '' });
    expect(result.complete).toBe(false);
    expect(result.missing).toContain('What do I do next?');
    expect(result.missing).toContain('Where can I verify it?');
  });

  it('rejects external or duplicate decision-graph destinations', () => {
    const result = validateTexasLifeBlueprint({
      ...completePage,
      nextSteps: [
        { title: 'Outside', href: 'https://example.com' },
        { title: 'Repeat', href: 'https://example.com' },
      ],
    });
    expect(result.complete).toBe(false);
    expect(result.errors.some((error) => error.includes('internal'))).toBe(true);
    expect(result.errors.some((error) => error.includes('Duplicate'))).toBe(true);
  });
});

describe('Texas Life outcome metrics', () => {
  it('measures actions instead of page views alone', () => {
    const events = [
      { type: 'resource-found', pageId: 'taxes', sessionId: 'a', occurredAt: '2026-08-04T01:00:00Z' },
      { type: 'next-step-clicked', pageId: 'taxes', sessionId: 'a', occurredAt: '2026-08-04T01:01:00Z', destination: '/tax-calculator' },
      { type: 'official-source-visited', pageId: 'taxes', sessionId: 'b', occurredAt: '2026-08-04T01:02:00Z', destination: 'https://comptroller.texas.gov' },
      { type: 'task-return-visit', pageId: 'taxes', sessionId: 'b', occurredAt: '2026-08-05T01:00:00Z' },
    ];
    const summary = summarizeTexasLifeOutcomes(events);
    expect(summary.totalEvents).toBe(4);
    expect(summary.uniqueSessions).toBe(2);
    expect(summary.completionRate).toBe(1);
  });

  it('ignores malformed outcome records', () => {
    const summary = summarizeTexasLifeOutcomes([
      { type: 'resource-found', pageId: '', sessionId: 'a', occurredAt: 'not-a-date' },
    ]);
    expect(summary.totalEvents).toBe(0);
    expect(summary.completionRate).toBe(0);
  });
});
