# Project Memory

## Core
Evergreen articles publish only with 5,000+ words of main story prose, excluding Texas relevance, attribution, FAQ, takeaways, sources, title, and dek.
No duplicate images on any single page of the site.
Homepage "Featured Stories" must rotate to a new lead + featured set every calendar day (America/Chicago).
Non-evergreen articles publish only with 2,000+ words of main story prose, excluding Texas relevance, attribution, FAQ, takeaways, sources, title, and dek.
Mobile perf is HEAD-only: lazy-load every non-LCP image, preload the LCP image with fetchpriority="high", keep AdSense async, dns-prefetch + preconnect ad/font hosts, never rewrite components for perf.
Every ingested or generated article must be fully rewritten (no source phrasing, ≤10-word quotes) with Summary + Texas Relevance + optional labeled Analysis + 3–5 Key Takeaways, dek ≤155 chars, and 5–10 keywords.

## Memories
- [Evergreen article spec](mem://features/evergreen-article-spec) — Required structure, tone, linking, and attribution for AI-generated evergreens
- [No duplicate images per page](mem://design/no-duplicate-images) — Hard rule + enforcement pattern (IMAGE_OVERRIDES) for keeping every page's images unique
- [CTR + Discover + rotation rules](mem://features/ctr-discover-rotation) — Title patterns, opening hook, pillar link weighting, no-cannibalization rules, and pre-publish quality gates for every evergreen
- [Duplicate-content quality gate](mem://features/dedupe-quality-gate) — dedupeArticleBody is mandatory on every body_json write + render
- [Featured Stories daily rotation](mem://features/featured-stories-rotation) — Homepage Featured Stories lineup must change every day via date-based pool rotation
- [Content quality rules](mem://features/content-quality-rules) — 800-word minimum, 60% reader-question coverage, 60% originality, credit-optimized expansion via PageExpansion
- [Mobile performance rules](mem://features/mobile-performance-rules) — LCP <4s via HEAD-only changes: image lazy-load, hero preload, font/ad resource hints
- [Editorial engine rewrite rules](mem://features/editorial-engine-rewrite) — Originality, required structure, SEO, AdSense, and CWV rules for every ingested/generated article
