/**
 * Export verified, exact-record private PostgreSQL cold archives to a PRIVATE
 * Supabase Storage bucket. Export-only; never deletes a database row.
 *
 * Requires repo-scoped SUPABASE_DB_URL + SUPABASE_SERVICE_ROLE_KEY.
 * Output includes no data payload or credential in Actions logs.
 */
import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';

const dbURL = process.env.SUPABASE_DB_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
const apiURL = process.env.SUPABASE_URL || 'https://ftkznprjljkhymknvhye.supabase.co';
const bucketName = 'shared-postgres-cold-archives';

if (!dbURL || !serviceKey) {
  throw new Error('Configured PostgreSQL DB URL and Supabase service-role key are required.');
}
if (!apiURL.endsWith('ftkznprjljkhymknvhye.supabase.co')) {
  throw new Error('Unexpected Supabase project URL.');
}
const parsed = new URL(dbURL);
if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
  throw new Error('Supabase DB URL must be PostgreSQL.');
}
const pgEnv = {
  ...process.env,
  PGHOST: parsed.hostname,
  PGPORT: parsed.port || '5432',
  PGUSER: decodeURIComponent(parsed.username),
  PGPASSWORD: decodeURIComponent(parsed.password),
  PGDATABASE: decodeURIComponent(parsed.pathname.replace(/^\//, '')),
  PGSSLMODE: parsed.searchParams.get('sslmode') || 'require',
  PGCONNECT_TIMEOUT: '15',
};
delete pgEnv.SUPABASE_DB_URL;
delete pgEnv.SUPABASE_SERVICE_ROLE_KEY;
delete pgEnv.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const md5 = (data) => createHash('md5').update(data).digest('hex');
function query(sql) {
  const res = spawnSync('psql', ['--no-psqlrc', '--tuples-only', '--no-align', '--quiet', '-v', 'ON_ERROR_STOP=1', '-c', sql], {
    encoding: 'utf8',
    maxBuffer: 180 * 1024 * 1024,
    timeout: 180000,
    env: pgEnv,
  });
  if (res.status !== 0 || res.error) {
    throw new Error('Postgres archive query failed (no payload logged).');
  }
  return res.stdout.trim();
}
const sourceDefs = [
  {table: 'private.legislative_opportunity_cold_batches',kind: 'legislative',key: 'id',checksum: 'record_ids_md5',fields: "'legislative_content_opportunities' as source_table"},
  {table: 'private.newsroom_cold_batches',kind: 'newsroom',key: 'id',checksum: 'record_ids_md5',fields: 'source_table'},
  {table: 'private.feed_cold_batches',kind: 'feed',key: 'feed_item_id',checksum: 'record_keys_md5',fields: 'source_table'},
];
const supabase = createClient(apiURL, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
async function ensureBucket() {
  const { data, error } = await supabase.storage.getBucket(bucketName);
  if (!error && data) {
    if (data.public) throw new Error('Archive bucket must remain private.');
    return;
  }
  const created = await supabase.storage.createBucket(bucketName, {
    public: false,
    fileSizeLimit: 52428800,
    allowedMimeTypes: ['application/gzip','application/json'],
  });
  if (created.error) throw new Error('Private Storage bucket cannot be created or verified.');
  const check = await supabase.storage.getBucket(bucketName);
  if (check.error || check.data?.public !== false) throw new Error('Private bucket verification failed.');
}
async function saveAndVerify(path, bytes, mime) {
  const dest = supabase.storage.from(bucketName);
  const { error } = await dest.upload(path, bytes, { contentType: mime, upsert: false, cacheControl: '86400' });
  if (error && !/already exists|duplicate/i.test(error.message)) {
    throw new Error('Storage upload failed: '+path);
  }
  const download = await dest.download(path);
  if (download.error || !download.data) throw new Error('Storage read-back failed: '+path);
  const fetched = Buffer.from(await download.data.arrayBuffer());
  if (sha(fetched) !== sha(bytes)) throw new Error('Storage SHA-256 mismatch: '+path);
}
function queryArchive(def) {
  const base = def.checksum;
  const source = def.kind === 'legislative' ? "'legislative_content_opportunities'" : 'source_table';
  return query(`SELECT jsonb_build_object(
    'archive_key',archive_key,
    'source_table',${source},
    'record_count',record_count,
    'record_checksum',${base},
    'records',records
  )::text FROM ${def.table} ORDER BY archive_key;`);
}
function integrityAudit(text, def) {
  const lines = text ? text.split('\n').filter(Boolean) : [];
  let rows = 0;
  for (const line of lines) {
    const entry = JSON.parse(line);
    if (!Array.isArray(entry.records) || entry.records.length !== entry.record_count)
      throw new Error('Archive record count mismatch: '+def.kind);
    const key = def.kind === 'feed'
      ? (entry.source_table === 'texas_news_feed' ? 'id' : 'feed_item_id')
      : 'id';
    const digest = md5(entry.records.map((r) => String(r[key])).join(','));
    if (digest !== entry.record_checksum) throw new Error('Archive row ID checksum mismatch: '+def.kind);
    rows += entry.record_count;
  }
  const expected = query(`select coalesce(sum(record_count),0) from ${def.table};`);
  if (Number(expected) !== rows) throw new Error('Archive aggregate count mismatch: '+def.kind);
  return {rows,batches:lines.length};
}
await ensureBucket();
const manifest = {
  project: 'ftkznprjljkhymknvhye',
  created_at: new Date().toISOString(),
  export_only: true,
  archives: [],
};
const datePrefix = new Date().toISOString().slice(0,10);
for (const def of sourceDefs) {
  const plaintext = queryArchive(def);
  const audit = integrityAudit(plaintext, def);
  if (audit.rows === 0) continue;
  const zipped = gzipSync(Buffer.from(plaintext+'\n', 'utf8'), {level: 9});
  if (zipped.byteLength > 52428800) throw new Error('Archive exceeds Supabase Free file limit.');
  const digest = sha(zipped);
  const path = `postgres-cold/${datePrefix}/${def.kind}-${digest}.ndjson.gz`;
  await saveAndVerify(path, zipped, 'application/gzip');
  const plainRoundTrip = gunzipSync(zipped).toString('utf8').trim();
  const checked = integrityAudit(plainRoundTrip, def);
  if (checked.rows !== audit.rows || checked.batches !== audit.batches)
    throw new Error('Gzip integrity mismatch.');
  manifest.archives.push({kind:def.kind,storage_path:path,sha256:digest,rows:audit.rows,batches:audit.batches,bytes:zipped.length});
  console.log(`Verified private Storage export: ${def.kind}, ${audit.rows} records, ${audit.batches} batches`);
}
if (!manifest.archives.length) {
  console.log('No unexported archive batches found. Nothing deleted.');
  process.exit(0);
}
const manifestBytes = Buffer.from(JSON.stringify(manifest,null,2)+'\n');
await saveAndVerify(`postgres-cold/${datePrefix}/manifest-${sha(manifestBytes)}.json`, manifestBytes, 'application/json');
console.log('All archive objects verified in private Storage. Database archives preserved; export-only complete.');
