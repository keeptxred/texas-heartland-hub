import { searchEntityCollection, type SharedEntity } from './entities';
import type { SharedSite } from './registry';

export type SearchAuditCase = {
  query: string;
  expectedEntityIds?: string[];
  minimumResults?: number;
};

export type SearchAuditResult = {
  query: string;
  resultCount: number;
  topResultId?: string;
  missingExpectedIds: string[];
  passed: boolean;
};

export type SearchAuditSummary = {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  results: SearchAuditResult[];
};

export function auditSearchCases(
  cases: ReadonlyArray<SearchAuditCase>,
  entities: ReadonlyArray<SharedEntity>,
  site: SharedSite,
  limit = 20,
): SearchAuditSummary {
  const results = cases.map((testCase) => {
    const matches = searchEntityCollection(testCase.query, entities, site, limit);
    const matchIds = new Set(matches.map((match) => match.id));
    const missingExpectedIds = (testCase.expectedEntityIds ?? []).filter((id) => !matchIds.has(id));
    const minimumResults = testCase.minimumResults ?? (testCase.expectedEntityIds?.length ? 1 : 0);
    const passed = matches.length >= minimumResults && missingExpectedIds.length === 0;

    return {
      query: testCase.query,
      resultCount: matches.length,
      topResultId: matches[0]?.id,
      missingExpectedIds,
      passed,
    };
  });
  const passed = results.filter((result) => result.passed).length;
  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    passRate: results.length ? Math.round((passed / results.length) * 100) : 100,
    results,
  };
}

export function failedSearchAuditCases(summary: SearchAuditSummary) {
  return summary.results.filter((result) => !result.passed);
}

export const DEFAULT_SHARED_SEARCH_AUDIT_CASES: SearchAuditCase[] = [
  { query: 'property taxes', minimumResults: 1 },
  { query: 'mortgage calculator', minimumResults: 1 },
  { query: 'find my representative', minimumResults: 1 },
  { query: 'moving to texas', minimumResults: 1 },
  { query: 'texas laws', minimumResults: 1 },
  { query: 'Charls Schwertnr', minimumResults: 1 },
];
