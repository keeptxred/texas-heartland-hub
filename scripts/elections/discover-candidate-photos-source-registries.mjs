#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const CANDIDATES_PATH = path.join(DATA_DIR, "candidates.json");
const MANIFEST_PATH = path.join(DATA_DIR, "candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-source-registry-report.json");
const REVIEW_QUEUE_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-review-queue.json");
const USER_AGENT = "KeepTXRedCandidatePhotoBot/2.0 (+https://keeptxred.com)";
const MAX_PAGES_PER_SOURCE = 8;
const CONCURRENCY = 4;

const [candidates, manifest, registries] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
  loadRegistries(DATA_DIR),
]);

const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const missingCandidates = candidates.filter((candidate) => byId.get(candidate.id)?.usageStatus !== "approved");
const candidateByNormalizedName = new Map(missingCandidates.map((candidate) => [normalize(candidate.fullName), candidate]));
const resolvedActiveSources = registries
  .filter((entry) => entry?.discoveryStatus === "active" && entry?.domain)
  .map((entry) => ({ ...entry, candidate: resolveCandidate(entry, candidateByNormalizedName) }))
  .filter((entry) => entry.candidate && byId.get(entry.candidate.id)?.usageStatus !== "approved");
const sources = resolvedActiveSources.filter((entry) => entry.autoApprove === true);
const reviewSources = resolvedActiveSources.filter((entry) => entry.autoApprove !== true);

const discoveries = [];
const failures = [];
const reviewLeads = [];
const reviewFailures = [];

await runPool(sources, CONCURRENCY, async (source) => {
  try {
    const result = await discoverFromRegistrySource(source);
    if (!result) {
      failures.push({ candidateId: source.candidate.id, domain: source.domain, reason: "No validated candidate portrait found." });
      return;
    }
    byId.set(source.candidate.id, result);
    discoveries.push({ candidateId: source.candidate.id, domain: source.domain, imageUrl: result.imageUrl, sourceUrl: result.sourceUrl });
  } catch (error) {
    failures.push({ candidateId: source.candidate.id, domain: source.domain, reason: String(error?.message ?? error) });
  }
});

// Discovery-only registries are intentionally not allowed to mutate the public
// manifest. Crawl them into an explicit review queue so newly discovered source
// domains actually feed item-level provenance/rights review instead of being inert.
await runPool(reviewSources, CONCURRENCY, async (source) => {
  try {
    const result = await discoverFromRegistrySource(source);
    if (!result) {
      reviewFailures.push({ candidateId: source.candidate.id, domain: source.domain, reason: "No validated portrait lead found on discovery-only source." });
      return;
    }
    reviewLeads.push({
      candidateId: source.candidate.id,
      candidateName: source.candidate.fullName,
      raceId: source.candidate.primaryRaceId,
      domain: source.domain,
      sourceClass: source.sourceClass ?? null,
      imageUrl: result.imageUrl,
      sourceUrl: result.sourceUrl,
      rightsRule: source.rightsRule ?? null,
      reviewStatus: "item-level-rights-review-required",
      approvalBlocked: true,
      discoveredAt: new Date().toISOString(),
      discoveryMethod: "discovery-only-source-registry",
    });
  } catch (error) {
    reviewFailures.push({ candidateId: source.candidate.id, domain: source.domain, reason: String(error?.message ?? error) });
  }
});

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
const queued = dedupeBy(reviewLeads, (item) => `${item.candidateId}|${item.imageUrl}`)
  .sort((a, b) => a.candidateId.localeCompare(b.candidateId) || a.imageUrl.localeCompare(b.imageUrl));
await writeFile(MANIFEST_PATH, `${JSON.stringify(merged, null, 2)}\n`);
await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REVIEW_QUEUE_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  reviewLeadCount: queued.length,
  leads: queued,
}, null, 2)}\n`);
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  registryEntryCount: registries.length,
  activeAutoApproveSourceCount: sources.length,
  activeDiscoveryOnlySourceCount: reviewSources.length,
  discoveredPhotoCount: discoveries.length,
  reviewLeadCount: queued.length,
  discoveries,
  failures,
  reviewFailures,
}, null, 2)}\n`);

console.log(`Registry-driven discovery applied ${discoveries.length} verified candidate portrait(s) from ${sources.length} active approved source(s).`);
console.log(`Queued ${queued.length} portrait lead(s) from ${reviewSources.length} discovery-only source(s) for item-level rights review.`);

async function discoverFromRegistrySource(source) {
  const host = normalizeHost(source.domain);
  const startUrls = [`https://${host}/`, `https://www.${host}/`];
  const visited = new Set();
  const queue = [];
  for (const url of startUrls) if (!queue.includes(url)) queue.push(url);

  while (queue.length && visited.size < MAX_PAGES_PER_SOURCE) {
    const requestedUrl = queue.shift();
    if (visited.has(requestedUrl)) continue;
    visited.add(requestedUrl);
    const response = await safeFetch(requestedUrl);
    if (!response?.ok) continue;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) continue;
    const html = await response.text();
    const pageUrl = response.url || requestedUrl;
    if (!sameRegisteredDomain(pageUrl, host)) continue;
    if (!pageMatchesCandidate(html, source.candidate)) {
      enqueueCandidateLinks(queue, html, pageUrl, host, source.candidate);
      continue;
    }

    for (const image of extractImageCandidates(html, pageUrl)) {
      if (!looksLikeCandidatePortrait(image, source.candidate)) continue;
      if (!(await validateImage(image.url))) continue;
      return {
        candidateId: source.candidate.id,
        imageUrl: image.url,
        sourceUrl: pageUrl,
        altText: `${source.candidate.fullName}, candidate in ${raceLabel(source.candidate.primaryRaceId)}`,
        credit: sourceCredit(source),
        license: null,
        permissionBasis: source.rightsRule || "Candidate-identifying image hosted by a verified approved source registry entry and used for editorial candidate identification with source attribution.",
        usageStatus: "approved",
        discoveredAt: new Date().toISOString(),
        discoveryMethod: "verified-source-registry"
      };
    }
    enqueueCandidateLinks(queue, html, pageUrl, host, source.candidate);
  }
  return null;
}

