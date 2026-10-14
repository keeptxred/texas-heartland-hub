/**
 * Export verified, exact-record private PostgreSQL cold archives to a PRIVATE
 * Supabase Storage bucket using existing service-role credentials only.
 * No raw database password, new secrets, table deletions, or VACUUM required.
 *
 * Read access is restricted by SQL EXECUTE grants on the two service-role-only
 * RPC functions. This export is safe to retry: files use content SHA-256.
 */
import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import { createClient } from '@supabase/supabase-js';

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
                   process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
const apiURL = process.env.SUPABASE_URL ||
               'https://ftkznprjljkhymknvhye.supabase.co';
const bucketName = 'shared-postgres-cold-archives';
const MAX_UPLOAD_BYTES = 45_000_000;
const MAX_ARCHIVE_BATCHES_PER_OBJECT = 40;
const FETCH_CONCURRENCY = 6;
const ARTICLE_SNAPSHOT_PAGE_SIZE = 500;
const MAX_ARTICLE_SNAPSHOT_ROWS = 50_000;
const LIST_PAGE_SIZE = 100;
if (!serviceKey) throw new Error('Supabase service-role key not configured.');
if (new URL(apiURL).origin !== 'https://ftkznprjljkhymknvhye.supabase.co') {
  throw new Error('Unexpected Supabase project URL.');
}
const db = createClient(apiURL, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const md5 = data => createHash('md5').update(data).digest('hex');

async function listMetadata() {
  const rows = [];
  for (let offset = 0; offset < 100_000; offset += LIST_PAGE_SIZE) {
    const {data, error} = await db.rpc('list_private_cold_archive_batches', {
      p_offset: offset, p_limit: LIST_PAGE_SIZE,
    });
    if (error) throw new Error('Archive listing RPC failed: ' + (error.code || 'unknown'));
    if (!Array.isArray(data)) throw new Error('Archive listing returned a non-array.');
    rows.push(...data);
    if (data.length < LIST_PAGE_SIZE) return rows;
  }
  throw new Error('Archive listing exceeded pagination safety limit.');
}
async function readBatch(meta) {
  const {data, error} = await db.rpc('read_private_cold_archive_batch', {
    p_kind: meta.archive_kind,
    p_key: meta.archive_key,
  });
  if (error || !data) throw new Error('Archive RPC read failed: ' + (error?.code || 'empty'));
  validateBatch(data, meta);
  return data;
}
function validateBatch(entry, meta) {
  if (!entry || entry.archive_key !== meta.archive_key ||
      entry.source_table !== meta.source_table ||
      entry.record_count !== meta.record_count ||
      entry.record_checksum !== meta.record_checksum) {
    throw new Error('Archive metadata/readback mismatch.');
  }
  if (!Array.isArray(entry.records) || entry.records.length !== entry.record_count) {
    throw new Error('Archive count mismatch.');
  }
  const key = meta.archive_kind === 'feed' && entry.source_table !== 'texas_news_feed'
    ? 'feed_item_id' : 'id';
  const digest = md5(entry.records.map(row => String(row[key])).join(','));
  if (digest !== entry.record_checksum) throw new Error('Archive row IDs checksum mismatch.');
}
async function readChunk(metaChunk) {
  const result = [];
  for (let i = 0; i < metaChunk.length; i += FETCH_CONCURRENCY) {
    const group = metaChunk.slice(i, i + FETCH_CONCURRENCY);
    result.push(...await Promise.all(group.map(readBatch)));
  }
  return result;
}
async function ensurePrivateBucket() {
  const current = await db.storage.getBucket(bucketName);
  if (!current.error && current.data) {
    if (current.data.public !== false) throw new Error('Archive bucket is public.');
    return;
  }
  const created = await db.storage.createBucket(bucketName, {
    public: false,
    fileSizeLimit: MAX_UPLOAD_BYTES,
    allowedMimeTypes: ['application/gzip','application/json'],
  });
  if (created.error) throw new Error('Could not create archive Storage bucket: ' +
                                      (created.error.statusCode || 'unknown'));
  const verified = await db.storage.getBucket(bucketName);
  if (verified.error || verified.data?.public !== false) {
    throw new Error('Created archive bucket failed private-access verification.');
  }
}
async function storeAndReadBack(path, bytes, mime) {
  if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error('Backup file exceeds Free Plan size limit.');
  const bucket = db.storage.from(bucketName);
  const {error} = await bucket.upload(path, bytes, {
    contentType: mime, upsert: false, cacheControl: '86400',
  });
  if (error && !/already exists|duplicate/i.test(error.message)) {
    throw new Error('Storage upload failed: '+(error.statusCode || 'unknown'));
  }
  const downloaded = await bucket.download(path);
  if (downloaded.error || !downloaded.data) throw new Error('Private Storage readback failed.');
  const verifiedBytes = Buffer.from(await downloaded.data.arrayBuffer());
  if (sha256(verifiedBytes) !== sha256(bytes)) {
    throw new Error('Private Storage object checksum mismatch.');
  }
  return verifiedBytes;
}
function verifyArchiveBlob(gzipData, metadataChunk) {
  const plaintext = gunzipSync(gzipData).toString('utf8').trim();
  const lines = plaintext ? plaintext.split('\n') : [];
  if (lines.length !== metadataChunk.length) {
    throw new Error('Downloaded archive has incorrect batch count.');
  }
  let rows = 0;
  for (let i=0; i<lines.length; i++) {
    const entry = JSON.parse(lines[i]);
    validateBatch(entry, metadataChunk[i]);
    rows += entry.record_count;
  }
  return rows;
}

// Keep an immutable copy of the *entire* published-article table in PRIVATE
// object storage. Historical URL and editorial-copy loss preceded the 2026
// deletion archive, so saving only deleted-row logs cannot recover those cases.
// This operation is export-only; it never edits or removes database records.
async function snapshotPublishedArticles() {
  const rows = [];
  for (let offset = 0; offset < MAX_ARTICLE_SNAPSHOT_ROWS; offset += ARTICLE_SNAPSHOT_PAGE_SIZE) {
    const {data, error} = await db.from('daily_articles')
      .select('*')
      .order('slug', {ascending: true})
      .range(offset, offset + ARTICLE_SNAPSHOT_PAGE_SIZE - 1);
    if (error) throw new Error('Published article snapshot read failed: ' + (error.code || error.message));
    if (!Array.isArray(data)) throw new Error('Published article snapshot returned no array.');
    rows.push(...data);
    if (data.length < ARTICLE_SNAPSHOT_PAGE_SIZE) break;
  }
  if (!rows.length || rows.length >= MAX_ARTICLE_SNAPSHOT_ROWS) {
    throw new Error('Published article snapshot is empty or exceeded its safety limit.');
  }
  if (new Set(rows.map(row => row.slug)).size !== rows.length ||
      rows.some(row => !row.slug || !row.body_json || !row.title)) {
    throw new Error('Incomplete or duplicated published article rows: snapshot not accepted.');
  }
  const day = new Date().toISOString().slice(0,10);
  const snapshot = {
    schema_version: 1,
    project: 'ftkznprjljkhymknvhye',
    source_table: 'public.daily_articles',
    snapshot_day_utc: day,
    record_count: rows.length,
    records: rows,
  };
  const raw = Buffer.from(JSON.stringify(snapshot) + '\n');
  const zipped = gzipSync(raw, {level: 9});
  if (zipped.length > MAX_UPLOAD_BYTES) {
    throw new Error('Article snapshot grew beyond the private Storage object limit.');
  }
  const path = 'postgres-cold/' + day + '/published-articles-' + sha256(zipped) + '.json.gz';
  const verified = await storeAndReadBack(path, zipped, 'application/gzip');
  const reopened = JSON.parse(gunzipSync(verified).toString('utf8'));
  if (reopened.source_table !== 'public.daily_articles' ||
      reopened.project !== snapshot.project ||
      reopened.record_count !== rows.length ||
      !Array.isArray(reopened.records) ||
      reopened.records.length !== rows.length ||
      sha256(Buffer.from(JSON.stringify(reopened.records))) !==
        sha256(Buffer.from(JSON.stringify(rows)))) {
    throw new Error('Published article snapshot failed full private readback validation.');
  }
  console.log('Verified immutable private article snapshot: ' + rows.length +
    ' articles, ' + zipped.length + ' compressed bytes. No published rows deleted.');
}

await ensurePrivateBucket();
await snapshotPublishedArticles();

const metadata = await listMetadata();
if (!metadata.length) {
  console.log('No private archives exist; no export needed.');
  process.exit(0);
}
const unique = new Set();
const grouped = new Map();
const allowed = {
  feed: new Set(['texas_news_feed','news_feed_normalization','newsroom_source_page_fetch_state']),
  newsroom: new Set(['news_story_clusters','news_publish_candidates','news_research_packets','news_story_cluster_items']),
  legislative: new Set(['legislative_content_opportunities']),
};
for (const row of metadata) {
  if (!allowed[row.archive_kind]?.has(row.source_table)) {
    throw new Error('Archive source not allowlisted.');
  }
  const id = row.archive_kind + ':' + row.archive_key;
  if (unique.has(id)) throw new Error('Repeated archive key.');
  unique.add(id);
  if (!grouped.has(row.archive_kind)) grouped.set(row.archive_kind, []);
  grouped.get(row.archive_kind).push(row);
}
const manifest = {
  project: 'ftkznprjljkhymknvhye',
  created_at: new Date().toISOString(),
  export_only: true,
  batch_count: metadata.length,
  archive_objects: [],
};
const folder = new Date().toISOString().slice(0,10);
for (const [kind, list] of grouped) {
  for (let first = 0; first < list.length; first += MAX_ARCHIVE_BATCHES_PER_OBJECT) {
    const slice = list.slice(first, first + MAX_ARCHIVE_BATCHES_PER_OBJECT);
    const records = await readChunk(slice);
    const payload = Buffer.from(records.map(row => JSON.stringify(row)).join('\n')+'\n');
    const zipped = gzipSync(payload,{level:9});
    if (zipped.length > MAX_UPLOAD_BYTES) {
      throw new Error('Archive chunk too large; lower MAX_ARCHIVE_BATCHES_PER_OBJECT.');
    }
    const digest = sha256(zipped);
    const path = `postgres-cold/${folder}/${kind}-${first}-${digest}.ndjson.gz`;
    const downloaded = await storeAndReadBack(path,zipped,'application/gzip');
    const rowCount = verifyArchiveBlob(downloaded,slice);
    const metadataCount = slice.reduce((sum,x)=>sum+x.record_count,0);
    if (rowCount !== metadataCount) throw new Error('Storage row count mismatch.');
    manifest.archive_objects.push({
      kind,storage_path:path,sha256:digest,
      batches:slice.length,rows:rowCount,compressed_bytes:zipped.length,
    });
    console.log(`Verified Storage archive ${kind}: ${rowCount} records, ${slice.length} batches`);
  }
}
const totalBatches = manifest.archive_objects.reduce((sum,x)=>sum+x.batches,0);
if (totalBatches !== metadata.length) throw new Error('Not every archive batch was exported.');
const manifestBytes = Buffer.from(JSON.stringify(manifest,null,2)+'\n');
await storeAndReadBack(
  `postgres-cold/${folder}/manifest-${sha256(manifestBytes)}.json`,
  manifestBytes,'application/json'
);
console.log('Complete private Storage export/read-back verified. No database rows deleted.');
