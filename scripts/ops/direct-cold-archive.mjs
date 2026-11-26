import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';

const PROJECT = 'ftkznprjljkhymknvhye';
const BUCKET = 'shared-postgres-cold-archives';
const FORMAT = 'direct-cold-v1';
const SPEC = {
  feed: { max: 50, parent: 'texas_news_feed', children: {
    news_feed_normalization: 'feed_item_id', newsroom_source_page_fetch_state: 'feed_item_id',
  }},
  newsroom: { max: 65, parent: 'news_story_clusters', children: {
    news_publish_candidates: 'cluster_id', news_research_packets: 'cluster_id',
    news_story_cluster_items: 'cluster_id',
  }},
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function checked(label, response) {
  if (response?.error || !response) throw new Error(label + ' failed (' +
    (response?.error?.code || response?.error?.statusCode || 'unknown') + ')');
  return response.data;
}
export function validateDirectSnapshot(payload, kind, limit) {
  const spec = SPEC[kind];
  if (!spec || !Number.isInteger(limit) || limit < 1 || limit > spec.max ||
      typeof payload !== 'string' || Buffer.byteLength(payload) > 4000000)
    throw new Error('Invalid direct archive bounds');
  const doc = JSON.parse(payload);
  if (doc?.format !== FORMAT || doc.project !== PROJECT || doc.kind !== kind ||
      !Array.isArray(doc.parent_ids) || doc.parent_ids.length > limit ||
      !doc.records || typeof doc.records !== 'object' || Array.isArray(doc.records))
    throw new Error('Invalid direct snapshot identity');
  const ids = new Set(doc.parent_ids);
  const idPattern = kind === 'feed' ? /^[0-9]+$/ :
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (ids.size !== doc.parent_ids.length ||
      doc.parent_ids.some(id => typeof id !== 'string' || !idPattern.test(id)))
    throw new Error('Invalid or duplicate parent IDs');
  const expected = [spec.parent, ...Object.keys(spec.children)].sort();
  if (JSON.stringify(Object.keys(doc.records).sort()) !== JSON.stringify(expected) ||
      expected.some(table => !Array.isArray(doc.records[table])))
    throw new Error('Unexpected archive table coverage');
  const parentIds = doc.records[spec.parent].map(row => String(row?.id));
  if (parentIds.length !== ids.size || new Set(parentIds).size !== ids.size ||
      parentIds.some(id => !ids.has(id))) throw new Error('Archive parent coverage mismatch');
  for (const [table, fk] of Object.entries(spec.children)) {
    if (doc.records[table].some(row => !ids.has(String(row?.[fk]))))
      throw new Error('Archive child references outside snapshot');
  }
  return { parents: ids.size, rows: expected.reduce((n, table) => n + doc.records[table].length, 0) };
}
async function writeAndRead(bucket, path, bytes, contentType) {
  const uploaded = await bucket.upload(path, bytes, { contentType, upsert: false });
  if (uploaded.error && !(
    String(uploaded.error.statusCode ?? uploaded.error.status ?? '') === '409' ||
    /already exists|duplicate/i.test(uploaded.error.message || '')
  )) checked('Immutable private upload', uploaded);
  const blob = checked('Private object download', await bucket.download(path));
  const actual = Buffer.from(await blob.arrayBuffer());
  if (!actual.equals(bytes) || hash(actual) !== hash(bytes))
    throw new Error('Private Storage exact readback mismatch');
  return actual;
}
function assertVerification(result, count, manifestName, retired) {
  if (result?.verified !== true || result.parents !== count ||
      result.retired !== retired || result.manifest_name !== manifestName)
    throw new Error('Direct archive RPC returned unexpected proof/count');
}
/**
 * No duplicate PostgreSQL staging. Original SQL JSON text remains unchanged:
 * parsed data is used solely for validation, NEVER reserialized for retirement.
 * Production deletion uses the pre-deployed service-only transactional RPC.
 */
export async function archiveDirectColdKind(db, kind, limit, { retire = false } = {}) {
  if (typeof retire !== 'boolean' || !SPEC[kind] || !Number.isInteger(limit) ||
      limit < 1 || limit > SPEC[kind].max) throw new Error('Invalid archive invocation');
  const payload = checked('Direct cold snapshot', await db.rpc('snapshot_direct_cold_records', {
    p_kind: kind, p_limit: limit,
  }));
  const { parents, rows } = validateDirectSnapshot(payload, kind, limit);
  if (!parents) return { parents: 0, rows: 0, retired: 0, manifest: null };
  const bucketMeta = checked('Private bucket check', await db.storage.getBucket(BUCKET));
  if (bucketMeta?.id !== BUCKET || bucketMeta.public !== false)
    throw new Error('Archive bucket not explicitly private');
  const bucket = db.storage.from(BUCKET);
  const original = Buffer.from(payload, 'utf8');
  const compressed = gzipSync(original, { level: 9 });
  if (compressed.length > 4500000) throw new Error('Compressed archive exceeds safe bound');
  const folder = 'postgres-cold/' + new Date().toISOString().slice(0, 10) + '/';
  const gzipSha = hash(compressed);
  const objectName = folder + 'direct-' + kind + '-' + gzipSha + '.json.gz';
  const manifest = Buffer.from(JSON.stringify({
    format: FORMAT, project: PROJECT, kind,
    parent_count: parents, payload_bytes: original.length,
    payload_sha256: hash(original), gzip_sha256: gzipSha,
    compressed_bytes: compressed.length, object_name: objectName,
  }));
  const manifestName = folder + 'manifest-' + hash(manifest) + '.json';
  const readGzip = await writeAndRead(bucket, objectName, compressed, 'application/gzip');
  const readPayload = gunzipSync(readGzip, { maxOutputLength: 4000000 });
  if (!readPayload.equals(original)) throw new Error('Archive decompressed payload mismatch');
  const readManifest = await writeAndRead(bucket, manifestName, manifest, 'application/json');
  const args = {
    p_kind: kind, p_payload: readPayload.toString('utf8'),
    p_manifest: readManifest.toString('utf8'), p_manifest_name: manifestName, p_retire: false,
  };
  // Real server-side negative control: changing even whitespace in the exact
  // readback must fail the hash/manifest guard before any retirement can occur.
  const tampered = await db.rpc('verify_direct_cold_retirement', {
    ...args, p_payload: args.p_payload + ' ',
  });
  if (tampered.error?.code !== 'P0001' ||
      !/Direct manifest does not match snapshot/.test(tampered.error.message || ''))
    throw new Error('Direct archive tamper rejection was not proven');
  const dry = checked('Direct archive transactional dry-run',
    await db.rpc('verify_direct_cold_retirement', args));
  assertVerification(dry, parents, manifestName, 0);
  if (!retire) return { parents, rows, retired: 0, manifest: manifestName };
  // The RPC reacquires locks and repeats the exact parity/reference checks.
  const result = checked('Direct verified retirement',
    await db.rpc('verify_direct_cold_retirement', { ...args, p_retire: true }));
  assertVerification(result, parents, manifestName, parents);
  return { parents, rows, retired: parents, manifest: manifestName };
}
