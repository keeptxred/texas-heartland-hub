#!/usr/bin/env node
import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const candidates = JSON.parse(await readFile(path.join(ROOT,"src/data/elections/2026/candidates.json"),"utf8"));
const manifestPath = path.join(ROOT,"src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath,"utf8"));
const reportPath = path.join(ROOT,"artifacts/elections/candidate-photo-new-domains-report.json");
const byId = new Map(manifest.map(x=>[x.candidateId,x]));
const usedDomains = new Set(manifest.flatMap(x=>[host(x.sourceUrl),host(x.imageUrl)]).filter(Boolean));
const newlySeen = new Set();
const queue = candidates.filter(c=>byId.get(c.id)?.usageStatus!=="approved");
const found=[]; const failures=[];

await pool(queue,4,async c=>{
  const hit = await discover(c);
  if(hit){found.push(hit);newlySeen.add(host(hit.sourceUrl));}
  else failures.push({candidateId:c.id,name:c.fullName,raceId:c.primaryRaceId});
});

await mkdir(path.dirname(reportPath),{recursive:true});
await writeFile(reportPath,JSON.stringify({
  generatedAt:new Date().toISOString(),
  purpose:"Discover previously unused candidate-photo source domains without auto-approving identity, provenance, or reuse rights.",
  scanned:queue.length,
  discoveredReviewLeadCount:found.length,
  initiallyBlockedDomains:[...usedDomains].sort(),
  newDomains:[...newlySeen].sort(),
  found,
  failures
},null,2)+"\n");
console.log(`Unique-domain discovery found ${found.length} review lead(s) from ${newlySeen.size} previously unused domain(s).`);
console.log("No unique-domain discovery is auto-approved; identity, provenance, and reuse rights require verification first.");

async function discover(c){
  const name=c.fullName.replace(/\s+/g," ").trim();
  const race=(c.primaryRaceId||"").replace(/^race-2026-/,"").replace(/-/g," ");
  const queries=[
    `\"${name}\" Texas ${race} candidate portrait`,
    `\"${name}\" Texas election biography`,
    `\"${name}\" candidate forum Texas`,
    `\"${name}\" endorsement Texas`,
    `\"${name}\" voter guide`,
    `\"${name}\" campaign headshot`,
    `\"${name}\" Texas board biography`,
    `\"${name}\" Texas attorney profile`,
    `\"${name}\" Texas school district`,
    `\"${name}\" Texas chamber candidate`
  ];
  const pages=[];
  for(const q of queries){
    for(const u of await search(q)){
      const h=host(u); if(!h||usedDomains.has(h)||newlySeen.has(h)||pages.includes(u))continue;
      pages.push(u); if(pages.length>=80)break;
    }
    if(pages.length>=80)break;
  }
  for(const url of pages){
    const page=await fetchText(url); if(!page||!matches(page.text,c,race))continue;
    for(const img of extractImages(page.text,page.url)){
      const ih=host(img); if(!ih||usedDomains.has(ih)||newlySeen.has(ih))continue;
      if(!portraitish(img,c)||!(await validImage(img)))continue;
      return {
        candidateId:c.id,
        imageUrl:img,
        sourceUrl:page.url,
        altText:`Portrait lead for ${c.fullName}`,
        credit:host(page.url),
        license:null,
        permissionBasis:null,
        usageStatus:"unknown",
        reviewReason:"Previously unused domain discovery. Verify candidate identity, original provenance, and item-level reuse rights before approval.",
        discoveredAt:new Date().toISOString(),
        discoveryMethod:"unique-domain-web-search",
        discoverySource:"previously-unused-domain"
      };
    }
  }
  return null;
}

async function search(q){
  const endpoints=[
    `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
    `https://search.yahoo.com/search?p=${encodeURIComponent(q)}`,
    `https://www.mojeek.com/search?q=${encodeURIComponent(q)}`
  ];
  const out=[];
  for(const ep of endpoints){const r=await fetchText(ep);if(!r)continue;for(const m of r.text.matchAll(/href=["']([^"']+)["']/gi)){const u=abs(m[1],r.url);if(u&&/^https?:/i.test(u)&&!out.includes(u))out.push(u);}if(out.length>=25)break;}
  return out.slice(0,25);
}
function extractImages(html,base){const out=[];const pats=[/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["'][^>]+content=["']([^"']+)["']/gi,/<img[^>]+(?:src|data-src|data-lazy-src|data-original)=["']([^"']+)["']/gi,/"(?:image|thumbnailUrl|contentUrl)"\s*:\s*"([^"]+)"/gi];for(const p of pats)for(const m of html.matchAll(p)){const u=abs(m[1].replace(/\\u002F/g,"/"),base);if(u&&!out.includes(u))out.push(u);}return out.slice(0,100);}
function matches(html,c,race){const t=strip(html).toLowerCase();const n=c.fullName.toLowerCase();const last=(c.lastName||n.split(/\s+/).at(-1)).toLowerCase();return (t.includes(n)||t.includes(last))&&/texas|candidate|election|campaign|district|judge|representative|senator|board/.test(t)&&race.split(/[^a-z0-9]+/).filter(x=>x.length>3).some(x=>t.includes(x));}
function portraitish(u,c){const s=u.toLowerCase();if(/logo|icon|favicon|banner|header|seal|map|placeholder|default|sprite|group|crowd|event|adserver|pixel/.test(s))return false;return /headshot|portrait|profile|candidate|bio|avatar|member|official|speaker|author/.test(s)||normalize(s).includes(normalize(c.fullName));}
async function validImage(url){try{const r=await fetch(url,{headers:{"user-agent":"KeepTXRedCandidatePhotoBot/5.0",accept:"image/*,*/*;q=.8",Range:"bytes=0-65535"},redirect:"follow",signal:AbortSignal.timeout(15000)});if(!r.ok&&r.status!==206)return false;const ct=r.headers.get("content-type")||"";const len=Number(r.headers.get("content-length")||0);return ct.startsWith("image/")&&(!len||len>=6000);}catch{return false;}}
async function fetchText(url){try{const r=await fetch(url,{headers:{"user-agent":"KeepTXRedCandidatePhotoBot/5.0",accept:"text/html,application/xhtml+xml,*/*;q=.5"},redirect:"follow",signal:AbortSignal.timeout(16000)});if(!r.ok)return null;return {url:r.url,text:await r.text()};}catch{return null;}}
function host(u){try{return new URL(u).hostname.toLowerCase().replace(/^www\./,"");}catch{return null;}}
function abs(v,b){try{if(!v||/^data:|^blob:|^javascript:/i.test(v))return null;return new URL(v,b).toString();}catch{return null;}}
function normalize(s){return String(s).toLowerCase().replace(/[^a-z0-9]/g,"");}
function strip(s){return String(s).replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ");}
async function pool(items,n,fn){let i=0;await Promise.all(Array.from({length:n},async()=>{while(i<items.length)await fn(items[i++]);}));}
