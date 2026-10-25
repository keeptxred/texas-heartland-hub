import { describe, expect, it } from 'vitest';
import { buildGscCtrOpportunityReport, formatGscCtrReportMarkdown } from './gsc-ctr-opportunity-report.mjs';

const row = (metricDate, path, impressions, clicks, position) => ({ metricDate, path, impressions, clicks, position });

describe('Google page-level CTR opportunities', () => {
  it('compares equal finalized 28-day periods and separates ranking from CTR work', () => {
    const report = buildGscCtrOpportunityReport([
      row('2026-08-30', '/', 22, 3, 14.7),
      row('2026-09-14', '/laws', 41, 0, 71),
      row('2026-10-10', '/laws', 72, 0, 54.2),
      row('2026-10-18', '/elections/statewide', 9, 0, 7.1),
      row('2026-10-18', '/shop', 50, 0, 10), // commerce intent belongs to separate analysis
      row('2026-10-23', '/news', 900, 400, 1), // incomplete, not finalized
    ], '2026-10-22');

    expect(report.latestPeriod).toEqual({ start: '2026-09-25', end: '2026-10-22' });
    expect(report.previousPeriod).toEqual({ start: '2026-08-28', end: '2026-09-24' });
    expect(report.latest.clicks).toBe(0);
    expect(report.latest.impressions).toBe(131); // all GSC pages, including /shop
    expect(report.previous.clicks).toBe(3);
    expect(report.previous.impressions).toBe(63);
    expect(report.strikingDistance.map((p) => p.path)).toEqual(['/elections/statewide']);
    expect(report.rankFirst.map((p) => p.path)).toEqual(['/laws']);
    expect(formatGscCtrReportMarkdown(report)).toContain('0.00%');
    expect(formatGscCtrReportMarkdown(report)).toContain('Page-level Google Search Console data');
  });

  it('never invents CTR or ranking candidates on empty data', () => {
    const report = buildGscCtrOpportunityReport([], '2026-10-22');
    expect(report.latest.ctr).toBeNull();
    expect(report.latest.avgPosition).toBeNull();
    expect(report.strikingDistance).toEqual([]);
    expect(report.rankFirst).toEqual([]);
    expect(formatGscCtrReportMarkdown(report)).toContain('No pages met the minimum evidence thresholds');
  });

  it('treats zero position as unusable rather than a strong ranking signal', () => {
    const report = buildGscCtrOpportunityReport([
      row('2026-10-19', '/elections/2026', 100, 0, null),
    ], '2026-10-22');
    expect(report.latest.impressions).toBe(100);
    expect(report.latest.avgPosition).toBeNull();
    expect(report.strikingDistance).toHaveLength(0);
  });
});
