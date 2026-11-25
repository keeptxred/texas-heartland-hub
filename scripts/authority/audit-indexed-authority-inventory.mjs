import { readFile, mkdir, writeFile } from "node:fs/promises";

const {records} = JSON.parse(await readFile(new URL("./indexed-authority-inventory.json", import.meta.url), "utf8"));
const { checks, dispositions } = JSON.parse(await readFile(new URL("./indexed-authority-content-evidence.json", import.meta.url), "utf8"));
const KTR = "https://keeptxred.com";
const checkById = new Map(checks.map(check => [check.id, check]));
const dispositionById = new Map(dispositions.map(item => [item.id, item]));
for (const group of [checks, dispositions]) {
  if (new Set(group.map(item => item.id)).size !== group.length ||
      group.some(item => records[item.id - 1]?.url !== item.url)) {
    throw Error("Content evidence must match the exact owner-supplied inventory.");
  }
}
for (const check of checks) {
  if (!Array.isArray(check.requiredText) || !Array.isArray(check.requiredLinks) ||
      !check.requiredText.length && !check.requiredLinks.length ||
      [...check.requiredText, ...check.requiredLinks].some(item => typeof item !== "string" || !item.trim())) {
    throw Error("Missing substantive acceptance markers for row " + check.id);
  }
}
const hosts = new Set(["keeptxred.com","www.keeptxred.com","texasdefined.com","www.texasdefined.com"]);
if (records.length !== 92 || new Set(records.map(r => r.url)).size !== 92 ||
  records.some((r,i) => r.id !== i+1 || !["keeptxred.com","www.keeptxred.com"].includes(new URL(r.url).hostname))) {
  throw Error("The fixed 92-row recovery inventory has changed; reconcile the owner checkpoint before running.");
}
if (process.argv.includes("--validate")) {
  console.log("Verified 92 distinct original URL records.");
  process.exit(0);
}
const decode = s => String(s).replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
  const n = parseInt(hex, 16);
  return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
}).replace(/&#(\d+);/g, (match, decimal) => {
  const n = Number(decimal);
  return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
}).replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ");
const normalizeMarker = s => String(s).normalize("NFKC").replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g," ").trim().toLowerCase();
const text = s => decode(String(s).replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim());
function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map(m => [m[1].toLowerCase(),decode(m[2] ?? m[3] ?? m[4])]));
}
function canonicalKey(raw, base) {
  try {
    const u = new URL(raw,base);
    if (!["http:","https:"].includes(u.protocol)) return null;
    u.hash = "";
    if (u.pathname !== "/") u.pathname = u.pathname.replace(/\/+$/,"");
    if (u.hostname === "www.keeptxred.com") u.hostname = "keeptxred.com";
    if (u.hostname === "www.texasdefined.com") u.hostname = "texasdefined.com";
    return u.href;
  } catch { return null; }
}
let requestCount = 0;
async function request(url) {
  let error;
  for (let attempt=0;attempt<3;attempt++) {
    if (++requestCount > 1200) throw Error("Request budget exhausted");
    try {
      const r = await fetch(url,{redirect:"manual",signal:AbortSignal.timeout(20000),headers:{"cache-control":"no-cache","user-agent":"KeepTXRed-Authority-Audit/1.0","connection":"close"}});
      if ((r.status === 429 || r.status >= 500) && attempt < 2) {
        await r.body?.cancel();
        await new Promise(resolve => setTimeout(resolve, 500*(attempt+1)));
        continue;
      }
      return r;
    } catch(e) { error=e; }
  }
  throw error ?? Error("Request retry limit");
}
async function sitemapInventory() {
  const queue=[KTR+"/sitemap.xml"], visited=new Set(), entries=new Set(), errors=[];
  while(queue.length && visited.size<100) {
    const url=queue.shift();
    if(visited.has(url)) continue;
    visited.add(url);
    try {
      const r=await request(url);
      if(r.status!==200) throw Error("HTTP "+r.status);
      const xml=await r.text();
      if(!/<(?:sitemapindex|urlset)\b/i.test(xml)) throw Error("Not a sitemap");
      for(const m of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)) {
        const u=new URL(decode(m[1].trim()));
        if(u.origin!==KTR) throw Error("Unexpected sitemap host "+u.origin);
        if (u.pathname.endsWith(".xml")) queue.push(u.href);
        else entries.add(u.href);
      }
    } catch(e) { errors.push({url,error:String(e)}); }
  }
  if(queue.length) errors.push({error:"Sitemap recursion limit"});
  if(!entries.size) errors.push({error:"No sitemap entries"});
  return {entries, errors, visited:visited.size};
}
const sitemap=await sitemapInventory();
async function probe(record) {
  let current=record.url;
  const hops=[], seen=new Set();
  const row={...record,hops,observations:[]};
  try {
    for(let i=0;i<7;i++) {
      const u=new URL(current);
      if(!hosts.has(u.hostname)||!["http:","https:"].includes(u.protocol)) throw Error("Unexpected redirect destination");
      if(seen.has(current)) throw Error("Redirect loop");
      seen.add(current);
      const r=await request(current);
      const location=r.headers.get("location");
      hops.push({url:current,status:r.status,location});
      if([301,302,303,307,308].includes(r.status)) {
        await r.body?.cancel();
        if(!location) throw Error("Redirect missing Location");
        current=new URL(location,current).href;
        continue;
      }
      row.finalUrl=current; row.status=r.status;
      row.sitemapSubmitted=sitemap.errors.length?null:sitemap.entries.has(current);
      row.originalSitemapSubmitted=sitemap.errors.length?null:sitemap.entries.has(record.url);
      row.headerRobots=r.headers.get("x-robots-tag")||"";
      row.contentType=r.headers.get("content-type")||"";
      if(r.status!==200) {
        await r.body?.cancel();
        row.disposition=[404,410].includes(r.status)?"not-found-observed":"unexpected-http";
        return row;
      }
      if(!row.contentType.includes("text/html")) {
        await r.body?.cancel();
        row.disposition="non-html";
        return row;
      }
      const html=await r.text();
      const head=html.match(/<head(?:\s[^>]*)?>[\s\S]*?<\/head>/i)?.[0]||"";
      const main=html.match(/<main(?:\s[^>]*)?>[\s\S]*?<\/main>/i)?.[0]||html.match(/<article(?:\s[^>]*)?>[\s\S]*?<\/article>/i)?.[0]||"";
      const visible=html.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi," ");
      const editorialMarkup=main.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi," ");
      row.title=text(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"");
      row.h1=[...visible.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>text(m[1]));
      row.canonicals=[...head.matchAll(/<link\b[^>]*>/gi)].map(m=>attrs(m[0])).filter(a=>/(?:^|\s)canonical(?:\s|$)/i.test(a.rel||"")).map(a=>a.href).filter(Boolean);
      const metas=[...head.matchAll(/<meta\b[^>]*>/gi)].map(m=>attrs(m[0]));
      row.description=metas.find(m=>m.name?.toLowerCase()==="description")?.content||"";
      row.metaRobots=metas.filter(m=>/^(robots|googlebot)$/i.test(m.name||"")).map(m=>m.content||"");
      row.noindex=/\b(?:noindex|none)\b/i.test([row.headerRobots,...row.metaRobots].join(" "));
      row.mainWords=main?text(editorialMarkup).split(/\s+/).filter(Boolean).length:null;
      row.schemaTypes=[];
      for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        if(attrs(m[1]).type!=="application/ld+json") continue;
        try{
          const data=JSON.parse(m[2]);
          const items=Array.isArray(data)?data:[data,...(Array.isArray(data["@graph"])?data["@graph"]:[])];
          for(const item of items) if(item?.["@type"]) row.schemaTypes.push(...[item["@type"]].flat());
        }catch{row.observations.push("invalid-json-ld");}
      }
      const links=new Set(), external=new Set();
      for(const m of editorialMarkup.matchAll(/<a\b[^>]*>/gi)) {
        const href=attrs(m[0]).href;
        if(!href)continue;
        const key=canonicalKey(href,current);
        if(!key) continue;
        if(hosts.has(new URL(key).hostname)) links.add(key);
        else external.add(key);
      }
      row.mainInternalLinks=[...links].sort();
      row.mainExternalLinks=[...external].sort();
      const check = checkById.get(record.id);
      if (check) {
        const content = normalizeMarker(text(editorialMarkup || visible));
        const observed = new Set([...links, ...external]);
        row.contentEvidence = {
          pendingRelease: Boolean(check.pendingRelease),
          missingText: check.requiredText.filter(marker => !content.includes(normalizeMarker(marker))),
          missingLinks: check.requiredLinks.filter(href => !observed.has(canonicalKey(href, current))),
        };
      }
      row.disposition=u.hostname.endsWith("texasdefined.com")?"cross-site-destination":row.noindex?"noindex-observed":"html-observed";
      if(row.canonicals.length!==1 || row.canonicals[0]!==current) row.observations.push("canonical-check-needed");
      if(!row.title || !row.description || row.h1.length!==1) row.observations.push("metadata-or-heading-check-needed");
      if(row.sitemapSubmitted&&row.noindex) row.observations.push("sitemap-noindex-conflict");
      if(row.h1.some(h=>/^(?:404\s*[-:]?\s*)?(?:page|article)?\s*not found[.!]?$/i.test(h))) row.observations.push("possible-soft-404");
      if(row.mainWords===null) row.observations.push("main-content-boundary-not-detected");
      return row;
    }
    throw Error("Redirect hop limit");
  }catch(e){return {...row,disposition:"transport-error",error:String(e)};}
}
const results=[];
for(let i=0;i<records.length;i+=4) results.push(...await Promise.all(records.slice(i,i+4).map(probe)));
const byTarget=new Map();
for(const row of results) {
  if(row.status!==200||!row.finalUrl)continue;
  const key=canonicalKey(row.finalUrl,row.finalUrl);
  if(!byTarget.has(key))byTarget.set(key,new Set());
}
for(const row of results) {
  if(!row.finalUrl||!row.mainInternalLinks)continue;
  const source=canonicalKey(row.finalUrl,row.finalUrl);
  for(const target of row.mainInternalLinks) if(target!==source&&byTarget.has(target))byTarget.get(target).add(source);
}
for(const row of results) {
  if(row.finalUrl&&row.status===200)row.inboundCohortMainLinks=[...(byTarget.get(canonicalKey(row.finalUrl,row.finalUrl))||[])].sort();
  const check = checkById.get(row.id);
  if (check) {
    row.contentEvidence ??= { pendingRelease: Boolean(check.pendingRelease), missingText: check.requiredText, missingLinks: check.requiredLinks };
    const evidence = row.contentEvidence;
    evidence.passed = row.status === 200 && row.disposition === "html-observed" && row.sitemapSubmitted === true
      && row.canonicals?.length === 1 && row.canonicals[0] === row.finalUrl
      && evidence.missingText.length === 0 && evidence.missingLinks.length === 0;
    if (!evidence.passed) row.observations.push(evidence.pendingRelease ? "pending-release-content-evidence" : "released-content-evidence-mismatch");
  }
  const expected = dispositionById.get(row.id);
  if (expected) {
    const passed = expected.expected === null ? null : row.disposition === expected.expected
      && (!expected.finalUrl || row.finalUrl === expected.finalUrl)
      && (expected.expected !== "not-found-observed" || row.sitemapSubmitted === false)
      && (expected.expected !== "cross-site-destination" || row.originalSitemapSubmitted === false);
    row.dispositionEvidence = { expected: expected.expected, reason: expected.reason, passed };
    if (passed === false) row.observations.push("known-disposition-mismatch");
    if (passed === null) row.observations.push("historical-disposition-unresolved");
  }
}
const contentChecks = results.filter(row => row.contentEvidence);
const evidenceSummary = {
  checked: contentChecks.length,
  passed: contentChecks.filter(row => row.contentEvidence.passed).length,
  pendingReleaseMissing: contentChecks.filter(row => row.contentEvidence.pendingRelease && !row.contentEvidence.passed).length,
  releasedMissing: contentChecks.filter(row => !row.contentEvidence.pendingRelease && !row.contentEvidence.passed).length,
  knownDispositionMismatches: results.filter(row => row.dispositionEvidence?.passed === false).length,
  unresolvedHistorical: results.filter(row => row.dispositionEvidence?.passed === null).length,
};
await mkdir("artifacts",{recursive:true});
const summary=results.reduce((a,r)=>(a[r.disposition]=(a[r.disposition]||0)+1,a),{});
await writeFile("artifacts/indexed-authority-live.json",JSON.stringify({checkedAt:new Date().toISOString(),revision:process.env.GITHUB_SHA||null,requestCount,sitemap:{entries:sitemap.entries.size,visited:sitemap.visited,errors:sitemap.errors},summary,evidenceSummary,results},null,2)+"\n");
console.log("INDEXED_AUTHORITY_INVENTORY "+JSON.stringify({count:results.length,summary,sitemapEntries:sitemap.entries.size,sitemapErrors:sitemap.errors.length,requestCount,evidenceSummary}));
for(const row of results) console.log("INDEXED_AUTHORITY_ROW "+JSON.stringify({id:row.id,url:row.url,finalUrl:row.finalUrl,status:row.status,disposition:row.disposition,title:row.title,words:row.mainWords,canonical:row.canonicals,noindex:row.noindex,sitemap:row.sitemapSubmitted,inbound:row.inboundCohortMainLinks?.length,external:row.mainExternalLinks?.length,observations:row.observations,contentEvidence:row.contentEvidence,dispositionEvidence:row.dispositionEvidence,error:row.error}));
console.log("Observations require editorial and disposition review; this scan is not an authority grade or Google inspection.");
if(sitemap.errors.length||results.some(r=>["transport-error","unexpected-http"].includes(r.disposition)))process.exitCode=1;
if (process.argv.includes("--enforce-released") && (evidenceSummary.releasedMissing || evidenceSummary.knownDispositionMismatches)) process.exitCode=1;
