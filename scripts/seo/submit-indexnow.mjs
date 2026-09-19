import { readFile } from "node:fs/promises";

const origin = "https://keeptxred.com";
const host = "keeptxred.com";
const key = "f2877f4619069ed6765e12380d28d9e0";
const keyLocation = `${origin}/${key}.txt`;
const endpoint = "https://api.indexnow.org/indexnow";
const rootSitemap = `${origin}/sitemap.xml`;
const fullSubmission = process.env.INDEXNOW_FULL === "true";
const freshnessHours = Math.max(1, Number(process.env.INDEXNOW_FRESHNESS_HOURS || 72));
const maxUrls = 10_000;

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "KeepTXRedIndexNow/1.0" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.text();
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}>([^<]+)</${name}>`, "i"));
  return match ? decodeXml(match[1].trim()) : null;
}

function isCanonicalKtrUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && url.hostname === host
      && !url.search
      && !url.hash;
  } catch {
    return false;
  }
}

async function collectSitemapEntries(sitemapUrl, visited = new Set(), depth = 0) {
  if (depth > 3) throw new Error(`Sitemap recursion exceeded safe depth at ${sitemapUrl}`);
  if (visited.has(sitemapUrl)) return [];
  visited.add(sitemapUrl);

  const xml = await fetchText(sitemapUrl);
  if (xml.includes("<sitemapindex")) {
    const children = [...xml.matchAll(/<sitemap>[\s\S]*?<\/sitemap>/gi)]
      .map((match) => tag(match[0], "loc"))
      .filter(Boolean);
    if (children.length > 100) throw new Error(`Sitemap index is unexpectedly large: ${children.length}`);
    const nested = await Promise.all(children.map((child) => collectSitemapEntries(child, visited, depth + 1)));
    return nested.flat();
  }

  if (!xml.includes("<urlset")) throw new Error(`${sitemapUrl} is neither a sitemap index nor a URL sitemap.`);

  return [...xml.matchAll(/<url>[\s\S]*?<\/url>/gi)]
    .map((match) => ({
      url: tag(match[0], "loc"),
      lastmod: tag(match[0], "lastmod"),
    }))
    .filter((entry) => entry.url && isCanonicalKtrUrl(entry.url));
}

const robots = await fetchText(`${origin}/robots.txt`);
if (!robots.includes(`Sitemap: ${rootSitemap}`)) {
  throw new Error("robots.txt does not advertise the canonical KeepTXRed sitemap.");
}

const localKey = (await readFile(new URL(`../../public/${key}.txt`, import.meta.url), "utf8")).trim();
if (localKey !== key) throw new Error("Tracked IndexNow key file does not match the configured key.");

const liveKey = (await fetchText(keyLocation)).trim();
if (liveKey !== key) throw new Error("Live IndexNow ownership key does not match the configured key.");

const entries = await collectSitemapEntries(rootSitemap);
const canonical = new Map();
for (const entry of entries) {
  const previous = canonical.get(entry.url);
  const previousTime = previous?.lastmod ? Date.parse(previous.lastmod) : Number.NaN;
  const nextTime = entry.lastmod ? Date.parse(entry.lastmod) : Number.NaN;
  if (!previous || (Number.isFinite(nextTime) && (!Number.isFinite(previousTime) || nextTime > previousTime))) {
    canonical.set(entry.url, entry);
  }
}

const cutoff = Date.now() - freshnessHours * 60 * 60 * 1000;
const selected = [...canonical.values()]
  .filter((entry) => {
    if (fullSubmission) return true;
    if (!entry.lastmod) return false;
    const timestamp = Date.parse(entry.lastmod);
    return Number.isFinite(timestamp) && timestamp >= cutoff;
  })
  .map((entry) => entry.url)
  .sort();

if (selected.length === 0) {
  console.log(`IndexNow: no canonical KeepTXRed URLs changed in the last ${freshnessHours} hours.`);
  process.exit(0);
}

if (selected.length > maxUrls) {
  throw new Error(`IndexNow batch exceeds ${maxUrls} URLs: ${selected.length}`);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList: selected,
  }),
});

if (![200, 202].includes(response.status)) {
  const body = (await response.text()).slice(0, 1000);
  throw new Error(`IndexNow returned HTTP ${response.status}${body ? `: ${body}` : ""}`);
}

console.log(
  `IndexNow accepted ${selected.length} canonical KeepTXRed URL(s) with HTTP ${response.status} (${fullSubmission ? "full" : `last ${freshnessHours}h`}).`,
);
