#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-expanded-report.json");
const USER_AGENT = "KeepTXRedCandidatePhotoBot/3.0 (+https://keeptxred.com)";
const CONCURRENCY = 4;
const TARGET_COUNT = 395;

const [candidates, manifest] = await Promise.all([readJson(CANDIDATES_PATH), readJson(MANIFEST_PATH)]);
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) => !approved(byId.get(candidate.id)));
const discoveries = [];
const failures = [];
const stats = new Map();

await runPool(queue, CONCURRENCY, async (candidate) => {
  if ([...byId.values()].filter(approved).length >= TARGET_COUNT) return;
  try {
    const result = await discover(candidate);
    if (result) {
      byId.set(candidate.id, result);
      discoveries.push(result);
      stats.set(result.discoverySource, (stats.get(result.discoverySource) || 0) + 1);
    } else {
      failures.push({ candidateId: candidate.id, name: candidate.fullName });
    }
  } catch (error) {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, error: String(error?.message || error) });
  }
});

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
const approvedCount = merged.filter(approved).length;
await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(MANIFEST_PATH, `${JSON.stringify(merged, null, 2)}\n`);
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  candidateCount: candidates.length,
  approvedPhotoCount: approvedCount,
  coveragePercent: Number(((approvedCount / candidates.length) * 100).toFixed(2)),
  targetCount: TARGET_COUNT,
  targetMet: approvedCount >= TARGET_COUNT,
  newDiscoveries: discoveries.length,
  sourceStats: Object.fromEntries([...stats.entries()].sort()),
  failures,
}, null, 2)}\n`);
console.log(`Expanded discovery added ${discoveries.length}; coverage is ${approvedCount}/${candidates.length}.`);

async function discover(candidate) {
  const direct = directSources(candidate);
  for (const source of direct) {
    const found = await inspectPage(candidate, source.url, source.kind, source.confidence);
    if (found) return found;
  }

  const queries = buildQueries(candidate);
  const pages = [];
  for (const query of queries) {
    const [bing, ddg] = await Promise.all([bingRss(query), duckDuckGoLite(query)]);
    for (const url of [...bing, ...ddg]) {
      const kind = classify(url);
      if (!kind) continue;
      pages.push({ url, kind, confidence: confidence(kind) });
    }
    if (pages.length >= 45) break;
  }

  const ordered = dedupe(pages, (item) => item.url)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 45);
  for (const source of ordered) {
    const found = await inspectPage(candidate, source.url, source.kind, source.confidence);
    if (found) return found;
  }
  return null;
}

function directSources(candidate) {
  const sources = [];
  for (const [kind, url, confidence] of [
    ["campaign", candidate.campaignUrl, 100],
    ["official", candidate.websiteUrl, 100],
    ["facebook", candidate.socialLinks?.facebookUrl, 88],
    ["instagram", candidate.socialLinks?.instagramUrl, 86],
    ["linkedin", candidate.socialLinks?.linkedinUrl, 80],
  ]) if (http(url)) sources.push({ kind, url, confidence });
  return sources;
}

function buildQueries(candidate) {
  const name = `\"${candidate.fullName}\"`;
  const race = String(candidate.currentOfficeName || candidate.primaryRaceId || "Texas election").replace(/race-2026-/g, "").replace(/-/g, " ");
  const party = candidate.party || "";
  return [
    `${name} ${race} Texas candidate photo`,
    `${name} ${race} official campaign`,
    `site:communityimpact.com ${name} election`,
    `site:texastribune.org ${name} candidate`,
    `site:houstonchronicle.com ${name} voter guide`,
    `site:dallasnews.com ${name} voter guide`,
    `site:expressnews.com ${name} candidate`,
    `site:kut.org ${name} candidate`,
    `site:kera.org ${name} candidate`,
    `site:keranews.org ${name} candidate`,
    `site:ivoterguide.com ${name} Texas`,
    `site:vote411.org ${name} Texas`,
    `site:lptexas.org ${name}`,
    `site:texasgop.org ${name}`,
    `site:txdemocrats.org ${name}`,
    `site:txgreens.org ${name}`,
    `site:transparencyusa.org ${name} Texas`,
    `site:ballotpedia.org ${name} Texas`,
    `site:votesmart.org ${name} Texas`,
    `site:house.texas.gov ${name}`,
    `site:senate.texas.gov ${name}`,
    `site:house.gov ${name} Texas`,
    `site:txcourts.gov ${name}`,
    `${name} ${party} Texas county party`,
    `${name} Texas attorney biography`,
    `${name} Texas judge biography`,
    `${name} Texas school board biography`,
    `${name} Texas city council biography`,
    `${name} Texas university biography`,
  ];
}

