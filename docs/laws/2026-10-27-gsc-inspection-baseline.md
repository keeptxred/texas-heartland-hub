# KeepTXRed Texas Laws — verified Search Console indexing baseline

**Observed October 27, 2026.** Based on existing authenticated Google Search Console URL Inspection saved in Supabase, not merely a sitemap or technical smoke check. Last stored law-related inspections were October 26, 2026 (some guide rows October 23). Google results may change.

## What the Google API actually reported

| Population | Exact count and evidence |
|---|---|
| All inspected law-prefix pages | 21 URLs in the saved gsc_url_inspection table |
| Individual law guides | **17 of 18 inspected, none indexed**: 11 Discovered - currently not indexed, 6 URL is unknown to Google |
| Law guide without saved inspection | /laws/topic/wills-probate-inheritance-law — status **unknown**, not a documented failure |
| Indexed law pages | **2**: /laws and /laws/constitutional-amendments, both Submitted and indexed with matching Google and user canonical |
| Other unindexed law pages | /laws/topics: unknown to Google; /laws/effective-dates: discovered, not indexed |
| Selected canonical or last Google crawl for unindexed guides | Google did not provide either value. There is **no established canonical conflict**, nor a demonstrated robots/noindex exclusion |
| Search Analytics strictly for /laws and /laws/ descendants | **397 impressions, 0 clicks**, 74 daily rows for two indexed pages, July 27–October 23, 2026 |
| Additional legacy /laws-to-know path | 27 impressions, 0 clicks, counted in broader prefix query but excluded from the 397 authority-subtree impressions |

The separate HYPD connected Search Console service lists TexasDefined but **the existing KeepTXRed service-account-backed GitHub sync has actual permission to query sc-domain:keeptxred.com**. See GitHub Actions workflow sync-gsc-metrics.yml run 40544449669 (October 27), which read 76 Google rows, 24 news article metrics and stored 24 URL metrics. The sitewide sync workflow records canonical and index observations into the protected Supabase tables gsc_page_daily_metrics and gsc_url_inspection.

## Reproduce the findings

- Inspect records: SELECT path, verdict, coverage_state, google_canonical, user_canonical, last_crawl_time, inspected_at FROM public.gsc_url_inspection WHERE path = '/laws' OR path LIKE '/laws/%' ORDER BY path;
- Inspect breakdown: SELECT CASE WHEN path LIKE '/laws/topic/%' THEN 'guide' ELSE 'other' END AS section, coverage_state, count(*) FROM public.gsc_url_inspection WHERE path = '/laws' OR path LIKE '/laws/%' GROUP BY 1,2;
- Performance: SELECT count(*) AS rows, count(DISTINCT url) AS urls, sum(impressions) AS impressions, sum(clicks) AS clicks, min(metric_date), max(metric_date) FROM public.gsc_page_daily_metrics WHERE path = '/laws' OR path LIKE '/laws/%';

## Action and limits

1. Reuse the existing daily sitewide Search Console URL Inspection job (200 inspections/day and 25 priority slots), not a new monitoring service. Two priority additions ensure the next eligible non-push inspection samples /laws/topics and the currently uninspected wills/probate guide while retaining the rotating sitewide sample.
2. Keep the current protected source, sitemap, canonical, H1 and browser gates. They validate the served site, but Google indexing is a separate outcome.
3. Once Google's crawl/index/Google-selected canonical states are actually supplied for the guides, investigate documented blockers rather than generating low-value or duplicate content or making unsupported claims of canonical bugs.
4. Reevaluate after subsequent sitewide inspection snapshots. This report makes **no guarantee of indexing or ranking**. Full legal paragraph/FAQ review, human real-user Core Web Vitals, and real paid ad delivery are still separate outstanding tasks in master issue #2938.
