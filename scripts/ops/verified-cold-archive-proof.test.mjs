import { it as test } from 'vitest';
import { strict as assert } from 'node:assert';
import { verifyColdArchiveProof } from './verified-cold-archive-proof.mjs';

const sha = 'a'.repeat(64);
const md5 = 'b'.repeat(32);
const metadata = [
  {archive_kind:'newsroom',archive_key:'batch-one',source_table:'news_story_clusters',record_count:50,record_checksum:md5},
  {archive_kind:'newsroom',archive_key:'batch-two',source_table:'news_publish_candidates',record_count:50,record_checksum:md5},
  {archive_kind:'feed',archive_key:'batch-three',source_table:'texas_news_feed',record_count:42,record_checksum:md5},
];
const receipt = {
  project:'ftkznprjljkhymknvhye',
  manifest_name:'postgres-cold/2026-10-27/manifest-'+sha+'.json',
  manifest_sha256:sha, batch_count:3,
  archive_objects:[
    {kind:'newsroom',storage_path:'postgres-cold/2026-10-27/newsroom-0-'+sha+'.ndjson.gz',sha256:sha,batches:2,rows:100,compressed_bytes:23123},
    {kind:'feed',storage_path:'postgres-cold/2026-10-27/feed-0-'+sha+'.ndjson.gz',sha256:sha,batches:1,rows:42,compressed_bytes:4123},
  ]
};
test('accepts downloaded, SHA-verified complete batch and row coverage', () => {
  const proof = verifyColdArchiveProof(receipt,metadata);
  assert.deepEqual(proof.byKind, {newsroom:{batches:2,rows:100},feed:{batches:1,rows:42}});
});
test('rejects a stale or unauthenticated Storage manifest', () => {
  assert.throws(() => verifyColdArchiveProof({...receipt,manifest_sha256:'z'.repeat(64)},metadata),/manifest/);
  assert.throws(() => verifyColdArchiveProof({...receipt,project:'some-other-project'},metadata),/project-bound/);
});
test('rejects even small gaps and duplicate batch coverage', () => {
  assert.throws(() => verifyColdArchiveProof({...receipt,archive_objects:[{...receipt.archive_objects[0],rows:99},receipt.archive_objects[1]]},metadata),/missing or over-reporting/);
  assert.throws(() => verifyColdArchiveProof(receipt,[...metadata,metadata[0]]),/Duplicate/);
  assert.throws(() => verifyColdArchiveProof({...receipt,batch_count:4},metadata),/coverage/);
});
test('rejects mismatched object hashes and copies of the same path', () => {
  assert.throws(() => verifyColdArchiveProof({...receipt,archive_objects:[{...receipt.archive_objects[0],sha256:'c'.repeat(64)},receipt.archive_objects[1]]},metadata),/SHA-256/);
  assert.throws(() => verifyColdArchiveProof({...receipt,archive_objects:[receipt.archive_objects[0],receipt.archive_objects[0]]},metadata),/duplicate/);
});
