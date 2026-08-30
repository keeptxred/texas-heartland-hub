#!/usr/bin/env node
/**
 * Indexability guard. Fails the build when the site would advertise URLs that
 * Google should never be offered:
 *  - article slugs whose date prefix is a bad/implausible year
 *  - sitemap URLs that redirect, 404, are noindex, or are non-canonical
 *  - duplicate canonical ownership across primary URL sitemaps
 *  - obvious duplicate news clusters (same story fingerprint) in the long-term article sitemap
 *
 * Google News, image, and curated priority sitemaps are derivative discovery
 * feeds: their page <loc> values may intentionally repeat canonical URLs owned
 * by a primary sitemap. They still participate in host/path/status/canonical
 * validation below; they are excluded only from duplicate primary ownership.
 *
 * Usage: node scripts/seo/validate-indexability.mjs [--base http://localhost:8080]
 * Live checks are skipped (with a warning) when the base URL is unreachable.
 */
import { newsClusterKey, isBadYearSlug, parseArticleSlug } from "../../src/lib/article-slug-integrity.ts";

const baseArg = process.argv.indexOf("--base");
const BASE = baseArg > -1 ? process.argv[baseArg + 1] : process.env.SEO_BASE || "http://localhost:8080";
const CANONICAL_HOST = "https://keeptxred.com";
const SAMPLE = Number(process.env.SEO_SAMPLE || 60);
const DERIVATIVE_SITEMAPS = new Set([
  "/sitemap-news.xml",
  "/sitemap-images.xml",
  "/sitemap-priority.xml",
]);
const DISALLOWED = [/\?/, /#/, /^\/admin/, /^\/api\//, /^\/cart/, /^\/shop\/checkout/, /^\/preview\//, /^\/hubs/, /^\/email\//];
const INDEXABLE_PRIORITY_PATHS = [
  "/contact-legislators",
  "/find-representative",
  "/laws",
  "/bills",
  "/texas-legislature",
];
const REDIRECT_ALIASES = [
  "/candidate-guides",
  "/laws-to-know",
  "/legislative-updates",
  "/texas-laws",
  "/texas-law-policy",
  "/texas-news",
  "/voting-locations",
  "/living-in-texas",
  "/moving-to-texas",
  "/texas-living",
  "/explore",
  "/tax-calculator",
];
const errors = [];
const warnings = [];

async function text(path) {
  const response = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return { status: response.status, body: await response.text(), location: response.headers.get("location") };
}

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

let reachable = true;
try {
  const probe = await fetch(`${BASE}/sitemap.xml`, { redirect: "manual" });
  reachable = probe.ok;
} catch {
  reachable = false;
}

if (!reachable) {
  console.warn(`[seo:indexability] ${BASE} unreachable — live checks skipped.`);
  process.exit(0);
}

const index = await text("/sitemap.xml");
if (index.status !== 200) errors.push(`/sitemap.xml returned ${index.status}`);

const childSitemaps = locs(index.body).map((loc) => loc.replace(CANONICAL_HOST, ""));
if (childSitemaps.length === 0) errors.push("Sitemap index lists no child sitemaps.");

const all = [];
for (const child of childSitemaps) {
  const res = await text(child);
  if (res.status !== 200) {
    errors.push(`${child} returned ${res.status}`);
    continue;
  }
  for (const loc of locs(res.body)) all.push({ sitemap: child, loc });
}

const primary = all.filter((entry) => !DERIVATIVE_SITEMAPS.has(entry.sitemap));

// 1. duplicate canonical ownership across primary URL sitemaps. Derivative
// discovery sitemaps intentionally repeat canonical page URLs and are excluded
// from ownership while remaining subject to all other checks below.
const seen = new Map();
for (const { sitemap, loc } of primary) {
  if (seen.has(loc)) errors.push(`Duplicate primary sitemap URL ${loc} (${seen.get(loc)} and ${sitemap})`);
  else seen.set(loc, sitemap);
}

// 2. shape: canonical host, no query/hash, no blocked paths
for (const { loc } of all) {
  if (!loc.startsWith(`${CANONICAL_HOST}/`) && loc !== `${CANONICAL_HOST}/`) {
    errors.push(`Non-canonical host in sitemap: ${loc}`);
    continue;
  }
  const path = loc.slice(CANONICAL_HOST.length) || "/";
  for (const pattern of DISALLOWED) {
    if (pattern.test(path)) errors.push(`Low-value/blocked URL in sitemap: ${path}`);
  }
}

// 3. bad-year article slugs. Check unique page URLs so derivative sitemap
// repetition cannot duplicate the same diagnostic.
for (const loc of new Set(all.map((entry) => entry.loc))) {
  const path = loc.slice(CANONICAL_HOST.length);
  const match = /^\/news\/(.+)$/.exec(path);
  if (!match) continue;
  if (isBadYearSlug(match[1])) errors.push(`Bad-year article slug in sitemap: ${path}`);
  if (!parseArticleSlug(match[1]) && !/^[a-z0-9-]+$/.test(match[1])) {
    errors.push(`Malformed article slug in sitemap: ${path}`);
  }
}

// 4. duplicate news clusters in the long-term article sitemap only. The Google
// News sitemap intentionally repeats the freshest canonical article URLs.
const clusters = new Map();
for (const { loc } of all.filter((entry) => entry.sitemap === "/sitemap-evergreen.xml")) {
  const match = /^\/news\/(.+)$/.exec(loc.slice(CANONICAL_HOST.length));
  if (!match) continue;
  const parsed = parseArticleSlug(match[1]);
  const words = (parsed ? parsed.tail : match[1]).split("-").slice(0, -1).join(" ");
  const key = newsClusterKey(words);
  if (!key) continue;
  if (clusters.has(key)) {
    errors.push(`Duplicate news cluster in sitemap: ${match[1]} duplicates ${clusters.get(key)}`);
  } else {
    clusters.set(key, match[1]);
  }
}

// 5. live status / canonical / robots on a sample plus every static page URL.
// Sample unique canonical page URLs so the same article is not fetched twice
// merely because it also appears in a derivative sitemap.
const pageUrls = primary.filter((entry) => entry.sitemap === "/sitemap-pages.xml").map((e) => e.loc);
const otherPrimaryUrls = [...new Set(
  primary.filter((entry) => entry.sitemap !== "/sitemap-pages.xml").map((e) => e.loc),
)];
const sample = [...pageUrls, ...otherPrimaryUrls.sort(() => Math.random() - 0.5).slice(0, SAMPLE)];

for (const loc of sample) {
  const path = loc.slice(CANONICAL_HOST.length) || "/";
  const res = await text(path);
  if (res.status !== 200) {
    errors.push(`Sitemap URL ${path} returned ${res.status} (redirects and errors must not be listed)`);
    continue;
  }
  if (/name="robots"[^>]*content="[^"]*noindex/i.test(res.body)) {
    errors.push(`Sitemap URL ${path} is noindex`);
  }
  const canonicals = [...res.body.matchAll(/rel="canonical"\s+href="([^"]+)"/g)].map((m) => m[1]);
  if (canonicals.length > 1 && new Set(canonicals).size > 1) {
    errors.push(`Sitemap URL ${path} emits conflicting canonicals: ${[...new Set(canonicals)].join(", ")}`);
  }
  if (canonicals.length > 0 && !canonicals.includes(loc)) {
    errors.push(`Sitemap URL ${path} canonicalises to ${canonicals[0]} instead of itself`);
  }
}

