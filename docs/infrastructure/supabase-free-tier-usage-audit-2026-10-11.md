# Shared Supabase Free-Tier Database Recovery — verified 2026-10-11/12 UTC

Production project: `ftkznprjljkhymknvhye` (shared by KeepTXRed and TexasDefined). Organization plan: **free**. Public, published, and official-history records were retained. All figures below come from live PostgreSQL queries, not capacity forecasts.

## Current result

- **Initial:** 666.89 MiB (699,272,339 bytes, approximately).
- **Latest physical measurement:** **451.30 MiB**, or **473.22 million bytes**. This is below both conservative 500 MB (decimal) and 500 MiB thresholds.
- Recovered approximately **215.6 MiB** physically from start.
- The remaining capacity margin is about **26.8 MB using decimal units**; this alone is not enough to guarantee long-term Free Plan compliance.
- Published story clusters and publication candidates remained 83 each, daily articles 283, and TexasDefined articles 40 immediately after feed cleanup.

## Changes already executed and confirmed

1. Applied 20261011233913 (cron success daily rollup and restricted batch prune).
2. Applied 20261011234016 (active hourly 7-day successful cron retention, preserve all failed runs). 48,619 older successful executions condensed into 1,192 rollups, then `VACUUM FULL cron.job_run_details`. Database fell to 648.63 MiB.
3. Applied 20261011234405 (private, RLS-protected legislative opportunity cold archive). Archived 60,518 historical editorial opportunities, verified 60,518 distinct IDs and zero content mismatches, removed their active copies and compacted. Database fell to 606.75 MiB; 31 newer opportunities remained.
4. Applied 20261011234848 (private newsroom cold archive). Exact-copied 11,092 dormant unpublished story clusters, 11,092 candidates, 10,162 packets, 14,273 cluster items. Each archive set had zero ID/content mismatches. Protected all published/linked clusters and drafts. Retired eligible clusters with row locks, child-equality protection, and FK cascading; compacted four live tables. Database fell to 563.45 MiB.
5. Applied 20261011235331 (private feed cold archive). Exact-copied 27,885 incoming feed items, 27,192 normalization records and 4,067 source fetch-state records; protected published slugs, TD source FKs, independent KTR article source URLs, event fact JSON ID references, reconciliation holds, rewrite history, manual overrides, current cluster links, living stories, and duplicate canonical references. Guarded retirement transaction rejected zero dependent mismatches, removed 27,885 aged records, and compacted three live tables. Database fell to 482.56 MiB.
6. Additional `VACUUM FULL` of `news_event_cluster_sources` and `news_event_facts` returned previously unallocated bloat, bringing the verified result to 473.22 decimal MB / 451.30 MiB.
7. Applied 20261012000443: twice-daily private capacity sample job (04:55 and 16:55 UTC), with warning at 450 million bytes, critical at 475 million, and hard limit at 500 million. Test sample 473,246,867 bytes, status `warning`.
8. All cron publishing/sync jobs continued to be active. No feature was intentionally disabled.

## Cold archives still INSIDE PostgreSQL

- `private.legislative_opportunity_cold_batches`: 60,518 exact records, ~20.30 MiB.
- `private.newsroom_cold_batches`: 46,619 exact records across four sources, ~25.11 MiB.
- `private.feed_cold_batches`: 59,144 exact records across three sources, ~35.10 MiB.
- Cold archive total: **~80.51 MiB**. This is included in the 451.30 MiB live database measurement.

**DO NOT delete or truncate these three tables until their complete datasets have been exported to a private Supabase Storage bucket and read back with SHA-256 + record-count verification.** This export is not yet certified.

A private-Storage export-only pipeline was added at `scripts/data/export-supabase-cold-archives.mjs` with a trusted-branch GitHub Actions workflow. It requires existing GitHub secrets `SUPABASE_DB_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or documented fallback). It is strictly export-only; it has NO DB DELETE or VACUUM calls. Await positive evidence from `storage.buckets` and `storage.objects` before any further database archive removal.

## Capacity watch

```sql
select pg_database_size(current_database()) as bytes_used,
       round(pg_database_size(current_database())/1000000.0,2) as decimal_mb,
       round(pg_database_size(current_database())/1048576.0,2) as mib_used;
