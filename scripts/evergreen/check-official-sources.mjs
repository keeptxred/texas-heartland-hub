import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
/** Checks accessibility and fingerprints, not the truth of claims. No writes to production content. */
const [,,inputPath,outputPath] = process.argv;
if(!inputPath || !outputPath) {console.error('Usage: node check-official-sources.mjs sources.json results.json');process.exit(2)}
const records=JSON.parse(readFileSync(inputPath,'utf8'));
if(!Array.isArray(records)) throw new Error('Expected array of source records');
const results=[];
for(const record of records.slice(0,25)) {
 const url=new URL(record.url);
 if(url.protocol!=='https:' || !url.hostname.endsWith('.gov') && !url.hostname.endsWith('.texas.gov') && !url.hostname.endsWith('.tx.us')) {
  results.push({id:record.id,url:record.url,status:'manual-review',reason:'Source host not on conservative government allowlist'});continue;
 }
 try {
  const response=await fetch(url,{headers:{'User-Agent':'KeepTXRed-SourceAudit/1.0 (+https://keeptxred.com/contact)','Accept':'text/html,application/json,text/plain'},signal:AbortSignal.timeout(12000),redirect:'error'});
  if(!response.ok) {results.push({id:record.id,url:record.url,status:'unavailable',httpStatus:response.status});continue}
  const content=await response.text();
  results.push({id:record.id,url:record.url,status:'retrieved-not-verified',checkedAt:new Date().toISOString(),httpStatus:response.status,sha256:createHash('sha256').update(content).digest('hex'),bytes:content.length});
 } catch(error) {results.push({id:record.id,url:record.url,status:'unavailable',error:String(error).slice(0,250)})}
}
writeFileSync(outputPath,JSON.stringify({generatedAt:new Date().toISOString(),results},null,2)+'\n');
console.log('Checked '+results.length+' sources; no factual claims were verified or published.');
