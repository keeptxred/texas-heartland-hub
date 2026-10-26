#!/usr/bin/env node
/**
 * Read-only check: retired KeepTXRed /news URLs must not appear as live
 * navigation links on currently submitted pages.
 * Uses the authoritative Supabase registry and live XML sitemaps.
 */
import { createClient } from "@supabase/supabase-js";
import { mkdir,writeFile } from "node:fs/promises";
const project="ftkznprjljkhymknvhye";
const key=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
if(!key)throw Error("Missing server credential; cannot verify retired links");
const db=createClient("https://"+project+".supabase.co",key,{auth:{persistSession:false,autoRefreshToken:false}});
const registry=[];
for(let offset=0;offset<2500;offset+=500){
 const {data,error}=await db.from("article_url_registry").select("slug,recovery_status").range(offset,offset+499);
 if(error)throw Error(error.message);
 registry.push(...data||[]);
 if((data||[]).length<500)break;
}
const retired=new Set(registry.filter(x=>x.recovery_status==="retired_low_value").map(x=>x.slug));
if(retired.size<90||retired.size>500)throw Error("Unexpected retired registry size "+retired.size);
const origin="https://keeptxred.com";
let requests=0;const failures=[];
const request=async url=>{
 if(++requests>5000)throw Error("Link verification request limit exceeded");
 const r=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{accept:"text/html,application/xml", "user-agent":"KTR-Retired-Link-Audit/1.0"}});
 if(!r.ok)throw Error("HTTP "+r.status+" at "+url);
 return r.text();
};
const locs=xml=>[...xml.matchAll(/<loc\\b[^>]*>([^<]+)<\\/loc>/gi)].map(m=>m[1].replace(/&amp;/g,"&"));
const pages=new Set();const queue=[origin+"/sitemap.xml"];const seen=new Set();
while(queue.length){
 const sitemap=queue.shift();if(seen.has(sitemap))continue;
 if(seen.size>=100)throw Error("Sitemap recursion limit");
 seen.add(sitemap);
 const xml=await request(sitemap);
 for(const raw of locs(xml)){
  const u=new URL(raw,origin);
  if(u.hostname!=="keeptxred.com")throw Error("Cross-domain sitemap entry "+u.href);
  if(/\\.xml$/i.test(u.pathname)&&/sitemap/i.test(u.pathname))queue.push(u.href);
  else pages.add(u.href);
 }
 if(pages.size>2000)throw Error("Page scan limit; refusing partial result");
}
let cursor=0,values=[...pages];
const extractHref=html=>[...html.matchAll(/\\bhref\\s*=\\s*([\"'])([^\"']+)\\1/gi)].map(m=>m[2]);
await Promise.all(Array.from({length:10},async()=>{
 while(cursor<values.length){
  const url=values[cursor++];
  try {
   const html=await request(url);
   for(const href of extractHref(html)){
    let loc;try{loc=new URL(href,url)}catch{continue}
    if(!["keeptxred.com","www.keeptxred.com"].includes(loc.hostname))continue;
    const m=loc.pathname.match(/^\\/news\\/([^/]+)\\/?$/);
    if(!m)continue;
    let slug=m[1];try{slug=decodeURIComponent(slug)}catch{}
    if(retired.has(slug))failures.push({source:url,retiredSlug:slug,href});
   }
  } catch(e){failures.push({source:url,error:String(e)})}
 }
}));
const report={checkedAt:new Date().toISOString(),registryRows:registry.length,retiredCount:retired.size,sitemaps:seen.size,currentPages:values.length,requests,failures};
await mkdir("artifacts",{recursive:true});await writeFile("artifacts/retired-news-links.json",JSON.stringify(report,null,2));
console.log("RETIRED_INTERNAL_LINKS "+JSON.stringify({registryRows:report.registryRows,retiredCount:report.retiredCount,sitemaps:report.sitemaps,currentPages:report.currentPages,requests:report.requests,failures:report.failures.length}));
for(const f of failures.slice(0,100))console.log("RETIRED_LINK_ISSUE "+JSON.stringify(f));
if(failures.length)process.exitCode=1;
