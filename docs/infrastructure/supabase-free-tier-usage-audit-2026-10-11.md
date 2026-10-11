# Shared Supabase Free-Tier Usage Audit — 2026-10-11

Applies to the shared production project `ftkznprjljkhymknvhye` backing KeepTXRed and TexasDefined. Organization verified **Free**. PostgreSQL database quota is **500 MB**. The database was **666.9 MiB** before this remediation, well over quota.

## Changes deployed and measured

- Applied migration **20261011233913**: private `cron_success_history_daily` rollup and restricted `private.prune_successful_cron_run_history(integer)` function.
- Applied migration **20261011234016**: active hourly `free-tier-successful-cron-history-retention` job (minute 19 UTC; batch cap 20,000).
- Verified public/anon/authenticated cannot execute the privileged prune function.
- Preserved all failed and unfinished job logs; kept at least seven days of successful run details.
- Pruned **48,619** old success details into **1,192** daily aggregates (26 job identifiers).
- Ran `VACUUM FULL cron.job_run_details` with verification; live table shrank **20.21 → 1.67 MiB**.
- Total production database measured **648.63 MiB** immediately after compaction, down from **666.89 MiB** (18.26 MiB recovered).
- All publishing/sync cron jobs remained active; no article, bill, property-tax or Business Network content was deleted.

## Next reclamation candidates — not yet deleted

| Relation | Physical size (MiB) | Safety classification |
|---|---:|---|
| legislative_content_opportunities | 62.42 | Temporary editorial opportunities; 60,518 of 60,549 events >365 days old. Archive/verify before pruning. |
| texas_news_feed | 119.73 | Shared KTR/TD incoming feed; must protect publishing, linked articles, normalization and story IDs. |
| news_research_packets | 49.19 | Research evidence is used by published story refresh; preserve linked/published packets. |
| news_feed_normalization | 41.88 | FK cascade dependency of feed; preserve active dedupe history. |
| news_story_clusters | 18.17 | Published cluster references must remain stable. |
| authority_relationships | 75.55 | Permanent entity graph: **do not truncate**. |
| bill_actions / bill_sponsors / bills | 125.04 combined | Permanent official bill history: **do not truncate**. |
| texas_property_tax_rates | 16.01 | Permanent TD authority data: **preserve**. |

## Required gates for next phase

1. Obtain restorable offline or object-storage archive of the proposed stale rows, with count and integrity verification.
2. Verify all foreign-key dependents and cross-site reads before allowing archival.
3. Keep published records and any records needed for follow-on refresh or citation unchanged.
4. Use bounded, restartable batches and confirm row counts.
5. Compact only when a safe lock window is available and remeasure `pg_database_size(current_database())`.
6. Ensure scheduled ingest cannot immediately recreate retired data.
7. Target 350–400 MiB for operating headroom, with warnings at 375, 400, 450 MiB. No unpaid tier assumption without verified monitoring.

## Read-only production verification queries

```sql
select round(pg_database_size(current_database()) / 1048576.0,2) as total_mib;
select jobname,active,schedule from cron.job where jobname='free-tier-successful-cron-history-retention';
select count(*) as detailed_run_count from cron.job_run_details;
select sum(pruned_count) as archived_successful_runs from private.cron_success_history_daily;
```

Physical table size may not shrink on DELETE until rewrite/compaction. `VACUUM FULL` takes an ACCESS EXCLUSIVE lock; do not run on large active publishing tables without safety checks. Only apply tested reductions; production remains the source of truth.
