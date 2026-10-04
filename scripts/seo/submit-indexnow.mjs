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
const blockedPrefixes = ["/admin", "/api", "/account", "/cart", "/shop/checkout", "/search"];

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
    headers: { "user-agent": "KeepTXRedIndexNow/2.0" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.text();
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}>([^<]+)</${name}>`, "i"));
  return match ? decodeXml(match[1].trim()) : null;
}

function canonicalKtrUrl(value) {
  try {
    const url = new URL(value, origin);
    if (url.protocol !== "https:" || url.hostname !== host || url.username || url.password) return null;
    if (url.search || url.hash) return null;
    if (blockedPrefixes.some((prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`))) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function explicitUrls() {
  return (process.env.INDEXNOW_URLS || "")
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map(canonicalKtrUrl)
    .filter(Boolean);
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
      url: canonicalKtrUrl(tag(match[0], "loc")),
      lastmod: tag(match[0], "lastmod"),
    }))
    .filter((entry) => entry.url);
}

async function submitChunk(urlList) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });
  if (![200, 202].includes(response.status)) {
    const body = (await response.text()).slice(0, 1000);
    throw new Error(`IndexNow returned HTTP ${response.status}${body ? `: ${body}` : ""}`);
  }
  return response.status;
}

const robots = await fetchText(`${origin}/robots.txt`);
for (const required of [
  `Sitemap: ${rootSitemap}`,
  "User-agent: Bingbot",
  "User-agent: Applebot",
  "User-agent: DuckDuckBot",
  "User-agent: OAI-SearchBot",
]) {
  if (!robots.includes(required)) throw new Error(`robots.txt missing: ${required}`);
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
const selected = new Set(explicitUrls());
for (const entry of canonical.values()) {
  if (fullSubmission) {
    selected.add(entry.url);
    continue;
  }
  if (!entry.lastmod) continue;
  const timestamp = Date.parse(entry.lastmod);
  if (Number.isFinite(timestamp) && timestamp >= cutoff) selected.add(entry.url);
}

if (selected.size === 0) {
  console.log(`IndexNow: no canonical KeepTXRed URLs changed in the last ${freshnessHours} hours and no explicit URLs were supplied.`);
  process.exit(0);
}

const sorted = [...selected].sort();
let accepted = 0;
for (let offset = 0; offset < sorted.length; offset += maxUrls) {
  const chunk = sorted.slice(offset, offset + maxUrls);
  const status = await submitChunk(chunk);
  accepted += chunk.length;
  console.log(`IndexNow accepted ${chunk.length} canonical KeepTXRed URL(s) with HTTP ${status}.`);
}

console.log(
  `IndexNow submission complete: ${accepted} URL(s), mode=${fullSubmission ? "full" : `last-${freshnessHours}h`}, explicit=${explicitUrls().length}.`,
);
