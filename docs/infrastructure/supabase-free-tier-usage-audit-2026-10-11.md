# Shared Supabase Free Plan Recovery — Final Verified Production State

**Verification date:** October 11, 2026 (October 12 UTC).  
**Project:** `ftkznprjljkhymknvhye` — shared by **KeepTXRed** and **TexasDefined**.  
**Organization:** Supabase Free Plan; target strictly below 500,000,000 PostgreSQL bytes.

## Certified outcome

| Measurement | Verified |
|---|---:|
| Initial physical PostgreSQL size | 699,272,339 bytes ≈ 699.27 decimal MB (666.89 MiB) |
| Post-release physical PostgreSQL size | **324,291,731 bytes ≈ 324.29 decimal MB (309.27 MiB)** |
| Physical PostgreSQL bytes recovered | **374,980,608 bytes ≈ 374.98 decimal MB** |
| Remaining headroom under strict 500MB decimal cap | **175,708,269 bytes ≈ 175.71 decimal MB** |
| Active scheduled jobs | 29 |
| Private backup objects | 21 |
| Private backup Storage size | 46,800,324 bytes ≈ 44.63 MiB |

All 29 cron jobs were active on the final check. Published KTR/TD article, government, authority graph and property-tax records were not removed. The historical, unpublished, and unreferenced operational records were preserved outside PostgreSQL before their DB archive copies were released.

## Historical recovery stages completed

1. Verified table / index / TOAST sizes and the shared cross-site dependencies. Initial usage was dominated by KTR newsroom and legislative pipelines, not TexasDefined's Business Network.
2. Cron retention: 48,619 completed-success records older than seven days rolled into 1,192 private daily aggregates; all failed run records preserved; hourly scheduled success-detail pruning.
3. Legislative opportunities: 60,518 expired, editorial-only opportunities archived with exact-content checks. Official bills, legislative actions, and sponsors retained.
4. Dormant unpublished newsroom: 11,092 clusters, 11,092 candidate records, 10,162 research packets, and 14,273 cluster items archived with ID/record parity; published clusters and drafts protected.
5. Unreferenced old feed: 27,885 feed records, 27,192 normalization records and 4,067 source fetch-state records archived with published articles, soft JSON ID evidence, canonical dedupe links and living-story integrity guarded.
6. Physical-only VACUUM FULL + ANALYZE on selected news, authority, legislative and tax tables removed bloat. Retained **145,098 authority relationships, 147,775 bill actions, 41,504 sponsors, 12,786 bills, and 23,087 property tax rows**.
7. All eight archived source record types passed sample exact JSONB reconstruction tests. Full archived copies had been compared against the original live records before retirement.

## Private Storage offload: completed and independently verified

Project bucket `shared-postgres-cold-archives` has `public=false`.

