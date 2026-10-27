/**
 * Fail-closed verification of the download-verified private Storage export
 * receipt against a fresh listing of all still-staged PostgreSQL cold batches.
 * This code is deterministic, pure, and can be tested without service keys.
 */
const PROJECT = 'ftkznprjljkhymknvhye';
const PARENT_TABLE = Object.freeze({
  feed: 'texas_news_feed',
  newsroom: 'news_story_clusters',
  legislative: 'legislative_content_opportunities',
});
const CHILD_TABLES = Object.freeze({
  feed: new Set(['texas_news_feed','news_feed_normalization','newsroom_source_page_fetch_state']),
  newsroom: new Set(['news_story_clusters','news_publish_candidates','news_research_packets','news_story_cluster_items']),
  legislative: new Set(['legislative_content_opportunities']),
});
const ALLOWED = new Set(Object.keys(PARENT_TABLE));
const MANIFEST = /^postgres-cold\/\d{4}-\d{2}-\d{2}\/manifest-([0-9a-f]{64})\.json$/;
const ARCHIVE = /^postgres-cold\/\d{4}-\d{2}-\d{2}\/(feed|newsroom|legislative)-\d+-([0-9a-f]{64})\.ndjson\.gz$/;
const MAX_OBJECT_BYTES = 45_000_000;

function count(value, label, allowZero = false) {
  if (!Number.isSafeInteger(value) || value < (allowZero ? 0 : 1)) {
    throw new Error('Invalid verified archive ' + label);
  }
  return value;
}

export function verifyColdArchiveProof(receipt, metadata) {
  if (!receipt || receipt.project !== PROJECT || !Array.isArray(metadata) || metadata.length === 0) {
    throw new Error('Missing project-bound archive receipt or staged batch listing');
  }
  const match = MANIFEST.exec(receipt.manifest_name || '');
  if (!match || match[1] !== receipt.manifest_sha256) {
    throw new Error('Verified immutable manifest name and SHA-256 disagree');
  }
  if (!Array.isArray(receipt.archive_objects) || !receipt.archive_objects.length) {
    throw new Error('Verified export contains no archive objects');
  }

  const expected = new Map();
  const keys = new Set();
  for (const meta of metadata) {
    if (!ALLOWED.has(meta.archive_kind) || !meta.archive_key ||
        !CHILD_TABLES[meta.archive_kind].has(meta.source_table) || typeof meta.record_checksum !== 'string' ||
        !/^[0-9a-f]{32}$/.test(meta.record_checksum)) {
      throw new Error('Invalid staged archive metadata');
    }
    const key = meta.archive_kind + ':' + meta.archive_key;
    if (keys.has(key)) throw new Error('Duplicate staged archive batch');
    keys.add(key);
    const value = expected.get(meta.archive_kind) ?? { batches: 0, rows: 0, parentRows: 0 };
    value.batches++;
    const n = count(meta.record_count, 'record count');
    value.rows += n;
    if (meta.source_table === PARENT_TABLE[meta.archive_kind]) value.parentRows += n;
    expected.set(meta.archive_kind, value);
  }

  const received = new Map();
  const paths = new Set();
  for (const object of receipt.archive_objects) {
    if (!ALLOWED.has(object.kind)) throw new Error('Unapproved cold archive kind');
    const m = ARCHIVE.exec(object.storage_path || '');
    if (!m || m[1] !== object.kind || m[2] !== object.sha256 ||
        paths.has(object.storage_path)) throw new Error('Archive file SHA-256/name mismatch or duplicate');
    paths.add(object.storage_path);
    count(object.compressed_bytes, 'object bytes');
    if (object.compressed_bytes > MAX_OBJECT_BYTES) throw new Error('Archive object exceeds private Storage limit');
    const value = received.get(object.kind) ?? { batches: 0, rows: 0 };
    value.batches += count(object.batches, 'object batch count');
    value.rows += count(object.rows, 'object row count');
    received.set(object.kind, value);
  }
  count(receipt.batch_count, 'manifest total batch count');
  if (receipt.batch_count !== metadata.length || received.size !== expected.size) {
    throw new Error('Storage manifest and database staged batch coverage differ');
  }
  for (const [kind, stats] of expected) {
    if (!stats.parentRows) throw new Error('Missing archived source parent rows: ' + kind);
    const actual = received.get(kind);
    if (!actual || actual.rows !== stats.rows || actual.batches !== stats.batches) {
      throw new Error('Manifest missing or over-reporting ' + kind + ' archive records');
    }
  }
  return { manifestName: receipt.manifest_name, byKind: Object.fromEntries(expected) };
}
