#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-texas-archives-report.json");
const USER_AGENT = "KeepTXRedCandidatePhotoBot/2.0 (+https://keeptxred.com)";
const MAX_CANDIDATES = 24;
const CONCURRENCY = 3;

const [candidates, manifest] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
]);

const approved = new Set(
  manifest.filter((entry) => entry.usageStatus === "approved" && /^https:\/\//i.test(entry.imageUrl || ""))
    .map((entry) => entry.candidateId)
);

const queue = candidates
  .filter((candidate) => !approved.has(candidate.id))
  .sort(prioritySort)
  .slice(0, MAX_CANDIDATES);

const findings = [];
const failures = [];

await runPool(queue, CONCURRENCY, async (candidate) => {
  try {
    for (const source of sourcesFor(candidate)) {
      const urls = await duckDuckGoSearch(source.query);
      for (const url of urls) {
        if (!urlMatchesDomain(url, source.domain)) continue;
        findings.push({
          candidateId: candidate.id,
          name: candidate.fullName,
          raceId: candidate.primaryRaceId,
          party: candidate.party,
          sourceDomain: source.domain,
          sourceClass: source.sourceClass,
          url,
          status: "needs-item-level-identity-and-rights-review",
          rightsRule: source.rightsRule,
        });
      }
    }
  } catch (error) {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, reason: String(error?.message ?? error) });
  }
});

const deduped = dedupeBy(findings, (item) => `${item.candidateId}|${item.url}`);
const byDomain = {};
for (const item of deduped) byDomain[item.sourceDomain] = (byDomain[item.sourceDomain] || 0) + 1;

await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  purpose: "Review-only candidate portrait discovery across newly registered Texas and national archival repositories.",
  candidateCount: candidates.length,
  missingCandidateCount: candidates.length - approved.size,
  searchedCandidateCount: queue.length,
  sourceDomains: ["texashistory.unt.edu", "tsl.texas.gov", "dp.la"],
  findingCount: deduped.length,
  findingsByDomain: byDomain,
  findings: deduped,
  failures,
}, null, 2)}\n`);

console.log(`Texas archive discovery searched ${queue.length} candidates and produced ${deduped.length} review candidate(s).`);
console.log("No archival image is auto-approved; every result requires item-level identity and rights verification.");

function sourcesFor(candidate) {
  const name = `\"${candidate.fullName}\"`;
  const context = raceContext(candidate.primaryRaceId);
  return [
    {
      domain: "texashistory.unt.edu",
      sourceClass: "texas-history-digital-archive",
      query: `site:texashistory.unt.edu ${name} Texas ${context} photograph portrait`,
      rightsRule: "Portal rights vary by item and collection partner; verify the item and holding institution before reuse.",
    },
    {
      domain: "tsl.texas.gov",
      sourceClass: "texas-state-library-and-archives",
      query: `site:tsl.texas.gov ${name} Texas ${context} portrait photograph archives`,
      rightsRule: "TSLAC agency-created web works and collection items have different rights; verify the exact record before reuse.",
    },
    {
      domain: "dp.la",
      sourceClass: "digital-public-library-image-index",
      query: `site:dp.la ${name} Texas ${context} portrait photograph`,
      rightsRule: "Use DPLA as an index; verify standardized rights and the originating institution record before reuse.",
    },
  ];
}

async function duckDuckGoSearch(query) {
  const response = await safeFetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
  if (!response?.ok) return [];
  const html = await response.text();
  const links = [];
  for (const match of html.matchAll(/class=["']result__a["'][^>]+href=["']([^"']+)["']/gi)) {
    const decoded = decodeSearchRedirect(match[1]);
    if (decoded) links.push(decoded);
  }
  return [...new Set(links)].slice(0, 6);
}

function decodeSearchRedirect(value) {
  try {
    const url = new URL(value, "https://html.duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : /^https?:/i.test(url.toString()) ? url.toString() : null;
  } catch { return null; }
}

function urlMatchesDomain(value, domain) {
  try {
    const host = new URL(value).hostname.toLowerCase().replace(/^www\./, "");
    return host === domain || host.endsWith(`.${domain}`);
  } catch { return false; }
}

function prioritySort(a, b) {
  const score = (candidate) => {
    const race = candidate.primaryRaceId || "";
    let value = 0;
    if (candidate.featured) value -= 100;
    if (/governor|lieutenant-governor|attorney-general|comptroller|land-commissioner|agriculture-commissioner|railroad-commissioner|us-senate/.test(race)) value -= 80;
    if (/supreme-court|court-of-criminal-appeals|state-board-of-education/.test(race)) value -= 60;
    if (/us-house|texas-senate/.test(race)) value -= 40;
    return value;
  };
  return score(a) - score(b) || String(a.primaryRaceId || "").localeCompare(String(b.primaryRaceId || "")) || a.fullName.localeCompare(b.fullName);
}

function raceContext(raceId = "") {
  return String(raceId).replace(/^race-2026-/, "").replace(/-/g, " ");
}

async function safeFetch(url) {
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
      headers: { "user-agent": USER_AGENT, accept: "text/html,*/*;q=0.8" },
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

function dedupeBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}
