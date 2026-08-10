#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT = path.join(ROOT, "artifacts/elections/candidate-photo-deep-web-report.json");
const UA = "KeepTXRedCandidatePhotoBot/4.0 (+https://keeptxred.com)";

const candidates = JSON.parse(await readFile(CANDIDATES, "utf8"));
const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) => byId.get(candidate.id)?.usageStatus !== "approved");
const found = [];
const failures = [];
const sourceStats = {};

await pool(queue, 5, async (candidate) => {
  const result = await discover(candidate);
  if (!result) {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, raceId: candidate.primaryRaceId });
    return;
  }
  byId.set(candidate.id, result);
  found.push(result);
  sourceStats[result.discoverySource] = (sourceStats[result.discoverySource] || 0) + 1;
});

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await mkdir(path.dirname(REPORT), { recursive: true });
await writeFile(MANIFEST, `${JSON.stringify(merged, null, 2)}\n`);
await writeFile(REPORT, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  scanned: queue.length,
  discovered: found.length,
  approvedTotal: merged.filter((entry) => entry.usageStatus === "approved").length,
  sourceStats,
  failures,
}, null, 2)}\n`);
console.log(`Deep-web discovery added ${found.length} portraits.`);

async function discover(candidate) {
  const race = humanRace(candidate.primaryRaceId || "");
  const district = districtFromRace(candidate.primaryRaceId || "");
  const names = nameVariants(candidate.fullName || "");
  const queries = buildQueries(names, race, district, candidate.party);
  const pages = [];

  for (const query of queries.slice(0, 48)) {
    const results = await multiSearch(query);
    for (const url of results) if (!pages.includes(url)) pages.push(url);
    if (pages.length >= 90) break;
  }

  for (const url of pages.slice(0, 90)) {
    const page = await fetchText(url);
    if (!page || !matchesCandidate(page.text, candidate, race, district)) continue;

    const imageCandidates = extractImages(page.text, page.url);
    for (const image of imageCandidates) {
      if (!portraitish(image, candidate)) continue;
      if (!(await validImage(image.url))) continue;
      return makeEntry(candidate, image.url, page.url, classify(page.url));
    }

    for (const child of extractLikelyProfileLinks(page.text, page.url).slice(0, 8)) {
      const childPage = await fetchText(child);
      if (!childPage || !matchesCandidate(childPage.text, candidate, race, district)) continue;
      for (const image of extractImages(childPage.text, childPage.url)) {
        if (!portraitish(image, candidate)) continue;
        if (!(await validImage(image.url))) continue;
        return makeEntry(candidate, image.url, childPage.url, classify(childPage.url));
      }
    }
  }
  return null;
}

function buildQueries(names, race, district, party) {
  const domains = [
    "vote411.org", "ballotpedia.org", "votesmart.org", "ivoterguide.com", "transparencyusa.org",
    "followthemoney.org", "opensecrets.org", "texastribune.org", "communityimpact.com",
    "houstonchronicle.com", "dallasnews.com", "statesman.com", "expressnews.com",
    "star-telegram.com", "khou.com", "kprc2.com", "abc13.com", "wfaa.com", "ksat.com",
    "kxan.com", "fox4news.com", "cbsnews.com", "youtube.com", "flickr.com", "archive.org",
    "issuu.com", "documentcloud.org", "facebook.com", "instagram.com", "linkedin.com"
  ];
  const queries = [];
  for (const name of names) {
    const context = ["Texas", race, district, party, "candidate"].filter(Boolean).join(" ");
    queries.push(
      `"${name}" ${context} photo`,
      `"${name}" ${context} headshot`,
      `"${name}" ${context} portrait`,
      `"${name}" ${context} biography`,
      `"${name}" ${context} voter guide`,
      `"${name}" ${context} questionnaire filetype:pdf`,
      `"${name}" ${context} endorsement`,
      `"${name}" ${context} campaign website`,
      `"${name}" ${context} city council school board trustee judge representative senator`,
      `"${name}" ${context} county elections sample ballot`
    );
    for (const domain of domains) queries.push(`"${name}" ${context} site:${domain}`);
    queries.push(
      `"${name}" ${context} site:tx.us`,
      `"${name}" ${context} site:texas.gov`,
      `"${name}" ${context} site:k12.tx.us`,
      `"${name}" ${context} site:edu`,
      `"${name}" ${context} "meet the candidates"`,
      `"${name}" ${context} "candidate forum"`,
      `"${name}" ${context} "election guide"`
    );
  }
  return [...new Set(queries)];
}

async function multiSearch(query) {
  const endpoints = [
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    `https://www.google.com/search?udm=2&q=${encodeURIComponent(query)}`,
    `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
    `https://search.brave.com/search?q=${encodeURIComponent(query)}&source=web`,
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
    `https://www.mojeek.com/search?q=${encodeURIComponent(query)}`,
    `https://www.ecosia.org/search?q=${encodeURIComponent(query)}`,
    `https://www.qwant.com/?q=${encodeURIComponent(query)}&t=web`,
    `https://r.jina.ai/http://www.google.com/search?q=${encodeURIComponent(query)}`
  ];
  const out = [];
  for (const endpoint of endpoints) {
    const page = await fetchText(endpoint);
    if (!page) continue;
    for (const link of extractLinks(page.text, page.url)) if (!out.includes(link)) out.push(link);
    if (out.length >= 24) break;
  }
  return out.slice(0, 24);
}

