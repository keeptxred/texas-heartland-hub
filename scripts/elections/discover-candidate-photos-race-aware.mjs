#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-race-aware-report.json");
const CACHE_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-source-cache.json");
const USER_AGENT = "Mozilla/5.0 (compatible; KeepTXRedCandidatePhotoBot/3.0; +https://keeptxred.com)";
const CONCURRENCY = 4;

const [candidates, manifest, cache] = await Promise.all([
  readJson(CANDIDATES_PATH), readJson(MANIFEST_PATH), readJson(CACHE_PATH, {}),
]);
const manifestById = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) => !approved(manifestById.get(candidate.id)));
const discoveries = [];
const failures = [];
const sourceStats = {};

await pool(queue, CONCURRENCY, async (candidate) => {
  try {
    const result = await discover(candidate);
    if (result) {
      manifestById.set(candidate.id, result);
      discoveries.push(result);
      sourceStats[result.discoverySource] = (sourceStats[result.discoverySource] || 0) + 1;
    } else failures.push({ candidateId: candidate.id, name: candidate.fullName, raceId: candidate.primaryRaceId });
  } catch (error) {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, error: String(error?.message || error) });
  }
});

const merged = [...manifestById.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(MANIFEST_PATH, JSON.stringify(merged, null, 2) + "\n");
await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
await writeFile(REPORT_PATH, JSON.stringify({
  generatedAt: new Date().toISOString(),
  candidateCount: candidates.length,
  approvedPhotoCount: merged.filter(approved).length,
  discoveredPhotoCount: discoveries.length,
  coveragePercent: Number((merged.filter(approved).length / candidates.length * 100).toFixed(2)),
  sourceStats,
  failures,
}, null, 2) + "\n");
console.log(`Race-aware discovery added ${discoveries.length} portraits.`);

async function discover(candidate) {
  const queries = buildQueries(candidate);
  const pages = [];
  for (const query of queries) {
    const key = normalize(query);
    let urls = cache[key];
    if (!Array.isArray(urls)) {
      urls = dedupe([...(await bingHtml(query)), ...(await yahooHtml(query)), ...(await mojeek(query)), ...(await braveHtml(query))]).slice(0, 20);
      cache[key] = urls;
    }
    for (const url of urls) {
      const kind = classify(url);
      if (kind) pages.push({ url, kind });
    }
    if (pages.length >= 40) break;
  }
  for (const source of rank(dedupeBy(pages, (x) => x.url))) {
    const entry = await inspect(candidate, source);
    if (entry) return entry;
  }
  return null;
}

function buildQueries(candidate) {
  const name = `\"${candidate.fullName}\"`;
  const race = String(candidate.primaryRaceId || "").replace(/^race-2026-/, "").replaceAll("-", " ");
  const district = race.match(/(?:house|senate|congress|education)\s+(\d+)/)?.[1];
  const party = candidate.party || "";
  const q = [
    `${name} Texas 2026 candidate photo`,
    `${name} ${race} campaign`,
    `${name} ${party} Texas candidate`,
    `${name} voter guide Texas`,
    `${name} endorsement questionnaire Texas`,
    `site:vote411.org ${name}`,
    `site:communityimpact.com ${name} candidate`,
    `site:texastribune.org ${name} election`,
    `site:transparencyusa.org ${name} Texas`,
    `site:ballotpedia.org ${name}`,
    `site:facebook.com ${name} for Texas`,
    `site:instagram.com ${name} Texas candidate`,
    `site:x.com ${name} Texas candidate`,
    `site:linkedin.com/in ${name} Texas`,
    `site:youtube.com ${name} Texas candidate`,
  ];
  if (/texas house/.test(race)) q.push(`Texas House District ${district} 2026 candidates`, `site:house.texas.gov ${name}`, `${name} state representative Texas`);
  if (/texas senate/.test(race)) q.push(`Texas Senate District ${district} 2026 candidates`, `site:senate.texas.gov ${name}`, `${name} state senator Texas`);
  if (/us house/.test(race)) q.push(`Texas Congressional District ${district} 2026 candidates`, `site:house.gov ${name}`);
  if (/state board of education/.test(race)) q.push(`Texas SBOE District ${district} candidate ${candidate.fullName}`, `site:tea.texas.gov ${name}`);
  if (/court|judge|justice/.test(race)) q.push(`${name} judge biography Texas`, `site:txcourts.gov ${name}`, `${name} attorney Texas`);
  return q;
}

async function inspect(candidate, source) {
  const res = await fetchSafe(source.url);
  if (!res?.ok || !(res.headers.get("content-type") || "").includes("text/html")) return null;
  const html = await res.text();
  const text = strip(html).toLowerCase();
  const last = normalize(candidate.lastName || "");
  if (!text.includes(candidate.fullName.toLowerCase()) && (!last || !normalize(text).includes(last))) return null;
  if (!/texas|candidate|election|district|representative|senator|judge|board of education/.test(text)) return null;
  for (const image of extractImages(html, res.url || source.url)) {
    if (!portrait(image, candidate)) continue;
    if (!(await validImage(image.url))) continue;
    return {
      candidateId: candidate.id,
      imageUrl: image.url,
      sourceUrl: res.url || source.url,
      altText: `Portrait of ${candidate.fullName}`,
      credit: credit(source.kind, res.url || source.url),
      license: null,
      permissionBasis: permission(source.kind),
      usageStatus: "approved",
      discoveredAt: new Date().toISOString(),
      discoveryMethod: "automated-race-aware-multi-engine-validation",
      discoverySource: source.kind,
    };
  }
  return null;
}

function extractImages(html, base) {
  const found = [];
  const patterns = [
    /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image|twitter:image:src)["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image|twitter:image:src)["']/gi,
    /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi,
  ];
  for (const pattern of patterns) for (const match of html.matchAll(pattern)) {
    const url = absolute(match[1], base); if (url) found.push({ url, tag: match[0] });
  }
  return dedupeBy(found, (x) => x.url).slice(0, 50);
}

function portrait(image, candidate) {
  const h = `${image.url} ${image.tag}`.toLowerCase();
  if (/logo|favicon|banner|header|footer|seal|flag|donate|yard|sign|event|map|placeholder|default|sprite|group|team|podcast|video|newsletter|ad-|advert/.test(h)) return false;
  if (/headshot|portrait|profile|candidate|avatar|bio|official|member|legislator|speaker/.test(h)) return true;
  return [candidate.firstName, candidate.lastName, candidate.preferredName].filter(Boolean).some((x) => normalize(h).includes(normalize(x)));
}

async function validImage(url) {
  const res = await fetchSafe(url, { headers: { Range: "bytes=0-65535", accept: "image/*,*/*;q=0.8" } });
  if (!res || (!res.ok && res.status !== 206)) return false;
  if (!(res.headers.get("content-type") || "").startsWith("image/")) return false;
  const len = Number(res.headers.get("content-length") || 0);
  return !len || len >= 7000;
}

async function bingHtml(q) { return searchHtml(`https://www.bing.com/search?q=${encodeURIComponent(q)}&count=20`, /<li class="b_algo"[\s\S]*?<a href="(https?:[^"#]+)"/gi); }
async function yahooHtml(q) { return searchHtml(`https://search.yahoo.com/search?p=${encodeURIComponent(q)}&n=20`, /<a[^>]+href="(https?:\/\/[^" ]+)"[^>]*>/gi); }
async function mojeek(q) { return searchHtml(`https://www.mojeek.com/search?q=${encodeURIComponent(q)}`, /<a[^>]+class="ob"[^>]+href="([^"]+)"/gi); }
async function braveHtml(q) { return searchHtml(`https://search.brave.com/search?q=${encodeURIComponent(q)}&source=web`, /href="(https?:\/\/[^" ]+)"/gi); }
async function searchHtml(url, pattern) {
  const res = await fetchSafe(url, { headers: { accept: "text/html" } }); if (!res?.ok) return [];
  const html = await res.text(); const urls = [];
  for (const m of html.matchAll(pattern)) { const u = decodeUrl(m[1]); if (u) urls.push(u); }
  return dedupe(urls).slice(0, 15);
}

function classify(url) {
  let host; try { host = new URL(url).hostname.toLowerCase(); } catch { return null; }
  if (/house\.texas\.gov|senate\.texas\.gov|tea\.texas\.gov/.test(host)) return "texas-government";
  if (/txcourts\.gov|\.tx\.us$/.test(host)) return "judicial";
  if (/house\.gov|senate\.gov/.test(host)) return "congress";
  if (/vote411|lwV|leagueofwomenvoters/i.test(host)) return "voter-guide";
  if (/communityimpact|texastribune|houstonchronicle|dallasnews|expressnews|kut|kera|statesman|star-telegram/.test(host)) return "news-voter-guide";
  if (/ballotpedia/.test(host)) return "ballotpedia";
  if (/transparencyusa|ethics\.state\.tx/.test(host)) return "campaign-finance";
  if (/facebook|instagram|x\.com|twitter|linkedin|youtube/.test(host)) return "social";
  if (/gop|republican|democrat|libertarian|greenparty/.test(host)) return "party";
  if (/\.gov$|\.us$/.test(host)) return "government";
  return "campaign-or-biography";
}
function rank(items) { const score = { "texas-government":100, judicial:99, congress:99, government:97, "campaign-or-biography":94, party:91, "voter-guide":90, ballotpedia:88, "news-voter-guide":84, "campaign-finance":82, social:78 }; return items.sort((a,b)=>(score[b.kind]||0)-(score[a.kind]||0)); }
function permission(kind) { return /government|judicial|congress/.test(kind) ? "Official public-sector portrait used for informational candidate identification with attribution." : "Public candidate-identification portrait used editorially with direct source attribution."; }
function credit(kind, url) { try { return `${kind}: ${new URL(url).hostname.replace(/^www\./, "")}`; } catch { return kind; } }
async function fetchSafe(url, init={}) { try { return await fetch(url, { redirect:"follow", signal:AbortSignal.timeout(16000), ...init, headers:{ "user-agent":USER_AGENT, ...(init.headers||{}) } }); } catch { return null; } }
function absolute(v,b){ if(!v||v.startsWith("data:")) return null; try{return new URL(v,b).toString();}catch{return null;} }
function decodeUrl(v){ try{const u=new URL(v.replaceAll("&amp;","&")); const target=u.searchParams.get("uddg")||u.searchParams.get("url")||u.searchParams.get("u"); return target?decodeURIComponent(target):u.toString();}catch{return null;} }
function strip(s){return s.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&\w+;/g," ");}
function normalize(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]/g,"");}
function approved(x){return x?.usageStatus==="approved"&&/^https?:\/\//.test(x.imageUrl||"");}
function dedupe(a){return [...new Set(a)];}
function dedupeBy(a,f){const s=new Set();return a.filter(x=>{const k=f(x);if(s.has(k))return false;s.add(k);return true;});}
async function pool(items,n,worker){let i=0;await Promise.all(Array.from({length:Math.min(n,items.length)},async()=>{while(i<items.length)await worker(items[i++]);}));}
async function readJson(p,fallback=[]){try{return JSON.parse(await readFile(p,"utf8"));}catch{return fallback;}}
