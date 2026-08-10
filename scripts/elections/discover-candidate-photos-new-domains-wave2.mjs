#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const candidates=JSON.parse(await readFile(path.join(ROOT,'src/data/elections/2026/candidates.json'),'utf8'));
const manifestPath=path.join(ROOT,'src/data/elections/2026/candidate-photos.json');
const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
const reportPath=path.join(ROOT,'artifacts/elections/candidate-photo-new-domains-wave2-report.json');
const byId=new Map(manifest.map(x=>[x.candidateId,x]));
const blocked=new Set(manifest.flatMap(x=>[host(x.sourceUrl),host(x.imageUrl)]).filter(Boolean));
const claimed=new Set();
const missing=candidates.filter(c=>byId.get(c.id)?.usageStatus!=='approved');
const found=[]; const failures=[];
for (const c of missing){
  const hit=await discover(c);
  if(hit){byId.set(c.id,hit);found.push(hit);claimed.add(host(hit.sourceUrl));claimed.add(host(hit.imageUrl));}
  else failures.push({candidateId:c.id,name:c.fullName,raceId:c.primaryRaceId});
}
await mkdir(path.dirname(reportPath),{recursive:true});
await writeFile(manifestPath,JSON.stringify([...byId.values()].sort((a,b)=>a.candidateId.localeCompare(b.candidateId)),null,2)+'\n');
await writeFile(reportPath,JSON.stringify({generatedAt:new Date().toISOString(),scanned:missing.length,discovered:found.length,blockedDomains:[...blocked].sort(),newDomains:[...claimed].filter(Boolean).sort(),found,failures},null,2)+'\n');
console.log(`Wave 2 added ${found.length} portraits.`);

async function discover(c){
  const name=(c.fullName||'').trim();
  const race=(c.primaryRaceId||'').replace(/^race-2026-/,'').replaceAll('-',' ');
  const queries=[
    `\"${name}\" Texas candidate campaign website`,
    `\"${name}\" Texas candidate Facebook`,
    `\"${name}\" Texas candidate Instagram`,
    `\"${name}\" ${race} questionnaire`,
    `\"${name}\" ${race} voter guide pdf`,
    `\"${name}\" Texas endorsement`,
    `\"${name}\" Texas election forum`,
    `\"${name}\" Texas campaign finance`,
    `\"${name}\" Texas election 2026 photo`,
    `\"${name}\" Texas candidate archive`
  ];
  for(const q of queries){
    for(const url of await searchAll(q)){
      const d=host(url); if(!d||blocked.has(d)||claimed.has(d)||isSearch(d)) continue;
      const html=await get(url); if(!html||!matches(html,name)) continue;
      for(const image of images(html,url)){
        const id=host(image); if(!id||blocked.has(id)||claimed.has(id)||badImage(image)) continue;
        return {candidateId:c.id,imageUrl:image,sourceUrl:url,altText:`Portrait of ${name}`,credit:d,license:null,permissionBasis:'Publicly published candidate or biography portrait used for editorial identification with source attribution.',usageStatus:'approved',discoveredAt:new Date().toISOString(),discoveryMethod:'new-domain-wave2'};
      }
    }
  }
  return null;
}
async function searchAll(q){
  const endpoints=[
    `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
    `https://search.yahoo.com/search?p=${encodeURIComponent(q)}`,
    `https://www.mojeek.com/search?q=${encodeURIComponent(q)}`
  ];
  const out=[];
  for(const e of endpoints){const h=await get(e); if(h) out.push(...links(h,e));}
  return [...new Set(out)].slice(0,100);
}
async function get(url){try{const r=await fetch(url,{redirect:'follow',headers:{'user-agent':'Mozilla/5.0 KeepTXRedCandidatePhotoBot/5.1'}}); if(!r.ok)return ''; const t=r.headers.get('content-type')||''; if(!t.includes('text/html'))return ''; return await r.text();}catch{return '';}}
function links(h,b){return [...h.matchAll(/href=["']([^"']+)["']/gi)].map(m=>decode(m[1],b)).filter(Boolean);}
function images(h,b){const vals=[...h.matchAll(/(?:src|data-src|content)=["']([^"']+)["']/gi)].map(m=>decode(m[1],b)); return [...new Set(vals)].filter(u=>/^https?:/i.test(u));}
function decode(v,b){try{if(v.startsWith('//'))return 'https:'+v; if(v.startsWith('/url?q='))return decodeURIComponent(v.slice(7).split('&')[0]); return new URL(v,b).href;}catch{return null;}}
function matches(h,n){const s=h.toLowerCase(), parts=n.toLowerCase().replace(/[^a-z0-9 ]/g,'').split(/\s+/).filter(x=>x.length>2); return parts.length>=2&&parts.every(x=>s.includes(x));}
function badImage(u){return /(logo|icon|sprite|banner|favicon|seal|flag|placeholder|avatar-default|tracking|pixel)/i.test(u)||/\.(svg|gif)(\?|$)/i.test(u);}
function host(u){try{return new URL(u).hostname.replace(/^www\./,'').toLowerCase();}catch{return '';}}
function isSearch(d){return /(google|bing|yahoo|duckduckgo|brave|mojeek)\./i.test(d);}
