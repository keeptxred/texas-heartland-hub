# Project Memory

## Core
Every evergreen article must follow the Evergreen article spec — neutral tone, required sections (Overview, Why This Matters, Impact on Texans, Historical Context, topical-authority), 900–1,400 words, Key Takeaways box, "Keep Texas Red Editorial Staff" byline + /about bio, 3–5 internal links incl. /glossary + category page, Last updated date.
No duplicate images on any single page of the site.
Homepage "Featured Stories" must rotate to a new lead + featured set every calendar day (America/Chicago).
Every page and article must clear 800 words. When short, append modular PageExpansion blocks (perspective + 3–5 sections + FAQs + summary) — never regenerate. Every article must include one Texas-specific original perspective block and a Reader Questions block.
Mobile perf is HEAD-only: lazy-load every non-LCP image, preload the LCP image with fetchpriority="high", keep AdSense async, dns-prefetch + preconnect ad/font hosts, never rewrite components for perf.

## Memories
- [Evergreen article spec](mem://features/evergreen-article-spec) — Required structure, tone, linking, and attribution for AI-generated evergreens
- [No duplicate images per page](mem://design/no-duplicate-images) — Hard rule + enforcement pattern (IMAGE_OVERRIDES) for keeping every page's images unique
- [Featured Stories daily rotation](mem://features/featured-stories-rotation) — Homepage Featured Stories lineup must change every day via date-based pool rotation
- [Content quality rules](mem://features/content-quality-rules) — 800-word minimum, 60% reader-question coverage, 60% originality, credit-optimized expansion via PageExpansion
- [Mobile performance rules](mem://features/mobile-performance-rules) — LCP <4s via HEAD-only changes: image lazy-load, hero preload, font/ad resource hints
