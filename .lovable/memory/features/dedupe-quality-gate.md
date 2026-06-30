---
name: Article duplicate-content quality gate
description: Global rule + implementation for stripping duplicate paragraphs/sentences/headings/bullets/FAQs across all articles
type: feature
---
# Duplicate-Content Quality Gate

No article on keeptxred.com may publish or render with duplicate paragraphs,
repeated sentences, repeated headings, repeated bullets, or repeated FAQ
questions.

## Implementation
- `src/lib/article-dedupe.ts` exports `dedupeArticleBody(body)` and
  `hasDuplicateContent(body)`. Pure functions — no side effects.
- Render-time safety net: `src/routes/news.$slug.tsx` dedupes both static
  ARTICLE_BODIES entries and AI-generated evergreen `body_json` before
  returning loader data.
- Write-time enforcement (must NOT be removed):
  - `src/routes/api/public/hooks/generate-evergreen.ts` — dedupes + calls
    `hasDuplicateContent` and BLOCKS publish (HTTP 422) if duplicates persist.
  - `src/routes/api/public/hooks/generate-sports.ts` — dedupes before upsert.
  - `src/routes/api/public/hooks/ingest-feeds.ts` — dedupes every ingested
    `body_json` before upsert.
- Backfill: a one-shot Bun script rewrote all existing `daily_articles.body_json`
  rows through `dedupeArticleBody`. Re-run if drift is suspected.

## Rule for future generators
Any new code path that writes `daily_articles.body_json` MUST pass the body
through `dedupeArticleBody` before insert/upsert. SEO metadata, slugs,
`published_at`, categories, keywords, and image fields are preserved — only
duplicate prose is stripped.