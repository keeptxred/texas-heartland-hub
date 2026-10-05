import { readFile } from "node:fs/promises";

const origin = "https://keeptxred.com";
const host = "keeptxred.com";
const key = "f2877f4619069ed6765e12380d28d9e0";
const keyLocation = `${origin}/${key}.txt`;
const endpoint = "https://api.indexnow.org/indexnow";
const rootSitemap = `${origin}/sitemap.xml`;
const fullSubmission = process.env.INDEXNOW_FULL === "true";
const freshnessHours = Math.max(1, Number(process.env.INDEXNOW_FRESHNESS_HOURS || 72));
const strict = process.env.INDEXNOW_STRICT === "true";
const maxUrls = 10_000;
const batchSize = 1000;
const maxFetchAttempts = 3;

const blockedPrefixes = ["/admin", "/api", "/search", "/preview", "/draft", "/private", "/email", "/cart", "/shop/checkout"];
const sitemapFailures = [];

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url) {
  let lastError;
  for (let attempt = 1; attempt <= maxFetchAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "KeepTXRedIndexNow/2.1" },
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) return response.text();
      lastError = new Error(`${url} returned HTTP ${response.status}`);
      if (response.status < 500 || attempt === maxFetchAttempts) break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === maxFetchAttempts) break;
    }
    await delay(750 * attempt);
  }
  throw lastError ?? new Error(`${url} could not be fetched`);
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}>([^<]+)</${name}>`, "i"));
  return match ? decodeXml(match[1].trim()) : null;
}

function canonicalKtrUrl(value) {
  try {
    const url = new URL(value, origin);
    if (url.protocol !== "https:" || url.origin !== origin || url.search || url.hash || url.username || url.password) return null;
    const path = url.pathname.replace(/\/{2,}/g, "/");
    if (blockedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return null;
    return `${origin}${path}`;
  } catch {
    return null;
  }
}

function explicitUrls(raw) {
  if (!raw) return [];
  return [...new Set(String(raw).split(/[\n,\s]+/).map(canonicalKtrUrl).filter(Boolean))].sort();
}

async function collectSitemapEntries(sitemapUrl, visited = new Set(), depth = 0) {
  if (depth > 4) throw new Error(`Sitemap recursion exceeded safe depth at ${sitemapUrl}`);
  if (visited.has(sitemapUrl)) return [];
  visited.add(sitemapUrl);

  const xml = await fetchText(sitemapUrl);
  if (xml.includes("<sitemapindex")) {
    const children = [...xml.matchAll(/<sitemap>[\s\S]*?<\/sitemap>/gi)]
      .map((match) => tag(match[0], "loc"))
      .filter(Boolean);
    if (children.length > 500) throw new Error(`Sitemap index is unexpectedly large: ${children.length}`);
    const nested = await Promise.allSettled(children.map((child) => collectSitemapEntries(child, visited, depth + 1)));
    const entries = [];
    nested.forEach((result, index) => {
      if (result.status === "fulfilled") {
        entries.push(...result.value);
        return;
      }
      const child = children[index];
      const message = result.reason instanceof Error ? result.reason.message : String(result.reason);
      sitemapFailures.push({ sitemap: child, message });
      console.warn(`IndexNow sitemap warning: ${child} failed after retries: ${message}`);
    });
    return entries;
  }

  if (!xml.includes("<urlset")) throw new Error(`${sitemapUrl} is neither a sitemap index nor a URL sitemap.`);
  return [...xml.matchAll(/<url>[\s\S]*?<\/url>/gi)]
    .map((match) => ({ url: canonicalKtrUrl(tag(match[0], "loc")), lastmod: tag(match[0], "lastmod") }))
    .filter((entry) => entry.url);
}

async function submitBatches(urls) {
  for (let i = 0; i < urls.length; i += batchSize) {
    const urlList = urls.slice(i, i + batchSize);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8", "user-agent": "KeepTXRedIndexNow/2.1" },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
      signal: AbortSignal.timeout(15_000),
    });
    if (![200, 202].includes(response.status)) {
      const body = (await response.text()).slice(0, 1000);
      throw new Error(`IndexNow returned HTTP ${response.status}${body ? `: ${body}` : ""}`);
    }
    console.log(`IndexNow accepted batch of ${urlList.length} canonical KeepTXRed URL(s) with HTTP ${response.status}.`);
  }
}

const robots = await fetchText(`${origin}/robots.txt`);
if (!robots.includes(`Sitemap: ${rootSitemap}`)) throw new Error("robots.txt does not advertise the canonical KeepTXRed sitemap.");
if (!robots.includes("OAI-SearchBot")) throw new Error("robots.txt does not explicitly expose OAI-SearchBot policy.");

const localKey = (await readFile(new URL(`../../public/${key}.txt`, import.meta.url), "utf8")).trim();
if (localKey !== key) throw new Error("Tracked IndexNow key file does not match the configured key.");
const liveKey = (await fetchText(keyLocation)).trim();
if (liveKey !== key) throw new Error("Live IndexNow ownership key does not match the configured key.");

let selected = explicitUrls(process.env.INDEXNOW_URLS);
let mode = selected.length ? "explicit URL lifecycle event" : "recent sitemap changes";

if (!selected.length) {
  const entries = await collectSitemapEntries(rootSitemap);
  const canonical = new Map();
  for (const entry of entries) {
    const previous = canonical.get(entry.url);
    const previousTime = previous?.lastmod ? Date.parse(previous.lastmod) : Number.NaN;
    const nextTime = entry.lastmod ? Date.parse(entry.lastmod) : Number.NaN;
    if (!previous || (Number.isFinite(nextTime) && (!Number.isFinite(previousTime) || nextTime > previousTime))) canonical.set(entry.url, entry);
  }

  const cutoff = Date.now() - freshnessHours * 60 * 60 * 1000;
  selected = [...canonical.values()]
    .filter((entry) => {
      if (fullSubmission) return true;
      if (!entry.lastmod) return false;
      const timestamp = Date.parse(entry.lastmod);
      return Number.isFinite(timestamp) && timestamp >= cutoff;
    })
    .map((entry) => entry.url)
    .sort();
  mode = fullSubmission ? "full canonical sitemap" : `canonical URLs changed in the last ${freshnessHours}h`;
}

if (!selected.length) {
  console.log(`IndexNow: no ${mode}; cosmetic deployment produced no notification.`);
} else {
  if (selected.length > maxUrls) throw new Error(`IndexNow submission exceeds ${maxUrls} URLs: ${selected.length}`);
  try {
    await submitBatches(selected);
    console.log(`IndexNow accepted ${selected.length} canonical KeepTXRed URL(s): ${mode}.`);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.warn(`IndexNow notification failed without blocking publishing/deployment: ${detail}`);
    if (strict) process.exitCode = 1;
  }
}

if (sitemapFailures.length > 0) {
  console.warn(`IndexNow completed with ${sitemapFailures.length} child sitemap failure(s); healthy canonical URLs were still processed.`);
  if (strict) process.exitCode = 1;
}
