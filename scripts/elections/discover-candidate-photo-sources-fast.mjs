#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REGISTRY_DIR = path.join(ROOT, "src/data/elections/2026");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-source-discovery-report.json");
const USER_AGENT = "KeepTXRedCandidatePhotoBot/2.1 (+https://keeptxred.com)";
const MAX_CANDIDATES_PER_RUN = 18;
const MAX_DIRECTORY_BRIDGES = 8;
const MAX_RESULTS_PER_CANDIDATE = 48;
const CONCURRENCY = 4;
const FETCH_TIMEOUT_MS = 6500;

const [candidates, manifest, registry, previousReport] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
  loadSourceRegistries(REGISTRY_DIR),
  readJsonIfExists(REPORT_PATH),
]);

const approved = new Set(
  manifest
    .filter((entry) => entry.usageStatus === "approved" && /^https:\/\//i.test(entry.imageUrl || ""))
    .map((entry) => entry.candidateId),
);
const knownDomains = new Set(registry.map((entry) => normalizeHost(entry.domain)).filter(Boolean));
const discoveryDirectories = dedupeBy(
  registry
    .filter((entry) => entry?.autoApprove === false && entry?.domain && ["active", "discovery-only"].includes(entry?.discoveryStatus))
    .map((entry) => ({ ...entry, domain: normalizeHost(entry.domain) }))
    .filter((entry) => entry.domain),
  (entry) => entry.domain,
)
  .sort((a, b) => directoryRank(a) - directoryRank(b) || a.domain.localeCompare(b.domain))
  .slice(0, MAX_DIRECTORY_BRIDGES);
const discoveryDirectoryDomains = new Set(discoveryDirectories.map((entry) => entry.domain));
const missingCandidates = candidates.filter((candidate) => !approved.has(candidate.id)).sort(prioritySort);
const requestedOffset = Number(previousReport?.nextCandidateOffset ?? 0);
const searchStartOffset = missingCandidates.length
  ? ((Number.isFinite(requestedOffset) ? requestedOffset : 0) % missingCandidates.length + missingCandidates.length) % missingCandidates.length
  : 0;
const queue = takeWrapped(missingCandidates, searchStartOffset, MAX_CANDIDATES_PER_RUN);
const nextCandidateOffset = missingCandidates.length ? (searchStartOffset + queue.length) % missingCandidates.length : 0;
const discoveries = [];
const failures = [];
const directoryBridgeStats = new Map();

await runPool(queue, CONCURRENCY, async (candidate) => {
  try {
    const urls = await discoverSourceUrls(candidate);
    for (const url of urls) {
      const host = hostOf(url);
      if (!host || isKnownDomain(host, knownDomains) || isBlockedHost(host)) continue;
      discoveries.push({
        candidateId: candidate.id,
        name: candidate.fullName,
        raceId: candidate.primaryRaceId,
        party: candidate.party,
        url,
        domain: host,
        sourceClassGuess: classifyDomain(host, url),
        status: "needs-rights-and-identity-review",
      });
    }
  } catch (error) {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, reason: String(error?.message ?? error) });
  }
});

const deduped = dedupeBy(discoveries, (item) => `${item.candidateId}|${item.domain}|${item.url}`)
  .sort((a, b) => sourceRank(a.sourceClassGuess) - sourceRank(b.sourceClassGuess) || a.domain.localeCompare(b.domain));
const domainSummary = new Map();
for (const item of deduped) {
  const current = domainSummary.get(item.domain) || {
    domain: item.domain,
    sourceClassGuess: item.sourceClassGuess,
    candidateCount: 0,
    sampleUrls: [],
  };
  current.candidateCount += 1;
  if (current.sampleUrls.length < 3) current.sampleUrls.push(item.url);
  domainSummary.set(item.domain, current);
}

