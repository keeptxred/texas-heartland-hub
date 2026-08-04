import { describe, expect, it } from 'vitest';
import { buildTexasLifeAdminDashboard } from './texas-life-admin';

const now = new Date('2026-08-03T12:00:00Z');

describe('Texas Life admin dashboard', () => {
  it('reports a healthy platform when content passes and journeys complete', () => {
    const dashboard = buildTexasLifeAdminDashboard([
      {
        resourceId: 'guide:homestead',
        title: 'Homestead Exemption',
        href: '/homestead',
        lastReviewedAt: '2026-08-01T12:00:00Z',
        reviewEveryDays: 90,
        hasTrustFramework: true,
        goldenRuleComplete: true,
        hasNextSteps: true,
        updatedAt: '2026-08-01T12:00:00Z',
      },
    ], [
      { journeyId: 'buying-home', sessionId: 'a', type: 'journey-started', occurredAt: '2026-08-02T12:00:00Z' },
      { journeyId: 'buying-home', sessionId: 'a', type: 'journey-completed', occurredAt: '2026-08-02T12:10:00Z' },
      { journeyId: 'buying-home', sessionId: 'a', type: 'official-resource-clicked', occurredAt: '2026-08-02T12:05:00Z' },
    ], now);

    expect(dashboard.status).toBe('healthy');
    expect(dashboard.outcomes.overallCompletionRate).toBe(1);
    expect(dashboard.outcomes.officialResourceClicks).toBe(1);
    expect(dashboard.priorities).toEqual([]);
  });

  it('raises critical priorities for broken official links', () => {
    const dashboard = buildTexasLifeAdminDashboard([
      {
        resourceId: 'guide:llc',
        title: 'Start an LLC',
        href: '/start-llc',
        lastReviewedAt: '2026-08-01T12:00:00Z',
        reviewEveryDays: 90,
        brokenOfficialLinks: 1,
        hasTrustFramework: true,
        goldenRuleComplete: true,
        hasNextSteps: true,
      },
    ], [], now);

    expect(dashboard.status).toBe('critical');
    expect(dashboard.priorities[0]?.severity).toBe('critical');
    expect(dashboard.priorities[0]?.action).toContain('Repair the official source link');
  });

  it('turns standards gaps into clear editorial actions', () => {
    const dashboard = buildTexasLifeAdminDashboard([
      {
        resourceId: 'guide:moving',
        title: 'Moving to Texas',
        href: '/moving-to-texas',
        lastReviewedAt: '2026-08-01T12:00:00Z',
        reviewEveryDays: 90,
        hasTrustFramework: false,
        goldenRuleComplete: false,
        hasNextSteps: false,
      },
    ], [], now);

    expect(dashboard.status).toBe('attention');
    expect(dashboard.priorities[0]?.action).toContain('official-authority distinction');
  });

  it('aggregates journey outcomes across multiple journeys', () => {
    const dashboard = buildTexasLifeAdminDashboard([], [
      { journeyId: 'moving', sessionId: 'a', type: 'journey-started', occurredAt: '2026-08-02T12:00:00Z' },
      { journeyId: 'moving', sessionId: 'a', type: 'journey-completed', occurredAt: '2026-08-02T12:10:00Z' },
      { journeyId: 'business', sessionId: 'b', type: 'journey-started', occurredAt: '2026-08-02T12:00:00Z' },
      { journeyId: 'business', sessionId: 'b', type: 'calculator-used', occurredAt: '2026-08-02T12:02:00Z' },
      { journeyId: 'business', sessionId: 'b', type: 'next-action-clicked', occurredAt: '2026-08-02T12:03:00Z' },
    ], now);

    expect(dashboard.outcomes.totalStarts).toBe(2);
    expect(dashboard.outcomes.totalCompletions).toBe(1);
    expect(dashboard.outcomes.overallCompletionRate).toBe(0.5);
    expect(dashboard.outcomes.calculatorUses).toBe(1);
    expect(dashboard.outcomes.nextActionClicks).toBe(1);
  });
});
