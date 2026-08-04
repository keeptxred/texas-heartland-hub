import { describe, expect, it } from 'vitest';
import { rankTexasLifeRecommendations } from './texas-life-context';
import { checklistProgress, deadlineState, validateTexasLifeChecklist, validateTexasLifeDeadline } from './texas-life-tasks';
import { buildTexasLifeFreshnessDashboard, summarizeTexasLifeJourneys } from './texas-life-operations';

describe('adaptive Texas Life platform', () => {
  it('ranks recommendations by journey, audience, location, season and recent changes', () => {
    const ranked = rankTexasLifeRecommendations([
      { id: 'a', title: 'Homestead', href: '/homestead', description: 'Apply', journeyIds: ['home'], audiences: ['resident'], counties: ['Fort Bend'], topics: ['taxes'] },
      { id: 'b', title: 'Camping', href: '/camping', description: 'Camp', seasons: ['fall'] },
    ], { journeyId: 'home', audience: 'resident', county: 'fort bend', changedTopics: ['Taxes'] });
    expect(ranked[0]?.id).toBe('a');
    expect(ranked[0]?.reasons).toEqual(expect.arrayContaining(['same-journey', 'audience-match', 'same-county', 'recent-change']));
  });

  it('validates deadlines and calculates their state', () => {
    const deadline = {
      id: 'vote', title: 'Register to vote', dueAt: '2026-10-05T23:59:59Z', reminderText: 'Register before the deadline.',
      authorityName: 'Texas Secretary of State', authorityUrl: 'https://www.sos.texas.gov', relatedHrefs: ['/elections'],
    };
    expect(validateTexasLifeDeadline(deadline).valid).toBe(true);
    expect(deadlineState(deadline, new Date('2026-09-01T00:00:00Z'))).toBe('open');
  });

  it('validates and measures interactive checklists', () => {
    const checklist = { id: 'move', title: 'Moving', items: [{ id: 'dl', title: 'Driver license' }, { id: 'vote', title: 'Register to vote', href: '/elections' }] };
    expect(validateTexasLifeChecklist(checklist).valid).toBe(true);
    expect(checklistProgress(checklist, new Set(['dl']))).toMatchObject({ completed: 1, total: 2, percent: 50, complete: false });
  });

  it('builds a prioritized freshness dashboard', () => {
    const dashboard = buildTexasLifeFreshnessDashboard([{
      resourceId: 'guide:home', title: 'Home Guide', href: '/home', lastReviewedAt: '2025-01-01', reviewEveryDays: 90,
      brokenOfficialLinks: 1, hasTrustFramework: false, goldenRuleComplete: true, hasNextSteps: false, updatedAt: '2026-01-01',
    }], new Date('2026-08-01'));
    expect(dashboard.criticalIssues).toBe(1);
    expect(dashboard.issues[0]?.reasons).toEqual(expect.arrayContaining(['review-due', 'broken-official-link', 'missing-trust-framework', 'missing-next-steps']));
  });

  it('summarizes journey starts, completions and useful actions', () => {
    const events = [
      { journeyId: 'home', sessionId: '1', type: 'journey-started' as const, occurredAt: '2026-08-01T00:00:00Z' },
      { journeyId: 'home', sessionId: '1', type: 'journey-step-viewed' as const, stepId: 'mortgage', occurredAt: '2026-08-01T00:01:00Z' },
      { journeyId: 'home', sessionId: '1', type: 'calculator-used' as const, occurredAt: '2026-08-01T00:02:00Z' },
      { journeyId: 'home', sessionId: '1', type: 'official-resource-clicked' as const, occurredAt: '2026-08-01T00:03:00Z' },
      { journeyId: 'home', sessionId: '1', type: 'journey-completed' as const, occurredAt: '2026-08-01T00:04:00Z' },
    ];
    expect(summarizeTexasLifeJourneys(events)[0]).toMatchObject({ starts: 1, completions: 1, completionRate: 1, calculatorUses: 1, officialResourceClicks: 1 });
  });
});
