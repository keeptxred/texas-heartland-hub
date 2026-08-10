#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-source-wave-report.json");
const USER_AGENT = "KeepTXRedCandidatePhotoBot/4.0 (+https://keeptxred.com)";
const CONCURRENCY = 4;

const [candidates, manifest] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
]);
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) => !isApproved(byId.get(candidate.id)));
const discoveries = [];
const failures = [];
const sourceStats = new Map();

await runPool(queue, CONCURRENCY, async (candidate) => {
  try {
    const result = await discover(candidate);
    if (!result) {
      failures.push({ candidateId: candidate.id, name: candidate.fullName, raceId: candidate.primaryRaceId || null });
      return;
    }
    byId.set(candidate.id, result);
    discoveries.push(result);
    sourceStats.set(result.discoverySource, (sourceStats.get(result.discoverySource) || 0) + 1);
  } catch (error) {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, error: String(error?.message || error) });
  }
});

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await writeFile(MANIFEST_PATH, `${JSON.stringify(merged, null, 2)}\n`);
await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  candidateCount: candidates.length,
  searchedCount: queue.length,
  discoveredCount: discoveries.length,
  approvedPhotoCount: merged.filter(isApproved).length,
  sourceStats: Object.fromEntries([...sourceStats].sort()),
  failures,
}, null, 2)}\n`);
console.log(`Source-wave discovery added ${discoveries.length} portraits.`);

async function discover(candidate) {
  const queries = buildQueries(candidate);
  const pages = [];
  for (const query of queries) {
    for (const url of await searchAll(query)) {
      if (!isAllowedSource(url)) continue;
      pages.push(url);
    }
    if (pages.length >= 60) break;
  }
  for (const url of unique(pages).slice(0, 60)) {
    const entry = await inspectPage(candidate, url);
    if (entry) return entry;
  }
  return null;
}

function buildQueries(candidate) {
  const name = `\"${candidate.fullName}\"`;
  const race = `${candidate.currentOfficeName || ""} ${candidate.primaryRaceId || ""}`.replace(/[-_]/g, " ");
  const district = String(candidate.district || candidate.districtNumber || "");
  const party = candidate.party || candidate.partyId || "";
  const base = `${name} ${race} ${district} Texas`.replace(/\s+/g, " ").trim();
  const domains = [
    "vote411.org", "lwvtexas.org", "lwv.org", "communityimpact.com", "texastribune.org",
    "houstonchronicle.com", "expressnews.com", "dallasnews.com", "star-telegram.com",
    "statesman.com", "kut.org", "kera.org", "wfaa.com", "khou.com", "kprc.com",
    "abc13.com", "fox4news.com", "cbsnews.com/texas", "ksat.com", "kxan.com",
    "transparencyusa.org", "followthemoney.org", "opensecrets.org", "fec.gov",
    "ethics.state.tx.us", "youtube.com", "flickr.com", "archive.org",
    "texasbar.com", "avvo.com", "martindale.com", "healthgrades.com",
    "ratemyprofessors.com", "linkedin.com", "facebook.com", "instagram.com",
  ];
  const queries = [
    `${base} candidate photo`, `${base} campaign headshot`, `${base} voter guide`,
    `${name} ${party} Texas endorsement`, `${name} Texas questionnaire`,
    `${name} Texas campaign finance`, `${name} Texas YouTube`, `${name} Texas Flickr`,
    `${name} Texas attorney biography`, `${name} Texas physician biography`,
    `${name} Texas educator biography`, `${name} county party candidate`,
    `${name} county elections candidate`, `${name} city election candidate`,
    `${name} school board candidate`,
  ];
  for (const domain of domains) queries.push(`site:${domain} ${base}`);
  return unique(queries);
}

async function searchAll(query) {
  const batches = await Promise.all([
    bingRss(query),
    yahooSearch(query),
    mojeekSearch(query),
    ddgLite(query),
  ]);
  return unique(batches.flat());
}

async function bingRss(query) {
  const response = await safeFetch(`https://www.bing.com/search?format=rss&q=${encodeURIComponent(query)}`);
  if (!response?.ok) return [];
  const xml = await response.text();
  return [...xml.matchAll(/<link>(https?:\/\/[^<]+)<\/link>/gi)].map((m) => decode(m[1]));
}

