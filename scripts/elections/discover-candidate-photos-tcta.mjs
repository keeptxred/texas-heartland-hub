#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-tcta-report.json");
const USER_AGENT = "KeepTXRedCandidatePhotoBot/2.0 (+https://keeptxred.com)";
const LIST_PAGES = [
  "https://www.tcta.org/texasteachersvote/find-candidates/texas-house-candidates",
  "https://www.tcta.org/texasteachersvote/find-candidates/texas-house-candidates2",
  "https://www.tcta.org/texasteachersvote/find-candidates/texas-house-candidates3",
  "https://www.tcta.org/texasteachersvote/find-candidates/texas-house-candidates4",
];

const [candidates, manifest] = await Promise.all([readJson(CANDIDATES_PATH), readJson(MANIFEST_PATH)]);
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const missing = candidates.filter((candidate) =>
  /race-2026-texas-house-\d+$/.test(candidate.primaryRaceId || "") && byId.get(candidate.id)?.usageStatus !== "approved"
);

const profileLinks = await loadProfileLinks();
const discoveries = [];
const failures = [];

for (const candidate of missing) {
  const profileUrl = findProfile(candidate, profileLinks);
  if (!profileUrl) {
    failures.push({ candidateId: candidate.id, reason: "No matching TCTA candidate profile found." });
    continue;
  }

  const profile = await fetchText(profileUrl);
  if (!profile) {
    failures.push({ candidateId: candidate.id, profileUrl, reason: "TCTA profile could not be fetched." });
    continue;
  }

  const campaignUrl = extractCampaignWebsite(profile.html, profile.url);
  if (!campaignUrl) {
    failures.push({ candidateId: candidate.id, profileUrl, reason: "TCTA profile did not expose a campaign website." });
    continue;
  }

  const campaign = await fetchText(campaignUrl);
  if (!campaign || !pageMatchesCandidate(campaign.html, candidate)) {
    failures.push({ candidateId: candidate.id, profileUrl, campaignUrl, reason: "Campaign site could not be verified against candidate identity." });
    continue;
  }

  const images = extractImages(campaign.html, campaign.url);
  let selected = null;
  for (const image of images) {
    if (!looksLikeCandidateImage(image, candidate)) continue;
    if (await validateImage(image.url)) {
      selected = image;
      break;
    }
  }
  if (!selected) {
    failures.push({ candidateId: candidate.id, profileUrl, campaignUrl, reason: "No validated candidate image found on campaign site." });
    continue;
  }

  const entry = {
    candidateId: candidate.id,
    imageUrl: selected.url,
    sourceUrl: campaign.url,
    altText: `${candidate.fullName}, candidate for ${formatRace(candidate.primaryRaceId)}`,
    credit: `${candidate.fullName} campaign`,
    license: null,
    permissionBasis: "Candidate image published on the official campaign website identified through the Texas Classroom Teachers Association candidate directory, used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveredAt: new Date().toISOString(),
    discoveryMethod: "tcta-campaign-directory"
  };

  byId.set(candidate.id, entry);
  discoveries.push({ candidateId: candidate.id, profileUrl, campaignUrl: campaign.url, imageUrl: selected.url });
}

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await writeFile(MANIFEST_PATH, `${JSON.stringify(merged, null, 2)}\n`);
await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  missingTexasHouseCandidateCount: missing.length,
  tctaProfileCount: profileLinks.length,
  discoveredPhotoCount: discoveries.length,
  discoveries,
  failures
}, null, 2)}\n`);

console.log(`TCTA campaign-directory discovery added ${discoveries.length} approved candidate portrait(s).`);

async function loadProfileLinks() {
  const links = [];
  for (const page of LIST_PAGES) {
    const result = await fetchText(page);
    if (!result) continue;
    for (const match of result.html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const text = stripHtml(match[2]).trim();
      const url = absoluteUrl(match[1], result.url);
      if (!url || !text || !/\/texasteachersvote\/find-candidates\/texas-house-candidates/i.test(url)) continue;
      links.push({ text, url });
    }
  }
  return dedupeBy(links, (item) => item.url);
}

function findProfile(candidate, links) {
  const candidateName = normalize(candidate.fullName);
  const first = normalize(candidate.firstName || candidate.fullName.split(/\s+/)[0]);
  const last = normalize(candidate.lastName || candidate.fullName.split(/\s+/).at(-1));
  let best = null;
  let bestScore = 0;
  for (const link of links) {
    const text = normalize(link.text);
    let score = 0;
    if (text === candidateName) score = 100;
    else {
      if (last && text.includes(last)) score += 55;
      if (first && text.includes(first)) score += 35;
      if (candidateName.includes(text) || text.includes(candidateName)) score += 20;
    }
    if (score > bestScore) { best = link.url; bestScore = score; }
  }
  return bestScore >= 70 ? best : null;
}

function extractCampaignWebsite(html, baseUrl) {
  const websiteLabel = /Website:\s*<[^>]*>\s*<a[^>]+href=["']([^"']+)["']/i.exec(html);
  if (websiteLabel) return absoluteUrl(websiteLabel[1], baseUrl);
  const anchors = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  for (const anchor of anchors) {
    const url = absoluteUrl(anchor[1], baseUrl);
    if (!url) continue;
    const host = hostOf(url);
    if (!host || host.endsWith("tcta.org") || /facebook\.com|instagram\.com|x\.com|twitter\.com|youtube\.com/.test(host)) continue;
    if (/website|campaign|official/i.test(stripHtml(anchor[2]))) return url;
  }
  return null;
}

function pageMatchesCandidate(html, candidate) {
  const text = normalize(stripHtml(html));
  const first = normalize(candidate.firstName || candidate.fullName.split(/\s+/)[0]);
  const last = normalize(candidate.lastName || candidate.fullName.split(/\s+/).at(-1));
  return Boolean(last && text.includes(last) && (!first || text.includes(first)));
}

function extractImages(html, baseUrl) {
  const results = [];
  const metaPatterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/gi,
  ];
  for (const pattern of metaPatterns) for (const match of html.matchAll(pattern)) {
    const url = absoluteUrl(match[1], baseUrl); if (url) results.push({ url, text: match[0], priority: 0 });
  }
  for (const match of html.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi)) {
    const url = absoluteUrl(match[1], baseUrl); if (url) results.push({ url, text: match[0], priority: 1 });
  }
  return dedupeBy(results, (item) => item.url).sort((a, b) => a.priority - b.priority).slice(0, 50);
}

function looksLikeCandidateImage(image, candidate) {
  const haystack = normalize(`${image.url} ${image.text}`);
  if (/logo|icon|favicon|header|footer|banner|yard sign|endorsement|donate|map|district|event|group|team/.test(haystack)) return false;
  const first = normalize(candidate.firstName || candidate.fullName.split(/\s+/)[0]);
  const last = normalize(candidate.lastName || candidate.fullName.split(/\s+/).at(-1));
  if (/headshot|portrait|candidate|profile|bio|hero/.test(haystack)) return true;
  return Boolean((last && haystack.includes(last)) || (first && last && haystack.includes(first) && haystack.includes(last)));
}

async function validateImage(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "user-agent": USER_AGENT, accept: "image/*,*/*;q=0.8", Range: "bytes=0-65535" }
    });
    if (!response.ok && response.status !== 206) return false;
    const type = response.headers.get("content-type") || "";
    if (!type.startsWith("image/")) return false;
    const length = Number(response.headers.get("content-length") || 0);
    return !length || length >= 4000;
  } catch { return false; }
}

async function fetchText(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
      headers: { "user-agent": USER_AGENT, accept: "text/html,*/*;q=0.8" }
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") || "";
    if (!type.includes("text/html")) return null;
    return { html: await response.text(), url: response.url || url };
  } catch { return null; }
}

function formatRace(raceId = "") {
  return String(raceId).replace(/^race-2026-/, "").replace(/-/g, " ").replace(/texas house (\d+)/, "Texas House District $1");
}
function absoluteUrl(value, base) { try { return new URL(value, base).toString(); } catch { return null; } }
function hostOf(value) { try { return new URL(value).hostname.toLowerCase(); } catch { return null; } }
function stripHtml(value) { return String(value || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;|&#34;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/\s+/g, " "); }
function normalize(value) { return String(value || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
function dedupeBy(items, keyFn) { const seen = new Set(); return items.filter((item) => { const key = keyFn(item); if (seen.has(key)) return false; seen.add(key); return true; }); }
async function readJson(filePath) { return JSON.parse(await readFile(filePath, "utf8")); }