await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  purpose: "Bounded discovery of previously unseen candidate-photo source domains without auto-approving images.",
  candidateCount: candidates.length,
  missingCandidateCount: missingCandidates.length,
  searchedCandidateCount: queue.length,
  searchStartOffset,
  nextCandidateOffset,
  searchedCandidateIds: queue.map((candidate) => candidate.id),
  knownSourceDomainCount: knownDomains.size,
  loadedRegistryEntryCount: registry.length,
  discoveryOnlyDirectoryCount: discoveryDirectories.length,
  directoryBridgeDomains: discoveryDirectories.map((entry) => entry.domain),
  directoryBridgeStats: Object.fromEntries([...directoryBridgeStats.entries()].sort()),
  runtimeBounds: {
    maxCandidatesPerRun: MAX_CANDIDATES_PER_RUN,
    maxDirectoryBridges: MAX_DIRECTORY_BRIDGES,
    maxResultsPerCandidate: MAX_RESULTS_PER_CANDIDATE,
    concurrency: CONCURRENCY,
    fetchTimeoutMs: FETCH_TIMEOUT_MS,
  },
  newSourceCandidateCount: deduped.length,
  newDomainCount: domainSummary.size,
  newDomains: [...domainSummary.values()],
  discoveries: deduped,
  failures,
}, null, 2)}\n`);

console.log(`Bounded source expansion searched ${queue.length} candidates from offset ${searchStartOffset} and found ${domainSummary.size} new domain(s).`);
console.log(`Used ${discoveryDirectories.length} highest-priority discovery bridges and will continue at offset ${nextCandidateOffset}.`);

async function discoverSourceUrls(candidate) {
  const name = `\"${candidate.fullName}\"`;
  const race = raceContext(candidate.primaryRaceId);
  const queries = [
    `${name} Texas ${race} official campaign portrait`,
    `${name} Texas ${race} press media headshot`,
    `${name} Texas ${race} official government biography photo`,
    `${name} Texas ${race} public domain portrait`,
    `${name} Texas ${race} Creative Commons portrait`,
    `${name} Texas ${race} candidate voter guide`,
    ...discoveryDirectories.map((directory) => `site:${directory.domain} ${name} Texas ${race} candidate`),
  ];
  const urls = [];
  const directoryPages = [];
  for (const query of queries) {
    const results = await duckDuckGoSearch(query);
    for (const url of results) {
      const host = hostOf(url);
      if (host && isDomainInSet(host, discoveryDirectoryDomains)) directoryPages.push(url);
      else urls.push(url);
    }
    if (urls.length + directoryPages.length >= MAX_RESULTS_PER_CANDIDATE) break;
  }
  for (const directoryPage of [...new Set(directoryPages)].slice(0, 6)) {
    const outbound = await discoverOutboundSourceUrls(directoryPage, candidate);
    if (outbound.length) {
      const host = hostOf(directoryPage) || "unknown-directory";
      directoryBridgeStats.set(host, (directoryBridgeStats.get(host) || 0) + outbound.length);
      urls.push(...outbound);
    }
  }
  return [...new Set(urls)].slice(0, MAX_RESULTS_PER_CANDIDATE);
}

async function discoverOutboundSourceUrls(directoryPageUrl, candidate) {
  const response = await safeFetch(directoryPageUrl, { headers: { accept: "text/html" } });
  if (!response?.ok || !(response.headers.get("content-type") || "").includes("text/html")) return [];
  const html = await response.text();
  const text = normalize(stripHtml(html));
  const fullName = normalize(candidate.fullName);
  const tokens = fullName.split(" ").filter((token) => token.length >= 4);
  if (fullName && !text.includes(fullName) && !(tokens.length >= 2 && tokens.every((token) => text.includes(token)))) return [];
  const links = [];
  for (const match of html.matchAll(/<a[^>]+href=["']([^"'#]+)["'][^>]*>/gi)) {
    const url = absoluteUrl(match[1], response.url || directoryPageUrl);
    if (!url) continue;
    const host = hostOf(url);
    if (!host || isDomainInSet(host, discoveryDirectoryDomains) || isBlockedHost(host)) continue;
    links.push(url);
  }
  return [...new Set(links)].slice(0, 16);
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
  return links.slice(0, 6);
}

