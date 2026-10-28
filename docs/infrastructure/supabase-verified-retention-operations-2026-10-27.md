# Shared Supabase verified cold retention — operations and recovery

Date: 2026-10-27. Project: `ftkznprjljkhymknvhye` (KeepTXRed and TexasDefined).
Repository: `keeptxred/texas-heartland-hub`.

## Why the recurring job exists

The original October 12 cold archive/reclamation was a one-time,
independently verified export/offload of older unpublished operational rows.
The project has since grown close to the conservative 500,000,000-byte
PostgreSQL Free Plan threshold. The October 27 index cleanup reclaimed
approximately 15 MB without deleting records, but is not a durable
retention strategy.

## Existing deployed database safety functions

- `public.stage_expired_free_tier_feed`: only old, unlinked (21+ days)
  RSS evidence with every explicit FK/soft-reference check; snapshots the
  full source row and normalization/fetch children into private JSONB batches.
- `public.stage_expired_free_tier_newsroom`: only READY but never-published
  old clusters (30+ days since first seen, 14+ since last seen) whose
  candidates are still PENDING and have no generation drafts. Retains
  all complete cluster/candidate/research/item child records.
- `public.retire_verified_expired_free_tier_feed` and
  `public.retire_verified_expired_free_tier_newsroom`: use transactional
  row locks, compare every archived JSONB row with the current original,
  recheck all source/child/publication references, and require a private
  Storage manifest and matching row/batch counts before retiring rows.
- These RPC functions are **service_role-only**. Anonymous and ordinary
  authenticated roles do not have EXECUTE. Do not grant these functions to
  public clients or bypass their record and reference guards.

## Automated workflow and proof sequence

`.github/workflows/retire-verified-supabase-cold-records.yml` is
serialized and runs at 00:27, 04:27, 08:27, 12:27, 16:27 and 20:27 UTC,
plus on deployment of its own workflow changes, and via manual dispatch.
The only credential is the existing GitHub Supabase service-role secret.
`ENABLE_VERIFIED_COLD_RETIREMENT=1` is required for any mutating action.

Each scheduled run attempts two sequential cycles during normal capacity
conditions, or up to four sequential cycles when the measured PostgreSQL size
is at least 490,000,000 bytes. The four-cycle order is newsroom → feed →
newsroom → feed; each cycle archives at most 65 newsroom clusters or 75 feed
rows and completes Storage readback plus reference-checked retirement before
another cycle begins. 
This pressure-triggered mode raises maximum daily archival throughput from
390 to 780 newsroom clusters and from 450 to 900 feed parent records (six
scheduled runs/day). Actual throughput depends on source eligibility and
publication protections; database pages are usually reused, not physically
returned immediately. If a feed stage times out, previously completed
newsroom retirements remain committed and fully backed up. Never respond by
removing reference guards or increasing concurrent archive jobs.

A run requires at least
1.2 MB of temporary PostgreSQL staging headroom to avoid gratuitously
worsening quota pressure. A tighter threshold or database failure stops
before any attempt to delete.

1. Resume any existing private archive claims first; never overwrite pending
   batches left by a prior interrupted run.
2. Otherwise call both of the already-deployed staging RPCs. No live
   source rows are deleted at this stage.
3. Invoke `scripts/data/export-supabase-cold-archives.mjs` in a restricted
   archive-only mode. The exporter independently reads every private
   staged batch, verifies record count and ordered ID MD5, compresses
   private objects with SHA-256 filenames, downloads each Storage object,
   validates its bytes and NDJSON content, then downloads and verifies
   the immutable manifest.
4. Accept a machine-readable export receipt only when that entire
   readback succeeds. Compare receipt against a new database batch listing:
   project, immutable manifest SHA, exact kind/row/batch coverage, duplicate
   object paths, object SHA name, and upload size.
5. Call only the guarded retirement RPCs with the just-verified manifest
   path and exact row/batch counts. Supabase revalidates every original and
   references before deletion.
6. Query current capacity and report actual completed row counts.

There is **no direct DELETE or TRUNCATE** in the runner/exporter. Failed
backup verification leaves staged records in private PostgreSQL, and
the next run re-exports and resumes those staged claims before any
additional staging.

The existing daily published-article/URL immutable Storage snapshot job
is unchanged. Frequent archival maintenance suppresses only a duplicate
*second* snapshot in the new job, not the daily recovery job.

## What to check after rollout

- GitHub workflow success with `retired_verified` log events and a
  real private manifest. A workflow marked successful without any
  eligible records is normal when all retained records remain protected.
- `private.free_tier_feed_retention_runs` and
  `private.free_tier_newsroom_retention_runs`: new successful certification
  entries; these are private ledgers, not public content.
- `private.feed_cold_batches` and `private.newsroom_cold_batches`:
  should return to zero after each successful run; nonzero signals a
  recoverable interrupted staging/export.
- `pg_database_size(current_database())`: physical size may not fall after
  deleting source rows; normal VACUUM makes heap pages available for reuse.
  Check multi-day physical growth trends, not only the immediate snapshot.
- Supabase query/WAL and disk-I/O volume after the merged scoring/RSS
  write reductions. Historical aggregate counters are not post-change proof.
- [Free Plan alert issue](https://github.com/keeptxred/texas-heartland-hub/issues/2762).
  The issue remains actionable if the database is near 500 MB.

## Safe pause, recovery and incident response

To pause new archival cycles, disable this GitHub scheduled workflow.
Do not remove staged rows or force-delete any source tables.
After recovering credentials/storage access, rerun the workflow;
the existing pending batches are exported and verified before retirement.
If Supabase returns `Feed changed or gained protected references`,
`Newsroom cluster changed`, or a child-content mismatch, **do not force
retirement**. Investigate the new reference or changed record and repair
the backed-up staging only with an independently reviewed procedure.

All private backups are retained under
`shared-postgres-cold-archives/postgres-cold/YYYY-MM-DD/`. Restore by
checking the immutable manifest SHA, each compressed object SHA-256,
each batch's ordered record-ID MD5, then restoring parents before
dependent rows with exact JSONB records. Never publish private backups,
credentials or restore data through the public web application.

Do not run broad scheduled VACUUM FULL/REINDEX, disable publishing,
delete authoritative bills/tax data, or purchase more Supabase resources
as a substitute for verified retention.
