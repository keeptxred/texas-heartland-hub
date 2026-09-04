import crypto from 'node:crypto';
import { extractSitemapLocs, normalizeSiteUrl, selectInspectionUrls } from './gsc-sitewide-utils.mjs';

const credentialsJson = process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON;
const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:keeptxred.com';
const fetchOrigin = process.env.GSC_SITEWIDE_FETCH_ORIGIN || 'https://keeptxred-site.freddy-coppola.workers.dev';
const syncEndpoint = process.env.GSC_SITEWIDE_SYNC_ENDPOINT || `${fetchOrigin}/api/admin/gsc-sitewide-sync`;
const githubToken = process.env.GITHUB_TOKEN || '';
const githubRunId = process.env.GITHUB_RUN_ID || '';
const githubRepository = process.env.GITHUB_REPOSITORY || '';
const githubEventName = process.env.GITHUB_EVENT_NAME || '';
const inspectionLimit = Math.max(1, Math.min(500, Number(process.env.GSC_INSPECTION_LIMIT || 200)));
const metricLookbackDays = Math.max(1, Math.min(90, Number(process.env.GSC_SITEWIDE_LOOKBACK_DAYS || 28)));
const dryRun = process.argv.includes('--dry-run');

if (!credentialsJson) throw new Error('GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON is required');
const credentials = JSON.parse(credentialsJson);
if (!credentials.client_email || !credentials.private_key) throw new Error('Search Console service-account credentials are incomplete');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const metricEndDateValue = new Date();
metricEndDateValue.setUTCDate(metricEndDateValue.getUTCDate() - 3);
const metricStartDateValue = new Date(metricEndDateValue);
metricStartDateValue.setUTCDate(metricStartDateValue.getUTCDate() - (metricLookbackDays - 1));
const metricDate = metricEndDateValue.toISOString().slice(0, 10);
const metricStartDate = metricStartDateValue.toISOString().slice(0, 10);

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function fetchTransportUrl(canonicalUrl) {
  const canonical = new URL(canonicalUrl);
  if (!['keeptxred.com', 'www.keeptxred.com'].includes(canonical.hostname.toLowerCase())) return canonical.href;
  const transport = new URL(fetchOrigin);
  transport.pathname = canonical.pathname;
  transport.search = canonical.search;
  transport.hash = '';
  return transport.href;
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), credentials.private_key).toString('base64url');
  const assertion = `${unsigned}.${signature}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth-grant-type:jwt-bearer', assertion }),
  });
  if (!tokenResponse.ok) throw new Error(`Google OAuth failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
  const { access_token: accessToken } = await tokenResponse.json();
  if (!accessToken) throw new Error('Google OAuth returned no access token');
  return accessToken;
}

async function fetchPageMetrics(accessToken) {
  const rows = [];
  for (let startRow = 0; ; startRow += 25000) {
    const response = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: metricStartDate, endDate: metricDate, dimensions: ['date', 'page'], rowLimit: 25000, startRow, dataState: 'final' }),
    });
    if (!response.ok) throw new Error(`Search Console page query failed: ${response.status} ${await response.text()}`);
    const payload = await response.json();
    const pageRows = Array.isArray(payload.rows) ? payload.rows : [];
    rows.push(...pageRows);
    if (pageRows.length < 25000) break;
  }

  const aggregated = new Map();
  for (const row of rows) {
    const rowDate = typeof row?.keys?.[0] === 'string' ? row.keys[0] : '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(rowDate)) continue;
    const normalized = normalizeSiteUrl(row?.keys?.[1]);
    if (!normalized) continue;
    const impressions = Math.max(0, Number(row.impressions || 0));
    const clicks = Math.max(0, Number(row.clicks || 0));
    const position = Number.isFinite(Number(row.position)) ? Number(row.position) : null;
    const aggregateKey = `${rowDate}\u0000${normalized.url}`;
    const current = aggregated.get(aggregateKey) || {
      metricDate: rowDate, ...normalized, impressions: 0, clicks: 0, positionWeighted: 0, positionWeight: 0,
    };
    current.impressions += impressions;
    current.clicks += clicks;
    if (position !== null && impressions > 0) {
      current.positionWeighted += position * impressions;
      current.positionWeight += impressions;
    }
    aggregated.set(aggregateKey, current);
  }

  return [...aggregated.values()].map((row) => ({
    metricDate: row.metricDate,
    url: row.url,
    path: row.path,
    impressions: Math.round(row.impressions),
    clicks: Math.round(row.clicks),
    ctr: row.impressions > 0 ? row.clicks / row.impressions : null,
    position: row.positionWeight > 0 ? row.positionWeighted / row.positionWeight : null,
  }));
}

