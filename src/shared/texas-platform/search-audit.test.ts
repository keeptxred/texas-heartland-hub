import { describe, expect, it } from 'vitest';
import { REPRESENTATIVE_ENTITIES, SHARED_ENTITIES } from './entities';
import { auditSearchCases, failedSearchAuditCases } from './search-audit';

describe('shared search audits', () => {
  it('summarizes passing and failing search cases', () => {
    const representative = REPRESENTATIVE_ENTITIES.find((entity) => entity.title.includes('Schwertner'));
    expect(representative).toBeDefined();
    const summary = auditSearchCases([
      { query: representative!.title, minimumResults: 1 },
      { query: 'definitely-no-match-query', expectedEntityIds: ['resource:intentionally-missing'] },
    ], SHARED_ENTITIES, 'keeptxred');

    expect(summary.total).toBe(2);
    expect(summary.passed).toBe(1);
    expect(summary.failed).toBe(1);
    expect(summary.passRate).toBe(50);
    expect(failedSearchAuditCases(summary)).toHaveLength(1);
  });

  it('checks expected entity ids', () => {
    const representative = REPRESENTATIVE_ENTITIES.find((entity) => entity.title.includes('Schwertner'));
    expect(representative).toBeDefined();
    const summary = auditSearchCases([
      { query: 'Charls Schwertnr', expectedEntityIds: [representative!.id] },
    ], SHARED_ENTITIES, 'keeptxred');

    expect(summary.failed).toBe(0);
    expect(summary.results[0].missingExpectedIds).toEqual([]);
  });

  it('enforces site visibility', () => {
    const representative = REPRESENTATIVE_ENTITIES[0];
    const summary = auditSearchCases([
      { query: representative.title, expectedEntityIds: [representative.id] },
    ], SHARED_ENTITIES, 'texasdefined');

    expect(summary.failed).toBe(1);
    expect(summary.results[0].missingExpectedIds).toEqual([representative.id]);
  });

  it('returns a perfect score for an empty audit list', () => {
    expect(auditSearchCases([], SHARED_ENTITIES, 'keeptxred').passRate).toBe(100);
  });
});
