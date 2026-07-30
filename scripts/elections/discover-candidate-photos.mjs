#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-discovery-report.json");
const TARGET_COVERAGE = 0.85;
const CONCURRENCY = 8;
const USER_AGENT = "KeepTXRedCandidatePhotoBot/1.0 (+https://keeptxred.com)";

const [candidates, manifest] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
]);

const manifestById = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) => !isApproved(manifestById.get(candidate.id)));
const discoveries = [];
const failures = [];

await runPool(queue, CONCURRENCY, async (candidate) => {
  try {
    const discovered = await discoverForCandidate(candidate);
    if (discovered) {
      discoveries.push(discovered);
      manifestById.set(candidate.id, discovered);
    } else {
      failures.push({ candidateId: candidate.id, name: candidate.fullName, reason: "No validated portrait source found." });
    }
  } catch (error) {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, reason: String(error?.message ?? error) });
  }
});

const mergedManifest = [...manifestById.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
const approvedCount = mergedManifest.filter(isApproved).length;
const coverage = candidates.length ? approvedCount / candidates.length : 0;

await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(MANIFEST_PATH, `${JSON.stringify(mergedManifest, null, 2)}\n`);
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  candidateCount: candidates.length,
  approvedPhotoCount: approvedCount,
  discoveredPhotoCount: discoveries.length,
  coverage,
  coveragePercent: Number((coverage * 100).toFixed(2)),
  targetCoverage: TARGET_COVERAGE,
  targetMet: coverage >= TARGET_COVERAGE,
  failures,
}, null, 2)}\n`);

console.log(`Discovered ${discoveries.length} new candidate portraits.`);
console.log(`Coverage: ${approvedCount}/${candidates.length} (${(coverage * 100).toFixed(2)}%).`);
if (coverage < TARGET_COVERAGE) {
  console.warn(`Coverage remains below the ${(TARGET_COVERAGE * 100).toFixed(0)}% target.`);
}

async function discoverForCandidate(candidate) {
  const sources = buildSources(candidate);
  for (const source of sources) {
    const result = source.kind === "wikidata"
      ? await discoverFromWikidata(candidate, source)
      : await discoverFromPage(candidate, source);
    if (result) return result;
  }
  return null;
}

function buildSources(candidate) {
  const sources = [];
  if (candidate.externalIds?.wikidataId) {
    sources.push({ kind: "wikidata", url: candidate.externalIds.wikidataId });
  }
  for (const [kind, url] of [
    ["campaign", candidate.campaignUrl],
    ["official", candidate.websiteUrl],
    ["facebook", candidate.socialLinks?.facebookUrl],
    ["linkedin", candidate.socialLinks?.linkedinUrl],
    ["instagram", candidate.socialLinks?.instagramUrl],
  ]) {
    if (isHttpUrl(url)) sources.push({ kind, url });
  }
  if (candidate.externalIds?.ballotpediaId) {
    const id = String(candidate.externalIds.ballotpediaId).replace(/^https?:\/\/ballotpedia\.org\//, "");
    sources.push({ kind: "ballotpedia", url: `https://ballotpedia.org/${encodeURI(id)}` });
  }
  return dedupeSources(sources);
}