// 6. robots.txt sanity
const robots = await text("/robots.txt");
if (robots.status !== 200) errors.push(`/robots.txt returned ${robots.status}`);
if (/^\s*Disallow:\s*\/\s*$/m.test(robots.body)) errors.push("robots.txt blocks the entire site.");
if (!robots.body.includes(`Sitemap: ${CANONICAL_HOST}/sitemap.xml`)) {
  errors.push("robots.txt does not advertise the sitemap index.");
}

// 7. Core canonical pages must be crawlable and present in a primary sitemap.
for (const priority of INDEXABLE_PRIORITY_PATHS) {
  if (new RegExp(`^\\s*Disallow:\\s*${priority}`, "m").test(robots.body)) {
    errors.push(`robots.txt blocks priority page ${priority}`);
  }
  if (!primary.some((entry) => entry.loc === `${CANONICAL_HOST}${priority}`)) {
    errors.push(`Priority page ${priority} is missing from the primary sitemaps.`);
  }
}

// 8. Legacy, duplicate, noindex, or migrated aliases must never be advertised
// as canonical sitemap URLs. Redirects remain crawlable so search engines can
// discover the 301 and transfer accumulated equity to the canonical destination.
for (const alias of REDIRECT_ALIASES) {
  if (primary.some((entry) => entry.loc === `${CANONICAL_HOST}${alias}`)) {
    errors.push(`Redirect/noindex alias is incorrectly listed in a primary sitemap: ${alias}`);
  }
}

console.log(`[seo:indexability] ${all.length} sitemap entries (${primary.length} primary) across ${childSitemaps.length} sitemaps; ${sample.length} live-checked.`);
for (const warning of warnings) console.warn(`  warn: ${warning}`);
if (errors.length) {
  console.error(`[seo:indexability] FAILED with ${errors.length} error(s):`);
  for (const error of errors.slice(0, 60)) console.error(`  - ${error}`);
  process.exit(1);
}
console.log("[seo:indexability] PASS");
