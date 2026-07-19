# Texas Viral Content Engine — Integration Audit

Read-only audit. No code changed. Below is the current system and exactly where a "Viral Content Engine" plugs in without duplicating infrastructure.

## 1. Current Article Pipeline

Producer → Queue → Rewriter → Renderer.

```text
RSS sources ──► ingest-feeds ──► texas_news_feed  (raw feed rows)
                                     │
                                     ▼
                     daily_articles (is_ingested=false, kind='ingested')
                                     │
                          ┌──────────┼───────────────┐
                          ▼          ▼               ▼
                  generate-news  generate-      generate-sports
                                 evergreen
                                     │
                                     ▼
                  daily_articles (is_ingested=true, body_json filled)
                                     │
                                     ▼
                  featured-image.functions  → article-images bucket
                                     │
                                     ▼
                  news.$slug / texas-*/ homepage feeds (daily-news.functions)
```

Key files: `src/routes/api/public/hooks/{ingest-feeds,generate-news,generate-evergreen,generate-sports}.ts`, `src/lib/{ingest-and-normalize,daily-news,featured-image,content-quality,article-length,title-similarity,sports-lifecycle}.functions.ts`.

Quality gates: `daily_articles_require_body` DB trigger; word-count tiers (Breaking 800 / Analysis 1,200 / Sports 1,200 / News 2,000 / Evergreen 1,800–2,000+); puzzle-title filter; near-duplicate title guard; category-scoped fallback images.

## 2. RSS / Import System

- `content_sources` table (platform, source_name, source_url, category) — admin-editable via `ContentSourceManager`.
- `ingest-feeds.ts` pulls, dedupes by canonical URL + title similarity, upserts `texas_news_feed` and stub `daily_articles` rows.
- `ingestStory` server fn (`ingest-and-normalize.functions.ts`) is the programmatic single-story entry point (`RawStorySchema` → NLP classify → upsert).

## 3. Categories

Stored on `daily_articles.category` + `discover_category`; taxonomy helpers in `src/lib/article-filters.ts`, `src/data/articles.ts`. Surfaces: Texas News, Texas Business, Politics, Houston, Elections, Laws, Economy, Sports (per-league + per-team), Non-political.

## 4. Tags

Two arrays on `daily_articles`: `keywords` (entity extraction from `nlp.ts`) and `seo_keywords`. Sports uses `teams[]`. Regional enrichment: `affected_regions[]` + `texas_impact_summary` via `content-quality.enrichArticleRow`. No dedicated `tags` table.

## 5. Publishing Queue

`publishing_queue` table + `src/services/publishingQueue.{functions,ts}` + `PublishingQueuePanel`. Statuses: DRAFT → ASSET_READY → READY_TO_POST → PUBLISHED (mirrored on `content_packages.workflow_status`). Linked to `content_packages` via `content_package_id`; stores platform, notes, external post id/url after publish.

## 6. Facebook Publishing Flow

1. OAuth: `/api/public/oauth/facebook/{start,callback}` (Login for Business, `config_id=1430025278935088`) → writes Page + token to `social_connections`.
2. Quick path: `ContentOpportunityPanel` "Post to Facebook" → `quickPublishToFacebook` (`quickPublish.functions.ts`).
3. Asset resolution: `feed_item_id` → `texas_news_feed.internal_slug` → `daily_articles.featured_image_url`, normalized to absolute https, validated (ext + content-type + reachable).
4. Graph API: `/photos` when image valid, else `/feed`. Records `publishing_queue` row with FB post id/url only on real success.
5. Full-package path: `SavedPackagesPanel` → `metaPublisher.functions.ts` for approved packages.

## 7. Database Tables (public)

Content: `daily_articles`, `texas_news_feed`, `content_sources`, `content_packages`, `publishing_queue`, `reel_candidates`, `social_connections`, `newsletter_signups`.
Commerce/system: `products`, `orders`, `email_send_log`, `email_send_state`, `email_unsubscribe_tokens`, `suppressed_emails`.
Storage bucket: `article-images` (private, signed via `/api/public/article-image/$filename`).

