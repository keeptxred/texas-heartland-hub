# Why the admin console shows few stories

## What the data actually shows

Verified against the live database and the panel code:

- **110 sources are enabled**, but only **~28 have ever produced a feed row**. 74 of the enabled sources have **no RSS URL saved at all** (YouTube channels, TikTok tags, city/agency pages, college teams, scanner apps). Ingestion only pulls sources where `rss_url` is set, so those 74 are decorative — enabled in the Source Library, never fetched.
- 8 more sources *do* have an RSS URL but returned nothing (Houston Chronicle, Dallas Morning News, several TV YouTube feeds, r/houstonwx) — those feeds are blocked or wrong.
- The feed itself is healthy: **1,680 rows in the last 14 days**. The shortage is downstream filtering, not ingestion volume.
- **Viral Radar** hard-caps at **150 rows** fetched, then keeps only rows with `texas_relevance >= 40` AND `source_reputation >= 55`. Only **143 of 1,680 recent rows** pass that gate. Rows with a saved non-READY preflight are permanently hidden (23 rows).
- **"Ready for Rewrite" is structurally impossible**: the threshold is a viral score of **90**, but the highest score anywhere in the database is **73**. That filter will always be empty (confirmed: 0 rows flagged out of 2,501).
- **Content Opportunities** fetches 500 rows but renders only the **first 75**, and hides any row whose saved preflight isn't READY. Only **11 rows** have a READY preflight.

## Plan

### 1. Make the panels show what already exists
- Raise Viral Radar's fetch cap from 150 to 500 and add a "load more" instead of truncating.
- Raise the Content Opportunities render cap from 75 with a "load more" control.
- Lower the panel-level review gate (relevance >= 25, reputation >= 40) so borderline-but-usable Texas stories reach manual review instead of being silently dropped.

### 2. Fix the impossible readiness threshold
- Recalibrate `VIRAL_READY_MIN_SCORE` from 90 to a reachable value (~60), based on the observed distribution (64 rows in the 60s, 37 above 70). Keep confidence and reputation floors as-is.
- Re-run scoring so `ready_for_rewrite` gets populated.

### 3. Fix the Source Library so "enabled" means "fetched"
- Add a real RSS URL for every enabled source that can supply one (city newsrooms, state agencies, papers, college athletics, YouTube channel RSS endpoints).
- Mark sources with no RSS path (TikTok tags, scanner apps) as "not ingestible" in the admin UI so the source count reflects real coverage.
- Repair the 8 enabled feeds that return nothing, or disable them with a reason.

### 4. Visibility
- Add a diagnostics line to the Source Library: sources enabled, sources with a working feed, and rows contributed in the last 7 days per source — so this gap is self-evident next time.

## Technical notes
- Panels: `src/components/admin/ViralRadarPanel.tsx` (`FETCH_LIMIT`, `shouldShowRow`), `src/components/admin/ContentOpportunityPanel.tsx` (`.limit`, `filtered.slice(0, 75)`, `shouldShowOpportunity`).
- Thresholds: `src/lib/viral-score.ts`.
- Ingestion source merge: `loadSources()` in `src/routes/api/public/hooks/ingest-feeds.ts`.
- Source rows: `content_sources` (data updates only, no schema change).