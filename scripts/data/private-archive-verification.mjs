import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";

export const COLD_ARCHIVE_BUCKET = "shared-postgres-cold-archives";
export const COLD_ARCHIVE_PROJECT = "ftkznprjljkhymknvhye";
export const COLD_ARCHIVE_KINDS = Object.freeze({
  feed: "texas_news_feed",
  newsroom: "news_story_clusters",
});

export const hash = (bytes, algorithm = "sha256") =>
  createHash(algorithm).update(bytes).digest("hex");

export function verifyArchiveManifest(name, contents, metadata, objects) {
  // This validator deliberately never trusts row-count arguments from callers.
  // All counts must be reconstructed from verified downloaded objects, then
  // compared with service-role-only staging metadata before a retire RPC.
  if (!/^postgres-cold\/\d{4}-\d{2}-\d{2}\/manifest-[a-f0-9]{64}\.json$/.test(name))
    throw new Error("Unexpected private archive manifest path");
  if (hash(contents) !== name.match(/manifest-([a-f0-9]{64})\.json$/)?.[1])
    throw new Error("Private archive manifest SHA256 mismatch");

  const manifest = JSON.parse(contents.toString("utf8"));
  if (manifest.project !== COLD_ARCHIVE_PROJECT || manifest.export_only !== true ||
      !Number.isSafeInteger(manifest.batch_count) || manifest.batch_count <= 0 ||
      !Array.isArray(manifest.archive_objects) || !manifest.archive_objects.length)
    throw new Error("Invalid or empty signed-by-content archive manifest");

  const expected = new Map();
  for (const entry of metadata) {
    if (!["feed", "newsroom", "legislative"].includes(entry.archive_kind) ||
        !entry.archive_key || expected.has(entry.archive_kind + ":" + entry.archive_key) ||
        !Number.isInteger(entry.record_count) || entry.record_count < 1)
      throw new Error("Bad or duplicate database archive staging metadata");
    expected.set(entry.archive_kind + ":" + entry.archive_key, entry);
  }
  if (expected.size !== manifest.batch_count)
    throw new Error("Database staging batch count differs from manifest");
  const seen = new Set();
  const totals = {};
  for (const object of manifest.archive_objects) {
    if (!["feed", "newsroom", "legislative"].includes(object.kind) ||
        !/^postgres-cold\/\d{4}-\d{2}-\d{2}\/[a-z]+-\d+-[a-f0-9]{64}\.ndjson\.gz$/.test(object.storage_path) ||
        !Number.isSafeInteger(object.batches) || object.batches < 1 ||
        !Number.isSafeInteger(object.rows) || object.rows < 1 ||
        !Number.isSafeInteger(object.compressed_bytes) || object.compressed_bytes < 1)
      throw new Error("Invalid archive object descriptor");
    const gz = objects.get(object.storage_path);
    if (!gz || gz.length !== object.compressed_bytes ||
        hash(gz) !== object.sha256 ||
        !object.storage_path.endsWith(object.sha256 + ".ndjson.gz"))
      throw new Error("Archive object missing or checksum/size mismatch");
    let lines;
    try { lines = gunzipSync(gz).toString("utf8").trim().split("\n"); }
    catch { throw new Error("Archive object is not valid gzip"); }
    if (lines.length !== object.batches) throw new Error("Archive object batch count mismatch");
    let rows = 0;
    for (const line of lines) {
      const batch = JSON.parse(line);
      const key = object.kind + ":" + batch.archive_key;
      const meta = expected.get(key);
      if (!meta || seen.has(key) || meta.source_table !== batch.source_table ||
          !Array.isArray(batch.records) || meta.record_count !== batch.record_count ||
          meta.record_checksum !== batch.record_checksum ||
          batch.records.length !== batch.record_count)
        throw new Error("Archived batch is missing, duplicated, or not the staged version");
      const idColumn = object.kind === "feed" &&
        batch.source_table !== "texas_news_feed" ? "feed_item_id" : "id";
      const keys = batch.records.map(row => row?.[idColumn]);
      if (keys.some(id => id == null) ||
          hash(keys.map(String).join(","), "md5") !== batch.record_checksum)
        throw new Error("Archive row ID checksum mismatch");
      seen.add(key);
      rows += batch.record_count;
      totals[object.kind] ??= { rows: 0, batches: 0, rootRows: 0 };
      totals[object.kind].batches += 1;
      totals[object.kind].rows += batch.record_count;
      if (batch.source_table === COLD_ARCHIVE_KINDS[object.kind])
        totals[object.kind].rootRows += batch.record_count;
    }
    if (object.rows !== rows) throw new Error("Downloaded archive object row count mismatch");
  }
  if (seen.size !== expected.size) throw new Error("One or more staged batches missing from private archive");
  return totals;
}
