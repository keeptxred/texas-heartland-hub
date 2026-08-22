#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-congress-gov-report.json");
const USER_AGENT = "KeepTXRedCandidatePhotoBot/2.0 (+https://keeptxred.com)";
const CONCURRENCY = 4;

const [candidates, manifest] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
]);

const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) =>
  candidate.primaryRaceId?.includes("us-house") && byId.get(candidate.id)?.usageStatus !== "approved"
);
const discoveries = [];
const failures = [];

await runPool(queue, CONCURRENCY, async (candidate) => {
  try {
    const entry = await discoverFromCongressGov(candidate);
    if (entry) {
      byId.set(candidate.id, entry);
      discoveries.push(entry);
    } else {
      failures.push({ candidateId: candidate.id, name: candidate.fullName, reason: "No validated Congress.gov portrait found." });
    }
  } catch (error) {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, reason: String(error?.message ?? error) });
  }
});

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await writeFile(MANIFEST_PATH, `${JSON.stringify(merged, null, 2)}\n`);
await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: "Congress.gov / Library of Congress",
  sourceDomain: "congress.gov",
  queuedCandidateCount: queue.length,
  discoveredPhotoCount: discoveries.length,
  discoveries: discoveries.map(({ candidateId, sourceUrl, imageUrl }) => ({ candidateId, sourceUrl, imageUrl })),
  failures,
}, null, 2)}\n`);

console.log(`Congress.gov discovery added ${discoveries.length} verified portrait(s).`);

async function discoverFromCongressGov(candidate) {
  const links = await duckDuckGoSearch(`site:congress.gov/member \"${candidate.fullName}\" Texas`);
  for (const url of links) {
    if (!/^https:\/\/(?:www\.)?congress\.gov\/member\//i.test(url)) continue;
    const response = await safeFetch(url);
    if (!response?.ok) continue;
    const html = await response.text();
    if (!matchesCandidate(html, candidate)) continue;
    for (const image of extractImages(html, response.url || url)) {
      if (!looksLikeMemberPortrait(image, candidate)) continue;
      if (!(await validateImage(image.url))) continue;
      return {
        candidateId: candidate.id,
        imageUrl: image.url,
        sourceUrl: response.url || url,
        altText: `Official Congress.gov portrait of ${candidate.fullName}`,
        credit: "Congress.gov / Library of Congress",
        license: null,
        permissionBasis: "Official Congress.gov member portrait used for informational candidate identification with source attribution.",
        usageStatus: "approved",
        discoveredAt: new Date().toISOString(),
        discoveryMethod: "official-congress-gov-member-profile",
        discoverySource: "congress.gov",
      };
    }
  }
  return null;
}

async function duckDuckGoSearch(query) {
  const response = await safeFetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, { headers: { accept: "text/html" } });
  if (!response?.ok) return [];
  const html = await response.text();
  const links = [];
  for (const match of html.matchAll(/class=["']result__a["'][^>]+href=["']([^"']+)["']/gi)) {
    const decoded = decodeSearchRedirect(match[1]);
    if (decoded) links.push(decoded);
  }
  return [...new Set(links)].slice(0, 8);
}

function decodeSearchRedirect(value) {
  try {
    const url = new URL(value, "https://html.duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : /^https?:/i.test(url.toString()) ? url.toString() : null;
  } catch { return null; }
}

function matchesCandidate(html, candidate) {
  const text = stripHtml(html).toLowerCase();
  const full = candidate.fullName.toLowerCase();
  const last = candidate.lastName?.toLowerCase();
  return text.includes(full) || Boolean(last && text.includes(last) && text.includes("texas"));
}

function extractImages(html, baseUrl) {
  const entries = [];
  for (const match of html.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi)) {
    const url = absoluteUrl(match[1], baseUrl);
    if (url) entries.push({ url, text: match[0] });
  }
  for (const pattern of [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/gi,
  ]) {
    for (const match of html.matchAll(pattern)) {
      const url = absoluteUrl(match[1], baseUrl);
      if (url) entries.push({ url, text: match[0] });
    }
  }
  return dedupeBy(entries, (entry) => entry.url).slice(0, 25);
}

function looksLikeMemberPortrait(image, candidate) {
  const haystack = `${image.url} ${image.text}`.toLowerCase();
  if (/logo|seal|icon|flag|map|banner|placeholder|sprite/.test(haystack)) return false;
  if (/\/img\/member\//.test(image.url) || /portrait|member|headshot|profile|photo of/.test(haystack)) return true;
  const normalized = normalize(haystack);
  return [candidate.firstName, candidate.lastName, candidate.preferredName]
    .filter(Boolean)
    .map(normalize)
    .filter((token) => token.length >= 3)
    .some((token) => normalized.includes(token));
}

async function validateImage(url) {
  const response = await safeFetch(url, { method: "GET", headers: { Range: "bytes=0-65535", accept: "image/*,*/*;q=0.8" } });
  if (!response?.ok && response?.status !== 206) return false;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) return false;
  const length = Number(response.headers.get("content-length") ?? 0);
  return !length || length >= 8000;
}

async function safeFetch(url, init = {}) {
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
      ...init,
      headers: { "user-agent": USER_AGENT, accept: "text/html,image/*;q=0.9,*/*;q=0.8", ...(init.headers ?? {}) },
    });
  } catch { return null; }
}

async function runPool(items, concurrency, worker) {
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) await worker(items[index++]);
  });
  await Promise.all(runners);
}

function stripHtml(value) { return String(value || "").replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim(); }
function normalize(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
function absoluteUrl(value, baseUrl) { if (!value || value.startsWith("data:")) return null; try { return new URL(value, baseUrl).toString(); } catch { return null; } }
function dedupeBy(items, keyFn) { const seen = new Set(); return items.filter((item) => { const key = keyFn(item); if (seen.has(key)) return false; seen.add(key); return true; }); }
async function readJson(filePath) { return JSON.parse(await readFile(filePath, "utf8")); }
