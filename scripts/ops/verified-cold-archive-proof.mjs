/**
 * Fail-closed verification of the download-verified private Storage export
 * receipt against a fresh listing of all still-staged PostgreSQL cold batches.
 * This code is deterministic, pure, and can be tested without service keys.
 */
const PROJECT = 'ftkznprjljkhymknvhye';
const ALLOWED = new Set(['feed', 'newsroom', 'legislative']);
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
        !meta.source_table || typeof meta.record_checksum !== 'string' ||
        !/^[0-9a-f]{32}$/.test(meta.record_checksum)) {
      throw new Error('Invalid staged archive metadata');
    }
    const key = meta.archive_kind + ':' + meta.archive_key;
    if (keys.has(key)) throw new Error('Duplicate staged archive batch');
    keys.add(key);
    const value = expected.get(meta.archive_kind) ?? { batches: 0, rows: 0 };
    value.batches++;
    value.rows += count(meta.record_count, 'record count');
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
    const actual = received.get(kind);
    if (!actual || actual.rows !== stats.rows || actual.batches !== stats.batches) {
      throw new Error('Manifest missing or over-reporting ' + kind + ' archive records');
    }
  }
  return { manifestName: receipt.manifest_name, byKind: Object.fromEntries(expected) };
}
