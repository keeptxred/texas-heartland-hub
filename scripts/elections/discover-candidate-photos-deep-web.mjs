#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT = path.join(ROOT, "artifacts/elections/candidate-photo-deep-web-report.json");
const UA = "KeepTXRedCandidatePhotoBot/3.1 (+https://keeptxred.com)";
const concurrency = 4;

const [candidates, manifest] = await Promise.all([readJson(CANDIDATES), readJson(MANIFEST)]);
const byId = new Map(manifest.map(x => [x.candidateId, x]));
const queue = candidates.filter(c => byId.get(c.id)?.usageStatus !== "approved");
const found = [], failures = [], sourceStats = {};

await pool(queue, concurrency, async candidate => {
  const entry = await discover(candidate);
  if (entry) {
    byId.set(candidate.id, entry);
    found.push(entry);
    sourceStats[entry.discoverySource] = (sourceStats[entry.discoverySource] || 0) + 1;
  } else failures.push({ candidateId: candidate.id, name: candidate.fullName, raceId: candidate.primaryRaceId });
});

const merged = [...byId.values()].sort((a,b)=>a.candidateId.localeCompare(b.candidateId));
await mkdir(path.dirname(REPORT), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(merged, null, 2) + "\n");
await writeFile(REPORT, JSON.stringify({ generatedAt:new Date().toISOString(), scanned:queue.length, discovered:found.length, approvedTotal:merged.filter(x=>x.usageStatus==="approved").length, sourceStats, failures }, null, 2) + "\n");
console.log(`Deep-web discovery added ${found.length} portraits.`);

async function discover(c) {
  const name = c.fullName.replace(/\s+/g," ").trim();
  const race = humanRace(c.primaryRaceId || "");
  const variants = nameVariants(name);
  const queries = [];
  for (const n of variants) {
    queries.push(
      `\"${n}\" Texas ${race} candidate photo`,
      `\"${n}\" Texas election headshot`,
      `\"${n}\" candidate questionnaire Texas`,
      `\"${n}\" voter guide Texas PDF`,
      `\"${n}\" endorsement Texas election`,
      `\"${n}\" campaign Facebook Texas`,
      `\"${n}\" YouTube campaign Texas`,
      `\"${n}\" Flickr Texas candidate`,
      `\"${n}\" site:archive.org Texas election`,
      `\"${n}\" site:issuu.com voter guide Texas`,
      `\"${n}\" site:fliphtml5.com voter guide Texas`,
      `\"${n}\" site:documentcloud.org Texas election`,
      `\"${n}\" site:texasbar.com OR site:avvo.com OR site:martindale.com`,
      `\"${n}\" site:youtube.com/@ candidate Texas`,
      `\"${n}\" site:flickr.com Texas politics`,
      `\"${n}\" site:facebook.com Texas campaign`,
      `\"${n}\" site:instagram.com Texas candidate`
    );
  }
  const urls = [];
  for (const q of queries.slice(0,32)) {
    for (const u of await multiSearch(q)) if (!urls.includes(u)) urls.push(u);
    if (urls.length >= 60) break;
  }
  for (const url of urls.slice(0,60)) {
    const page = await fetchText(url);
    if (!page || !matches(page.text, c, race)) continue;
    for (const image of extractImages(page.text, page.url)) {
      if (!portraitish(image, c)) continue;
      if (!(await validImage(image.url))) continue;
      return makeEntry(c, image.url, page.url, classify(page.url));
    }
  }
  return null;
}

async function multiSearch(q) {
  const endpoints = [
    `https://www.google.com/search?q=${encodeURIComponent(q)}&udm=2`,
    `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    `https://search.brave.com/search?q=${encodeURIComponent(q)}&source=web`,
    `https://www.startpage.com/sp/search?query=${encodeURIComponent(q)}`,
    `https://www.ecosia.org/search?q=${encodeURIComponent(q)}`,
    `https://www.qwant.com/?q=${encodeURIComponent(q)}&t=web`,
    `https://r.jina.ai/http://www.google.com/search?q=${encodeURIComponent(q)}`
  ];
  const out=[];
  for (const endpoint of endpoints) {
    const r = await fetchText(endpoint);
    if (!r) continue;
    for (const u of extractLinks(r.text, r.url)) if (!out.includes(u)) out.push(u);
    if (out.length >= 15) break;
  }
  return out.slice(0,15);
}