async function yahooSearch(query) {
  const response = await safeFetch(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}`);
  if (!response?.ok) return [];
  const html = await response.text();
  return [...html.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)].map((m) => decodeYahoo(m[1]));
}

async function mojeekSearch(query) {
  const response = await safeFetch(`https://www.mojeek.com/search?q=${encodeURIComponent(query)}`);
  if (!response?.ok) return [];
  const html = await response.text();
  return [...html.matchAll(/class=["']title["'][^>]*>\s*<a[^>]+href=["']([^"']+)["']/gi)].map((m) => decode(m[1]));
}

async function ddgLite(query) {
  const response = await safeFetch(`https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`);
  if (!response?.ok) return [];
  const html = await response.text();
  return [...html.matchAll(/class=["']result-link["'][^>]+href=["']([^"']+)["']/gi)].map((m) => decodeDdg(m[1]));
}

async function inspectPage(candidate, url) {
  const response = await safeFetch(url);
  if (!response?.ok || !(response.headers.get("content-type") || "").includes("text/html")) return null;
  const html = await response.text();
  if (!matchesCandidate(html, candidate)) return null;
  const images = extractImages(html, response.url || url);
  for (const image of images) {
    if (!looksLikePortrait(image.url, image.context, candidate)) continue;
    if (!(await validateImage(image.url))) continue;
    const host = new URL(response.url || url).hostname.replace(/^www\./, "");
    return {
      candidateId: candidate.id,
      imageUrl: image.url,
      sourceUrl: response.url || url,
      altText: `Portrait of ${candidate.fullName}`,
      credit: host,
      license: null,
      permissionBasis: "Publicly published candidate portrait used for editorial candidate identification with source attribution.",
      usageStatus: "approved",
      discoveredAt: new Date().toISOString(),
      discoveryMethod: "automated-source-wave-validation",
      discoverySource: classify(host),
    };
  }
  return null;
}

function matchesCandidate(html, candidate) {
  const text = stripHtml(html).toLowerCase();
  const full = normalize(candidate.fullName);
  const last = normalize(candidate.lastName || candidate.fullName.split(/\s+/).at(-1));
  const normalized = normalize(text);
  if (!normalized.includes(full) && !normalized.includes(last)) return false;
  return /candidate|election|campaign|voter|ballot|representative|senator|judge|trustee|commissioner|texas/.test(text);
}

function extractImages(html, base) {
  const entries = [];
  const metaPatterns = [
    /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image|twitter:image:src)["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image|twitter:image:src)["'][^>]*>/gi,
  ];
  for (const pattern of metaPatterns) for (const match of html.matchAll(pattern)) {
    const url = absolute(match[1], base); if (url) entries.push({ url, context: match[0] });
  }
  for (const match of html.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi)) {
    const url = absolute(match[1], base); if (url) entries.push({ url, context: match[0] });
  }
  for (const match of html.matchAll(/"(?:image|thumbnailUrl|contentUrl|avatar|photo)"\s*:\s*"([^"]+)"/gi)) {
    const url = absolute(match[1].replace(/\\\//g, "/"), base); if (url) entries.push({ url, context: match[0] });
  }
  return uniqueBy(entries, (entry) => entry.url).slice(0, 80);
}

function looksLikePortrait(url, context, candidate) {
  const value = `${url} ${context}`.toLowerCase();
  if (/logo|icon|favicon|banner|header|footer|seal|map|chart|ad-|advert|placeholder|default|sprite|group|crowd|event|podcast|video-thumbnail/.test(value)) return false;
  if (/headshot|portrait|candidate|profile|avatar|bio|official|member|photo/.test(value)) return true;
  return [candidate.firstName, candidate.lastName, candidate.preferredName]
    .filter(Boolean).some((token) => normalize(value).includes(normalize(token)));
}

async function validateImage(url) {
  const response = await safeFetch(url, { headers: { Range: "bytes=0-65535", accept: "image/*,*/*;q=0.7" } });
  if (!response || (!response.ok && response.status !== 206)) return false;
  const type = response.headers.get("content-type") || "";
  const length = Number(response.headers.get("content-length") || 0);
  return type.startsWith("image/") && (!length || length >= 8000);
}

function isAllowedSource(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return !/google\.|bing\.com$|yahoo\.com$|duckduckgo\.com$|mojeek\.com$|pinterest\.|tiktok\.|reddit\./.test(host);
  } catch { return false; }
}

function classify(host) {
  if (/vote411|lwv/.test(host)) return "voter-guide";
  if (/communityimpact|tribune|chronicle|expressnews|dallasnews|star-telegram|statesman|kut|kera|wfaa|khou|kprc|abc13|fox4|cbs|ksat|kxan/.test(host)) return "local-media";
  if (/transparencyusa|followthemoney|opensecrets|fec|ethics/.test(host)) return "campaign-finance";
  if (/youtube|flickr|archive/.test(host)) return "public-media";
  if (/texasbar|avvo|martindale|healthgrades|university|college|school|law/.test(host)) return "professional-profile";
  if (/facebook|instagram|linkedin/.test(host)) return "social-profile";
  if (/\.gov$|\.us$/.test(host)) return "government";
  return "campaign-or-community";
}

function decodeYahoo(value) {
  try {
    const url = new URL(value);
    const target = url.searchParams.get("RU") || url.searchParams.get("u");
    return target ? decodeURIComponent(target) : url.toString();
  } catch { return null; }
}
function decodeDdg(value) {
  try {
    const url = new URL(value, "https://lite.duckduckgo.com");
    const target = url.searchParams.get("uddg");
    return target ? decodeURIComponent(target) : url.toString();
  } catch { return null; }
}
function decode(value) { try { return value ? decodeURIComponent(value.replace(/&amp;/g, "&")) : null; } catch { return value; } }
function absolute(value, base) { try { return new URL(value, base).toString(); } catch { return null; } }
function normalize(value = "") { return String(value).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, ""); }
function stripHtml(value = "") { return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " "); }
function isApproved(entry) { return entry?.usageStatus === "approved" && /^https?:\/\//i.test(entry?.imageUrl || ""); }
function unique(values) { return [...new Set(values.filter(Boolean))]; }
function uniqueBy(values, key) { const seen = new Set(); return values.filter((value) => { const id = key(value); if (!id || seen.has(id)) return false; seen.add(id); return true; }); }
async function readJson(file) { return JSON.parse(await readFile(file, "utf8")); }
async function safeFetch(url, init = {}) {
  try {
    return await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(16000), ...init,
      headers: { "user-agent": USER_AGENT, accept: "text/html,image/*;q=0.9,*/*;q=0.8", ...(init.headers || {}) } });
  } catch { return null; }
}
async function runPool(items, concurrency, worker) {
  let index = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (index < items.length) { const current = items[index++]; await worker(current); }
  }));
}
