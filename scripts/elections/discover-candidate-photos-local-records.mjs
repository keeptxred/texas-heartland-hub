#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT = path.join(ROOT, "artifacts/elections/candidate-photo-local-records-report.json");
const UA = "KeepTXRedCandidatePhotoBot/5.0 (+https://keeptxred.com)";

const [candidates, manifest] = await Promise.all([
  readJson(CANDIDATES),
  readJson(MANIFEST),
]);
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) => byId.get(candidate.id)?.usageStatus !== "approved");
const found = [];
const failures = [];
const sourceStats = {};

await pool(queue, 4, async (candidate) => {
  const entry = await discover(candidate);
  if (entry) {
    byId.set(candidate.id, entry);
    found.push(entry);
    sourceStats[entry.discoverySource] = (sourceStats[entry.discoverySource] || 0) + 1;
  } else {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, raceId: candidate.primaryRaceId });
  }
});

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await mkdir(path.dirname(REPORT), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(merged, null, 2) + "\n");
await writeFile(REPORT, JSON.stringify({
  generatedAt: new Date().toISOString(),
  scanned: queue.length,
  discovered: found.length,
  approvedTotal: merged.filter((x) => x.usageStatus === "approved").length,
  sourceStats,
  failures,
}, null, 2) + "\n");
console.log(`Local-records discovery added ${found.length} portraits.`);

async function discover(candidate) {
  const race = humanRace(candidate.primaryRaceId || "");
  const district = districtToken(candidate.primaryRaceId || "");
  const party = candidate.party || "";
  const names = nameVariants(candidate.fullName);
  const queries = [];

  for (const name of names) {
    const context = ["Texas", race, district, party].filter(Boolean).join(" ");
    for (const tail of [
      "candidate biography photo",
      "candidate forum headshot",
      "election questionnaire portrait",
      "sample ballot voter guide",
      "official biography",
      "campaign media kit",
      "press release headshot",
      "endorsement profile",
      "board member biography",
      "attorney profile",
      "judge biography",
      "speaker biography",
      "faculty profile",
      "nonprofit leadership biography",
      "company leadership profile",
    ]) queries.push(`\"${name}\" ${context} ${tail}`);

    for (const domain of [
      "*.tx.us", "*.gov", "*.org", "*.edu",
      "co.*.tx.us", "countyclerkrecords.com", "sos.state.tx.us",
      "txcourts.gov", "txcourts.gov", "texasbar.com",
      "ballotpedia.org", "vote411.org", "votesmart.org",
      "communityimpact.com", "patch.com", "substack.com",
      "prnewswire.com", "businesswire.com", "globenewswire.com",
      "legacy.com", "archive.org", "webcache.googleusercontent.com",
    ]) queries.push(`\"${name}\" ${context} site:${domain}`);
  }

  const urls = [];
  for (const query of queries.slice(0, 72)) {
    for (const url of await searchAll(query)) {
      if (!urls.includes(url)) urls.push(url);
      if (urls.length >= 140) break;
    }
    if (urls.length >= 140) break;
  }

  const expanded = [];
  for (const url of urls.slice(0, 100)) {
    const page = await fetchText(url);
    if (!page || !matchesCandidate(page.text, candidate, race, district)) continue;
    expanded.push(page);
    for (const link of extractLinks(page.text, page.url)) {
      if (/bio|about|candidate|profile|team|leadership|media|press|news|endorsement|questionnaire|voter|election|official/i.test(link)) {
        const linked = await fetchText(link);
        if (linked && matchesCandidate(linked.text, candidate, race, district)) expanded.push(linked);
      }
      if (expanded.length >= 125) break;
    }
    if (expanded.length >= 125) break;
  }

  for (const page of expanded) {
    for (const image of extractImages(page.text, page.url)) {
      if (!portraitish(image, candidate)) continue;
      if (!(await validImage(image.url))) continue;
      return makeEntry(candidate, image.url, page.url, classify(page.url));
    }
  }
  return null;
}

async function searchAll(query) {
  const endpoints = [
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`,
    `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`,
    `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
    `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
    `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
    `https://www.mojeek.com/search?q=${encodeURIComponent(query)}`,
    `https://r.jina.ai/http://www.google.com/search?q=${encodeURIComponent(query)}`,
    `https://r.jina.ai/http://www.bing.com/search?q=${encodeURIComponent(query)}`,
  ];
  const out = [];
  for (const endpoint of endpoints) {
    const page = await fetchText(endpoint);
    if (!page) continue;
    for (const link of extractLinks(page.text, page.url)) {
      if (!out.includes(link)) out.push(link);
      if (out.length >= 24) break;
    }
    if (out.length >= 24) break;
  }
  return out;
}

