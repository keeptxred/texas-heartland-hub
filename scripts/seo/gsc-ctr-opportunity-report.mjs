// Read-only analysis of already-fetched, finalized Google page/day metrics.
// Search Console suppresses rare queries and may not return all page rows;
// never present these totals as the complete Google dashboard.
const DAY = 86_400_000;
const dateOnly = (date) => new Date(date).toISOString().slice(0, 10);

function rangeFor(endDate, offsetStart, offsetEnd) {
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (!Number.isFinite(end)) throw new Error('Invalid finalized GSC end date');
  return {
    start: dateOnly(end - offsetStart * DAY),
    end: dateOnly(end - offsetEnd * DAY),
  };
}

function eligiblePage(path) {
  if (typeof path !== 'string') return false;
  return path === '/' ||
    /^\/(?:news|laws|elections|texas-politics|texas-legislature|texas-government|bills|issues|policy|data)(?:\/|$)/.test(path);
}

function aggregate(rows) {
  const byPath = new Map();
  let impressions = 0;
  let clicks = 0;
  let weighted = 0;
  let weight = 0;

  for (const row of rows) {
    const imp = Math.max(0, Number(row.impressions) || 0);
    const clk = Math.max(0, Number(row.clicks) || 0);
    const pos = row.position == null ? null : Number(row.position);
    if (imp <= 0) continue;
    impressions += imp;
    clicks += clk;
    if (Number.isFinite(pos)) {
      weighted += pos * imp;
      weight += imp;
    }
    const current = byPath.get(row.path) || { path: row.path, impressions: 0, clicks: 0, weighted: 0, weight: 0 };
    current.impressions += imp;
    current.clicks += clk;
    if (Number.isFinite(pos)) {
      current.weighted += pos * imp;
      current.weight += imp;
    }
    byPath.set(row.path, current);
  }

  return {
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : null,
    avgPosition: weight ? weighted / weight : null,
    byPath: [...byPath.values()].map(({ path, impressions: imp, clicks: clk, weighted: weightedPos, weight: posWeight }) => ({
      path,
      impressions: imp,
      clicks: clk,
      ctr: imp ? clk / imp : null,
      avgPosition: posWeight ? weightedPos / posWeight : null,
    })),
  };
}

export function buildGscCtrOpportunityReport(rows, endDate) {
  const latestPeriod = rangeFor(endDate, 27, 0);
  const previousPeriod = rangeFor(endDate, 55, 28);
  const current = aggregate(rows.filter((row) => row.metricDate >= latestPeriod.start && row.metricDate <= latestPeriod.end));
  const previous = aggregate(rows.filter((row) => row.metricDate >= previousPeriod.start && row.metricDate <= previousPeriod.end));

  const visible = current.byPath.filter((page) => eligiblePage(page.path));
  const strikingDistance = visible
    .filter((page) => page.impressions >= 5 && page.avgPosition >= 3 && page.avgPosition <= 15 && page.clicks <= 1)
    .sort((a, b) => b.impressions - a.impressions || a.avgPosition - b.avgPosition)
    .slice(0, 10);
  const rankFirst = visible
    .filter((page) => page.impressions >= 8 && page.avgPosition > 15)
    .sort((a, b) => b.impressions - a.impressions || a.avgPosition - b.avgPosition)
    .slice(0, 10);

  return {
    source: 'Google Search Console finalized page/day records',
    disclaimer: 'Page-level Search Console rows may omit data and differ from ungrouped site totals. These are observed metrics, not guaranteed complete site totals or causal CTR experiments.',
    latestPeriod,
    previousPeriod,
    latest: { clicks: current.clicks, impressions: current.impressions, ctr: current.ctr, avgPosition: current.avgPosition },
    previous: { clicks: previous.clicks, impressions: previous.impressions, ctr: previous.ctr, avgPosition: previous.avgPosition },
    strikingDistance,
    rankFirst,
  };
}

function percent(ctr) {
  return ctr == null ? 'n/a' : `${(ctr * 100).toFixed(2)}%`;
}

export function formatGscCtrReportMarkdown(report) {
  const lines = [
    '## Keep TX Red — organic search opportunity report',
    '',
    'Page-level Google Search Console data, finalized through ' + report.latestPeriod.end,
    '',
    '| Window | Clicks | Impressions | CTR | Avg. position |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...[
      [report.latestPeriod, report.latest],
      [report.previousPeriod, report.previous],
    ].map(([period, row]) =>
      `| ${period.start} to ${period.end} | ${row.clicks} | ${row.impressions} | ${percent(row.ctr)} | ${row.avgPosition?.toFixed(1) ?? 'n/a'} |`
    ),
    '',
    '### CTR opportunities: positions 3–15',
    ...report.strikingDistance.map((page) =>
      `- ${page.path}: ${page.impressions} impressions, ${page.clicks} clicks, position ${page.avgPosition.toFixed(1)}`),
    ...(report.strikingDistance.length ? [] : ['- No pages met the minimum evidence thresholds.']),
    '',
    '### Ranking opportunities: positions beyond 15',
    ...report.rankFirst.map((page) =>
      `- ${page.path}: ${page.impressions} impressions, position ${page.avgPosition.toFixed(1)}`),
    ...(report.rankFirst.length ? [] : ['- No pages met the minimum evidence thresholds.']),
    '',
    '> ' + report.disclaimer,
  ];
  return lines.join('\n') + '\n';
}