## 8. Admin Pages

Single `/admin` shell (`src/routes/admin.tsx`) composing:
`ContentOpportunityPanel`, `ContentPackagePreview`, `SavedPackagesPanel`, `PublishingQueuePanel`, `MediaPackageBuilder`, `ReelRadarPanel`, `ContentSourceManager`, `MetaConnectionManager`, `BrandSettings`. Passcode-gated (`ktr-admin-passcode`).

---

## Where the Viral Content Engine Plugs In

Do not build a parallel pipeline. The engine is a **scoring + selection layer** on top of what exists, plus one new admin panel.

### Ingestion (reuse, do not replace)
- Reuse `ingest-feeds.ts` + `content_sources`. Add "viral" candidate sources (X/Reddit/YouTube/TikTok trending) as new `content_sources.platform` values; `ingest-feeds` learns to fan out per platform, still writing to `texas_news_feed`.

### Scoring (new, small)
- New `src/lib/viral-score.ts` — pure function: `(feedRow, signals) → { viralScore, texasRelevance, breakoutVelocity, reasons[] }`. Reuses existing `nlp.ts`, `title-similarity.ts`, `content-quality.ts`.
- Optional new columns on `texas_news_feed`: `viral_score int`, `viral_signals jsonb`, `trend_source text`. One migration.

### Selection & Rewrite (reuse)
- Feeds with `viral_score ≥ threshold` still flow through `generate-news` / `generate-evergreen`. Add a prompt variant "viral angle" in existing generators — no new hook route.
- Word-count tiers in `article-length.ts` already cover the range; add a `kind='viral'` tier only if needed.

### Publishing (reuse entirely)
- Quick path (`quickPublishToFacebook`) and full-package path (`metaPublisher`) already handle FB image/text/link. Viral items get the same "Post to Facebook" button. No new publisher.
- IG Reels: `reel_candidates` + `ReelRadarPanel` already exist; extend, don't duplicate.

### Admin (one new panel)
- New `src/components/admin/ViralRadarPanel.tsx` mounted in `/admin`. Reads `texas_news_feed` ordered by `viral_score`, shows badges (Rewritten / Image Ready / Reel Ready — reuse `OpportunityStatusBadges`), one-click "Rewrite Now" (calls `generate-news`) + "Post to Facebook" (reuses `quickPublishToFacebook`).

### New surface area (minimum)
1. Migration: `texas_news_feed` add `viral_score`, `viral_signals`, `trend_source` (+ GRANTs).
2. `src/lib/viral-score.ts` (pure).
3. Optional scheduled hook `src/routes/api/public/hooks/score-viral.ts` — refreshes `viral_score` from external trend APIs; pg_cron every 15 min.
4. `ViralRadarPanel.tsx` + one entry in `admin.tsx`.
5. Prompt tweak inside `generate-news.ts` when `feed.trend_source` is set.

### Explicitly do NOT create
- New articles/queue/packages/publisher tables.
- A second Facebook flow or OAuth path.
- A second admin route.
- A separate storage bucket or image pipeline.

## Additional Constraints (approved)

- No new categories. Classifier maps to existing `daily_articles.category` values only.
- `discover_category` behavior untouched.
- Reuse existing `keywords` + `seo_keywords` fields — no new tag columns.
- Require classification confidence ≥ threshold before auto-invoking `generate-news`; low-confidence items stay in the panel for manual review.
- `viral_score` alone never triggers publish. Publishing still requires the human "Post to Facebook" click (or the existing package approval flow).
- Respect existing breaking-news aging (`daily-news.functions` 6h/24h demote) and sports lifecycle windows.
- Reuse existing image validation + `quickPublishToFacebook` end-to-end.
- SEO, sitemap, canonical, and indexing rules unchanged.

Confirm this integration shape and I'll implement in one focused change set.
