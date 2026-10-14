# Texas Bills API timeouts — 2026-10-14

## Impact and symptoms
The public Bills directory intermittently received HTTP 500 from Supabase PostgREST for `/rest/v1/bills` and `/rest/v1/rpc/list_active_bill_filter_options`. PostgreSQL logged SQLSTATE 57014 statement timeouts. Observed failures included approximately 20:12 UTC on 2026-10-14; earlier failures were also observed that day. This was intermittent, not a sustained outage.

## Shipped mitigation
PR [#2780](https://github.com/keeptxred/texas-heartland-hub/pull/2780), squash merge `5047dc334af9cb907f06ef206b8bcb1cce8b95eb`, changed `src/lib/bills.ts` to use `count: "planned"` instead of `count: "exact"` for the paginated list and removed automatic replay of a timed-out query. This reduces unnecessary database work; it is not a demonstrated fix for every potential cause of SQLSTATE 57014.

## Production verification
Cloudflare account Worker `keeptxred-site` production deployment `c9f8e93e-198f-4a0e-b684-e80ce14242dd` activated version `0d7dec5a-19dc-4d50-837c-92307bcb5145` at 2026-10-14 21:26:41 UTC with 100% traffic. The deployed Worker content was inspected through the Cloudflare API: the actual `listBills` query contains `select(indexFirst ? "id" : BILL_LIST_COLUMNS, { count: "planned" })`. This is stronger evidence than comparing a Wrangler version ID to a Git SHA. Subsequent observed Bills requests returned successful responses, and sampled post-deployment Supabase edge and PostgreSQL logs showed no new Bills-related 500s or statement timeouts as of approximately 21:32 UTC. A short clean window is not proof of long-term stability.

## Database diagnostics
At 21:32 UTC, `pg_stat_user_tables` estimated 12,786 live and 38 dead `bills` tuples; manual ANALYZE had completed at 21:00 UTC. `pg_stat_statements` cumulative data showed a frequently executed Bills listing query at ~19.9 ms mean over 24,592 calls (607.5 ms maximum recorded), and the filter-options RPC at ~185.1 ms mean over 1,442 calls (2,815.2 ms maximum recorded). Other Bills query variants had slower averages. These statistics are cumulative and do not establish the load at the incident minute.

The most expensive cumulative workload included `texas_news_feed` inserts (~3,003,225 ms across 6,575 calls, ~456.8 ms mean), but **no causal connection to the simultaneous Bills timeouts has been established**. Cron job records for 20:10–20:14 UTC showed successful jobs and no failed runs; this does not rule out external Worker/HTTP workloads or transient resource contention. Do not disable news ingestion or scheduled jobs based solely on these totals.

## Monitoring and recurrence response
An **existing enabled** hourly automation named **Texas Bills Error Watch** checks the Supabase project `ftkznprjljkhymknvhye` for new `/rest/v1/bills` and `/rest/v1/rpc/list_active_bill_filter_options` HTTP 5xx responses and relevant PostgreSQL statement timeouts, suppressing duplicate notifications. Its notification delivery settings should be reviewed: the task listing showed notifications and email both disabled. No duplicate automation should be created.

When a new error occurs:
1. Capture the exact UTC timestamp, affected path, HTTP status, SQLSTATE, and request correlation ID if available; never log credentials or sensitive request parameters.
2. Examine `postgres_logs` and `edge_logs` within +/- 3 minutes. Distinguish API timeouts from unrelated database cancellations.
3. Check `pg_stat_activity` for active waits/locks and concurrent statements **during** the incident, plus `pg_stat_statements` changes and Supabase resource metrics. Cumulative rankings alone cannot identify a spike.
4. Correlate with `cron.job_run_details`, external ingestion Worker requests, and Cloudflare logs. A successful cron enqueue does not mean the downstream HTTP job completed successfully.
5. Reproduce with bounded read-only queries for the affected filters/pagination, and only then propose targeted query/index/concurrency fixes.
6. Verify the actual deployed Worker bundle and post-change API responses; observe a meaningful subsequent traffic window.

## Current assessment
**Mitigation deployed and verified; root cause of shared intermittent database contention remains unproven.** Avoid speculative changes to production database settings or unrelated pipelines. Continue the existing watch and reopen this incident if a new relevant 500/57014 occurs.
