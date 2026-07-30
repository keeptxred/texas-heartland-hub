#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-discovery-report.json");
const REVIEW_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-review-queue.json");
const TARGET_COVERAGE = 0.85;
const CONCURRENCY = 5;
const USER_AGENT = "KeepTXRedCandidatePhotoBot/2.0 (+https://keeptxred.com)";

const [candidates, manifest] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
]);

const manifestById = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) => !isApproved(manifestById.get(candidate.id)));
const discoveries = [];
const failures = [];
const reviewQueue = [];
const sourceStats = new Map();

await runPool(queue, CONCURRENCY, async (candidate) => {
  try {
    const result = await discoverForCandidate(candidate);
    if (result?.entry) {
      discoveries.push(result.entry);
      manifestById.set(candidate.id, result.entry);
      increment(sourceStats, result.entry.discoverySource || result.entry.discoveryMethod);
    } else {
      failures.push({ candidateId: candidate.id, name: candidate.fullName, reason: "No validated portrait source found." });
      if (result?.review?.length) reviewQueue.push(...result.review);
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
await writeFile(REVIEW_PATH, `${JSON.stringify(reviewQueue, null, 2)}\n`);
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  candidateCount: candidates.length,
  approvedPhotoCount: approvedCount,
  discoveredPhotoCount: discoveries.length,
  coverage,
  coveragePercent: Number((coverage * 100).toFixed(2)),
  targetCoverage: TARGET_COVERAGE,
  targetMet: coverage >= TARGET_COVERAGE,
  sourceStats: Object.fromEntries([...sourceStats.entries()].sort()),
  reviewQueueCount: reviewQueue.length,
  failures,
}, null, 2)}\n`);

console.log(`Discovered ${discoveries.length} new candidate portraits.`);
console.log(`Coverage: ${approvedCount}/${candidates.length} (${(coverage * 100).toFixed(2)}%).`);
if (coverage < TARGET_COVERAGE) console.warn(`Coverage remains below the ${(TARGET_COVERAGE * 100).toFixed(0)}% target.`);

async function discoverForCandidate(candidate) {
  const review = [];

  // 1. Existing candidate-linked sources remain highest confidence.
  for (const source of buildLinkedSources(candidate)) {
    const entry = source.kind === "wikidata"
      ? await discoverFromWikidata(candidate, source)
      : await discoverFromPage(candidate, source);
    if (entry) return { entry, review };
  }

  // 2. Public knowledge APIs locate records even when the candidate dataset lacks IDs.
  for (const finder of [discoverFromWikidataSearch, discoverFromCommonsSearch]) {
    const entry = await finder(candidate);
    if (entry) return { entry, review };
  }

  // 3. Targeted domain searches find official, campaign, legislative, judicial,
  // party, professional and reputable profile pages that are not yet linked.
  const discoveredPages = await discoverSourcePages(candidate);
  for (const source of discoveredPages) {
    const entry = await discoverFromPage(candidate, source);
    if (entry) return { entry, review };
  }

  return { entry: null, review };
}

function buildLinkedSources(candidate) {
  const sources = [];
  if (candidate.externalIds?.wikidataId) sources.push({ kind: "wikidata", url: candidate.externalIds.wikidataId, confidence: 100 });
  for (const [kind, url, confidence] of [
    ["campaign", candidate.campaignUrl, 98],
    ["official", candidate.websiteUrl, 98],
    ["facebook", candidate.socialLinks?.facebookUrl, 88],
    ["linkedin", candidate.socialLinks?.linkedinUrl, 82],
    ["instagram", candidate.socialLinks?.instagramUrl, 86],
  ]) if (isHttpUrl(url)) sources.push({ kind, url, confidence });
  if (candidate.externalIds?.ballotpediaId) {
    const id = String(candidate.externalIds.ballotpediaId).replace(/^https?:\/\/ballotpedia\.org\//, "");
    sources.push({ kind: "ballotpedia", url: `https://ballotpedia.org/${encodeURI(id)}`, confidence: 90 });
  }
  const slug = candidate.fullName.trim().replace(/\s+/g, "_");
  sources.push({ kind: "ballotpedia", url: `https://ballotpedia.org/${encodeURIComponent(slug)}`, confidence: 78 });
  return dedupeSources(sources);
}

