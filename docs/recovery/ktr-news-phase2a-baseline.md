# KTR Phase 2A — Initial Article and Redirect Ledger

**Captured:** 2026-11-04. **Main inspected:** `6ec6410f625914506c25e33e412a20a8bd1ec876`. **Working branch:** `seo/ktr-news-phase2a-indexability-alignment-20261104`.

This report is a **complete initial URL inventory from the currently accessible canonical storage sources**, **not final editorial certification**. Every included URL has one provisional A–E disposition. The `decision_state=PROVISIONAL_TRIAGE` field is deliberate: automated signals, quality flags, existing policy and prior publication do **not** independently prove originality, valid sources, actual sitemap membership, Google indexing, link equity or editorial value. Only confirmed reviews and production checks may turn these into final decisions.

## Coverage and initial classifications

- Supabase `daily_articles`: **319** rows.
- Static `ARTICLES` definitions: **60** rows, 60 authored-body registry keys.
- Existing `article_slug_redirects`: **21** aliases.
- Deduplicated URL ledger: **388** entries (storage counts: {"daily_articles":319,"static_ARTICLES":57,"slug_redirect_alias":12}).
- Duplicate slugs between Supabase and static registry: 3 (`live-2026-07-07-texas-pitmasters-to-feature-in-new-food-network-competition-series-v3wglp`, `live-2026-07-02-secretary-of-state-releases-july-3-texas-register-detailing-new-state--m0th5w`, `live-2026-06-29-the-history-behind-the-texas-stock-tank-name-bxkvg7`).
- Provisional dispositions: `A`: 43, `B`: 9, `C`: 305, `D`: 23, `E`: 8.
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

## Remediation batch 3 — code committed, production pending

- PR #3425 upgrades the source-backed static civic guides `how-texas-counties-spend` and `what-local-governments-control` under disposition B (improve and retain).
- These two are no longer merely hypothetical A candidates: the existing short bodies and overbroad statements were directly inspected and revised using statutory primary sources. The original May 2026 publication dates remain unchanged.
- Both rows have `REPAIRED_IN_CODE_PENDING_PRODUCTION` pending tests, protected merge, and post-deployment HTTP verification. No count represents a Google indexing verdict.

## Phase 2A next reviewed civic guide batch (pending separate PR)
- `texas-energy-policy-guide`: updated from a shallow 52-word authority summary into a source-grounded explanation distinguishing ERCOT, PUCT, RRC, and applicable federal reliability jurisdiction; historic publication preserved.
- `how-a-bill-becomes-texas-law`: replaces erroneous all-bills-hearing/conference assumptions with TLO-verified checkpoints, procedural records, governor action and effective dates; historic publication preserved.
- Both now category B for targeted improvement; original A designation was provisional. No Google recovery or final editorial certification claimed before protected production smoke.

## Additional targeted civic guide — Texas school board powers

- `texas-school-board-powers` reclassified from provisional A to B (improve and retain) after inspection: original was a ~69-word body with unsupported claims about universal seven-member boards, May elections and under-five-percent turnout.
- Updated with official Texas Education Code Chapter 11, TEA governance roles, the Texas Secretary of State's election-date guidance, verifiable public meeting and fiscal research steps. Historical May 2026 publication date preserved, November 4 substantive revision recorded.
- **No final live certification from this change alone**. Protected CI, merge and production smoke still required. Other provisional candidates remain for direct review.

## Targeted executive-authority guides — research update in code
- `texas-governor-powers`: specific constitutional limits on appointments, Senate confirmation, veto, special sessions and emergency powers replace unsupported sweeping power claims.
- `texas-attorney-general-powers`: legal-opinion limits, distinct public/private counsel, local prosecution and child-support versus visitation authority corrected from OAG and Government Code primary documents.
- Both original historical June 2026 publication timestamps preserved; November 4 substantive revisions. Provisional ledger entries B with `REPAIRED_IN_CODE_PENDING_PRODUCTION`. Finish CI, merge, deployment and newsroom smoke before claiming live correction.

## Targeted school finance and terminology quality improvements

- `texas-school-finance-explained`: removes unverified statewide recapture claim, adds TEA SOF, current FSP formula guidance, state/local funding and school-year evidence methods.
- `texas-political-terminology`: turns a skeletal list into a differentiated citizen's guide for interpreting official legislative and election actions using Texas Legislative Council and Secretary of State sources.
- Original May 27, 2026 published timestamps remain; substantive revised November 4. Rows B are repaired **in code only** until protected CI and production checks confirm live publication.
