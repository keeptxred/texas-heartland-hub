import { readFileSync } from 'node:fs';

const [,,inputPath] = process.argv;
if (!inputPath) throw new Error('Usage: node persist-source-results.mjs results.json');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  throw new Error('Private ledger ingestion requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}
const base = new URL(url);
if (base.protocol !== 'https:' || base.username || base.password || base.pathname !== '/' || base.search || base.hash || !base.hostname.endsWith('.supabase.co')) throw new Error('Supabase endpoint must be a project HTTPS origin');
const payload = JSON.parse(readFileSync(inputPath, 'utf8'));
if (!Array.isArray(payload.results) || payload.results.length === 0 || payload.results.length > 25) throw new Error('Expected 1 to 25 source-check results');
if (payload.results.some(item => !item || typeof item !== 'object')) throw new Error('Invalid source-check entry');
if (new Set(payload.results.map(item => item.id)).size !== payload.results.length) throw new Error('Duplicate source-check identifiers');
for (const result of payload.results) {
  if (typeof result.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(result.id)) throw new Error('Invalid source identifier');
  if (typeof result.url !== 'string') throw new Error('Invalid source URL');
  const sourceUrl = new URL(result.url);
  if (sourceUrl.protocol !== 'https:' || !(sourceUrl.hostname.endsWith('.gov') || sourceUrl.hostname === 'www.sos.state.tx.us') || sourceUrl.username || sourceUrl.password) throw new Error('Invalid government source URL');
  if (!Number.isFinite(Date.parse(result.checkedAt || payload.generatedAt))) throw new Error('Invalid check time');
  if (!['retrieved-not-verified','unavailable','manual-review'].includes(result.status)) throw new Error('Unknown source-check status');
}
const headers = { apikey:key, ...(key.startsWith('sb_secret_') ? {} : {Authorization:`Bearer ${key}`}), 'Content-Type':'application/json', Prefer:'resolution=merge-duplicates,return=minimal' };
const endpoint = new URL('/rest/v1/rpc/ktr_ingest_evergreen_source_batch', base);
const response = await fetch(endpoint, {
  method:'POST', headers, body:JSON.stringify({p_results:payload.results}), signal:AbortSignal.timeout(30000),
});
if (!response.ok) throw new Error(`Atomic ledger ingestion failed: HTTP ${response.status}`);
const written = await response.json();
if (written !== payload.results.length) throw new Error('Atomic ledger ingestion returned an unexpected count');
console.log(`Recorded ${written} source checks and audit events atomically; no facts approved or published.`);
