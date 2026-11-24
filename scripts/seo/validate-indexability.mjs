#!/usr/bin/env node
/**
 * Indexability guard. Fails the build when the site would advertise URLs that
 * Google should never be offered:
 *  - article slugs whose date prefix is a bad/implausible year
 *  - sitemap URLs that redirect, 404, are noindex, or are non-canonical
 *  - duplicate canonical ownership across primary URL sitemaps
 *  - obvious duplicate news clusters (same story fingerprint) in the long-term article sitemap
 *
 * Google News, image, and the curated Search Console priority sitemap are
 * discovery overlays: their page <loc> values may intentionally repeat
 * canonical URLs owned elsewhere. Every priority-sitemap URL is therefore
 * live-checked rather than treated as a second canonical owner.
 *
 * Usage: node scripts/seo/validate-indexability.mjs [--base http://localhost:8080]
 * Local live checks may be skipped when no development server is running.
 * Explicit production checks must fail when the target is unreachable.
 */
import { newsClusterKey, isBadYearSlug, parseArticleSlug } from "../../src/lib/article-slug-integrity.ts";

const baseArg = process.argv.indexOf("--base");
const BASE = baseArg > -1 ? process.argv[baseArg + 1] : process.env.SEO_BASE || "http://localhost:8080";
const CANONICAL_HOST = "https://keeptxred.com";
const REQUIRE_LIVE = process.env.SEO_REQUIRE_LIVE === "1" || BASE.replace(/\/+$/, "") === CANONICAL_HOST;
const FULL_SCAN = process.env.SEO_FULL_SCAN === "1";
const SAMPLE = Number(process.env.SEO_SAMPLE || 60);
const PRIORITY_SITEMAP = "/sitemap-priority.xml";
const MAX_PRIORITY_URLS = 30;
const DERIVATIVE_SITEMAPS = new Set(["/sitemap-news.xml", "/sitemap-images.xml", PRIORITY_SITEMAP]);
const ALWAYS_LIVE_CHECK_SITEMAPS = new Set(["/sitemap-pages.xml"]);
const DISALLOWED = [/\?/, /#/, /^\/admin/, /^\/api\//, /^\/cart/, /^\/shop\/checkout/, /^\/preview\//, /^\/hubs/, /^\/email\//];
const INDEXABLE_PRIORITY_PATHS = [
  "/contact-legislators",
  "/find-representative",
  "/laws",
  "/bills",
  "/texas-legislature",
];
const REDIRECT_ALIASES = [
  "/about-keep-texas-red",
  "/candidate-guides",
  "/laws-to-know",
  "/legislative-updates",
  "/texas-laws",
  "/texas-law-policy",
  "/texas-news",
  "/voting-locations",
  "/living-in-texas",
  "/dmv",
  "/moving-to-texas",
  "/texas-living",
  "/explore",
  "/tax-calculator",
];
const errors = [];
const warnings = [];

async function text(path) {
  const url = `${BASE}${path}`;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(20_000),
        headers: { "cache-control": "no-cache", connection: "close" },
      });
      const result = {
        status: response.status,
        body: await response.text(),
        location: response.headers.get("location"),
        robots: response.headers.get("x-robots-tag") || "",
      };
      if ((result.status === 429 || result.status >= 500) && attempt < 3) {
        console.warn(`[seo:indexability] ${path}: HTTP ${result.status}, retry ${attempt}/2`);
      } else {
        return result;
      }
    } catch (error) {
      lastError = error;
      if (attempt < 3) console.warn(`[seo:indexability] ${path}: ${error.cause?.code || error.message}, retry ${attempt}/2`);
    }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
  }
  throw new Error(`${path}: ${lastError?.cause?.code || lastError?.message || "fetch failed"} after three attempts`);
}

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

let index;
try {
  index = await text("/sitemap.xml");
} catch (error) {
  console.warn(`[seo:indexability] ${error.message}`);
}
if (!index || index.status !== 200) {
  if (REQUIRE_LIVE) {
    console.error(`[seo:indexability] ${BASE} unreachable — required live checks FAILED.`);
    process.exit(1);
  }
  console.warn(`[seo:indexability] ${BASE} unreachable — local live checks skipped.`);
  process.exit(0);
}

const childSitemaps = locs(index.body).map((loc) => loc.replace(CANONICAL_HOST, ""));
if (childSitemaps.length === 0) errors.push("Sitemap index lists no child sitemaps.");

const all = [];
for (const child of childSitemaps) {
  let res;
  try {
    res = await text(child);
  } catch (error) {
    errors.push(`Child sitemap ${child} fetch failed: ${error.message}`);
    continue;
  }
  if (res.status !== 200) {
    errors.push(`${child} returned ${res.status}`);
    continue;
  }
  for (const loc of locs(res.body)) all.push({ sitemap: child, loc });
}

const primary = all.filter((entry) => !DERIVATIVE_SITEMAPS.has(entry.sitemap));
const priorityUrls = all.filter((entry) => entry.sitemap === PRIORITY_SITEMAP).map((entry) => entry.loc);