select measured_day,measured_at,database_bytes,status
from private.database_capacity_daily order by measured_day desc limit 10;
select jobname,active,schedule from cron.job
where jobname in ('free-tier-database-capacity-monitor',
                  'free-tier-successful-cron-history-retention');
```

`warning` and `critical` are stored DB states **not owner notifications**. Do not claim any email alert exists until a delivery mechanism is verified.

## Required sustainability work

1. Certify successful private-Storage upload/download of all three cold archives. The Storage quota is separate from the 500 MB PostgreSQL quota; existing image objects occupied ~72.26 MiB prior to this phase.
2. Only after verified read-back, remove the *identically archived* private DB copies and compact, gaining an estimated additional ~80 MiB of headroom.
3. Implement ongoing, bounded cleanup with exact-copy cold archival and published/reference guards, plus verified Storage drain. Static one-time cleanup alone will not sustain the Free Plan under continuous ingestion.
4. Review zero-scan indexes only against real query plans and feature dependencies; never drop primary/unique indexes to chase arbitrary savings.
5. Keep daily snapshots, verify query/ingestion behavior after each maintenance batch, and backstop Free Plan status with the Supabase Dashboard's actual plan quota.
6. Audit unrelated Free Plan allowances (egress, Edge Function invocations, active users, Storage). These were **not** verified here.

## Restore rules

Archives are versioned JSONB arrays with complete original record columns and ID checksums. Only a database administrator may restore. For each batch inspect with `jsonb_array_elements(records)`; reconstruct rows with `jsonb_populate_record(null::public.<original_table>, entry)` and restore the original parent rows before their FK children. Never expose private archive content in a public API or log.

Source control: [merged cron-retention PR #2722](https://github.com/keeptxred/texas-heartland-hub/pull/2722) and [draft archive/export follow-up PR #2724](https://github.com/keeptxred/texas-heartland-hub/pull/2724). The latter is NOT yet approved or merged. Live migration application and PR acceptance are separate states.


## Follow-up production measurements (2026-10-12 UTC)

- After additional **physical-only** VACUUM (FULL, ANALYZE) on authority_relationships, bill_actions, bill_sponsors and bills, physical database usage fell to **416.11 decimal MB**, with all original 145,098 authority relationships, 147,775 actions, 41,504 sponsors and 12,786 bills preserved.
- Additional compaction of TexasDefined taxing rates and other legislative history preserved 23,087 tax rows. Subsequent smaller table compaction produced **408.42 decimal MB** at 00:25 UTC, or approximately **91.58 MB** below the strict decimal cap. All 29 cron jobs remained active.
- Migration `20261012002233_capture_free_tier_capacity_hourly_with_90day_retention` added restricted hourly samples, with a 90-day retention window; the existing capacity monitor job now runs each hour at minute 45 and also updates the daily sample. Verified the privileged function is not executable by anon or authenticated roles.
- A restore-format test on a representative archived row from each of all eight source record types passed exact JSONB round-trip equality. This complements the full archive-vs-active-row equality checks that were performed before retirement.
- A GitHub CI run for the follow-up changes passed Supabase retention tests, daily news publication verification, legislative validation, production build validation and GitHub workflow policy after upgrading the new workflows to actions/checkout@v5 and actions/setup-node@v5. Repo-level test and build health status must be independently checked before PR acceptance.
- **Storage export is still not verified**: as of 00:25 UTC, no bucket named `shared-postgres-cold-archives` existed. The export workflow reports a sanitized success/failure status into PR #2724 on the trusted branch and **never** deletes database copies. A PR comment or source-control CI success by itself does not certify readback of every archive; also verify objects and manifest in Storage.

Storage free-plan upload guard was tightened to **45,000,000 bytes per object** (below the documented 50 MB global file limit). The private Storage export should be run and read back before moving a single archive row out of PostgreSQL.
