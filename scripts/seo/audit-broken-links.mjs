// Repository and production-site broken-link audit for KeepTXRed.
// Verification touch: exercise the post-merge current-main broken-link dispatcher.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { isNavigationalPath, shouldScanRuntimeLinks } from './broken-link-scan-scope.mjs';
import {
  extractLinkCandidates,
  normalizeInternalLink,
  routeRegexFromRouteName,
} from './broken-link-audit-utils.mjs';

const ROOT = process.cwd();
const ROUTES_ROOT = path.join(ROOT, 'src', 'routes');
const PUBLIC_ROOT = path.join(ROOT, 'public');
const SITE = process.env.AUDIT_SITE_URL || 'https://keeptxred.com';
const LIVE = process.argv.includes('--live');
const SCAN_ROOTS = ['src', 'public', 'scripts', 'supabase'];
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.md', '.html', '.sql', '.txt']);
const RETIRED_PREFIXES = [
  '/explore', '/texas-living', '/living-in-texas', '/moving-to-texas',
  '/moving-to-texas-checklist', '/texas-resources', '/texas-data',
  '/events', '/food-bbq',
];
const IGNORE_PREFIXES = ['/api/', '/admin', '/auth/', '/assets/', '/favicon', '/robots.txt', '/sitemap'];
const MAX_FETCH_ATTEMPTS = 3;
const AUDIT_REQUEST_HEADERS = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 KeepTXRed-Link-Audit/1.2',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist', '.output', 'coverage'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

async function walkAllFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist', '.output', 'coverage'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkAllFiles(full));
    else files.push(full);
  }
  return files;
}

async function collectPublicAssetPaths() {
  try {
    const files = await walkAllFiles(PUBLIC_ROOT);
    return new Set(files.map((file) => `/${path.relative(PUBLIC_ROOT, file).replace(/\\/g, '/')}`));
  } catch {
    return new Set();
  }
}

function routeRegexFromFile(file) {
  const name = path.relative(ROUTES_ROOT, file).replace(/\\/g, '/');
  return routeRegexFromRouteName(name);
}

function normalizeInternal(raw) {
  const pathname = normalizeInternalLink(raw, SITE);
  return pathname && isNavigationalPath(pathname) ? pathname : null;
}

function extractLinks(text) {
  return extractLinkCandidates(text);
}

async function staticAudit() {
  const routeFiles = await walk(ROUTES_ROOT);
  const routeRegexes = routeFiles.map(routeRegexFromFile).filter(Boolean);
  const publicAssetPaths = await collectPublicAssetPaths();
  const findings = [];

  for (const root of SCAN_ROOTS) {
    const absolute = path.join(ROOT, root);
    try { await fs.access(absolute); } catch { continue; }

    for (const file of await walk(absolute)) {
      if (!shouldScanRuntimeLinks(file)) continue;
      const text = await fs.readFile(file, 'utf8');
      const lines = text.split(/\r?\n/);

      lines.forEach((line, index) => {
        for (const raw of extractLinks(line)) {
          const pathname = normalizeInternal(raw);
          if (!pathname || IGNORE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) continue;

          const retired = RETIRED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
          const matched = routeRegexes.some((regex) => regex.test(pathname));
          let publicAsset = false;
          try { publicAsset = publicAssetPaths.has(decodeURIComponent(pathname)); } catch { publicAsset = false; }

          if (retired || (!matched && !publicAsset)) {
            findings.push({
              type: retired ? 'retired-internal-link' : 'unmatched-internal-route',
              severity: retired ? 'migration-debt' : 'blocking',
              file: path.relative(ROOT, file),
              line: index + 1,
              raw,
              pathname,
            });
          }
        }
      });
    }
  }

  return findings;
}

async function fetchText(url) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: AUDIT_REQUEST_HEADERS,
      });
      const text = await response.text();
      if (response.status < 500 || attempt === MAX_FETCH_ATTEMPTS) return { response, text, attempts: attempt };
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === MAX_FETCH_ATTEMPTS) throw error;
    } finally {
      clearTimeout(timer);
    }
    await sleep(500 * attempt);
  }
  throw lastError;
}

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1].replace(/&amp;/g, '&'));
}

