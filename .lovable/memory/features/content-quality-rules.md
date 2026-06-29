---
name: Content quality rules (800-word, 60% coverage, 60% originality)
description: Global minimums for every page and article — word count, reader-question coverage, originality, and credit-optimized expansion pattern
type: feature
---
# Content Quality Rules

## Word Count (800+ words, hard minimum)
Every page and article must clear 800 words of rendered prose. When a page is short, DO NOT regenerate — APPEND modular blocks via `src/components/page-expansion.tsx` (PageExpansion):
- 3–5 concise sections (100–150 words each)
- 4–6 FAQs (50–100 words each)
- One summary block (50–75 words)
- One originality "Texas Angle" block (100–150 words)

Applies to: Homepage, About, Contact, Contact Legislators, Dashboard, and all future pages. Reject any new page lacking expansion-ready sections.

## Reader Question Coverage (target 60%)
Every article must answer reader questions across funnel stages:
- Top: definition / overview
- Mid: implementation, pricing, how-to-file
- Bottom: ROI, differentiators, frameworks

Implement as a bottom-of-article "Reader Questions" block (120–180 words per block). Auto-link to related internal articles. Every article must have at least one reader-question answer AND an FAQ section.

## Originality (target 60%)
Every article must include one original perspective block (100–150 words):
- Texas-specific analysis
- Contrarian viewpoint with evidence
- Unique framework
- On-the-ground reporting summary

Acceptable "proprietary data placeholders" instead of fabricated datasets:
- "According to internal analysis…"
- "Local interviews indicate…"
- "Our review of county-level filings shows…"

Reject pure commodity coverage. Reject any article missing an original perspective block.

## Credit Optimization
- Never regenerate full pages — append modular blocks instead.
- Reuse existing sections.
- Keep AI prompts requesting only the missing block, not the full article.
- The evergreen generator (`src/routes/api/public/hooks/generate-evergreen.ts`) enforces these rules in its system prompt.