async function bingRss(query) {
  const response = await fetchSafe(`https://www.bing.com/search?format=rss&q=${encodeURIComponent(query)}`, { headers: { accept: "application/rss+xml,text/xml" } });
  if (!response?.ok) return [];
  const xml = await response.text();
  const urls = [];
  for (const match of xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/gi)) urls.push(decodeEntities(match[1]));
  return dedupe(urls, (v) => v).slice(0, 10);
}

async function duckDuckGoLite(query) {
  const response = await fetchSafe(`https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`, { headers: { accept: "text/html" } });
  if (!response?.ok) return [];
  const html = await response.text();
  const urls = [];
  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*class=["']result-link["']/gi)) {
    const decoded = searchRedirect(match[1]);
    if (decoded) urls.push(decoded);
  }
  for (const match of html.matchAll(/<a[^>]+class=["']result-link["'][^>]+href=["']([^"']+)["']/gi)) {
    const decoded = searchRedirect(match[1]);
    if (decoded) urls.push(decoded);
  }
  return dedupe(urls, (v) => v).slice(0, 10);
}

async function inspectPage(candidate, url, kind, sourceConfidence) {
  const response = await fetchSafe(url, { headers: { accept: "text/html" } });
  if (!response?.ok || !(response.headers.get("content-type") || "").includes("text/html")) return null;
  const html = await response.text();
  if (!matchesCandidate(html, candidate, sourceConfidence)) return null;
  const images = extractImages(html, response.url || url);
  for (const image of images) {
    if (!portraitLike(image, candidate)) continue;
    if (!(await validImage(image.url))) continue;
    return {
      candidateId: candidate.id,
      imageUrl: image.url,
      sourceUrl: response.url || url,
      altText: `Portrait of ${candidate.fullName}`,
      credit: creditFor(kind, response.url || url),
      license: null,
      permissionBasis: permissionFor(kind),
      usageStatus: "approved",
      discoveredAt: new Date().toISOString(),
      discoveryMethod: "expanded-independent-search",
      discoverySource: kind,
      confidence: sourceConfidence,
    };
  }
  return null;
}

function matchesCandidate(html, candidate, sourceConfidence) {
  const text = strip(html).toLowerCase();
  const full = candidate.fullName.toLowerCase();
  const first = String(candidate.firstName || "").toLowerCase();
  const last = String(candidate.lastName || "").toLowerCase();
  if (text.includes(full)) return true;
  if (sourceConfidence >= 95 && first.length > 2 && last.length > 2 && text.includes(first) && text.includes(last)) return true;
  return false;
}

function extractImages(html, base) {
  const entries = [];
  const metas = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/gi,
  ];
  for (const pattern of metas) for (const match of html.matchAll(pattern)) {
    const url = absolute(match[1], base); if (url) entries.push({ url, text: match[0] });
  }
  for (const match of html.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi)) {
    const url = absolute(match[1], base); if (url) entries.push({ url, text: match[0] });
  }
  return dedupe(entries, (entry) => entry.url).slice(0, 60);
}

function portraitLike(image, candidate) {
  const hay = `${image.url} ${image.text}`.toLowerCase();
  if (/logo|icon|favicon|banner|header|footer|seal|flag|donate|yard.?sign|endorsement|event|map|placeholder|default|sprite|group|crowd|building|advertis|sponsor/.test(hay)) return false;
  if (/headshot|portrait|candidate|profile|avatar|official|member|bio|legislator|judge/.test(hay)) return true;
  const normalized = normalize(hay);
  return [candidate.firstName, candidate.lastName, candidate.preferredName].filter(Boolean).map(normalize).filter((v) => v.length > 2).some((token) => normalized.includes(token));
}

async function validImage(url) {
  const response = await fetchSafe(url, { headers: { Range: "bytes=0-65535", accept: "image/*,*/*;q=0.8" } });
  if (!response || (!response.ok && response.status !== 206)) return false;
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) return false;
  const length = Number(response.headers.get("content-length") || 0);
  return !length || length >= 8000;
}

