import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SOURCE_ROOTS = ["src", "scripts"];
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"]);
const errors = [];
const warnings = [];

async function walk(dir) {
  const entries = await readdir(join(ROOT, dir), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(rel)));
    else if (TEXT_EXTENSIONS.has(extname(entry.name))) files.push(rel);
  }
  return files;
}

async function read(path) {
  return readFile(join(ROOT, path), "utf8");
}

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function warn(file, message) {
  warnings.push(`${file}: ${message}`);
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

const files = (await Promise.all(SOURCE_ROOTS.map(walk))).flat();
const contents = new Map(await Promise.all(files.map(async (file) => [file, await read(file)])));

for (const [file, source] of contents) {
  if (/favicon\.ico/i.test(source) && /(?:logo|publisher)/i.test(source)) {
    fail(file, "favicon.ico must not be used as a publisher or organization logo");
  }
  if (/noindex\s*,?\s*nofollow/i.test(source)) {
    fail(file, "use noindex,follow unless link blocking is explicitly required");
  }
  if (/name:\s*["']keywords["']/i.test(source) || /<meta[^>]+name=["']keywords["']/i.test(source)) {
    fail(file, "obsolete meta keywords output detected");
  }
  if (/Where can I read more on this topic\??/i.test(source)) {
    fail(file, "generic FAQ question detected");
  }
  if (/check back for updates/i.test(source) && !file.endsWith("article-length.ts")) {
    warn(file, "generic freshness boilerplate detected");
  }
  if (/https:\/\/www\.keeptxred\.com/i.test(source)) {
    fail(file, "noncanonical www hostname detected");
  }
}

const seo = contents.get("src/lib/seo.ts") ?? "";
for (const required of ["ORGANIZATION_ID", "WEBSITE_ID", "PUBLISHER_LOGO", "organizationJsonLd", "websiteJsonLd", "webPageJsonLd"]) {
  if (!seo.includes(required)) fail("src/lib/seo.ts", `missing required centralized SEO export: ${required}`);
}
if (!/SITE_NAME\s*=\s*["']Keep TX Red["']/.test(seo)) {
  fail("src/lib/seo.ts", "primary site name must be Keep TX Red");
}
if (!/noindex,follow,max-image-preview:large/.test(seo)) {
  fail("src/lib/seo.ts", "noindex metadata must preserve follow and large image previews");
}

const articleRoute = contents.get("src/routes/news.$slug.tsx") ?? "";
if (/selectHeadlineVariant|trackHeadlineImpression|headline_variants/.test(articleRoute)) {
  fail("src/routes/news.$slug.tsx", "article H1 must not use A/B headline variants");
}
if (!/NewsArticle/.test(articleRoute) || !/BreadcrumbList/.test(articleRoute)) {
  fail("src/routes/news.$slug.tsx", "article schema must include NewsArticle and BreadcrumbList");
}
if (!/ImageObject/.test(articleRoute)) {
  fail("src/routes/news.$slug.tsx", "article schema must include an ImageObject");
}

const homepage = contents.get("src/routes/index.tsx") ?? "";
if (!/"@graph"/.test(homepage)) fail("src/routes/index.tsx", "homepage schema must use a connected @graph");
if (/SearchAction/.test(homepage)) warn("src/routes/index.tsx", "verify any SearchAction points to a working public search endpoint");

const sitemapIndex = contents.get("src/routes/sitemap[.]xml.ts") ?? "";
const sitemapNames = [...sitemapIndex.matchAll(/file:\s*["']([^"']+\.xml)["']/g)].map((match) => match[1]);
const duplicateSitemaps = sitemapNames.filter((name, index) => sitemapNames.indexOf(name) !== index);
for (const name of new Set(duplicateSitemaps)) fail("src/routes/sitemap[.]xml.ts", `duplicate sitemap index entry: ${name}`);

for (const [file, source] of contents) {
  if (!/sitemap/i.test(file)) continue;
  if (/loc:\s*`[^`]*\?/.test(source) || /<loc>[^<]*\?/.test(source)) {
    fail(file, "query-string URL appears in sitemap output");
  }
  if (/toIsoDate\(new Date\(\)\)/.test(source)) {
    warn(file, "request-time lastmod detected; prefer a real content revision date");
  }
}

const authorRoute = contents.get("src/routes/authors.$slug.tsx") ?? "";
if (!/ProfilePage/.test(authorRoute) || !/personJsonLd/.test(authorRoute)) {
  fail("src/routes/authors.$slug.tsx", "author pages must connect ProfilePage and Person entities");
}

const start = contents.get("src/start.ts") ?? "";
if (/if\s*\(url\.search\)/.test(start)) {
  fail("src/start.ts", "blanket query-string noindex behavior detected");
}
if (!/stripTrackingParams/.test(start) || !/hasNoindexState/.test(start)) {
  fail("src/start.ts", "parameter-specific tracking cleanup and noindex handling are required");
}

for (const [file, source] of contents) {
  if (!file.startsWith("src/routes/") || !file.endsWith(".tsx")) continue;
  const h1Count = countMatches(source, /<h1\b/g);
  if (h1Count > 1) warn(file, `contains ${h1Count} static <h1> elements; verify only one renders per route`);
}

if (warnings.length) {
  console.warn(`SEO/AEO validation warnings (${warnings.length}):`);
  for (const warning of warnings) console.warn(`  - ${warning}`);
}

if (errors.length) {
  console.error(`SEO/AEO validation failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`SEO/AEO validation passed across ${files.length} source files${warnings.length ? ` with ${warnings.length} warning(s)` : ""}.`);
