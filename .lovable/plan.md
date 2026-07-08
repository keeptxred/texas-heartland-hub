# Fix empty ingested articles

## Root cause

In `src/routes/api/public/hooks/ingest-feeds.ts`, when `rewriteItem()` returns `null` (AI gateway timeout, non-2xx, or invalid JSON), the code still calls `buildArticleRow(it, null)` and upserts the row. The resulting article contains only boilerplate: the source's short RSS blurb as the intro, the generic "affects Texans and is being tracked by the Keep TX Red newsroom" stub as the only section, and the two-line boilerplate takeaways. That's the article you linked, and there are **36 rows** in the same shape currently live.

Note on the credit-refund ask: I can't issue refunds. That's handled by Lovable support (Help menu in the workspace). What I can do is actually fix the pipeline so this stops recurring.

## Changes (minimal, edits only — no schema changes, no new files)

### 1. `src/routes/api/public/hooks/ingest-feeds.ts`

- **Retry once on rewrite failure.** Wrap the `rewriteItem` call in a small helper that retries a single time after a short delay when the first attempt returns `null`. Rewrites fail almost entirely due to transient gateway timeouts.
- **Skip rows with no successful rewrite.** After `Promise.all(... rewriteItem ...)` in both call sites (lines ~441 and ~551), filter out items whose rewrite is still `null`. Only items with a real rewrite become article rows. This is the hard guard — an ingested article without an AI rewrite is never published.
- **Tighten the "successful rewrite" check.** In `rewriteItem`, additionally require `parsed.relevance` and either `parsed.summary` of ≥ 200 chars or a non-empty `parsed.keyTakeaways` — this catches AI responses that come back structurally valid but semantically empty.
- Leave `buildArticleRow` alone; it will only ever be called with a real rewrite now.

### 2. One-time cleanup migration

Add a migration that deletes the existing stub rows so the site immediately stops serving them (and the sitemap stops linking to them). The condition matches only the exact boilerplate strings this bug produces, so it can't touch legitimate articles:

```sql
delete from public.daily_articles
where kind = 'ingested'
  and (body_json #>> '{sections,0,paragraphs,0}')
      like '%affects Texans and is being tracked by the Keep TX Red newsroom%';
```

Expected deletion: 36 rows (verified via read query).

### 3. Render-side safety net in `src/routes/news.$slug.tsx`

In the ingested-article branch of the loader, if `body_json.sections` contains only the boilerplate stub strings and the intro is ≤ 1 short paragraph, throw `notFound()`. This is a belt-and-suspenders guard so any future regression can't publish a blank page — worst case the URL 404s instead of rendering an empty article that Google Discover will penalize.

## Out of scope

- No changes to `generate-news`, `generate-evergreen`, `generate-sports`, or `enrichArticleRow`.
- No sitemap logic changes (the deleted rows drop out automatically).
- No schema changes, no new tables, no new cron jobs.
- No changes to the AI prompt itself beyond the stricter response validation described above.

## Verification after build

1. Re-query the count of stub rows — must return 0.
2. Visit the failing URL from your message — must return 404 (not an empty article).
3. Manually POST to `/api/public/hooks/ingest-feeds` and confirm the response reports `inserted` ≤ `fetched` (skipped items are the diff) and no newly inserted row matches the stub pattern.
