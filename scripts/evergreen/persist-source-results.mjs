import { readFileSync } from 'node:fs';

const [,,inputPath] = process.argv;
if (!inputPath) throw new Error('Usage: node persist-source-results.mjs results.json');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  throw new Error('Private ledger ingestion requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}
const base = new URL(url);
if (base.protocol !== 'https:') throw new Error('Supabase endpoint must use HTTPS');
const payload = JSON.parse(readFileSync(inputPath, 'utf8'));
if (!Array.isArray(payload.results) || payload.results.length === 0 || payload.results.length > 25) throw new Error('Expected 1 to 25 source-check results');
const headers = { apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json', Prefer:'resolution=merge-duplicates,return=minimal' };
for (const result of payload.results) {
  if (typeof result.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(result.id)) throw new Error('Invalid source identifier');
  if (typeof result.url !== 'string' || new URL(result.url).protocol !== 'https:') throw new Error('Invalid source URL');
  const entityId = `source:${result.id}`;
  const checkedAt = result.checkedAt || payload.generatedAt;
  if (!Number.isFinite(Date.parse(checkedAt))) throw new Error('Invalid check time');
  const status = result.status === 'retrieved-not-verified' ? 'retrieved-not-verified' : result.status === 'unavailable' ? 'source-unavailable' : 'needs-review';
  const row = { entity_id:entityId, route:'/internal/evergreen/sources/'+result.id, cadence:'weekly', status, official_sources:[result.url], evidence:[result], last_checked_at:checkedAt, next_check_at:new Date(Date.parse(checkedAt)+7*86400000).toISOString(), updated_at:new Date().toISOString() };
  const endpoint = new URL('/rest/v1/ktr_evergreen_verifications?on_conflict=entity_id', base);
  const response = await fetch(endpoint, { method:'POST', headers, body:JSON.stringify(row), signal:AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Ledger write failed for ${result.id}: HTTP ${response.status}`);
  const event = { entity_id:entityId, event_type:'source-check', evidence:[result], changes:[] };
  const eventResponse = await fetch(new URL('/rest/v1/ktr_evergreen_verification_events',base), {method:'POST',headers,body:JSON.stringify(event),signal:AbortSignal.timeout(12000)});
  if (!eventResponse.ok) throw new Error(`Ledger event failed for ${result.id}: HTTP ${eventResponse.status}`);
}
console.log(`Recorded ${payload.results.length} source checks in private ledger; no facts approved or published.`);
