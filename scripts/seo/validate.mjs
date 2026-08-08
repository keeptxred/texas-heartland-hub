import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const VALIDATOR_PATH = "scripts/seo/validate.mjs";
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
  if (file === VALIDATOR_PATH) continue;
  const isApiRoute = file.startsWith("src/routes/api/");
  if (/favicon\.ico/i.test(source) && /(?:logo|publisher)/i.test(source)) {
    fail(file, "favicon.ico must not be used as a publisher or organization logo");
  }
  const isHtmlRoute = file.startsWith("src/routes/") && file.endsWith(".tsx");
  if (isHtmlRoute && /noindex\s*,?\s*nofollow/i.test(source)) {
    fail(file, "use noindex,follow unless link blocking is explicitly required");
  }
  if (/name:\s*["']keywords["']/i.test(source) || /<meta[^>]+name=["']keywords["']/i.test(source)) {
    fail(file, "obsolete meta keywords output detected");
  }
  if (!isApiRoute && /Where can I read more on this topic\??/i.test(source)) {
    fail(file, "generic FAQ question detected");
  }
  if (/check back for updates/i.test(source) && !file.endsWith("article-length.ts")) {
    warn(file, "generic freshness boilerplate detected");
  }
  if (!isApiRoute && /https:\/\/www\.keeptxred\.com/i.test(source)) {
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
if (/selectHeadlineVariant|trackHeadlineImpression/.test(articleRoute)) {
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

const staticSitemap = contents.get("src/routes/sitemap-pages[.]xml.ts") ?? "";
if (/DEFAULT_STATIC_PAGE_LASTMOD/.test(staticSitemap)) {
  fail("src/routes/sitemap-pages[.]xml.ts", "static sitemap must not assign one blanket lastmod to unrelated pages");
}
if (!/lastmod:STATIC_PAGE_LASTMOD_OVERRIDES\[path\]\s*\|\|\s*undefined/.test(staticSitemap)) {
  fail("src/routes/sitemap-pages[.]xml.ts", "static sitemap must omit lastmod when no trustworthy page revision date is known");
}

const retiredRoutes = new Map();
for (const [file, source] of contents) {
  if (!file.startsWith("src/routes/") || !file.endsWith(".tsx")) continue;
  const routeMatch = source.match(/createFileRoute\(["']([^"']+)["']\)/);
  if (!routeMatch) continue;
  const routePath = routeMatch[1];
  if (!routePath.startsWith("/") || routePath.includes("$") || routePath.includes("*")) continue;

  const redirects = /\bredirect\s*\(\s*\{/.test(source);
  // Only treat a static no-argument head as an always-noindex page. Dynamic
  // heads such as `head: ({ match }) => ...` legitimately noindex filtered
  // query states while keeping the clean route itself indexable.
  const staticHeadMatch = source.match(/head:\s*\(\)\s*=>\s*\(\{([\s\S]*?)\n\s*\}\),/);
  const alwaysNoindex = staticHeadMatch
    ? /name:\s*["']robots["'][\s\S]{0,160}content:\s*["'][^"']*noindex/i.test(staticHeadMatch[1])
    : false;
  if (redirects || alwaysNoindex) retiredRoutes.set(routePath, file);
  if ((redirects || alwaysNoindex) && staticSitemap.includes(`"${routePath}"`)) {
    fail(
      "src/routes/sitemap-pages[.]xml.ts",
      `static sitemap must not promote a route that redirects or is always noindex: ${routePath} (${file})`,
    );
  }
}

const llms = await read("public/llms.txt");
for (const [routePath, definitionFile] of retiredRoutes) {
  if (llms.includes(`](${routePath})`)) {
    fail("public/llms.txt", `AI-facing link index must not advertise retired/noindex route: ${routePath}`);
  }

  for (const [file, source] of contents) {
    const publicFacing = (file.startsWith("src/routes/") || file.startsWith("src/components/")) && file.endsWith(".tsx");
    if (!publicFacing || file === definitionFile) continue;
    const hasLiteralRoute = source.includes(`"${routePath}"`) || source.includes(`'${routePath}'`) || source.includes(`\`${routePath}\``);
    if (hasLiteralRoute) {
      fail(file, `public-facing source must link directly to the canonical destination instead of retired/noindex route: ${routePath}`);
    }
  }
}

for (const [file, source] of contents) {
  if (file === VALIDATOR_PATH || !/sitemap/i.test(file)) continue;
  if (/loc:\s*`[^`]*\?/.test(source) || /<loc>[^<]*\?/.test(source)) {
    fail(file, "query-string URL appears in sitemap output");
  }
  if (/toIsoDate\(new Date\(\)\)/.test(source)) {
    warn(file, "request-time lastmod detected; prefer a real content revision date");
  }
}

const robots = contents.get("src/routes/robots[.]txt.ts") ?? "";
const robotAgents = [...robots.matchAll(/["']User-agent:\s*([^"']+)["']/g)].map((match) => match[1].trim());
if (robotAgents.length !== 1 || robotAgents[0] !== "*") {
  fail(
    "src/routes/robots[.]txt.ts",
    "robots.txt must use one shared wildcard user-agent group so named crawlers cannot bypass common crawl restrictions",
  );
}
for (const required of [
  '"Disallow: /api/"',
  '"Disallow: /admin"',
  '"Disallow: /cart"',
  '"Disallow: /*?q="',
  '"Disallow: /*?search="',
  '"Disallow: /*?filter="',
  '`Sitemap: ${BASE_URL}/sitemap.xml`',
]) {
  if (!robots.includes(required)) {
    fail("src/routes/robots[.]txt.ts", `robots.txt missing required shared crawl boundary: ${required}`);
  }
}

const sitemapArticleLoader = contents.get("src/lib/evergreen.functions.ts") ?? "";
for (const required of [
  "const SITEMAP_ARTICLE_PAGE_SIZE = 1000;",
  "const MAX_CLOUD_SITEMAP_ARTICLES = 45000;",
  ".select(\"slug,title,published_at,updated_at,image_url,kind,body_json,quality_flags,content_quality_score\")",
  ".range(from, from + SITEMAP_ARTICLE_PAGE_SIZE - 1)",
]) {
  if (!sitemapArticleLoader.includes(required)) {
    fail("src/lib/evergreen.functions.ts", `cloud sitemap loader missing completeness/freshness contract: ${required}`);
  }
}
if (/updated_at:\s*null/.test(sitemapArticleLoader)) {
  fail("src/lib/evergreen.functions.ts", "cloud sitemap loader must preserve real updated_at values");
}

const authorRoute = contents.get("src/routes/authors.$slug.tsx") ?? "";
if (!/ProfilePage/.test(authorRoute) || !/["']@type["']:\s*["']Organization["']/.test(authorRoute) || !/parentOrganization/.test(authorRoute)) {
  fail("src/routes/authors.$slug.tsx", "newsroom desk pages must connect ProfilePage and Organization entities to the publisher");
}
if (/personJsonLd/.test(authorRoute)) {
  fail("src/routes/authors.$slug.tsx", "collective newsroom desk pages must not masquerade as Person entities");
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

for (const validator of [
  "scripts/shared/validate-backend-separation.mjs",
  "scripts/shared/validate-retired-lifestyle-code.mjs",
]) {
  try {
    const output = execFileSync(process.execPath, [validator], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (output) process.stdout.write(output);
  } catch (error) {
    const stdout = typeof error?.stdout === "string" ? error.stdout : error?.stdout?.toString?.() ?? "";
    const stderr = typeof error?.stderr === "string" ? error.stderr : error?.stderr?.toString?.() ?? "";
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stdout.write(stderr);
    console.log(`Nested validator failed: ${validator}`);
    process.exit(typeof error?.status === "number" ? error.status : 1);
  }
}

console.log(`SEO/AEO validation passed across ${files.length} source files${warnings.length ? ` with ${warnings.length} warning(s)` : ""}.`);
