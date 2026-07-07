## Content Growth Optimization Layer — Plan

Scope is broad. Grouping into 3 small, production-safe migrations + edits to existing hooks and a couple of new UI files. No pipeline rewrites.

### Migration 1 — Schema additions to `daily_articles` + new `newsletter_signups`
```sql
ALTER TABLE public.daily_articles
  ADD COLUMN IF NOT EXISTS image_score integer,
  ADD COLUMN IF NOT EXISTS internal_links jsonb,          -- [{label,href,kind}]
  ADD COLUMN IF NOT EXISTS texas_impact_summary text,
  ADD COLUMN IF NOT EXISTS affected_regions text[],       -- statewide|houston|dfw|austin|rural|...
  ADD COLUMN IF NOT EXISTS content_quality_score integer, -- 0-100
  ADD COLUMN IF NOT EXISTS quality_flags text[],          -- ['missing_image','thin_body',...]
  ADD COLUMN IF NOT EXISTS affiliate_category text,
  ADD COLUMN IF NOT EXISTS gsc_impressions integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gsc_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gsc_ctr numeric,
  ADD COLUMN IF NOT EXISTS gsc_avg_position numeric,
  ADD COLUMN IF NOT EXISTS gsc_last_update timestamptz;

CREATE TABLE public.newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL,
  source_page text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);
GRANT INSERT ON public.newsletter_signups TO anon, authenticated;
GRANT ALL ON public.newsletter_signups TO service_role;
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_signups
  FOR INSERT TO anon, authenticated WITH CHECK (true);
-- no SELECT policy: reads via service role only
```

Reuses existing `seo_headline`, `headline_variants`, `ctr_score`, `image_hash`, `body_json`.

### New helper library — `src/lib/content-quality.ts`
Pure functions used inside existing hooks (no new automation):

- `buildHeadlineSet(story) → { seo_headline, reader_headline, variant_a, variant_b }` — enhances existing SEO logic (calls into `src/lib/seo-headline.ts`; extends, does not replace).
- `scoreImage({url, title, category}) → number` — heuristic 0–100 (Texas keywords in filename/alt, deduped via existing `image_hash`, penalizes known stock hosts).
- `pickInternalLinks(title, category, body) → {label,href,kind}[]` — max 5; category → hub map (tax → `/tax-calculator` + `/texas/property-taxes-2026`; elections → `/register-to-vote` + `/candidate-guides`; business → `/texas-business`; etc.). Adds 1 evergreen from `daily_articles` matched by shared keywords, 1 category page, 1 resource page.
- `classifyRegions(text) → string[]` — statewide/houston/dfw/austin/rural via keyword match (extends `nlp.ts`).
- `buildTexasImpact(text, regions) → string` — templated 1–2 sentence summary.
- `scoreQuality(article) → { score, flags }` — checks author, image, min body length, presence of "Why This Matters", FAQ, key-takeaways markers, internal links. Returns 0–100 and flags list. Never blocks publish.
- `detectAffiliateCategory(text) → string | null` — moving | homes | insurance | energy | business | travel | products | services.

### Edits to existing hooks (small)
- `src/routes/api/public/hooks/generate-news.ts`
- `src/routes/api/public/hooks/generate-evergreen.ts`
- `src/routes/api/public/hooks/generate-sports.ts`
- `src/routes/api/public/hooks/ingest-feeds.ts`

In each row-build step, call the helpers and set the new columns before upsert. No control-flow changes, no new API calls, no new AI models — the existing AI rewrite output feeds into these pure post-processors.

Extend `seo-headline.ts` (already the SEO source of truth) so `buildHeadlineSet` lives alongside `pickHeadline`; existing callers keep working.

### Newsletter capture (UI + endpoint)
- **New component** `src/components/newsletter-signup.tsx` — email input, POSTs to server fn. Message: "Get Texas updates delivered weekly."
- **New server fn** `src/lib/newsletter.functions.ts` → `subscribeNewsletter({email, source_page})` — Zod-validated, insert to `newsletter_signups`, dedupe on unique constraint.
- Placement (small edits): `src/routes/news.$slug.tsx`, `src/routes/index.tsx`, evergreen article surface (already renders through news.$slug). One import + one `<NewsletterSignup source_page={pathname}/>` line each.

### GSC feedback storage — data layer only
- New util `src/lib/gsc.ts` exporting `applyGscMetrics(rows)` — takes an array of `{slug, impressions, clicks, ctr, position}` and writes to the new columns. No OAuth, no cron. Ready for future integration.

### CTR improvement loop — reuse existing fields
- New helper in `src/lib/ctr-score.ts`: `shouldGenerateNewVariant(row, siteAvgCtr)` — true when `variant_a_impressions + variant_b_impressions >= 1000` AND best-variant CTR < site avg × 0.8.
- New tiny server fn `src/lib/ctr-loop.functions.ts` → `refreshUnderperformingHeadlines()`: pulls flagged rows, calls the existing Lovable AI Gateway with the same rewrite system prompt to generate a new variant, writes it into `headline_variants`. **Not scheduled** in this change — safe manual/admin trigger. (User can add a cron later.)

### Files to be touched
**Migration:** 1 file (schema + newsletter table)
**New files:**
- `src/lib/content-quality.ts`
- `src/lib/newsletter.functions.ts`
- `src/lib/ctr-loop.functions.ts`
- `src/lib/gsc.ts`
- `src/components/newsletter-signup.tsx`

**Edited:**
- `src/lib/seo-headline.ts` (add `buildHeadlineSet`)
- `src/lib/ctr-score.ts` (add `shouldGenerateNewVariant`)
- `src/lib/nlp.ts` (add region classifier)
- `src/routes/api/public/hooks/generate-news.ts`
- `src/routes/api/public/hooks/generate-evergreen.ts`
- `src/routes/api/public/hooks/generate-sports.ts`
- `src/routes/api/public/hooks/ingest-feeds.ts`
- `src/routes/news.$slug.tsx` (insert newsletter component)
- `src/routes/index.tsx` (insert newsletter component)

### Not doing (per spec)
- No new automation pipeline, no new cron, no sitemap changes, no schema on other tables.
- Affiliate: only tagging, no link injection.
- GSC: storage + util only, no OAuth.
- CTR loop: helper + server fn only, not scheduled.

### Manual setup required after ship
1. (Optional) Add a weekly pg_cron to call the CTR refresh server fn when you're ready.
2. (Optional) Later, provide GSC API access to activate `applyGscMetrics`.
3. Newsletter signups are visible only via service role; add an admin view when you want to export.

Approve to build.