function classify(url) {
  let host; try { host = new URL(url).hostname.toLowerCase(); } catch { return null; }
  if (/house\.texas\.gov|senate\.texas\.gov/.test(host)) return "texas-legislature";
  if (/(^|\.)house\.gov$|(^|\.)senate\.gov$/.test(host)) return "congress";
  if (/txcourts\.gov|\.tx\.us$/.test(host)) return "government";
  if (/lptexas\.org/.test(host)) return "libertarian-party";
  if (/texasgop\.org|txdemocrats\.org|txgreens\.org|republican|democrat|gop/.test(host)) return "party";
  if (/communityimpact\.com/.test(host)) return "community-impact";
  if (/texastribune\.org/.test(host)) return "texas-tribune";
  if (/houstonchronicle\.com|dallasnews\.com|expressnews\.com|kut\.org|kera/.test(host)) return "voter-guide";
  if (/ivoterguide\.com|vote411\.org/.test(host)) return "voter-guide";
  if (/ballotpedia\.org/.test(host)) return "ballotpedia";
  if (/votesmart\.org/.test(host)) return "vote-smart";
  if (/transparencyusa\.org/.test(host)) return "public-directory";
  if (/facebook\.com/.test(host)) return "facebook";
  if (/instagram\.com/.test(host)) return "instagram";
  if (/linkedin\.com/.test(host)) return "linkedin";
  if (/\.gov$|\.us$/.test(host)) return "government";
  if (/law|attorney|university|college|school|isd|county|city/.test(host)) return "professional-bio";
  return "campaign";
}

function confidence(kind) {
  return ({ "texas-legislature": 100, congress: 100, government: 99, campaign: 96, "libertarian-party": 94, party: 92, ballotpedia: 90, "vote-smart": 88, "community-impact": 87, "texas-tribune": 86, "voter-guide": 84, "public-directory": 82, facebook: 80, instagram: 80, linkedin: 76, "professional-bio": 74 })[kind] || 65;
}

function permissionFor(kind) {
  if (["texas-legislature", "congress", "government"].includes(kind)) return "Official government portrait used for informational candidate identification with source attribution.";
  if (kind === "campaign") return "Candidate campaign portrait used for editorial identification with source attribution.";
  if (["libertarian-party", "party"].includes(kind)) return "Portrait published by an official political party candidate directory and used for editorial identification with attribution.";
  if (["community-impact", "texas-tribune", "voter-guide"].includes(kind)) return "Portrait published in a public election voter guide and used for editorial candidate identification with source attribution.";
  return "Public candidate-linked portrait used for editorial identification with source attribution.";
}

function creditFor(kind, url) {
  const labels = { "texas-legislature": "Texas Legislature", congress: "United States Congress", government: "Official government source", "libertarian-party": "Libertarian Party of Texas", party: "Official political party", "community-impact": "Community Impact", "texas-tribune": "The Texas Tribune", "voter-guide": "Public voter guide", ballotpedia: "Ballotpedia", "vote-smart": "Vote Smart", "public-directory": "Public candidate directory" };
  if (labels[kind]) return labels[kind];
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "Candidate source"; }
}

async function fetchSafe(url, init = {}) {
  try {
    return await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(18000), ...init, headers: { "user-agent": USER_AGENT, ...(init.headers || {}) } });
  } catch { return null; }
}

async function runPool(items, concurrency, worker) {
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) await worker(items[index++]);
  }));
}

function searchRedirect(value) {
  try {
    const url = new URL(value, "https://lite.duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : /^https?:/i.test(url.toString()) ? url.toString() : null;
  } catch { return null; }
}
function absolute(value, base) { if (!value || value.startsWith("data:")) return null; try { return new URL(decodeEntities(value), base).toString(); } catch { return null; } }
function decodeEntities(value) { return String(value).replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim(); }
function strip(value) { return String(value).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "); }
function normalize(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
function http(value) { return typeof value === "string" && /^https?:\/\//i.test(value); }
function approved(entry) { return entry?.usageStatus === "approved" && http(entry.imageUrl); }
function dedupe(items, key) { const seen = new Set(); return items.filter((item) => { const k = key(item); if (seen.has(k)) return false; seen.add(k); return true; }); }
async function readJson(file) { return JSON.parse(await readFile(file, "utf8")); }