function extractLinks(html, base) {
  const out=[];
  for (const m of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const u = absolute(m[1], base);
    if (!u || /google\.|startpage\.|ecosia\.|qwant\.|brave\.com|javascript:|accounts\./i.test(u)) continue;
    if (/^https?:/i.test(u)) out.push(u);
  }
  for (const m of html.matchAll(/https?:\/\/[^\s"'<>]+/gi)) if (!out.includes(m[0])) out.push(m[0]);
  return [...new Set(out)].slice(0,30);
}

function extractImages(html, base) {
  const out=[];
  const pats=[
    /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["']/gi,
    /<img[^>]+(?:src|data-src|data-lazy-src|data-original)=["']([^"']+)["'][^>]*>/gi,
    /"(?:image|thumbnailUrl|contentUrl)"\s*:\s*"([^"]+)"/gi
  ];
  for (const p of pats) for (const m of html.matchAll(p)) {
    const u=absolute(m[1].replace(/\\u002F/g,"/"),base); if(u) out.push({url:u,text:m[0]});
  }
  return [...new Map(out.map(x=>[x.url,x])).values()].slice(0,80);
}

function matches(html,c,race){
  const text=strip(html).toLowerCase();
  const full=c.fullName.toLowerCase();
  const last=(c.lastName||full.split(/\s+/).at(-1)).toLowerCase();
  if(!text.includes(full)&&!text.includes(last)) return false;
  const tokens=race.toLowerCase().split(/[^a-z0-9]+/).filter(x=>x.length>3);
  return /texas|candidate|election|voter|campaign|district|judge|representative|senator|board/.test(text) && (!tokens.length||tokens.some(t=>text.includes(t)));
}

function portraitish(img,c){
  const h=`${img.url} ${img.text}`.toLowerCase();
  if(/logo|icon|favicon|banner|header|footer|seal|flag|map|district|placeholder|default|sprite|group|crowd|event|adserver|pixel|tracking/.test(h)) return false;
  if(/headshot|portrait|profile|candidate|bio|avatar|member|official|speaker|author|person/.test(h)) return true;
  return nameVariants(c.fullName).some(n=>normalize(h).includes(normalize(n)));
}

async function validImage(url){
  try{
    const r=await fetch(url,{headers:{"user-agent":UA,accept:"image/*,*/*;q=.8",Range:"bytes=0-65535"},redirect:"follow",signal:AbortSignal.timeout(15000)});
    if(!r.ok&&r.status!==206)return false;
    const ct=r.headers.get("content-type")||""; if(!ct.startsWith("image/"))return false;
    const len=Number(r.headers.get("content-length")||0); return !len||len>=6000;
  }catch{return false;}
}

async function fetchText(url){
  try{
    const r=await fetch(url,{headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml,application/pdf;q=.8,*/*;q=.5"},redirect:"follow",signal:AbortSignal.timeout(18000)});
    if(!r.ok)return null;
    const ct=r.headers.get("content-type")||"";
    if(ct.includes("pdf")){
      const prox=`https://r.jina.ai/http://${new URL(r.url).host}${new URL(r.url).pathname}${new URL(r.url).search}`;
      const p=await fetch(prox,{headers:{"user-agent":UA},signal:AbortSignal.timeout(20000)}); if(!p.ok)return null;
      return {url:r.url,text:await p.text()};
    }
    return {url:r.url,text:await r.text()};
  }catch{return null;}
}

function makeEntry(c,imageUrl,sourceUrl,kind){return {candidateId:c.id,imageUrl,sourceUrl,altText:`Portrait of ${c.fullName}`,credit:credit(sourceUrl),license:null,permissionBasis:"Publicly published portrait used for editorial candidate identification with source attribution.",usageStatus:"approved",discoveredAt:new Date().toISOString(),discoveryMethod:"deep-web-document-and-image-search",discoverySource:kind};}
function classify(u){const h=new URL(u).hostname.toLowerCase();if(/youtube/.test(h))return"youtube";if(/flickr/.test(h))return"flickr";if(/archive|issuu|fliphtml5|documentcloud/.test(h))return"document-guide";if(/facebook|instagram/.test(h))return"social";if(/\.gov|\.us$/.test(h))return"government";if(/news|tribune|chronicle|statesman|star-telegram|impact/.test(h))return"local-media";return"deep-web";}
function credit(u){try{return new URL(u).hostname.replace(/^www\./,"")}catch{return"Public candidate source"}}
function humanRace(id){return id.replace(/^race-2026-/,"").replace(/-/g," ");}
function nameVariants(n){const a=[n,n.replace(/\b(JR\.?|SR\.?|II|III|IV)\b/gi,"").replace(/\s+/g," ").trim(),n.replace(/\./g,"")];return [...new Set(a.filter(Boolean))];}
function normalize(s){return String(s).toLowerCase().replace(/[^a-z0-9]/g,"");}
function strip(s){return String(s).replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/gi," ");}
function absolute(v,b){try{if(!v||/^data:|^blob:/i.test(v))return null;return new URL(v,b).toString()}catch{return null}}
async function readJson(p){return JSON.parse(await readFile(p,"utf8"));}
async function pool(items,n,fn){let i=0;await Promise.all(Array.from({length:n},async()=>{while(i<items.length){const x=items[i++];await fn(x)}}));}
