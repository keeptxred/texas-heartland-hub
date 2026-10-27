/**
 * Reference-safe, resumeable Free Plan cold-record maintenance.
 *
 * Production: bounded stage -> independent existing export to PRIVATE Storage
 * -> authenticated readback + per-object SHA-256/row-ID verification ->
 * manifest coverage proof -> existing transactional retirement RPC (which
 * rechecks original JSON and all live/FK references under row locks).
 *
 * Fail CLOSED; pending staged archives survive any interrupted export and
 * are re-exported/read back on the next run. No direct DELETE/TRUNCATE, no
 * admin table access and no table rewrites in this script.
 *
 * A separate workflow continues immutable daily published-article snapshots.
 */
import { spawnSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { verifyColdArchiveProof } from './verified-cold-archive-proof.mjs';

const PROJECT = 'ftkznprjljkhymknvhye';
const URL = 'https://' + PROJECT + '.supabase.co';
const REPO = 'keeptxred/texas-heartland-hub';
const ARCHIVE_EXPORTER = 'scripts/data/export-supabase-cold-archives.mjs';
const CYCLES = 2;
const MAX_STAGE_FEED = 75;
const MAX_STAGE_NEWSROOM = 65;
const MIN_HEADROOM = 1_200_000;
const STRICT_LIMIT = 500_000_000;

const key = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
if (!key) throw new Error('Existing trusted Supabase service-role secret is required');
if (process.env.GITHUB_REPOSITORY !== REPO) {
  throw new Error('Unexpected repository; refusing private archive operations');
}
const db = createClient(URL, key, {auth: {persistSession: false, autoRefreshToken: false}});
const active = process.env.ENABLE_VERIFIED_COLD_RETIREMENT === '1';

function safeResult(label, response) {
  if (response.error) {
    throw new Error(label + ' failed: ' + (response.error.code || response.error.message));
  }
  return response.data;
}

async function sizeSnapshot() {
  const value = safeResult('Capacity probe', await db.rpc('read_shared_free_tier_database_capacity'));
  const bytes = Number(value?.database_bytes);
  if (value?.project_id !== PROJECT || !Number.isSafeInteger(bytes) || bytes < 1) {
    throw new Error('Untrusted or malformed shared database capacity probe');
  }
  return bytes;
}

async function stagedMetadata() {
  const out = [];
  for (let offset = 0; offset <= 3000; offset += 100) {
    const page = safeResult('Archive batch listing', await db.rpc('list_private_cold_archive_batches', {
      p_offset: offset, p_limit: 100,
    }));
    if (!Array.isArray(page)) throw new Error('Archive batch listing was not an array');
    out.push(...page);
    if (page.length < 100) return out;
  }
  throw new Error('Archive batch listing exceeded safety limit');
}

async function stage(kind, size) {
  const rpc = kind === 'feed' ? 'stage_expired_free_tier_feed' : 'stage_expired_free_tier_newsroom';
  const arg = kind === 'feed' ? {p_limit: size} : {p_limit: size};
  const data = safeResult('Stage ' + kind, await db.rpc(rpc, arg));
  if (!data || typeof data !== 'object' || data.pending_backup !== true &&
      data.pending_backup !== false) {
    throw new Error('Malformed staged archive response: ' + kind);
  }
  console.log(JSON.stringify({phase:'staged',kind,detail:data}));
}

function verifiedExport() {
  // Existing exporter strictly verifies private-bucket status, every batch
  // checksum, every uploaded gzip object, the immutable manifest and the
  // downloaded bytes. On ANY failure the subprocess exits nonzero.
  const result = spawnSync(process.execPath, [ARCHIVE_EXPORTER], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SUPABASE_URL: URL,
      ARTICLE_SNAPSHOT_ONLY: '0',
      SKIP_ARTICLE_SNAPSHOT: '1',
      VERIFIED_COLD_RETENTION_JOB: '1',
    },
    maxBuffer: 8 * 1024 * 1024,
    encoding: 'utf8',
    timeout: 7 * 60 * 1000,
  });
  if (result.error || result.status !== 0) {
    // No database retirement on exporter failure. Staged rows remain for
    // retry, and only a short no-credentials diagnostic enters CI logs.
    const tail = (result.stdout || '').slice(-900);
    throw new Error('Private Storage export/readback did not complete: ' +
      (result.error?.message || 'exit '+result.status) + '\n' + tail);
  }
  const receipts = (result.stdout || '').split('\n')
    .filter(line => line.startsWith('VERIFIED_COLD_ARCHIVE_RECEIPT='));
  if (receipts.length !== 1) throw new Error('Expected one verifiable Storage export receipt');
  const receipt = JSON.parse(receipts[0].slice('VERIFIED_COLD_ARCHIVE_RECEIPT='.length));
  return receipt;
}