async function discoverSourcePages(candidate) {
  const name = `\"${candidate.fullName}\"`;
  const context = candidate.currentOfficeName || candidate.primaryRaceId || "Texas candidate";
  const queries = [
    `${name} ${context} official campaign`,
    `site:house.texas.gov ${name}`,
    `site:senate.texas.gov ${name}`,
    `site:house.gov ${name} Texas`,
    `site:senate.gov ${name} Texas`,
    `site:txcourts.gov ${name}`,
    `site:ballotpedia.org ${name} Texas`,
    `site:votesmart.org ${name} Texas`,
    `site:facebook.com ${name} candidate Texas`,
    `site:instagram.com ${name} candidate Texas`,
    `site:linkedin.com/in ${name} Texas`,
    `${name} Texas Republican candidate`,
    `${name} Texas Democratic candidate`,
    `${name} Texas Libertarian candidate`,
    `${name} judge Texas biography`,
    `${name} school board Texas`,
    `${name} city council Texas`,
    `${name} county commissioner Texas`,
    `${name} law firm biography Texas`,
    `${name} university faculty Texas`,
  ];

  const pages = [];
  for (const query of queries) {
    const links = await duckDuckGoSearch(query);
    for (const url of links) {
      const kind = classifySource(url);
      if (!kind) continue;
      pages.push({ kind, url, confidence: sourceConfidence(kind) });
    }
    if (pages.length >= 30) break;
  }
  return dedupeSources(pages).sort((a, b) => b.confidence - a.confidence).slice(0, 30);
}

