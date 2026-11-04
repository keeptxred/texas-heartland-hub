# KTR Phase 2A — Initial Article and Redirect Ledger

**Captured:** 2026-11-04. **Main inspected:** `6ec6410f625914506c25e33e412a20a8bd1ec876`. **Working branch:** `seo/ktr-news-phase2a-indexability-alignment-20261104`.

This report is a **complete initial URL inventory from the currently accessible canonical storage sources**, **not final editorial certification**. Every included URL has one provisional A–E disposition. The `decision_state=PROVISIONAL_TRIAGE` field is deliberate: automated signals, quality flags, existing policy and prior publication do **not** independently prove originality, valid sources, actual sitemap membership, Google indexing, link equity or editorial value. Only confirmed reviews and production checks may turn these into final decisions.

## Coverage and initial classifications

- Supabase `daily_articles`: **319** rows.
- Static `ARTICLES` definitions: **60** rows, 60 authored-body registry keys.
- Existing `article_slug_redirects`: **21** aliases.
- Deduplicated URL ledger: **388** entries (storage counts: {"daily_articles":319,"static_ARTICLES":57,"slug_redirect_alias":12}).
- Duplicate slugs between Supabase and static registry: 3 (`live-2026-07-07-texas-pitmasters-to-feature-in-new-food-network-competition-series-v3wglp`, `live-2026-07-02-secretary-of-state-releases-july-3-texas-register-detailing-new-state--m0th5w`, `live-2026-06-29-the-history-behind-the-texas-stock-tank-name-bxkvg7`).
- Provisional dispositions: `A`: 52, `C`: 305, `D`: 23, `E`: 8.
- GSC impressions/clicks reflect **internal GSC daily mirror through 2026-10-31**, NOT independently certified finalized external GSC and NOT ranking/index verdicts.
- URL Inspection verdicts are a partial cached sample and may predate the code now serving a URL. Empty cells mean unknown, **not zero indexing**.
- Source availability, original reporting, live indexability, sitemap membership, HTTP status, duplicates/redirect equivalence, internal link dependencies, social/newsletter references remain to be independently verified before final status.
- All historical articles and provenance remain in Supabase; **no bulk delete or re-dating was performed**.

## Disposition semantics and protection

- **A — keep indexable**: currently permitted static, flagged reviewed-authority, official source-first, or evergreen candidates. `potential-indexable` is an inferred *policy intent*, not a live certification.
- **B — improve and retain**: questionable candidates requiring editorial correction, no automatic AI-expanded prose.
- **C — keep public, noindex**: ordinary automated rewrites and off-topic/retired-search archive candidates. Do not repeat existing PR #2593 suppression.
- **D — consolidate**: existing redirect aliases or explicitly redirected static URLs. No new indiscriminate redirects were created. Verify equivalent content before final acceptance.
- **E — retire**: existing explicit static removal candidates only. Do not bulk delete stored content.

**Follow-up:** reconcile every provisional row with rendered page and sitemap, real internal links, primary-source validity, GSC finalized signals and ownership, then process in small restartable batches. File: `docs/recovery/ktr-news-phase2a-disposition-ledger.csv`. Related issue #3421 and prior issues #2041, #3406 and PR #2593.

**Guardrail:** 0 impressions, AI assistance, short length, and missing indexed verdict are **not** sufficient standalone reasons to retire or noindex.
