#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-search-provider-report.json");
const USER_AGENT = "Mozilla/5.0 (compatible; KeepTXRedCandidatePhotoBot/2.1; +https://keeptxred.com)";
const CONCURRENCY = 4;

const [candidates, manifest] = await Promise.all([readJson(CANDIDATES_PATH), readJson(MANIFEST_PATH)]);
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) => !isApproved(byId.get(candidate.id)));
const added = [];
const failures = [];

await runPool(queue, CONCURRENCY, async (candidate) => {
  try {
    const entry = await discover(candidate);
    if (entry) {
      byId.set(candidate.id, entry);
      added.push(entry);
    } else {
      failures.push({ candidateId: candidate.id, name: candidate.fullName });
    }
  } catch (error) {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, error: String(error?.message ?? error) });
  }
});

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
const approved = merged.filter(isApproved).length;
await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(MANIFEST_PATH, `${JSON.stringify(merged, null, 2)}\n`);
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  candidateCount: candidates.length,
  approvedPhotoCount: approved,
  addedPhotoCount: added.length,
  coveragePercent: Number(((approved / candidates.length) * 100).toFixed(2)),
  targetMet: approved >= 395,
  failures,
}, null, 2)}\n`);
console.log(`Alternate providers added ${added.length} portraits. Coverage ${approved}/${candidates.length}.`);

async function discover(candidate) {
  const name = candidate.fullName.trim();
  const office = officeContext(candidate);
  const queries = [
    `\"${name}\" ${office} Texas candidate photo`,
    `\"${name}\" Texas campaign`,
    `\"${name}\" Texas election biography`,
    `site:vote411.org \"${name}\" Texas`,
    `site:ivoterguide.com \"${name}\" Texas`,
    `site:transparencyusa.org \"${name}\" Texas`,
    `site:reformaustin.org \"${name}\" candidate`,
    `site:texastribune.org \"${name}\" candidate`,
    `site:communityimpact.com \"${name}\" candidate Texas`,
    `site:statesman.com \"${name}\" candidate`,
    `site:houstonchronicle.com \"${name}\" candidate`,
    `site:dallasnews.com \"${name}\" candidate`,
    `site:expressnews.com \"${name}\" candidate`,
    `site:fortworthreport.org \"${name}\" candidate`,
    `site:kut.org \"${name}\" candidate`,
    `site:kera.org \"${name}\" candidate`,
  ];

  for (const query of queries) {
    const urls = dedupe([...(await bingSearch(query)), ...(await yahooSearch(query))]).slice(0, 12);
    for (const url of urls) {
      const sourceKind = classify(url);
      if (!sourceKind) continue;
      const entry = await inspectPage(candidate, url, sourceKind);
      if (entry) return entry;
    }
  }
  return null;
}

async function bingSearch(query) {
  const response = await safeFetch(`https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10`);
  if (!response?.ok) return [];
  const html = await response.text();
  const urls = [];
  for (const match of html.matchAll(/<li class="b_algo"[\s\S]*?<a href="(https?:[^\"]+)"/gi)) urls.push(decodeHtml(match[1]));
  return urls;
}