async function duckDuckGoSearch(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const response = await safeFetch(url, { headers: { accept: "text/html" } });
  if (!response?.ok) return [];
  const html = await response.text();
  const links = [];
  for (const match of html.matchAll(/class=["']result__a["'][^>]+href=["']([^"']+)["']/gi)) {
    const decoded = decodeSearchRedirect(match[1]);
    if (decoded) links.push(decoded);
  }
  return dedupeBy(links, (value) => value).slice(0, 8);
}

function decodeSearchRedirect(value) {
  try {
    const url = new URL(value, "https://html.duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : /^https?:/i.test(url.toString()) ? url.toString() : null;
  } catch { return null; }
}

async function discoverFromWikidataSearch(candidate) {
  const endpoint = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(candidate.fullName)}&language=en&format=json&limit=8&origin=*`;
  const response = await safeFetch(endpoint);
  if (!response?.ok) return null;
  const data = await response.json();
  const matches = (data.search || []).filter((item) => {
    const text = `${item.label || ""} ${item.description || ""}`.toLowerCase();
    return normalize(item.label) === normalize(candidate.fullName) && /texas|politic|candidate|legislator|representative|senator|judge|attorney|official/.test(text);
  });
  for (const match of matches) {
    const entry = await discoverFromWikidata(candidate, { kind: "wikidata", url: match.id });
    if (entry) return { ...entry, discoverySource: "wikidata-search" };
  }
  return null;
}

async function discoverFromCommonsSearch(candidate) {
  const query = `${candidate.fullName} Texas`;
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;
  const response = await safeFetch(endpoint);
  if (!response?.ok) return null;
  const data = await response.json();
  const pages = Object.values(data?.query?.pages || {});
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info?.url || !looksLikePortrait(info.url, page.title, candidate)) continue;
    const metadata = info.extmetadata || {};
    const license = metadata.LicenseShortName?.value || null;
    const artist = stripHtml(metadata.Artist?.value || "Wikimedia Commons contributor");
    if (!(await validateImage(info.url))) continue;
    return makeEntry(candidate, info.url, `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`, artist, "Wikimedia Commons image used under the license stated on the linked file page.", license, "commons-search");
  }
  return null;
}

async function discoverFromWikidata(candidate, source) {
  const qid = String(source.url).match(/Q\d+/i)?.[0];
  if (!qid) return null;
  const entityUrl = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const response = await safeFetch(entityUrl);
  if (!response?.ok) return null;
  const data = await response.json();
  const entity = data?.entities?.[qid];
  const label = entity?.labels?.en?.value || "";
  if (label && normalize(label) !== normalize(candidate.fullName)) return null;
  const filename = entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (!filename) return null;
  const imageUrl = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`;
  if (!(await validateImage(imageUrl))) return null;
  return makeEntry(candidate, imageUrl, `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename.replace(/ /g, "_"))}`, "Wikimedia Commons", "Wikidata/Wikimedia Commons image; license details are available on the linked file page.", null, "wikidata");
}

async function discoverFromPage(candidate, source) {
  const response = await safeFetch(source.url);
  if (!response?.ok) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return null;
  const html = await response.text();
  if (!pageMatchesCandidate(html, candidate, source)) return null;
  const images = extractImageCandidates(html, response.url || source.url);
  for (const image of images) {
    if (!looksLikePortrait(image.url, image.text, candidate)) continue;
    if (!(await validateImage(image.url))) continue;
    const credit = sourceCredit(source.kind, response.url || source.url);
    const permissionBasis = permissionBasisFor(source.kind);
    return makeEntry(candidate, image.url, response.url || source.url, credit, permissionBasis, null, source.kind);
  }
  return null;
}

function pageMatchesCandidate(html, candidate, source) {
  const text = stripHtml(html).toLowerCase();
  const full = candidate.fullName.toLowerCase();
  const last = candidate.lastName?.toLowerCase();
  if (!text.includes(full) && !(last && text.includes(last))) return false;
  if (["official", "campaign", "legislature", "congress", "judicial", "party"].includes(source.kind)) return true;
  const context = `${candidate.currentOfficeName || ""} ${candidate.primaryRaceId || ""}`.toLowerCase();
  const tokens = context.split(/[^a-z0-9]+/).filter((v) => v.length > 3);
  return tokens.length === 0 || tokens.some((token) => text.includes(token)) || /texas|candidate|election|representative|senator|judge/.test(text);
}

function extractImageCandidates(html, baseUrl) {
  const entries = [];
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/gi,
  ];
  for (const pattern of patterns) for (const match of html.matchAll(pattern)) {
    const url = absoluteUrl(match[1], baseUrl);
    if (url) entries.push({ url, text: match[0] });
  }
  const imagePattern = /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(imagePattern)) {
    const url = absoluteUrl(match[1], baseUrl);
    if (url) entries.push({ url, text: match[0] });
  }
  return dedupeBy(entries, (entry) => entry.url).slice(0, 40);
}

function looksLikePortrait(url, text, candidate) {
  const haystack = `${url} ${text}`.toLowerCase();
  if (/logo|icon|favicon|banner|header|footer|seal|flag|donate|yard.?sign|endorsement|event|map|district|placeholder|default-avatar|sprite|thumbnail-logo|group|team-photo/.test(haystack)) return false;
  if (/headshot|portrait|bio|candidate|profile|avatar|official|member-photo|legislator/.test(haystack)) return true;
  const tokens = [candidate.firstName, candidate.lastName, candidate.preferredName]
    .filter(Boolean).map((value) => normalize(value)).filter((value) => value.length >= 3);
  const normalized = normalize(haystack);
  return tokens.some((token) => normalized.includes(token));
}

async function validateImage(url) {
  const response = await safeFetch(url, { method: "GET", headers: { Range: "bytes=0-65535", accept: "image/*,*/*;q=0.8" } });
  if (!response?.ok && response?.status !== 206) return false;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) return false;
  const length = Number(response.headers.get("content-length") ?? 0);
  if (length && length < 8000) return false;
  return true;
}