function extractLinks(html, base) {
  const out = [];
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const url = absolute(decodeRedirect(match[1]), base);
    if (!url || isSearchOrNoise(url)) continue;
    out.push(url);
  }
  for (const match of html.matchAll(/https?:\/\/[^\s"'<>]+/gi)) {
    const url = decodeRedirect(match[0]);
    if (!isSearchOrNoise(url)) out.push(url);
  }
  return [...new Set(out)].slice(0, 40);
}

function extractLikelyProfileLinks(html, base) {
  const out = [];
  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const text = strip(match[2]).toLowerCase();
    if (!/bio|about|candidate|profile|meet|team|media|press|news|endorsement|questionnaire/.test(text)) continue;
    const url = absolute(match[1], base);
    if (url && !isSearchOrNoise(url)) out.push(url);
  }
  return [...new Set(out)];
}

function extractImages(html, base) {
  const out = [];
  const patterns = [
    /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["']/gi,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/gi,
    /<img[^>]+(?:src|data-src|data-lazy-src|data-original|data-image)=["']([^"']+)["'][^>]*>/gi,
    /"(?:image|imageUrl|thumbnailUrl|contentUrl|profileImage|photo)"\s*:\s*"([^"]+)"/gi,
    /url\(["']?([^"')]+\.(?:jpg|jpeg|png|webp)(?:\?[^"')]*)?)["']?\)/gi
  ];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const url = absolute(match[1].replace(/\\u002F/g, "/").replace(/&amp;/g, "&"), base);
      if (url) out.push({ url, text: match[0] });
    }
  }
  return [...new Map(out.map((item) => [item.url, item])).values()].slice(0, 120);
}

function matchesCandidate(html, candidate, race, district) {
  const text = strip(html).toLowerCase();
  const variants = nameVariants(candidate.fullName || "").map((name) => name.toLowerCase());
  const last = (candidate.lastName || variants[0]?.split(/\s+/).at(-1) || "").toLowerCase();
  if (!variants.some((name) => text.includes(name)) && (!last || !text.includes(last))) return false;
  const context = [race, district, candidate.party, "texas"].filter(Boolean).join(" ").toLowerCase();
  const tokens = context.split(/[^a-z0-9]+/).filter((token) => token.length > 3);
  return /candidate|campaign|election|voter|district|judge|representative|senator|trustee|commissioner|board|texas/.test(text)
    && (!tokens.length || tokens.some((token) => text.includes(token)));
}

function portraitish(image, candidate) {
  const haystack = `${image.url} ${image.text}`.toLowerCase();
  if (/logo|icon|favicon|banner|header|footer|seal|flag|map|district|placeholder|default|sprite|group|crowd|event|adserver|pixel|tracking|donate|yard-sign|merch/.test(haystack)) return false;
  if (/headshot|portrait|profile|candidate|bio|avatar|member|official|speaker|author|person|team/.test(haystack)) return true;
  return nameVariants(candidate.fullName || "").some((name) => normalize(haystack).includes(normalize(name)));
}

