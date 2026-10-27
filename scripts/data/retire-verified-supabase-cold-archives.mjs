/**
 * Safely finish the existing 2026-10-12 cold-archive lifecycle.
 *
 * The existing service-role-only SQL routines select strictly unreferenced
 * eligible rows, stage original JSON, and refuse to retire if a record changes
 * or gains a publishing reference. The exporter writes compressed copies to a
 * PRIVATE bucket and verifies authenticated readback.
 *
 * This coordinator checks every exported object's SHA256, every staged batch
 * and row-ID MD5, and the exact batch inventory BEFORE invoking retirement.
 * It never deletes from operational tables directly, never VACUUM FULLs and
 * has no broad 'cleanup' fallback.
 */
import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import {
  COLD_ARCHIVE_BUCKET, COLD_ARCHIVE_KINDS, COLD_ARCHIVE_PROJECT,
  verifyArchiveManifest,
} from "./private-archive-verification.mjs";

const url = `https://${COLD_ARCHIVE_PROJECT}.supabase.co`;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
const repo = process.env.GITHUB_REPOSITORY;
if (!key || repo !== "keeptxred/texas-heartland-hub")
  throw new Error("Trusted production GitHub job and service-role secret required");
if (process.env.ARCHIVE_RETIRE_ENABLED !== "1") {
  console.log("Archive retirement intentionally disabled (explicit enable flag not set).");
  process.exit(0);
}

const client = createClient(url, key, { auth: {
  persistSession: false, autoRefreshToken: false,
} });
const bucket = client.storage.from(COLD_ARCHIVE_BUCKET);
const MAX_CYCLES = 4;
const SOFT_DB_STOP = 498_500_000; // avoid filling the last 1.5 MB with staging
const stageProcedures = {
  feed: "stage_expired_free_tier_feed",
  newsroom: "stage_expired_free_tier_newsroom",
};
const retireProcedures = {
  feed: "retire_verified_expired_free_tier_feed",
  newsroom: "retire_verified_expired_free_tier_newsroom",
};

async function capacity() {
  const { data, error } = await client.rpc("read_shared_free_tier_database_capacity");
  if (error || data?.project_id !== COLD_ARCHIVE_PROJECT ||
      !Number.isSafeInteger(Number(data.database_bytes)))
    throw new Error("Verified shared-capacity probe failed");
  return Number(data.database_bytes);
}
async function metadata() {
  const batches = [];
  for (let offset = 0; offset < 10000; offset += 100) {
    const { data, error } = await client.rpc("list_private_cold_archive_batches", {
      p_offset: offset, p_limit: 100,
    });
    if (error || !Array.isArray(data)) throw new Error("Staged archive listing failed");
    batches.push(...data);
    if (data.length < 100) return batches;
  }
  throw new Error("Private archive batch safety limit exceeded");
}
async function download(path) {
  const { data, error } = await bucket.download(path);
  if (error || !data) throw new Error("Private Storage download failed for " + path);
  return Buffer.from(await data.arrayBuffer());
}

async function verifyLivePrivateBackup(manifestName, expectedBatches) {
  const bucketInfo = await client.storage.getBucket(COLD_ARCHIVE_BUCKET);
  if (bucketInfo.error || bucketInfo.data?.public !== false)
    throw new Error("Cold archive Storage bucket must remain private");

  const contents = await download(manifestName);
  const manifest = JSON.parse(contents.toString("utf8"));
  if (!Array.isArray(manifest.archive_objects) || manifest.archive_objects.length > 200)
    throw new Error("Unexpected archive object count");
  const objects = new Map();
  for (const descriptor of manifest.archive_objects) {
    if (!descriptor.storage_path || objects.has(descriptor.storage_path))
      throw new Error("Duplicate archive object path");
    objects.set(descriptor.storage_path, await download(descriptor.storage_path));
  }
  const current = await metadata();
  if (JSON.stringify(current) !== JSON.stringify(expectedBatches))
    throw new Error("Archive staging changed during export");
  return verifyArchiveManifest(manifestName, contents, current, objects);
}

async function cycle(kind, size) {
  if (size >= SOFT_DB_STOP) {
    throw new Error(`Database at ${size} bytes; staging suspended before Free Plan capacity exhaustion`);
  }

  const limit = size > 490_000_000 ? 25 : 75;
  const { data: stage, error: stageError } = await client.rpc(stageProcedures[kind], { p_limit: limit });
  if (stageError || !stage || stage.pending_backup !== true && Number(stage[
      kind === "feed" ? "staged_feed" : "staged_clusters"
    ]) !== 0)
    throw new Error(`Staging ${kind} failed: ${stageError?.message ?? "invalid staged response"}`);

  const batches = await metadata();
  const staged = batches.filter(b => b.archive_kind === kind);
  if (!staged.length) {
    if (stage.pending_backup === true) throw new Error("Staging claims exist without readable batches");
    console.log(`${kind}: no eligible old, unpublished, unreferenced records`);
    return false;
  }
  const expectedRows = staged.filter(b => b.source_table === COLD_ARCHIVE_KINDS[kind])
    .reduce((total, b) => total + b.record_count, 0);
  if (expectedRows < 1 || expectedRows > 2000 || staged.length > 100)
    throw new Error("Retirement archive source/batch count outside allowed bounds");

  // Preserve existing article-URL snapshot and immutable private export
  // safeguards. A failed exporter leaves all originals and staging untouched.
  const stdout = execFileSync("bun", ["scripts/data/export-supabase-cold-archives.mjs"], {
    encoding: "utf8", timeout: 8 * 60 * 1000, maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, SUPABASE_URL: url, ARTICLE_SNAPSHOT_ONLY: "0" },
  });
  const manifest = stdout.match(/^VERIFIED_COLD_ARCHIVE_MANIFEST=(\S+)$/m)?.[1];
  if (!manifest) throw new Error("Verified exporter did not provide manifest completion proof");

  const totals = await verifyLivePrivateBackup(manifest, batches);
  if (totals[kind]?.rootRows !== expectedRows || totals[kind]?.batches !== staged.length)
    throw new Error("Current retired set lacks exact private Storage backup");

  const inputs = kind === "feed"
    ? { p_manifest_name: manifest, p_expected_feed_rows: expectedRows, p_expected_batches: staged.length }
    : { p_manifest_name: manifest, p_expected_clusters: expectedRows, p_expected_batches: staged.length };
  const { data: retired, error: retirementError } =
    await client.rpc(retireProcedures[kind], inputs);
  const actual = Number(retired?.[kind === "feed" ? "retired_feed" : "retired_clusters"]);
  if (retirementError || actual !== expectedRows)
    throw new Error(`Verified retirement refused for ${kind}: ${retirementError?.message ?? "count mismatch"}`);

  if ((await metadata()).some(b => b.archive_kind === kind))
    throw new Error("Private staging not released after verified retirement");
  console.log(JSON.stringify({ kind, retired: actual, verifiedManifest: manifest,
    capacityBytesBefore: size, capacityBytesAfter: await capacity() }));
  return true;
}

const initial = await capacity();
console.log(`Shared database before verified cold retention: ${initial} bytes`);
for (const kind of ["feed", "newsroom"]) {
  for (let i = 0; i < MAX_CYCLES; i++) {
    const changed = await cycle(kind, await capacity());
    if (!changed) break;
  }
}
console.log(`Verified cold-retention completed; final shared database: ${await capacity()} bytes`);