async function fetchSitemapUrls() {
  const queue = [{ url: 'https://keeptxred.com/sitemap.xml', depth: 0 }];
  const visitedSitemaps = new Set();
  const pageUrls = new Set();
  while (queue.length > 0 && visitedSitemaps.size < 100) {
    const item = queue.shift();
    if (!item || visitedSitemaps.has(item.url) || item.depth > 2) continue;
    visitedSitemaps.add(item.url);
    let response;
    try {
      response = await fetch(fetchTransportUrl(item.url), { headers: { 'User-Agent': 'KeepTXRed-GSC-Sitewide-Sync/1.0' } });
    } catch (error) {
      console.warn(`Unable to fetch sitemap ${item.url}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    if (!response.ok) {
      console.warn(`Unable to fetch sitemap ${item.url}: HTTP ${response.status}`);
      continue;
    }
    const xml = await response.text();
    for (const location of extractSitemapLocs(xml)) {
      let parsed;
      try { parsed = new URL(location); } catch { continue; }
      if (!['keeptxred.com', 'www.keeptxred.com'].includes(parsed.hostname.toLowerCase())) continue;
      if (parsed.pathname.toLowerCase().endsWith('.xml') && item.depth < 2) {
        queue.push({ url: location, depth: item.depth + 1 });
        continue;
      }
      const normalized = normalizeSiteUrl(location);
      if (normalized) pageUrls.add(normalized.url);
    }
  }
  return { pageUrls: [...pageUrls], sitemapCount: visitedSitemaps.size };
}

function normalizeInspection(url, payload) {
  const normalized = normalizeSiteUrl(url);
  if (!normalized) return null;
  const inspectionResult = payload?.inspectionResult ?? {};
  const result = inspectionResult?.indexStatusResult ?? {};
  return {
    ...normalized,
    verdict: result.verdict ?? null,
    coverageState: result.coverageState ?? null,
    robotsTxtState: result.robotsTxtState ?? null,
    indexingState: result.indexingState ?? null,
    pageFetchState: result.pageFetchState ?? null,
    lastCrawlTime: result.lastCrawlTime ?? null,
    googleCanonical: result.googleCanonical ?? null,
    userCanonical: result.userCanonical ?? null,
    sitemap: Array.isArray(result.sitemap) ? result.sitemap.slice(0, 50) : [],
    referringUrls: Array.isArray(result.referringUrls) ? result.referringUrls.slice(0, 50) : [],
    inspectionResultLink: inspectionResult.inspectionResultLink ?? null,
  };
}

async function inspectUrl(accessToken, url) {
  const response = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl, languageCode: 'en-US' }),
  });
  if (!response.ok) {
    const body = await response.text();
    if (response.status === 429) return { quotaExhausted: true, row: null, url };
    throw new Error(`URL Inspection failed for ${url}: ${response.status} ${body}`);
  }
  return { quotaExhausted: false, row: normalizeInspection(url, await response.json()), url };
}

async function inspectUrls(accessToken, urls) {
  const results = [];
  let quotaExhausted = false;
  for (let index = 0; index < urls.length; index += 5) {
    const chunk = urls.slice(index, index + 5);
    const chunkResults = await Promise.all(chunk.map((url) => inspectUrl(accessToken, url)));
    for (const item of chunkResults) {
      if (item.row) results.push(item.row);
      if (item.quotaExhausted) quotaExhausted = true;
    }
    if (quotaExhausted) {
      console.warn(`Google URL Inspection quota exhausted after ${results.length} successful inspections; preserving metrics and partial inspection results.`);
      break;
    }
    if (index + 5 < urls.length) await sleep(1000);
  }
  return { results, quotaExhausted };
}

async function writeBatch(payload) {
  const retryDelaysMs = [0, 10000, 20000, 30000, 45000, 60000];
  let lastFailure = '';
  for (let attempt = 0; attempt < retryDelaysMs.length; attempt += 1) {
    const delay = retryDelaysMs[attempt];
    if (delay > 0) await sleep(delay);
    const response = await fetch(syncEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'X-GitHub-Token': githubToken,
        'Content-Type': 'application/json',
        'X-GitHub-Run-Id': githubRunId,
        'X-GitHub-Repository': githubRepository,
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) return response.json();
    lastFailure = `${response.status} ${await response.text()}`;
    if (![401, 404, 500, 502, 503, 504].includes(response.status) || attempt === retryDelaysMs.length - 1) break;
  }
  throw new Error(`Sitewide GSC write failed after deployment retries: ${lastFailure}`);
}

const accessToken = await getAccessToken();
const metrics = await fetchPageMetrics(accessToken);
metrics.sort((a, b) => b.metricDate.localeCompare(a.metricDate) || b.impressions - a.impressions || b.clicks - a.clicks || a.url.localeCompare(b.url));

if (dryRun) {
  const inspectionResult = await inspectUrl(accessToken, 'https://keeptxred.com/texas-politics');
  console.log(JSON.stringify({ dryRun: true, siteUrl, metricStartDate, metricDate, metricLookbackDays, pageMetricRows: metrics.length, topMetricSample: metrics.slice(0, 5), urlInspectionAccess: inspectionResult.quotaExhausted ? 'quota-exhausted' : inspectionResult.row ? 'ok' : 'empty', inspectionVerdict: inspectionResult.row?.verdict ?? null }, null, 2));
  process.exit(0);
}

if (!githubToken || !githubRunId || !githubRepository) throw new Error('GitHub Actions identity is required for write mode');

let metricsStored = 0;
for (let index = 0; index < metrics.length; index += 500) {
  const result = await writeBatch({ metrics: metrics.slice(index, index + 500), inspections: [] });
  metricsStored += Number(result.metricsStored || 0);
}

const { pageUrls: sitemapUrls, sitemapCount } = await fetchSitemapUrls();
const builtInPriority = [
  'https://keeptxred.com/',
  'https://keeptxred.com/texas-politics',
  'https://keeptxred.com/texas-politics/figures',
  'https://keeptxred.com/elections/2026',
  'https://keeptxred.com/elections/candidates',
  // Keep the controlled zero-impression cohort observable after noindex removes
  // these URLs from sitemap rotation. This is inspection-only and does not
  // advertise the held pages back to search engines.
  'https://keeptxred.com/news/2026-08-13-how-texas-county-government-works',
  'https://keeptxred.com/news/2026-08-14-texas-data-centers-under-scrutiny-after-gov-abbott-s-order-sh190y',
  'https://keeptxred.com/news/2026-08-14-texas-public-information-act-request-guide',
  'https://keeptxred.com/news/2026-08-15-ercot-says-governor-s-data-center-audit-could-take-months-to-complete',
  'https://keeptxred.com/news/2026-08-19-minnesota-sues-gov-abbott-as-ice-agent-charged-in-shooting-faces-possible-releas',
  'https://keeptxred.com/news/2026-08-20-texas-families-ask-supreme-court-to-review-state-law-requiring-ten-commandments-',
];
const latestMetricUrls = metrics.filter((row) => row.metricDate === metricDate).map((row) => row.url);
const priorityUrls = [...builtInPriority, ...latestMetricUrls];
const inspectionEnabled = githubEventName !== 'push';
const inspectionUrls = inspectionEnabled
  ? selectInspectionUrls({ sitemapUrls, priorityUrls, limit: inspectionLimit, metricDate })
  : [];
const inspectionBatch = inspectionEnabled
  ? await inspectUrls(accessToken, inspectionUrls)
  : { results: [], quotaExhausted: false };
const inspections = inspectionBatch.results;

let inspectionsStored = 0;
for (let index = 0; index < inspections.length; index += 100) {
  const result = await writeBatch({ metrics: [], inspections: inspections.slice(index, index + 100) });
  inspectionsStored += Number(result.inspectionsStored || 0);
}

console.log(JSON.stringify({
  dryRun: false,
  siteUrl,
  metricStartDate,
  metricDate,
  metricLookbackDays,
  fetchOrigin,
  syncEndpointOrigin: new URL(syncEndpoint).origin,
  pageMetricRows: metrics.length,
  metricsStored,
  sitemapCount,
  sitemapUrls: sitemapUrls.length,
  inspectionLimit,
  inspectionEnabled,
  inspectionQuotaExhausted: inspectionBatch.quotaExhausted,
  inspectionsRequested: inspectionUrls.length,
  inspectionsStored,
  indexedVerdicts: inspections.reduce((counts, row) => {
    const key = row.verdict || 'UNKNOWN';
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {}),
}, null, 2));