async function validImage(url) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": UA, accept: "image/*,*/*;q=.8", Range: "bytes=0-131071" },
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
    });
    if (!response.ok && response.status !== 206) return false;
    const type = response.headers.get("content-type") || "";
    if (!type.startsWith("image/")) return false;
    const length = Number(response.headers.get("content-length") || 0);
    return !length || length >= 5000;
  } catch {
    return false;
  }
}

async function fetchText(url) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/pdf;q=.8,*/*;q=.5" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") || "";
    if (type.includes("pdf")) {
      const parsed = new URL(response.url);
      const proxy = `https://r.jina.ai/http://${parsed.host}${parsed.pathname}${parsed.search}`;
      const converted = await fetch(proxy, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(25000) });
      return converted.ok ? { url: response.url, text: await converted.text() } : null;
    }
    return { url: response.url, text: await response.text() };
  } catch {
    return null;
  }
}

function makeEntry(candidate, imageUrl, sourceUrl, source) {
  return {
    candidateId: candidate.id,
    imageUrl,
    sourceUrl,
    altText: `Portrait of ${candidate.fullName}`,
    credit: credit(sourceUrl),
    license: null,
    permissionBasis: "Publicly published portrait used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveredAt: new Date().toISOString(),
    discoveryMethod: "deep-web-document-image-and-local-search",
    discoverySource: source,
  };
}

function classify(url) {
  const host = new URL(url).hostname.toLowerCase();
  if (/youtube/.test(host)) return "youtube";
  if (/flickr/.test(host)) return "flickr";
  if (/archive|issuu|fliphtml5|documentcloud/.test(host)) return "document-guide";
  if (/facebook|instagram|linkedin/.test(host)) return "social-profile";
  if (/\.gov|\.us$|texas\.gov|tx\.us/.test(host)) return "government";
  if (/news|tribune|chronicle|statesman|star-telegram|impact|khou|kprc|abc13|wfaa|ksat|kxan|fox4/.test(host)) return "local-media";
  if (/vote411|ivoterguide|ballotpedia|votesmart/.test(host)) return "voter-guide";
  return "deep-web";
}

function nameVariants(name) {
  const clean = name.replace(/\s+/g, " ").trim();
  const noSuffix = clean.replace(/\b(JR\.?|SR\.?|II|III|IV|V)\b/gi, "").replace(/\s+/g, " ").trim();
  const noPunctuation = clean.replace(/[.'’,-]/g, " ").replace(/\s+/g, " ").trim();
  const parts = noSuffix.split(" ").filter(Boolean);
  const firstLast = parts.length > 1 ? `${parts[0]} ${parts.at(-1)}` : noSuffix;
  const firstMiddleLast = parts.length > 2 ? `${parts[0]} ${parts[1][0]} ${parts.at(-1)}` : noSuffix;
  return [...new Set([clean, noSuffix, noPunctuation, firstLast, firstMiddleLast].filter(Boolean))];
}

function districtFromRace(id) {
  const match = id.match(/(?:house|senate|congress|education|district)-?(\d+)$/i);
  return match ? `district ${match[1]}` : "";
}
function humanRace(id) { return id.replace(/^race-2026-/, "").replace(/-/g, " "); }
function normalize(value) { return String(value).toLowerCase().replace(/[^a-z0-9]/g, ""); }
function strip(value) { return String(value).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " "); }
function absolute(value, base) { try { if (!value || /^(data|blob|javascript):/i.test(value)) return null; return new URL(value, base).toString(); } catch { return null; } }
function decodeRedirect(value) { try { const url = new URL(value, "https://example.com"); return url.searchParams.get("url") || url.searchParams.get("uddg") || url.searchParams.get("u") || value; } catch { return value; } }
function isSearchOrNoise(url) { return /google\.|bing\.|yahoo\.|duckduckgo\.|startpage\.|ecosia\.|qwant\.|brave\.com|mojeek\.com|javascript:|accounts\.|doubleclick|gstatic|googleusercontent/i.test(url); }
function credit(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "Public candidate source"; } }
async function pool(items, count, fn) { let index = 0; await Promise.all(Array.from({ length: count }, async () => { while (index < items.length) await fn(items[index++]); })); }