async function retire(kind, proof) {
  const metrics = proof.byKind[kind];
  if (!metrics) return 0;
  const rpc = kind === 'newsroom'
    ? 'retire_verified_expired_free_tier_newsroom'
    : 'retire_verified_expired_free_tier_feed';
  const args = kind === 'newsroom'
    ? {p_manifest_name: proof.manifestName,p_expected_clusters: metrics.rows,
       p_expected_batches: metrics.batches}
    : {p_manifest_name: proof.manifestName,p_expected_feed_rows: metrics.rows,
       p_expected_batches: metrics.batches};

  // Each pre-deployed SECURITY DEFINER retirement RPC is granted ONLY to
  // service_role. It locks sources, checks exact archived JSONB parity,
  // publication/soft references and every FK child before transactional
  // deletion. No optional bypass and no direct DELETE permissions here.
  const result = safeResult('Verified ' + kind + ' retirement', await db.rpc(rpc,args));
  const actual = Number(kind === 'newsroom' ? result?.retired_clusters : result?.retired_feed);
  if (actual !== metrics.rows || result?.storage_manifest !== proof.manifestName) {
    throw new Error('Retirement response count/manifest mismatch: ' + kind);
  }
  console.log(JSON.stringify({phase:'retired_verified',kind,rows:actual,manifest:proof.manifestName}));
  return actual;
}

const initial = await sizeSnapshot();
console.log('Shared Supabase measured PostgreSQL capacity: ' + initial +
  ' bytes; headroom ' + (STRICT_LIMIT-initial) + ' bytes');
if (!active) {
  console.log('READ ONLY: ENABLE_VERIFIED_COLD_RETIREMENT is not enabled. No staging or retirement.');
  process.exit(0);
}

let totalFeed = 0, totalNewsroom = 0;
for (let cycle = 1; cycle <= CYCLES; cycle++) {
  const before = await sizeSnapshot();
  // Staging temporarily duplicates old evidence in PostgreSQL. If quota
  // headroom is too tight to do so safely, preserve all rows and alert.
  if (STRICT_LIMIT - before < MIN_HEADROOM) {
    throw new Error('Insufficient temporary archive staging headroom. Fail closed: ' + before);
  }
  const existing = await stagedMetadata();
  if (!existing.length) {
    await stage('newsroom', MAX_STAGE_NEWSROOM);
    await stage('feed', MAX_STAGE_FEED);
  } else {
    // Recovery from crash after staging or after exporting: do NOT replace
    // a pending verified claim. First re-export and complete it.
    console.log('Resuming previously staged archive batch without restaging');
  }
  const metadata = await stagedMetadata();
  if (!metadata.length) {
    console.log('No eligible cold records for this cycle');
    break;
  }
  if (metadata.some(m => !['feed','newsroom'].includes(m.archive_kind))) {
    throw new Error('Unexpected additional archive kind; refusing unrelated retirement');
  }
  const receipt = verifiedExport();
  const proof = verifyColdArchiveProof(receipt, metadata);
  // Retire newsroom first: this may release reference links so next cycle's
  // feed eligibility check can safely reconsider now-unreferenced sources.
  totalNewsroom += await retire('newsroom', proof);
  totalFeed += await retire('feed', proof);
  console.log(JSON.stringify({cycle, phase:'complete', feed:totalFeed, newsroom:totalNewsroom}));
}
const finalBytes = await sizeSnapshot();
console.log(JSON.stringify({ok:true,feedRowsRetired:totalFeed,
  newsroomClustersRetired:totalNewsroom,initialBytes:initial,finalBytes,
  warning: finalBytes >= 450_000_000 ? 'Free Plan capacity pressure remains' : null}));