function classifySource(url) {
  let host;
  try { host = new URL(url).hostname.toLowerCase(); } catch { return null; }
  if (/house\.texas\.gov|senate\.texas\.gov/.test(host)) return "legislature";
  if (/(^|\.)house\.gov$|(^|\.)senate\.gov$/.test(host)) return "congress";
  if (/txcourts\.gov|\.tx\.us$/.test(host)) return "judicial";
  if (/ballotpedia\.org/.test(host)) return "ballotpedia";
  if (/votesmart\.org/.test(host)) return "votesmart";
  if (/facebook\.com/.test(host)) return "facebook";
  if (/instagram\.com/.test(host)) return "instagram";
  if (/linkedin\.com/.test(host)) return "linkedin";
  if (/wikipedia\.org|wikimedia\.org/.test(host)) return "wikimedia";
  if (/gop|republican|democrat|libertarian|greenparty/.test(host)) return "party";
  if (/\.gov$|\.us$/.test(host)) return "official";
  if (/law|attorney|university|college|school|isd|county|city/.test(host)) return "professional";
  return "campaign";
}

function sourceConfidence(kind) {
  return ({ legislature: 100, congress: 100, official: 98, judicial: 98, campaign: 94, party: 90, ballotpedia: 88, votesmart: 86, wikimedia: 84, facebook: 80, instagram: 80, linkedin: 76, professional: 72 })[kind] || 60;
}

function permissionBasisFor(kind) {
  if (["official", "legislature", "congress", "judicial"].includes(kind)) return "Official government portrait used for informational candidate identification with source attribution.";
  if (kind === "campaign") return "Image published by the candidate's campaign website and used for editorial candidate identification with source attribution.";
  if (kind === "party") return "Image published by an official political party or county party candidate page and used for editorial identification with attribution.";
  if (kind === "ballotpedia") return "Candidate portrait sourced from the candidate's Ballotpedia profile and used for editorial identification with source attribution.";
  if (kind === "votesmart") return "Candidate portrait sourced from Vote Smart and used for editorial candidate identification with source attribution.";
  if (kind === "professional") return "Public professional biography portrait used for editorial candidate identification with source attribution.";
  return "Image published by a candidate-linked public profile and used for editorial candidate identification with source attribution.";
}

function makeEntry(candidate, imageUrl, sourceUrl, credit, permissionBasis, license, discoverySource) {
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
    discoveryMethod: "automated-multi-source-validation",
    discoverySource,
  };
}

function sourceCredit(kind, url) {
  const labels = { ballotpedia: "Ballotpedia", votesmart: "Vote Smart", facebook: "Official candidate Facebook page", instagram: "Official candidate Instagram profile", linkedin: "Candidate LinkedIn profile", legislature: "Texas Legislature", congress: "United States Congress", judicial: "Texas judiciary" };
  if (labels[kind]) return labels[kind];
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "Candidate source"; }
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

function increment(map, key) { map.set(key || "unknown", (map.get(key || "unknown") || 0) + 1); }
function stripHtml(value) { return String(value || "").replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim(); }
function normalize(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
function absoluteUrl(value, baseUrl) { if (!value || value.startsWith("data:")) return null; try { return new URL(value, baseUrl).toString(); } catch { return null; } }
function isHttpUrl(value) { return typeof value === "string" && /^https?:\/\//i.test(value); }
function isApproved(entry) { return entry?.usageStatus === "approved" && isHttpUrl(entry.imageUrl); }
function dedupeSources(sources) { return dedupeBy(sources, (source) => source.url); }
function dedupeBy(items, keyFn) { const seen = new Set(); return items.filter((item) => { const key = keyFn(item); if (seen.has(key)) return false; seen.add(key); return true; }); }
async function readJson(filePath) { return JSON.parse(await readFile(filePath, "utf8")); }
