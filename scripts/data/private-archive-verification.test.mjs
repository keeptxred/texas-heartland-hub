import test from "node:test";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { verifyArchiveManifest, hash, COLD_ARCHIVE_PROJECT } from "./private-archive-verification.mjs";

function fixtures() {
  const item = { id: 111, link: "https://publisher.example/verified-report" };
  const checksum = hash("111", "md5");
  const batch = { archive_key: "batch-1", source_table: "texas_news_feed",
    record_count: 1, record_checksum: checksum, records: [item] };
  const bytes = gzipSync(Buffer.from(JSON.stringify(batch) + "\n"));
  const path = `postgres-cold/2026-10-27/feed-0-${hash(bytes)}.ndjson.gz`;
  const doc = {
    project: COLD_ARCHIVE_PROJECT,
    export_only: true, batch_count: 1,
    archive_objects: [{ kind: "feed", storage_path: path, sha256: hash(bytes),
      compressed_bytes: bytes.length, rows: 1, batches: 1 }],
  };
  const contents = Buffer.from(JSON.stringify(doc) + "\n");
  const name = `postgres-cold/2026-10-27/manifest-${hash(contents)}.json`;
  const metadata = [{ archive_kind: "feed", archive_key: "batch-1",
    source_table: "texas_news_feed", record_count: 1, record_checksum: checksum }];
  const objects = new Map([[path, bytes]]);
  return { name, contents, metadata, objects };
}
test("valid readback of immutable verified private Storage manifest", () => {
  const f=fixtures();
  assert.equal(verifyArchiveManifest(f.name,f.contents,f.metadata,f.objects).feed.rootRows,1);
});
test("fails closed if manifest or Storage object was tampered with", () => {
  const f=fixtures();
  assert.throws(() => verifyArchiveManifest(f.name,Buffer.from("{}"),f.metadata,f.objects),/SHA256/);
  f.objects.set([...f.objects.keys()][0], Buffer.from("corrupt"));
  assert.throws(() => verifyArchiveManifest(f.name,f.contents,f.metadata,f.objects),/checksum|size/);
});
test("cannot retire a different staged batch with a valid unrelated archive", () => {
  const f=fixtures();
  f.metadata[0].archive_key="another-batch";
  assert.throws(() => verifyArchiveManifest(f.name,f.contents,f.metadata,f.objects),/staged version/);
});
test("rejects extra unverified staged batches", () => {
  const f=fixtures();
  f.metadata.push({...f.metadata[0],archive_key:"batch-2"});
  assert.throws(() => verifyArchiveManifest(f.name,f.contents,f.metadata,f.objects),/batch count/);
});
test("rejects weak or malformed paths", () => {
  const f=fixtures();
  assert.throws(() => verifyArchiveManifest("../manifest.json",f.contents,f.metadata,f.objects),/path/);
});
