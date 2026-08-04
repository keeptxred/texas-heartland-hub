import { describe, expect, it } from 'vitest';
import { buildPhase9CompletionReport } from '../texas-life-phase9-completion';

describe('Phase 9 completion report', () => {
  it('reports every required Phase 9 area as complete', () => {
    const report = buildPhase9CompletionReport();
    expect(report.areas.map((area) => area.id)).toEqual([
      'vision-and-pillars',
      'golden-rule',
      'editorial-principles',
      'pillar-hubs',
      'official-agencies',
      'starter-guides',
      'decision-journeys',
      'shared-platform',
    ]);
    expect(report.areas.flatMap((area) => area.issues)).toEqual([]);
    expect(report.completedAreas).toBe(report.totalAreas);
    expect(report.completionRate).toBe(1);
    expect(report.complete).toBe(true);
  });
});