if (priorityUrls.length > MAX_PRIORITY_URLS) {
  errors.push(`${PRIORITY_SITEMAP} lists ${priorityUrls.length} URLs; maximum is ${MAX_PRIORITY_URLS}.`);
}
if (new Set(priorityUrls).size !== priorityUrls.length) {
  errors.push(`${PRIORITY_SITEMAP} contains duplicate URLs.`);
}
const primaryOwners = new Set(primary.map((entry) => entry.loc));
for (const loc of priorityUrls) {
  if (!primaryOwners.has(loc)) errors.push(`Priority sitemap URL has no primary owner: ${loc}`);
}

// 1. duplicate canonical ownership across primary URL sitemaps. Discovery
// overlays intentionally repeat page URLs and are excluded from ownership.
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
  if (/(?:^|\/)(?:\$|%24)[^/]*(?:\/|$)/i.test(path)) {
    errors.push(`Unresolved route parameter in sitemap: ${path}`);
  }
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

// 5. live status / canonical / robots on every static/DMV page, every curated
// priority URL, and a sample of the remaining primary URLs. The Set keeps
// overlap between discovery feeds and primary sitemaps from double-fetching.
const alwaysLiveCheckedUrls = primary
  .filter((entry) => ALWAYS_LIVE_CHECK_SITEMAPS.has(entry.sitemap))
  .map((entry) => entry.loc);
const otherPrimaryUrls = [...new Set(
  primary.filter((entry) => !ALWAYS_LIVE_CHECK_SITEMAPS.has(entry.sitemap)).map((entry) => entry.loc),
)];
const randomPrimarySample = FULL_SCAN
  ? otherPrimaryUrls
  : otherPrimaryUrls.sort(() => Math.random() - 0.5).slice(0, SAMPLE);
const sample = [...new Set([...alwaysLiveCheckedUrls, ...priorityUrls, ...randomPrimarySample])];

async function checkPage(loc) {
  const path = loc.slice(CANONICAL_HOST.length) || "/";
  let res;
  try {
    res = await text(path);
  } catch (error) {
    errors.push(`Sitemap URL ${path} fetch failed: ${error.message}`);
    return;
  }
  if (res.status !== 200) {
    errors.push(`Sitemap URL ${path} returned ${res.status} (redirects and errors must not be listed)`);
    return;
  }
  const head = res.body.match(/<head(?:\s[^>]*)?>[\s\S]*?<\/head>/i)?.[0] || "";
  const attributes = (tag) => Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|\x27([^\x27]*)\x27|([^\s>]+))/g)]
      .map((m) => [m[1].toLowerCase(), m[2] ?? m[3] ?? m[4]]),
  );
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => attributes(m[0]));
  if (/\b(?:noindex|none)\b/i.test(res.robots) || metas.some((meta) =>
    /^(?:robots|googlebot)$/i.test(meta.name || "") && /\b(?:noindex|none)\b/i.test(meta.content || ""))) {
    errors.push(`Sitemap URL ${path} is noindex (HTTP header or HTML metadata)`);
  }
  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => attributes(m[0]))
    .filter((link) => /(?:^|\s)canonical(?:\s|$)/i.test(link.rel || ""))
    .map((link) => link.href).filter(Boolean);
  if (!canonicals.length) errors.push(`Sitemap URL ${path} is missing its canonical tag`);
  const visibleMarkup = res.body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const headings = [...visibleMarkup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  if (headings.some((heading) => /^(?:404(?:\s*[-–:]\s*|\s+))?(?:page not found|article not found|not found|this page didn.t load)[.!]?$/i.test(heading))) {
    errors.push(`Sitemap URL ${path} returns HTTP 200 with a not-found heading`);
  }
  for (const match of visibleMarkup.matchAll(/<a\b[^>]*>/gi)) {
    const href = attributes(match[0]).href;
    if (!href) continue;
    try {
      const destination = new URL(href, loc);
      if (destination.origin === CANONICAL_HOST &&
        /(?:^|\/)(?:\$|%24)[a-z_][a-z0-9_]*(?=\/|$)/i.test(destination.pathname)) {
        errors.push(`Sitemap URL ${path} links to unresolved route template ${destination.pathname}`);
      }
    } catch {
      // Malformed or non-HTTP links are not router-template destinations.
    }
  }
  if (canonicals.length > 1 && new Set(canonicals).size > 1) {
    errors.push(`Sitemap URL ${path} emits conflicting canonicals: ${[...new Set(canonicals)].join(", ")}`);
  }
  if (canonicals.length > 0 && !canonicals.includes(loc)) {
    errors.push(`Sitemap URL ${path} canonicalises to ${canonicals[0]} instead of itself`);
  }
}

// Bounded concurrency keeps complete live audits feasible without flooding the Worker.
for (let offset = 0; offset < sample.length; offset += 4) {
  await Promise.all(sample.slice(offset, offset + 4).map(checkPage));
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

console.log(`[seo:indexability] ${all.length} sitemap entries (${primary.length} primary, ${priorityUrls.length} priority) across ${childSitemaps.length} sitemaps; ${sample.length} live-checked.`);
for (const warning of warnings) console.warn(`  warn: ${warning}`);
if (errors.length) {
  console.error(`[seo:indexability] FAILED with ${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log("[seo:indexability] PASS");
