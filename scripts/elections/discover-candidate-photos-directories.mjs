#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const USER_AGENT = "KeepTXRedCandidatePhotoBot/1.0 (+https://keeptxred.com)";

const [candidates, manifest] = await Promise.all([readJson(CANDIDATES_PATH), readJson(MANIFEST_PATH)]);
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
let added = 0;

for (const candidate of candidates) {
  if (byId.get(candidate.id)?.usageStatus === "approved") continue;
  const sources = directorySources(candidate);
  for (const source of sources) {
    const discovered = await discover(candidate, source);
    if (!discovered) continue;
    byId.set(candidate.id, discovered);
    added += 1;
    break;
  }
}

const output = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await writeFile(MANIFEST_PATH, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Directory discovery added ${added} approved candidate portrait(s).`);

function directorySources(candidate) {
  const sources = [];
  const raceId = candidate.primaryRaceId ?? "";
  const house = raceId.match(/texas-house-(\d+)$/);
  const senate = raceId.match(/texas-senate-(\d+)$/);
  if (candidate.incumbencyType === "incumbent" && house) {
    sources.push({ kind: "texas-house", url: `https://house.texas.gov/members/member-page/?district=${house[1]}` });
  }
  if (candidate.incumbencyType === "incumbent" && senate) {
    sources.push({ kind: "texas-senate", url: `https://senate.texas.gov/member.php?d=${senate[1]}` });
  }
  const ballotpediaSlug = candidate.fullName
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv)\.?$/i, "")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("_");
  sources.push({ kind: "ballotpedia", url: `https://ballotpedia.org/${encodeURIComponent(ballotpediaSlug).replace(/%5F/g, "_")}` });
  return sources;
}

async function discover(candidate, source) {
  const response = await safeFetch(source.url);
  if (!response?.ok || !(response.headers.get("content-type") ?? "").includes("text/html")) return null;
  const html = await response.text();
  if (source.kind === "ballotpedia" && !pageMatchesCandidate(html, candidate)) return null;
  const images = extractImages(html, response.url || source.url);
  for (const image of images) {
    if (!looksLikeCandidatePhoto(image, candidate, source.kind)) continue;
    if (!(await validateImage(image.url))) continue;
    const government = source.kind.startsWith("texas-");
    return {
      candidateId: candidate.id,
      imageUrl: image.url,
      sourceUrl: response.url || source.url,
      altText: `Portrait of ${candidate.fullName}`,
      credit: government ? (source.kind === "texas-house" ? "Texas House of Representatives" : "Texas State Senate") : "Ballotpedia",
      license: null,
      permissionBasis: government
        ? "Official Texas government portrait used for informational candidate identification with source attribution."
        : "Candidate portrait sourced from the candidate's Ballotpedia profile and used for editorial identification with source attribution.",
      usageStatus: "approved",
      discoveredAt: new Date().toISOString(),
      discoveryMethod: "directory-source-validation",
    };
  }
  return null;
}

function extractImages(html, baseUrl) {
  const found = [];
  const metaPatterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
  ];
  for (const pattern of metaPatterns) {
    for (const match of html.matchAll(pattern)) pushImage(found, match[1], match[0], baseUrl);
  }
  for (const match of html.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+)["'][^>]*>/gi)) {
    pushImage(found, match[1], match[0], baseUrl);
  }
  const seen = new Set();
  return found.filter((item) => !seen.has(item.url) && seen.add(item.url)).slice(0, 30);
}

function pushImage(found, value, text, baseUrl) {
  if (!value || value.startsWith("data:")) return;
  try { found.push({ url: new URL(value, baseUrl).toString(), text }); } catch {}
}

function looksLikeCandidatePhoto(image, candidate, kind) {
  const text = `${image.url} ${image.text}`.toLowerCase();
  if (/logo|icon|favicon|banner|header|footer|seal|flag|map|district|donate|placeholder|default-avatar|social-share/.test(text)) return false;
  if (kind === "texas-house" && /members|member|photo|portrait|headshot/.test(text)) return true;
  if (kind === "texas-senate" && /members|member|img|photo|portrait|headshot/.test(text)) return true;
  if (/headshot|portrait|candidate|profile|biography|bio/.test(text)) return true;
  const last = String(candidate.lastName ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return last.length >= 3 && text.replace(/[^a-z0-9]/g, "").includes(last);
}

function pageMatchesCandidate(html, candidate) {
  const normalized = stripHtml(html).toLowerCase();
  const first = String(candidate.firstName ?? "").toLowerCase();
  const last = String(candidate.lastName ?? "").toLowerCase();
  return first.length > 1 && last.length > 1 && normalized.includes(first) && normalized.includes(last);
}

async function validateImage(url) {
  const response = await safeFetch(url, { headers: { Range: "bytes=0-65535" } });
  if (!response?.ok && response?.status !== 206) return false;
  const type = response.headers.get("content-type") ?? "";
  const length = Number(response.headers.get("content-length") ?? 0);
  return type.startsWith("image/") && (!length || length >= 8000);
}

async function safeFetch(url, init = {}) {
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
      ...init,
      headers: { "user-agent": USER_AGENT, accept: "text/html,image/*;q=0.9,*/*;q=0.8", ...(init.headers ?? {}) },
    });
  } catch { return null; }
}

function stripHtml(value) { return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "); }
async function readJson(filePath) { return JSON.parse(await readFile(filePath, "utf8")); }