async function discoverFromWikidata(candidate, source) {
  const qid = String(source.url).match(/Q\d+/i)?.[0];
  if (!qid) return null;
  const entityUrl = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const response = await safeFetch(entityUrl);
  if (!response?.ok) return null;
  const data = await response.json();
  const filename = data?.entities?.[qid]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (!filename) return null;
  const imageUrl = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`;
  if (!(await validateImage(imageUrl))) return null;
  return makeEntry(candidate, imageUrl, `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename.replace(/ /g, "_"))}`, "Wikimedia Commons", "Wikidata/Wikimedia Commons image; license details are available on the linked file page.", "Wikimedia Commons");
}

async function discoverFromPage(candidate, source) {
  const response = await safeFetch(source.url);
  if (!response?.ok) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return null;
  const html = await response.text();
  const candidates = extractImageCandidates(html, response.url || source.url);
  for (const image of candidates) {
    if (!looksLikePortrait(image.url, image.text, candidate)) continue;
    if (!(await validateImage(image.url))) continue;
    const credit = sourceCredit(source.kind, response.url || source.url);
    const permissionBasis = source.kind === "official" || source.kind === "campaign"
      ? "Image published by the candidate's official or campaign website and used for editorial candidate identification with source attribution."
      : source.kind === "ballotpedia"
        ? "Candidate portrait sourced from the candidate's Ballotpedia profile and used for editorial identification with source attribution."
        : "Image published by a verified candidate-linked profile and used for editorial candidate identification with source attribution.";
    return makeEntry(candidate, image.url, response.url || source.url, credit, permissionBasis, null);
  }
  return null;
}

function extractImageCandidates(html, baseUrl) {
  const entries = [];
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/gi,
  ];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const url = absoluteUrl(match[1], baseUrl);
      if (url) entries.push({ url, text: match[0] });
    }
  }
  const imagePattern = /<img[^>]+(?:src|data-src)=["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(imagePattern)) {
    const url = absoluteUrl(match[1], baseUrl);
    if (url) entries.push({ url, text: match[0] });
  }
  return dedupeBy(entries, (entry) => entry.url).slice(0, 20);
}

function looksLikePortrait(url, text, candidate) {
  const haystack = `${url} ${text}`.toLowerCase();
  if (/logo|icon|favicon|banner|header|footer|seal|flag|donate|yard.?sign|endorsement|event|map|district|placeholder|default-avatar/.test(haystack)) return false;
  if (/headshot|portrait|bio|candidate|profile|avatar|official/.test(haystack)) return true;
  const tokens = [candidate.firstName, candidate.lastName, candidate.preferredName]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter((value) => value.length >= 3);
  const normalized = haystack.replace(/[^a-z0-9]/g, "");
  return tokens.some((token) => normalized.includes(token));
}

async function validateImage(url) {
  const response = await safeFetch(url, { method: "GET", headers: { Range: "bytes=0-65535" } });
  if (!response?.ok && response?.status !== 206) return false;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) return false;
  const length = Number(response.headers.get("content-length") ?? 0);
  if (length && length < 8000) return false;
  return true;
}

function makeEntry(candidate, imageUrl, sourceUrl, credit, permissionBasis, license) {
  return {
    candidateId: candidate.id,
    imageUrl,
    sourceUrl,
    altText: `Portrait of ${candidate.fullName}`,
    credit,
    license,
    permissionBasis,
    usageStatus: "approved",
    discoveredAt: new Date().toISOString(),
    discoveryMethod: "automated-source-validation",
  };
}

function sourceCredit(kind, url) {
  if (kind === "ballotpedia") return "Ballotpedia";
  if (kind === "facebook") return "Official candidate Facebook page";
  if (kind === "instagram") return "Official candidate Instagram profile";
  if (kind === "linkedin") return "Official candidate LinkedIn profile";
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "Official candidate source"; }
}

async function safeFetch(url, init = {}) {
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      ...init,
      headers: { "user-agent": USER_AGENT, accept: "text/html,image/*;q=0.9,*/*;q=0.8", ...(init.headers ?? {}) },
    });
  } catch {
    return null;
  }
}

async function runPool(items, concurrency, worker) {
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const item = items[index++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}

function absoluteUrl(value, baseUrl) {
  if (!value || value.startsWith("data:")) return null;
  try { return new URL(value, baseUrl).toString(); } catch { return null; }
}
function isHttpUrl(value) { return typeof value === "string" && /^https?:\/\//i.test(value); }
function isApproved(entry) { return entry?.usageStatus === "approved" && isHttpUrl(entry.imageUrl); }
function dedupeSources(sources) { return dedupeBy(sources, (source) => source.url); }
function dedupeBy(items, keyFn) { const seen = new Set(); return items.filter((item) => { const key = keyFn(item); if (seen.has(key)) return false; seen.add(key); return true; }); }
async function readJson(filePath) { return JSON.parse(await readFile(filePath, "utf8")); }
