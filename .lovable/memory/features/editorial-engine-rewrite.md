---
name: Editorial engine rewrite rules (ingestion + all articles)
description: Originality, structure, SEO, AdSense, and Core Web Vitals rules every ingested or generated article must follow
type: feature
---
# Keep TX Red Editorial Engine

Applies to every ingested RSS item, every AI-generated article, and every future post.

## Ingestion (RSS / external)
- Extract only facts (who/what/when/where/why). Never copy source phrasing.
- No direct quote longer than 10 words. No reused headlines or narrative flow.
- Fully rewrite via the Lovable AI gateway in `src/routes/api/public/hooks/ingest-feeds.ts` (`rewriteItem`). If the rewrite fails, fall back to the structured row but never publish raw source text as the body.

## Required structure (all articles)
Stored on `daily_articles.body_json`:
- `intro` → SUMMARY (2–3 neutral sentences)
- `sections[0]` heading "Texas relevance"
- Optional `sections[*]` heading "Analysis" (labeled opinion, never contradicts facts)
- `keyTakeaways` → 3–5 bullets
- `faq` → optional Q&A
- `sources` → official link with attribution

## Word-count publish gate
- Non-evergreen articles require 2,000+ words of main story prose.
- Evergreen articles require 5,000+ words of main story prose.
- Do not count title, dek, Texas relevance, source attribution, FAQ, Reader Questions, key takeaways, sources, or other boilerplate toward the minimum.
- If a rewrite or generator returns less than the required main-body count, block publishing instead of inserting a stub or fallback article.

## SEO
- `title` = original SEO headline (not source wording)
- `dek` = meta description, MAX 155 characters
- `keywords` = 5–10 lowercase Texas-relevant terms (stored on `daily_articles.keywords`)
- Internal links via existing related-articles + glossary system on `/news/$slug`

## AdSense / quality
- No thin content, no near-duplicates, no templated phrasing across articles.
- Every article must read uniquely. Mobile-readable paragraphs.

## Core Web Vitals (page render)
- LCP image preloaded with `fetchpriority="high"` (see `mobile-performance-rules`).
- All non-LCP images `loading="lazy"`, prefer WebP.
- AdSense stays async/deferred. Defer non-critical JS.
- Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms.

## Continuous application
- New RSS items: rewritten in `ingest-feeds.ts` before insertion.
- Backfill: each ingestion run rewrites up to 25 orphan feed rows missing `internal_slug`.
- Evergreen / news / sports generators already enforce structure via their own system prompts — do not regress them.