async function collectSitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  try {
    const { response, text, attempts } = await fetchText(url);
    if (!response.ok) return [{ url, sitemapFailure: response.status, attempts }];
    const locs = xmlLocs(text);
    const nested = locs.filter((loc) => /sitemap.*\.xml(?:$|\?)/i.test(loc));
    const pages = locs.filter((loc) => !nested.includes(loc));
    for (const child of nested) pages.push(...await collectSitemapUrls(child, seen));
    return pages;
  } catch (error) {
    return [{ url, sitemapRequestError: String(error) }];
  }
}

async function liveAudit() {
  const sitemap = new URL('/sitemap.xml', SITE).href;
  const entries = await collectSitemapUrls(sitemap);
  const failures = [];
  const pages = entries.filter((entry) => typeof entry === 'string');

  failures.push(...entries.filter((entry) => typeof entry !== 'string').map((entry) => ({
    type: entry.sitemapFailure ? 'sitemap-http-error' : 'sitemap-request-error',
    severity: 'blocking',
    ...entry,
  })));

  let cursor = 0;
  const workers = Array.from({ length: 8 }, async () => {
    while (cursor < pages.length) {
      const url = pages[cursor++];
      try {
        const { response, text, attempts } = await fetchText(url);
        if (!response.ok) failures.push({ type: 'page-http-error', severity: 'blocking', url, status: response.status, attempts });
        if (/text\/html/i.test(response.headers.get('content-type') || '')) {
          const links = extractLinks(text)
            .map((raw) => ({ raw, pathname: normalizeInternal(raw) }))
            .filter((item) => item.pathname);
          for (const link of links) {
            if (RETIRED_PREFIXES.some((prefix) => link.pathname === prefix || link.pathname.startsWith(prefix + '/'))) {
              failures.push({ type: 'live-retired-link', severity: 'migration-debt', source: url, ...link });
            }
          }
        }
      } catch (error) {
        failures.push({ type: 'request-error', severity: 'blocking', url, attempts: MAX_FETCH_ATTEMPTS, error: String(error) });
      }
    }
  });

  await Promise.all(workers);
  return { pagesChecked: pages.length, failures };
}

function printBlockingStaticFindings(findings) {
  if (!findings.length) return;
  const counts = new Map();
  for (const item of findings) counts.set(item.pathname, (counts.get(item.pathname) ?? 0) + 1);
  const grouped = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  console.log('\nBlocking static targets by frequency:');
  for (const [pathname, count] of grouped) console.log(`- ${count} × ${pathname}`);
  console.log('\nBlocking static findings:');
  for (const item of findings) console.log(`- ${item.file}:${item.line} ${item.pathname} (${item.raw})`);
}

function printBlockingLiveFailures(failures) {
  if (!failures.length) return;
  console.log('\nBlocking live failures:');
  for (const item of failures) {
    const detail = item.status ?? item.sitemapFailure ?? item.error ?? item.sitemapRequestError ?? '';
    console.log(`- ${item.type}: ${item.url || item.source || ''} ${detail}`.trim());
  }
}

const staticFindings = await staticAudit();
const live = LIVE ? await liveAudit() : { pagesChecked: 0, failures: [] };
const blockingStatic = staticFindings.filter((item) => item.severity === 'blocking');
const migrationStatic = staticFindings.filter((item) => item.severity === 'migration-debt');
const blockingLive = live.failures.filter((item) => item.severity === 'blocking');
const migrationLive = live.failures.filter((item) => item.severity === 'migration-debt');

const report = {
  generatedAt: new Date().toISOString(),
  site: SITE,
  liveEnabled: LIVE,
  summary: {
    staticFindings: staticFindings.length,
    blockingStaticFindings: blockingStatic.length,
    migrationStaticFindings: migrationStatic.length,
    livePagesChecked: live.pagesChecked,
    liveFailures: live.failures.length,
    blockingLiveFailures: blockingLive.length,
    migrationLiveFindings: migrationLive.length,
  },
  staticFindings,
  liveFailures: live.failures,
};

await fs.mkdir(path.join(ROOT, 'artifacts'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'artifacts', 'broken-link-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.summary, null, 2));
printBlockingStaticFindings(blockingStatic);
printBlockingLiveFailures(blockingLive);
if (blockingStatic.length || blockingLive.length) process.exitCode = 1;
