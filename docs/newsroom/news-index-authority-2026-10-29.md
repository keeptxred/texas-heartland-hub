# KTR /news authority audit and release checkpoint — 2026-10-29

## Observed production baseline
- Live /news at 2026-10-29 showed four current cards. All four were Keep TX Red Reserve Desk explainers.
- Direct read of the production Supabase daily_articles table found NO non-reserve publishing on 2026-10-18 through 2026-10-29. The latest ordinary newsroom record was published 2026-10-15 04:42Z (October 14 America/Chicago).
- The intentionally strict seven-day current-news filter is in src/lib/current-news-freshness.ts. It must **not** be widened or bypassed to make the site look current.
- Existing upstream ingestion fixes, including PR #3174 merged October 28, do not by themselves prove publication has recovered. Verify actual approved, source-backed normal news output.
- Reserve Desk source_name identifies KTR-created fallback explainers, NOT the external source of the underlying research; its author is Keep TX Red Editorial Staff.
- The previous news page exposed old static explainers and a 30-item cap but no historical dynamic news reports.

## Page changes
- Current (seven-day) **kind=news, non-reserve** records only appear as verified current reporting.
- Publishable current Reserve Desk and other non-news records appear under **recent explainers** with transparent labels, not in the latest reporting count.
- A separate, query-bounded 120-day previous-news archive fetches source-backed, public-ready news dated older than seven days; never modifies timestamps or approval status; excludes historical restores and fallback Reserve Desk.
- Keep the existing public readiness, search ownership, minimum word-count, deduplication and original article URL checks.
- Permanent static/indexable guides are a distinct section, with expansion controls and live/archive slug deduplication.
- Include the missing Texas News, Business and Economy category filters, clear aria-pressed states and consistent absolute dates.
- No generic/category fallback stock for dynamic articles without a canonical featured image; preserve human-reviewed article image URLs and provided alt.
- Identify editorial desk labels as workflows, not fictional staffed offices; show author/byline separately from real source attribution.

## Release QA / remaining operational requirement
1. Run core build/typecheck, Vitest newsroom-presentation and freshness tests, SEO validation and any protected CI on the PR. Do not merge failing CI.
2. Inspect PR diff and merge only after protected checks pass; confirm actual Cloudflare deployment and live /news output.
3. Verify no unsafe restored article becomes 'current', and non-reserve previous news appears in the dated archive without generic fallback images.
4. Investigate latest ingest, rewrite, image and guarded publisher runs separately. Do not weaken the current 800-word, primary-source, independent corroboration or image-vision gates to inflate output. The recovery criterion is an actual new, independently verified, publishable political news report.
5. On the public page, reports may honestly show **zero** during a continuing publishing stall. Do not describe the problem as fixed just because the display now explains it.

## Guardrails
- Maintain KTR politics/news ownership and avoid TexasDefined lifestyle leaks.
- Do not re-date old stories, fabricate a headline or reclassify Reserve Desk guides as breaking news.
- Avoid costly full-site audit scans or new infrastructure to solve this targeted index issue.