function resolveCandidate(entry, candidateByNormalizedName) {
  const haystack = normalize(`${entry.searchHint || ""} ${entry.notes || ""} ${entry.rightsRule || ""}`);
  const matches = [];
  for (const [name, candidate] of candidateByNormalizedName) {
    if (name.length >= 5 && haystack.includes(name)) matches.push(candidate);
  }
  return matches.length === 1 ? matches[0] : null;
}

function enqueueCandidateLinks(queue, html, pageUrl, host, candidate) {
  for (const match of html.matchAll(/<a[^>]+href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const url = absoluteUrl(match[1], pageUrl);
    if (!url || !sameRegisteredDomain(url, host)) continue;
    const text = normalize(stripHtml(match[2] || ""));
    const href = normalize(url);
    const candidateTokens = normalize(candidate.fullName).split(" ").filter((token) => token.length >= 4);
    if (/about|meet|bio|media|press|photo|gallery|candidate|team/.test(`${text} ${href}`) || candidateTokens.some((token) => `${text} ${href}`.includes(token))) {
      if (!queue.includes(url)) queue.push(url);
    }
  }
}

function pageMatchesCandidate(html, candidate) {
  const text = normalize(stripHtml(html));
  const fullName = normalize(candidate.fullName);
  if (fullName && text.includes(fullName)) return true;
  const tokens = fullName.split(" ").filter((token) => token.length >= 4);
  return tokens.length >= 2 && tokens.every((token) => text.includes(token));
}

function extractImageCandidates(html, baseUrl) {
  const results = [];
  const metaPatterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/gi,
  ];
  for (const pattern of metaPatterns) {
    for (const match of html.matchAll(pattern)) {
      const url = absoluteUrl(match[1], baseUrl);
      if (url) results.push({ url, text: match[0] });
    }
  }
  for (const match of html.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi)) {
    const url = absoluteUrl(match[1], baseUrl);
    if (url) results.push({ url, text: match[0] });
  }
  return dedupeBy(results, (item) => item.url).slice(0, 60);
}

function looksLikeCandidatePortrait(image, candidate) {
  const text = normalize(`${image.url} ${image.text}`);
  if (/logo|icon|favicon|seal|flag|map|district|donate|button|yard sign|endorsement|sponsor|stock|background|placeholder|sprite|social|group|team photo/.test(text)) return false;
  const candidateTokens = normalize(candidate.fullName).split(" ").filter((token) => token.length >= 4);
  const hasCandidateName = candidateTokens.length >= 2
    ? candidateTokens.filter((token) => text.includes(token)).length >= 2
    : candidateTokens.some((token) => text.includes(token));
  if (hasCandidateName) return true;
  return /headshot|portrait|candidate photo|candidate headshot|profile photo|official photo/.test(text);
}

async function validateImage(url) {
  const response = await safeFetch(url, { method: "GET", headers: { Range: "bytes=0-65535", accept: "image/*,*/*;q=0.8" } });
  if (!response || (!response.ok && response.status !== 206)) return false;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) return false;
  const length = Number(response.headers.get("content-length") || 0);
  return !length || length >= 10000;
}

function sourceCredit(source) {
  if (source.sourceClass === "official-government") return source.domain;
  if (/campaign/.test(source.sourceClass || "")) return `${source.candidate.fullName} campaign`;
  return source.domain;
}

function raceLabel(raceId = "") {
  return String(raceId).replace(/^race-2026-/, "").replace(/-/g, " ");
}

async function loadRegistries(directory) {
  const names = (await readdir(directory)).filter((name) => /^candidate-photo-source-registry(?:-[a-z0-9-]+)?\.json$/i.test(name)).sort();
  const loaded = await Promise.all(names.map((name) => readJson(path.join(directory, name))));
  return loaded.flatMap((entries) => Array.isArray(entries) ? entries : []);
}

function sameRegisteredDomain(value, host) {
  try {
    const candidateHost = normalizeHost(new URL(value).hostname);
    return candidateHost === host || candidateHost.endsWith(`.${host}`) || host.endsWith(`.${candidateHost}`);
  } catch { return false; }
}

function absoluteUrl(value, base) {
  try {
    const url = new URL(value, base);
    return /^https?:$/.test(url.protocol) ? url.toString() : null;
  } catch { return null; }
}

function normalizeHost(value) { return String(value || "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]; }
function stripHtml(value) { return String(value || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z0-9#]+;/gi, " "); }
function normalize(value) { return String(value || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
function dedupeBy(items, keyFn) { const seen = new Set(); return items.filter((item) => { const key = keyFn(item); if (seen.has(key)) return false; seen.add(key); return true; }); }

async function safeFetch(url, init = {}) {
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
      ...init,
      headers: { "user-agent": USER_AGENT, accept: "text/html,*/*;q=0.8", ...(init.headers || {}) },
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

async function readJson(filePath) { return JSON.parse(await readFile(filePath, "utf8")); }
