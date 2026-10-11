import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
/** Checks accessibility and fingerprints, not the truth of claims. No writes to production content. */
const [,,inputPath,outputPath] = process.argv;
if(!inputPath || !outputPath) {console.error('Usage: node check-official-sources.mjs sources.json results.json');process.exit(2)}
const records=JSON.parse(readFileSync(inputPath,'utf8'));
if(!Array.isArray(records) || records.length < 1 || records.length > 25) throw new Error('Expected 1 to 25 source records');
if(records.some(record => !record || typeof record.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(record.id) || typeof record.url !== 'string')) throw new Error('Invalid source record');
if(new Set(records.map(record => record.id)).size !== records.length) throw new Error('Duplicate source IDs');
const results=[];
const MAX_BYTES = 2_000_000;
for(const record of records) {
 const url=new URL(record.url);
 const checkedAt=new Date().toISOString();
 if(url.protocol!=='https:' || !(url.hostname.endsWith('.gov') || url.hostname === 'www.sos.state.tx.us')) {
  results.push({id:record.id,url:record.url,status:'manual-review',checkedAt,reason:'Source host not on conservative government allowlist'});continue;
 }
 try {
  const response=await fetch(url,{headers:{'User-Agent':'KeepTXRed-SourceAudit/1.0 (+https://keeptxred.com/contact)','Accept':'text/html,application/json,text/plain'},signal:AbortSignal.timeout(12000),redirect:'error'});
  if(!response.ok) {results.push({id:record.id,url:record.url,status:'unavailable',checkedAt,httpStatus:response.status});continue}
  const declaredSize=Number(response.headers.get('content-length') || 0);
  if(declaredSize > MAX_BYTES) {results.push({id:record.id,url:record.url,status:'manual-review',checkedAt,reason:'Response exceeds fetch budget'});continue}
  const reader=response.body?.getReader();
  if(!reader) throw new Error('Missing response body');
  const chunks=[];let bytes=0;
  while(true) {
   const {done,value}=await reader.read();
   if(done) break;
   bytes+=value.byteLength;
   if(bytes>MAX_BYTES) {await reader.cancel();throw new Error('Response exceeds fetch budget')}
   chunks.push(value);
  }
  const content=Buffer.concat(chunks).toString('utf8');
  results.push({id:record.id,url:record.url,status:'retrieved-not-verified',checkedAt,httpStatus:response.status,sha256:createHash('sha256').update(content).digest('hex'),bytes});
 } catch(error) {results.push({id:record.id,url:record.url,status:'unavailable',checkedAt,error:String(error).slice(0,250)})}
}
writeFileSync(outputPath,JSON.stringify({generatedAt:new Date().toISOString(),results},null,2)+'\n');
console.log('Checked '+results.length+' sources; no factual claims were verified or published.');