**[Verified GitHub export run](https://github.com/keeptxred/texas-heartland-hub/actions/runs/38188210442)** completed full compressed Storage upload and authenticated download verification, checked SHA-256 hashes and original record-count/ID checksums. The exporter is **export-only** and cannot delete database rows.

Offload included:
- Legislative archive: **60,518** records; **122** archived batches.
- Newsroom archive: **46,619** records; **235** archived batches.
- Feed archive: **59,144** records; **396** archived batches.
- **166,281 historical records** total, in **20 compressed private files + 1 JSON manifest**.
- The 21 objects total **46,800,324 bytes** (approximately **44.63 MiB**). All are nonempty. Stored in Supabase Storage, subject to its separate quota.

**Verified immutable manifest:**
```
postgres-cold/2026-10-12/manifest-d4ee08e9afd66313b815b3bab4b03712fd4c3fc97e70548fc9ab2494546b5bf6.json
```

A guarded PostgreSQL transaction checked that the Storage bucket was private; that 20 gzip objects and the exact manifest existed; that storage bytes and all three DB archive row/batch totals exactly matched the verified export. It then inserted the backup certificate before atomically truncating *only the three duplicate private cold archive tables*. No operational or published tables were truncated.

**Recovery certificate:** `private.cold_archive_offload_certifications` has `released_from_database=true`, run URL, 21-object manifest location and exact row counts. The three archive tables are now empty and their recoverable records are in the private Storage objects.

Restore protocol: use the manifest to locate exact files, authenticate privately, verify SHA-256 on every file, gunzip NDJSON, check each batch's record count/MD5 of ordered IDs, then restore parent records before FK dependents via `jsonb_populate_record`. Do not expose private Storage backup files or credentials to public clients.

## Security and source control

- Private tables: RLS on, no public/anon/authenticated grants.
- `public.list_private_cold_archive_batches` and `public.read_private_cold_archive_batch` are **read-only, SECURITY DEFINER, and granted only to `service_role`**. Verified effective EXECUTE ACL: anon=false, authenticated=false, service_role=true. Never open these to public callers.
- No additional PostgreSQL URL or password is required for the GitHub exporter; it uses the existing trusted server-side service-role key.
- Supabase export uses 45,000,000-byte per-object maximum (beneath Free Plan 50 MB global upload limit), with immutable SHA-256 filenames and verified private read-back.
- Cron, database private archive and monitoring migrations are recorded in [KeepTXRed PR #2724](https://github.com/keeptxred/texas-heartland-hub/pull/2724). Initial successful cron-retention work was merged in [PR #2722](https://github.com/keeptxred/texas-heartland-hub/pull/2722).
- Focused Supabase CI, workflow validation, production build validation, daily-news validation and legislative validation have passed on follow-up branch; recheck final HEAD before PR merge.

## Active capacity monitoring

- `free-tier-successful-cron-history-retention`: active hourly pruning of only success runs older than seven days; all failures retained.
- `free-tier-database-capacity-monitor`: active hourly capacity sample at minute 45 UTC, retaining 90 days of hourly measurements and the daily summary.
- Internal status levels: warning at 450 million bytes; critical at 475 million; over limit at 500 million.
- Sample tables are private. **An internal status is NOT a delivered owner notification.**

### Read-only acceptance queries

```sql
select pg_database_size(current_database()) as bytes,
       round(pg_database_size(current_database())/1000000.0,2) as decimal_mb;
select jobname, active, schedule from cron.job where jobname like 'free-tier-%';
select measured_hour,database_bytes,quota_status
from private.database_capacity_hourly order by measured_hour desc limit 10;
select certified_at,manifest_object_name,verified_storage_objects,
       legislative_rows,newsroom_rows,feed_rows,released_from_database
from private.cold_archive_offload_certifications order by certified_at desc limit 3;
select b.id,b.public,count(o.id) as objects
from storage.buckets b left join storage.objects o on o.bucket_id=b.id
where b.id='shared-postgres-cold-archives' group by b.id,b.public;
```

## Remaining sustainability work

**Immediate Free Plan database-size objective is fully achieved.** No paid upgrade was necessary.

Important remaining tasks are explicitly **not** complete:
- Implement **ongoing, safe, automated age-based archive-and-retirement** for newly accumulating unpublished newsroom and feed data. The initial cleanup was one-time. Archive snapshots must be exported and read back before the database copies are retired. Do not silently enable untested destructive scheduled cleanup.
- When PR #2724 is merged, its private Storage export workflow is configured to run weekly, on main source changes and via manual dispatch; it remains **export-only**, not automatic DB-side archival or pruning.
- Verify actual Supabase non-database quotas: monthly egress, Edge Function invocations, monthly active users, and Storage.
- Deliver an owner notification for 450/475/500 MB thresholds if needed; private internal status alone does not alert the owner.
- Run a full production/browser smoke test of both applications after the source-control merge; database content counts and selected public pages have been checked, but that does not certify every feature.

**Cost rule:** Avoid disabling any live feature merely to lower size. Preserve official history and published pages. Prefer verified private cold Storage for disposable operational evidence, track physical bytes (not just deleted row counts), and never run repeated broad VACUUM FULL on a live schedule without lock and capacity review.


## New ongoing protection built 2026-10-12 (daily feed archive)

- The service-role-only `public.read_shared_free_tier_database_capacity()` returns exact database bytes with `ok / warning / investigate / critical / urgent / over_limit` at 375/400/450/475/500 million bytes. Effective EXECUTE access was verified: anon=false, authenticated=false, service_role=true.
- `.github/workflows/supabase-free-tier-capacity-alert.yml` is designed to run four times daily and maintain ONE owner-facing GitHub Issue when database usage exceeds 375 million bytes; issue severity is updated and the issue is closed on recovery. It uses the existing service-role secret, GitHub's issue token, no new account credentials, and does not alter user data.
- `public.stage_expired_free_tier_feed(integer)` stages at most 2,000 **unpublished** incoming feed records per run older than **21 days** after checking both site article references, canonical deduplication, event JSON source IDs, reconciliation holds, rewrite history, and live newsroom links. It snapshots exact original rows and their normalization/page-fetch dependents in RLS-protected private archive batches. **It does not delete live data.**
- `public.retire_verified_expired_free_tier_feed(text,integer,integer)` is callable only by service role. It checks a private immutable Storage manifest, exact parent record equality, all protected references, and each associated normalization/fetch-state archive copy. On ANY mismatch the operation raises an error and transaction rolls back without deleting originals; on verified success, it deletes only the archived feed parents, cascades protected children, records a permanent private retirement certificate, and releases only the now-redundant DB archive batches.
- The existing `scripts/data/export-supabase-cold-archives.mjs` was extended to run **stage → private Storage upload → SHA-256 download/readback + row checksum verification → guarded retirement** in that order. Main branch schedule: every day at 07:33 UTC (when this PR is merged); `workflow_dispatch` permits explicit runs; source-push jobs on main remain export-only. On the review branch, code changes run a **one-row canary**.
- **Verified live canary at 2026-10-12 12:37 UTC:** [successful GitHub action run](https://github.com/keeptxred/texas-heartland-hub/actions/runs/38250164626). GitHub log confirms `staged_feed=1`, 2 archived records in 2 private batches, full Storage read-back verified, `retired_feed=1`. The DB `private.free_tier_feed_retention_runs` ledger confirms exactly 1 row archived and retired; no staging claims or database cold-batches remained. Permanent government history and public content were not touched.
- The main scheduled exporter now has one GitHub issue for operational failures, closes the issue on successful recovery, and does not attempt any retention if backup verification fails. The separate capacity watcher raises earlier threshold warnings.
- The daily process does NOT schedule `VACUUM FULL`: it can block live writes. Space from DELETE becomes reusable within Postgres, while the database-size monitor detects cumulative physical file growth.

Remaining: add a similarly guarded, production-tested automatic retirement cycle for aged **unpublished newsroom clusters/candidates/research**; verify main-branch workflow schedules after merge; audit monthly egress/Edge Function/MAU allowances. Do not claim all Free Plan quotas are fully under control until those are measured. 