function decodeSearchRedirect(value) {
  try {
    const url = new URL(value, "https://html.duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : /^https?:/i.test(url.toString()) ? url.toString() : null;
  } catch {
    return null;
  }
}

function directoryRank(entry) {
  const text = `${entry.sourceClass || ""} ${entry.domain || ""}`.toLowerCase();
  if (/government|official-government|\.gov/.test(text)) return 0;
  if (/party|gop|democrat|republican/.test(text)) return 1;
  if (/voter|ballot|candidate|guide|tcta|teachthevote|votesmart|ballotpedia/.test(text)) return 2;
  if (/archive|commons|wikimedia|library/.test(text)) return 3;
  return 4;
}

function prioritySort(a, b) {
  const score = (candidate) => {
    let value = 0;
    if (candidate.featured) value -= 100;
    if (/governor|lieutenant-governor|attorney-general|comptroller|land-commissioner|agriculture-commissioner|railroad-commissioner|us-senate/.test(candidate.primaryRaceId || "")) value -= 80;
    if (/supreme-court|court-of-criminal-appeals|state-board-of-education/.test(candidate.primaryRaceId || "")) value -= 60;
    if (/us-house/.test(candidate.primaryRaceId || "")) value -= 40;
    return value;
  };
  return score(a) - score(b) || String(a.primaryRaceId || "").localeCompare(String(b.primaryRaceId || "")) || a.fullName.localeCompare(b.fullName);
}

function raceContext(raceId = "") {
  return String(raceId)
    .replace(/^race-2026-/, "")
    .replace(/-/g, " ")
    .replace(/texas house (\d+)/, "Texas House District $1")
    .replace(/texas senate (\d+)/, "Texas Senate District $1")
    .replace(/us house (\d+)/, "U.S. House District $1");
}

function classifyDomain(host, url) {
  if (/\.gov$|\.tx\.us$|\.us$/.test(host)) return "official-government";
  if (/gop|republican|democrat|libertarian|greenparty|greens/.test(host)) return "official-or-political-party";
  if (/ballot|vote|election|voter|leagueofwomenvoters|lwv/.test(host)) return "voter-guide-or-election-directory";
  if (/archive|museum|library|commons|flickr|photo|media/.test(host)) return "archive-or-image-repository";
  if (/law|attorney|university|college|school|isd|county|city/.test(host)) return "professional-or-institutional-biography";
  if (/news|tribune|times|post|chronicle|observer|standard|herald|reporter/.test(host)) return "news-or-editorial-source";
  if (/press|media|campaign|elect|vote|for(?:texas|tx|congress|house|senate|judge)/.test(`${host} ${url}`)) return "campaign-or-media-source";
  return "unclassified-web-source";
}

function sourceRank(sourceClass) {
  return ({
    "official-government": 0,
    "campaign-or-media-source": 1,
    "official-or-political-party": 2,
    "archive-or-image-repository": 3,
    "voter-guide-or-election-directory": 4,
    "professional-or-institutional-biography": 5,
    "news-or-editorial-source": 6,
    "unclassified-web-source": 7,
  })[sourceClass] ?? 9;
}

function isKnownDomain(host, domains) {
  for (const domain of domains) {
    if (host === domain || host.endsWith(`.${domain}`) || domain.endsWith(`.${host}`)) return true;
  }
  return false;
}

function isDomainInSet(host, domains) {
  for (const domain of domains) {
    if (host === domain || host.endsWith(`.${domain}`) || domain.endsWith(`.${host}`)) return true;
  }
  return false;
}

function isBlockedHost(host) {
  return /(^|\.)(google|bing|duckduckgo|yahoo|facebook|instagram|linkedin|x|twitter|youtube|tiktok|pinterest|reddit)\./.test(host)
    || /wikipedia\.org$|wikimedia\.org$/.test(host);
}

function takeWrapped(items, start, limit) {
  if (!items.length || limit <= 0) return [];
  const count = Math.min(limit, items.length);
  return Array.from({ length: count }, (_, index) => items[(start + index) % items.length]);
}

async function loadSourceRegistries(directory) {
  const names = (await readdir(directory))
    .filter((name) => /^candidate-photo-source-registry(?:-[a-z0-9-]+)?\.json$/i.test(name))
    .sort();
  const registries = await Promise.all(names.map((name) => readJson(path.join(directory, name))));
  return registries.flatMap((entries) => Array.isArray(entries) ? entries : []);
}

async function safeFetch(url, init = {}) {
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      ...init,
      headers: { "user-agent": USER_AGENT, accept: "text/html,*/*;q=0.8", ...(init.headers ?? {}) },
    });
  } catch {
    return null;
  }
}

async function runPool(items, concurrency, worker) {
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) await worker(items[index++]);
  });
  await Promise.all(runners);
}

function hostOf(value) { try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ""); } catch { return null; } }
function normalizeHost(value) { return String(value || "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]; }
function absoluteUrl(value, base) { try { const url = new URL(value, base); return /^https?:$/.test(url.protocol) ? url.toString() : null; } catch { return null; } }
function stripHtml(value) { return String(value || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z0-9#]+;/gi, " "); }
function normalize(value) { return String(value || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
function dedupeBy(items, keyFn) { const seen = new Set(); return items.filter((item) => { const key = keyFn(item); if (seen.has(key)) return false; seen.add(key); return true; }); }
async function readJson(filePath) { return JSON.parse(await readFile(filePath, "utf8")); }
async function readJsonIfExists(filePath) { try { return await readJson(filePath); } catch { return null; } }
