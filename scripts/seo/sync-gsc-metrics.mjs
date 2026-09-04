import crypto from 'node:crypto';

const credentialsJson = process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON;
const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:keeptxred.com';
const syncEndpoint = process.env.GSC_SYNC_ENDPOINT || 'https://keeptxred.com/api/admin/gsc-sync';
const githubToken = process.env.GITHUB_TOKEN || '';
const githubRunId = process.env.GITHUB_RUN_ID || '';
const githubRepository = process.env.GITHUB_REPOSITORY || '';
const dryRun = process.argv.includes('--dry-run');

if (!credentialsJson) throw new Error('GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON is required');
const credentials = JSON.parse(credentialsJson);
if (!credentials.client_email || !credentials.private_key) throw new Error('Search Console service-account credentials are incomplete');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const end = new Date();
end.setUTCDate(end.getUTCDate() - 3);
const start = new Date(end);
start.setUTCDate(start.getUTCDate() - 27);
const startDate = start.toISOString().slice(0, 10);
const endDate = end.toISOString().slice(0, 10);

const base64url = (value) => Buffer.from(value).toString('base64url');
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
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  }),
});
if (!tokenResponse.ok) throw new Error(`Google OAuth failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
const { access_token: accessToken } = await tokenResponse.json();
if (!accessToken) throw new Error('Google OAuth returned no access token');

const rows = [];
for (let startRow = 0; ; startRow += 25000) {
  const response = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 25000,
      startRow,
      dataState: 'final',
    }),
  });
  if (!response.ok) throw new Error(`Search Console query failed: ${response.status} ${await response.text()}`);
  const payload = await response.json();
  const pageRows = Array.isArray(payload.rows) ? payload.rows : [];
  rows.push(...pageRows);
  if (pageRows.length < 25000) break;
}

const bySlug = new Map();
for (const row of rows) {
  const page = row?.keys?.[0];
  if (typeof page !== 'string') continue;
  let url;
  try { url = new URL(page); } catch { continue; }
  if (!['keeptxred.com', 'www.keeptxred.com'].includes(url.hostname.toLowerCase())) continue;
  const match = /^\/news\/([^/?#]+)\/?$/.exec(url.pathname);
  if (!match) continue;
  const slug = decodeURIComponent(match[1]).trim();
  if (!slug) continue;

  const impressions = Number(row.impressions || 0);
  const clicks = Number(row.clicks || 0);
  const position = Number.isFinite(Number(row.position)) ? Number(row.position) : null;
  const current = bySlug.get(slug) || { slug, impressions: 0, clicks: 0, positionWeighted: 0, positionWeight: 0 };
  current.impressions += impressions;
  current.clicks += clicks;
  if (position !== null && impressions > 0) {
    current.positionWeighted += position * impressions;
    current.positionWeight += impressions;
  }
  bySlug.set(slug, current);
}

const metrics = [...bySlug.values()].map((row) => ({
  slug: row.slug,
  impressions: row.impressions,
  clicks: row.clicks,
  ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
  position: row.positionWeight > 0 ? row.positionWeighted / row.positionWeight : null,
}));

console.log(JSON.stringify({ siteUrl, startDate, endDate, searchConsoleRows: rows.length, articleRows: metrics.length, dryRun }, null, 2));

if (dryRun) process.exit(0);
if (!githubToken || !githubRunId || !githubRepository) throw new Error('GitHub Actions identity is required for write mode');

async function writeBatch(batch) {
  const retryDelaysMs = [0, 10000, 20000, 30000, 45000, 60000];
  let lastFailure = '';

  for (let attempt = 0; attempt < retryDelaysMs.length; attempt += 1) {
    const delay = retryDelaysMs[attempt];
    if (delay > 0) {
      console.log(`GSC write retry ${attempt + 1}/${retryDelaysMs.length} after ${delay / 1000}s deployment grace period.`);
      await sleep(delay);
    }

    const response = await fetch(syncEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'X-GitHub-Token': githubToken,
        'Content-Type': 'application/json',
        'X-GitHub-Run-Id': githubRunId,
        'X-GitHub-Repository': githubRepository,
      },
      body: JSON.stringify({ rows: batch, startDate, endDate }),
    });

    if (response.ok) return response.json();

    const body = await response.text();
    lastFailure = `${response.status} ${body}`;
    const retryable = [401, 404, 500, 502, 503, 504].includes(response.status);
    if (!retryable || attempt === retryDelaysMs.length - 1) break;
    console.log(`GSC write attempt ${attempt + 1} hit transient ${response.status}; production may still be serving the prior revision.`);
  }

  throw new Error(`GSC metric write failed after deployment retries: ${lastFailure}`);
}

let updated = 0;
let dailyArticlesUpdated = 0;
let aliasesResolved = 0;
const unmatched = [];
for (let i = 0; i < metrics.length; i += 500) {
  const batch = metrics.slice(i, i + 500);
  const result = await writeBatch(batch);
  updated += Number(result.updated || 0);
  dailyArticlesUpdated += Number(result.dailyArticlesUpdated || 0);
  aliasesResolved += Number(result.aliasesResolved || 0);
  if (Array.isArray(result.unmatched)) unmatched.push(...result.unmatched);
}

console.log(JSON.stringify({
  submitted: metrics.length,
  canonicalMetricsStored: updated,
  dailyArticlesCompatibilityUpdated: dailyArticlesUpdated,
  aliasesResolved,
  staticOrLegacyUrls: unmatched.length,
  staticOrLegacySample: unmatched.slice(0, 25),
}, null, 2));
console.log(`GSC sync complete: ${metrics.length} article metrics submitted, ${updated} canonical URL metrics stored, ${dailyArticlesUpdated} daily_articles compatibility rows updated.`);