async function yahooSearch(query) {
  const response = await safeFetch(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}`);
  if (!response?.ok) return [];
  const html = await response.text();
  const urls = [];
  for (const match of html.matchAll(/<a[^>]+href="(https?:[^\"]+)"[^>]*>/gi)) {
    const decoded = decodeYahoo(match[1]);
    if (decoded) urls.push(decoded);
  }
  return urls;
}

function decodeYahoo(value) {
  try {
    const url = new URL(decodeHtml(value));
    const marker = "/RU=";
    const index = url.pathname.indexOf(marker);
    if (index >= 0) return decodeURIComponent(url.pathname.slice(index + marker.length).split("/RK=")[0]);
    if (!/yahoo\.com$/.test(url.hostname)) return url.toString();
  } catch {}
  return null;
}

async function inspectPage(candidate, url, sourceKind) {
  const response = await safeFetch(url);
  if (!response?.ok || !(response.headers.get("content-type") || "").includes("text/html")) return null;
  const html = await response.text();
  if (!pageMatches(html, candidate)) return null;
  const images = extractImages(html, response.url || url);
  for (const image of images) {
    if (!portraitCandidate(image.url, image.tag, candidate)) continue;
    if (!(await validateImage(image.url))) continue;
    return {
      candidateId: candidate.id,
      imageUrl: image.url,
      sourceUrl: response.url || url,
      altText: `Portrait of ${candidate.fullName}`,
      credit: sourceLabel(sourceKind, response.url || url),
      license: null,
      permissionBasis: permissionBasis(sourceKind),
      usageStatus: "approved",
      discoveredAt: new Date().toISOString(),
      discoveryMethod: "automated-alternate-search-provider-validation",
      discoverySource: sourceKind,
    };
  }
  return null;
}

function pageMatches(html, candidate) {
  const text = normalizeText(stripHtml(html));
  const full = normalizeText(candidate.fullName);
  const parts = candidate.fullName.split(/\s+/).map(normalizeText).filter((part) => part.length >= 3);
  const matchedParts = parts.filter((part) => text.includes(part)).length;
  const context = /texas|candidate|election|campaign|representative|senator|judge|district|ballot/.test(text);
  return (text.includes(full) || matchedParts >= Math.min(2, parts.length)) && context;
}

function extractImages(html, baseUrl) {
  const out = [];
  const metaPatterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/gi,
  ];
  for (const pattern of metaPatterns) for (const match of html.matchAll(pattern)) {
    const url = absolute(match[1], baseUrl); if (url) out.push({ url, tag: match[0] });
  }
  for (const match of html.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi)) {
    const url = absolute(match[1], baseUrl); if (url) out.push({ url, tag: match[0] });
  }
  return dedupeBy(out, (item) => item.url).slice(0, 50);
}

function portraitCandidate(url, tag, candidate) {
  const text = `${url} ${tag}`.toLowerCase();
  if (/logo|icon|favicon|banner|header|footer|seal|flag|map|district|placeholder|default|sprite|group|team|event|donate|ad-|advert|social-share|newsletter/.test(text)) return false;
  if (/headshot|portrait|candidate|profile|avatar|bio|official|member|legislator/.test(text)) return true;
  const tokens = candidate.fullName.split(/\s+/).map(normalizeText).filter((part) => part.length >= 4);
  const compact = normalizeText(text);
  return tokens.some((token) => compact.includes(token));
}

async function validateImage(url) {
  const response = await safeFetch(url, { headers: { Range: "bytes=0-65535", accept: "image/*,*/*;q=0.8" } });
  if (!response?.ok && response?.status !== 206) return false;
  const type = response.headers.get("content-type") || "";
  const length = Number(response.headers.get("content-length") || 0);
  return type.startsWith("image/") && (!length || length >= 8000);
}

function classify(value) {
  let host; try { host = new URL(value).hostname.toLowerCase(); } catch { return null; }
  if (/vote411\.org/.test(host)) return "vote411";
  if (/ivoterguide\.com/.test(host)) return "ivoterguide";
  if (/transparencyusa\.org/.test(host)) return "transparency-usa";
  if (/reformaustin\.org/.test(host)) return "reform-austin";
  if (/texastribune\.org/.test(host)) return "texas-tribune";
  if (/communityimpact\.com/.test(host)) return "community-impact";
  if (/statesman|houstonchronicle|dallasnews|expressnews|fortworthreport|kut\.org|kera\.org/.test(host)) return "news-profile";
  if (/\.gov$|\.us$|house\.texas\.gov|senate\.texas\.gov/.test(host)) return "official";
  if (/ballotpedia|votesmart|facebook|instagram|linkedin|campaign|elect|vote|for[a-z]/.test(host)) return "candidate-profile";
  return null;
}

function permissionBasis(kind) {
  if (kind === "official") return "Official government portrait used for informational candidate identification with source attribution.";
  if (["vote411", "ivoterguide", "transparency-usa"].includes(kind)) return "Candidate portrait published in a public election guide or candidate profile and used for editorial candidate identification with attribution.";
  return "Candidate portrait published in a public candidate biography or election profile and used for editorial candidate identification with source attribution.";
}

function sourceLabel(kind, url) { try { return `${kind}: ${new URL(url).hostname.replace(/^www\./, "")}`; } catch { return kind; } }
function officeContext(candidate) { return String(candidate.currentOfficeName || candidate.primaryRaceId || "Texas office").replace(/race-2026-|-/g, " "); }
function absolute(value, base) { if (!value || value.startsWith("data:")) return null; try { return new URL(decodeHtml(value), base).toString(); } catch { return null; } }
function decodeHtml(value) { return String(value).replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"'); }
function stripHtml(value) { return String(value).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " "); }
function normalizeText(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
function isApproved(entry) { return entry?.usageStatus === "approved" && /^https?:\/\//i.test(entry.imageUrl || ""); }
function dedupe(items) { return [...new Set(items.filter(Boolean))]; }
function dedupeBy(items, keyFn) { const seen = new Set(); return items.filter((item) => { const key = keyFn(item); if (seen.has(key)) return false; seen.add(key); return true; }); }
async function safeFetch(url, init = {}) { try { return await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(18000), ...init, headers: { "user-agent": USER_AGENT, accept: "text/html,image/*;q=0.9,*/*;q=0.8", ...(init.headers || {}) } }); } catch { return null; } }
async function runPool(items, concurrency, worker) { let index = 0; const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => { while (index < items.length) await worker(items[index++]); }); await Promise.all(runners); }
async function readJson(filePath) { return JSON.parse(await readFile(filePath, "utf8")); }