function extractLinks(html, base) {
  const out = [];
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const url = absolute(match[1], base);
    if (!url || !/^https?:/i.test(url)) continue;
    if (/google\.|bing\.|yahoo\.|duckduckgo\.|brave\.com|mojeek\.com|javascript:|accounts\./i.test(url)) continue;
    out.push(url);
  }
  for (const match of html.matchAll(/https?:\/\/[^\s"'<>]+/gi)) out.push(match[0]);
  return [...new Set(out)].slice(0, 50);
}

function extractImages(html, base) {
  const found = [];
  const patterns = [
    /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["']/gi,
    /<img[^>]+(?:src|data-src|data-lazy-src|data-original|data-flickity-lazyload)=["']([^"']+)["'][^>]*>/gi,
    /"(?:image|thumbnailUrl|contentUrl|logo|photo)"\s*:\s*"([^"]+)"/gi,
    /background-image\s*:\s*url\(([^)]+)\)/gi,
  ];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const raw = match[1].replace(/^['"]|['"]$/g, "").replace(/\\u002F/g, "/");
      const url = absolute(raw, base);
      if (url) found.push({ url, text: match[0] });
    }
  }
  return [...new Map(found.map((item) => [item.url, item])).values()].slice(0, 120);
}

function matchesCandidate(html, candidate, race, district) {
  const text = strip(html).toLowerCase();
  const names = nameVariants(candidate.fullName).map((name) => name.toLowerCase());
  const last = (candidate.lastName || candidate.fullName.split(/\s+/).at(-1)).toLowerCase();
  const hasName = names.some((name) => text.includes(name)) || text.includes(last);
  if (!hasName) return false;
  const contextWords = [race, district, candidate.party, "texas", "candidate", "election", "district", "judge", "representative", "senator", "board"]
    .filter(Boolean)
    .flatMap((value) => String(value).toLowerCase().split(/[^a-z0-9]+/))
    .filter((word) => word.length > 3);
  return contextWords.some((word) => text.includes(word));
}

function portraitish(image, candidate) {
  const haystack = `${image.url} ${image.text}`.toLowerCase();
  if (/logo|icon|favicon|banner|header|footer|seal|flag|map|placeholder|default|sprite|group|crowd|event|sign|yard|merch|donate|pixel|tracking|advert/i.test(haystack)) return false;
  if (/headshot|portrait|profile|candidate|bio|avatar|member|official|speaker|author|person|team|leadership/i.test(haystack)) return true;
  return nameVariants(candidate.fullName).some((name) => normalize(haystack).includes(normalize(name)));
}

async function validImage(url) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": UA, accept: "image/*,*/*;q=.8", range: "bytes=0-65535" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok && response.status !== 206) return false;
    const type = response.headers.get("content-type") || "";
    if (!type.startsWith("image/")) return false;
    const length = Number(response.headers.get("content-length") || 0);
    return !length || length >= 6000;
  } catch {
    return false;
  }
}

async function fetchText(url) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/pdf;q=.8,*/*;q=.5" },
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") || "";
    if (type.includes("pdf")) {
      const parsed = new URL(response.url);
      const proxy = `https://r.jina.ai/http://${parsed.host}${parsed.pathname}${parsed.search}`;
      const converted = await fetch(proxy, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(20000) });
      if (!converted.ok) return null;
      return { url: response.url, text: await converted.text() };
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
    discoveryMethod: "local-public-records-and-biography-search",
    discoverySource: source,
  };
}

function classify(url) {
  const host = new URL(url).hostname.toLowerCase();
  if (/\.gov$|\.tx\.us$|txcourts|sos\.state\.tx/.test(host)) return "government-record";
  if (/\.edu$/.test(host)) return "education-profile";
  if (/county|cityof|isd\.|school|municipal|clerk|elections/.test(host)) return "local-government";
  if (/texasbar|avvo|martindale/.test(host)) return "professional-profile";
  if (/archive|legacy|prnewswire|businesswire|globenewswire/.test(host)) return "archive-or-press";
  if (/ballotpedia|vote411|votesmart/.test(host)) return "voter-guide";
  return "local-public-record";
}

function credit(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "Public source"; } }
function humanRace(id) { return id.replace(/^race-2026-/, "").replace(/-/g, " "); }
function districtToken(id) { const match = id.match(/(?:house|senate|district|board-of-education)-(\d+)/); return match ? `district ${match[1]}` : ""; }
function nameVariants(name) {
  const clean = name.replace(/\s+/g, " ").trim();
  const noSuffix = clean.replace(/\b(JR\.?|SR\.?|II|III|IV)\b/gi, "").replace(/\s+/g, " ").trim();
  const noPunctuation = clean.replace(/[.'’,-]/g, "").replace(/\s+/g, " ").trim();
  const parts = noSuffix.split(" ");
  const firstLast = parts.length > 1 ? `${parts[0]} ${parts.at(-1)}` : noSuffix;
  const initial = parts.length > 2 ? `${parts[0]} ${parts[1][0]} ${parts.at(-1)}` : firstLast;
  return [...new Set([clean, noSuffix, noPunctuation, firstLast, initial].filter(Boolean))];
}
function normalize(value) { return String(value).toLowerCase().replace(/[^a-z0-9]/g, ""); }
function strip(value) { return String(value).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " "); }
function absolute(value, base) { try { if (!value || /^data:|^blob:/i.test(value)) return null; return new URL(value, base).toString(); } catch { return null; } }
async function readJson(file) { return JSON.parse(await readFile(file, "utf8")); }
async function pool(items, size, fn) { let index = 0; await Promise.all(Array.from({ length: size }, async () => { while (index < items.length) await fn(items[index++]); })); }
