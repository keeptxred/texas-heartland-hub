# KTR Phase 2A — Initial Article and Redirect Ledger

**Captured:** 2026-11-04. **Main inspected:** `6ec6410f625914506c25e33e412a20a8bd1ec876`. **Working branch:** `seo/ktr-news-phase2a-indexability-alignment-20261104`.

This report is a **complete initial URL inventory from the currently accessible canonical storage sources**, **not final editorial certification**. Every included URL has one provisional A–E disposition. The `decision_state=PROVISIONAL_TRIAGE` field is deliberate: automated signals, quality flags, existing policy and prior publication do **not** independently prove originality, valid sources, actual sitemap membership, Google indexing, link equity or editorial value. Only confirmed reviews and production checks may turn these into final decisions.

## Coverage and initial classifications

- Supabase `daily_articles`: **319** rows.
- Static `ARTICLES` definitions: **60** rows, 60 authored-body registry keys.
- Existing `article_slug_redirects`: **21** aliases.
- Deduplicated URL ledger: **388** entries (storage counts: {"daily_articles":319,"static_ARTICLES":57,"slug_redirect_alias":12}).
- Duplicate slugs between Supabase and static registry: 3 (`live-2026-07-07-texas-pitmasters-to-feature-in-new-food-network-competition-series-v3wglp`, `live-2026-07-02-secretary-of-state-releases-july-3-texas-register-detailing-new-state--m0th5w`, `live-2026-06-29-the-history-behind-the-texas-stock-tank-name-bxkvg7`).
- Provisional dispositions in the **latest ledger**, after November 5 geographically invalid redirect correction: `A`: 24, `B`: 13, `C`: 305, `D`: 37, `E`: 9 (388 URLs). Original November 4 starting snapshot had `A`: 39, `D`: 23, `E`: 8. These are editorial triage labels, not certified Google-index counts.
- GSC impressions/clicks reflect **internal GSC daily mirror through 2026-10-31**, NOT independently certified finalized external GSC and NOT ranking/index verdicts.
- URL Inspection verdicts are a partial cached sample and may predate the code now serving a URL. Empty cells mean unknown, **not zero indexing**.
- Source availability, original reporting, live indexability, sitemap membership, HTTP status, duplicates/redirect equivalence, internal link dependencies, social/newsletter references remain to be independently verified before final status.
- All historical articles and provenance remain in Supabase; **no bulk delete or re-dating was performed**.

## Disposition semantics and protection

- **A — keep indexable**: currently permitted static, flagged reviewed-authority, official source-first, or evergreen candidates. `potential-indexable` is an inferred *policy intent*, not a live certification.
- **B — improve and retain**: questionable candidates requiring editorial correction, no automatic AI-expanded prose.
- **C — keep public, noindex**: ordinary automated rewrites and off-topic/retired-search archive candidates. Do not repeat existing PR #2593 suppression.
- **D — consolidate**: existing redirect aliases or explicitly redirected static URLs. No new indiscriminate redirects were created. Verify equivalent content before final acceptance.
- **E — retire**: explicitly retired static URLs and independently identified non-equivalent legacy aliases with no surviving source content. Do not bulk delete stored articles or redirect unrelated historical stories.

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

## Texas border geography — evidence-based repair in code
- `texas-border-geography-101` upgraded from oversimplified short piece to IBWC boundary/treaty, five CBP sector, port inspection versus between-port enforcement, Laredo-year-specific trade and river hazard verification resource. Original May 27 publication preserved.
- The provisional decision is B (improve/retain), **not certified until CI + deployed live tests**. No fabricated barrier percentage, evergreen copy duplication, or change to historical Supabase rows.

## Remediation batch 11 — Texas voter registration guide (November 5, 2026)

- `/news/texas-voter-registration-guide` moved from A provisional to B source-repaired, **pending exact-SHA production verification**. Historical May 27 publication date unchanged.
- Removed the false universal claim that a mailed application must **be received** 30 days before an election, documented the statutory mailing/postmark rule and weekend/holiday extension with the concrete October 5, 2026 deadline.
- Distinguished ordinary paper registration from eligible DPS transactions and existing-voter Texas.gov updates; covered county moves, fail-safe and limited ballots, reasonable-impediment ID alternatives and full seven-photo-ID list, backed by eight official sources and a new regression test.
- Keep genuine source-backed civic guides rather than indiscriminately noindexing them. No verification of Google indexing or Cloudflare production is claimed at this stage.

## Remediation batch 12 — Election civics authority (November 5, 2026)

- `/news/primary-vs-general-election` and `/news/beginners-guide-texas-elections` moved A→B **repaired in code, pending production**; published dates preserved.
- Corrected unsupported blanket November-formality claim, unfounded universal one-third runoff turnout statistic, and claim that subdivisions choose May elections to depress turnout. Updated titles, metadata and related crosslink.
- Added eight evidence-based sections and official sources per guide on Texas party affiliation, majority primaries/runoffs, actual general-election stakes, local elections, sample ballots, special districts, propositions and redistricting map checks. New regression tests included; no mass noindex, changes to original publication dates or indexing certification.

## November 5 cross-region redirect correction — production and database verified

- [PR #3485](https://github.com/keeptxred/texas-heartland-hub/pull/3485) merged to main at `df3921894ee0cf2370e6bd4545df723fdf08b6ad` after all required CI checks. Workflow-run deployment [#42084237220](https://github.com/keeptxred/texas-heartland-hub/actions/runs/42084237220) and dependent newsroom smoke [#42084265269](https://github.com/keeptxred/texas-heartland-hub/actions/runs/42084265269) returned overall `success` but their jobs' verification/deployment steps were **skipped**; neither is valid proof this SHA was deployed. The non-skipped manual exact-SHA deployment [#42084476221](https://github.com/keeptxred/texas-heartland-hub/actions/runs/42084476221) was **in progress** when this checkpoint was written. Do not certify production or HTTP behavior until the non-skipped deploy + post-deploy smoke finish and `keeptxred-production-current` is successful.
- Authenticated read-only Supabase baseline found that the July San Antonio Flock opposition alias incorrectly mapped to a geographically different August Houston Flock report, with a stale circular backlink. The original San Antonio article did not exist in the current `daily_articles` table.
- Following protected merge, applied only the guarded one-alias SQL fix preserved in `docs/recovery/ktr-news-phase2a-cross-region-redirect-fix.sql`. Authenticated read-only postflight found `article_slug_redirects` old alias count **0**; Houston article's body and `internal_links` old-alias references **false**; credible contemporaneous Boerne article source **present**; original Houston `published_at` **2026-08-09 17:26 UTC**, unchanged. Total `daily_articles` remains **319**. No historical news record was deleted or re-dated.
- Category D→E exactly once; subsequently 15 already-migrated lifestyle guides were reclassified A→D (and the pre-existing moving-to-Texas redirect target was specified). The ledger is now **A24/B13/C305/D37/E9**, still provisional. Follow-up [PR #3488](https://github.com/keeptxred/texas-heartland-hub/pull/3488) adds permanent live smoke for genuine HTTP 404, correct Houston 200 self-canonical, and absence of old alias; it must pass CI, merge, deploy, and production checks before this specific HTTP behavior is certified.

## November 5 KTR-to-TexasDefined ownership ledger reconciliation (15 entries)

- The canonical code map `src/lib/migrated-practical-guide-canonical.ts` already sends 16 `/news/...` Texas lifestyle guides to exact content-equivalent TexasDefined `/article/...` URLs via existing permanent handoffs. The initial Phase 2A ledger erroneously labeled **15** of those URLs as A/potential-indexable, though the site had already moved ownership to TexasDefined. The sixteenth (`moving-to-texas-guide`) was D but lacked a recorded final target.
- Ledger now marks all **16** as D/permanent redirect with an exact verified-in-code TexasDefined canonical destination; no article content, redirects or publication dates were modified. Each retains a pending live-HTTP-cohort decision state rather than falsely claiming Google indexing. New regression test checks every mapped `/news/...` handoff is D/redirect and has its exact destination in the ledger.
- Revised disposition counts A **24**, B **13**, C **305**, D **37**, E **9** = **388**. These describe expected ownership/SEO policy, not what Google chose to index. Existing production handoff tests exercise migrated lifestyle redirects separately; the bounded Phase 2A cohort is still responsible for per-URL HTTP and sitemap confirmation.

## November 5 production completion — structured JSON issue isolated and fixed

- Protected [PR #3488](https://github.com/keeptxred/texas-heartland-hub/pull/3488) passed the required repository suite, production build validation, and merged into main at **`05d094baa7300afbbc67114340693c66bcf79524`**. It also restored the actual Dustin Burrows Speaker-page "Coverage and freshness" disclosure required by the representative source-validation gate; no validator was bypassed.
- Non-skipped exact-SHA [production deployment #42087592267](https://github.com/keeptxred/texas-heartland-hub/actions/runs/42087592267) completed its deployment job. The first post-deploy newsroom smoke exposed one remaining problem: although the deleted San Antonio redirect and Houston plain `body`/`internal_links` were correct, the public Houston page still rendered the old URL from the independent `daily_articles.body_json.sections[].paragraphs` field.
- The old URL occurred **once** in the structured JSON. Authenticated guarded single-row correction replaced that sentence with the contemporaneous Boerne/Kendall coverage source, preserving the source structure and `published_at = 2026-08-09 17:26 UTC`. Postflight verified **zero old-alias references** across the plain `body`, structured `body_json`, and `internal_links`.
- Re-running **only the failed post-deploy smoke job** in the same exact-SHA deployment (attempt 2) passed. Recorded text: `OK Phase 2A retired non-equivalent San Antonio alias HTTP 404; Houston survivor HTTP 200 and stale link absent`. All other newsroom smoke steps passed as well. The latest commit's `keeptxred-production-current` status is successful and points to that deployment.
- The SQL recovery recipe `docs/recovery/ktr-news-phase2a-cross-region-redirect-fix.sql` now covers **all three** storage copies and fails atomically if a stale alias survives; future replay does not silently miss the rendered structured body.
- **Scope of certification:** verified production HTTP/canonical behavior for this individual retirement, protected sitemap/robots samples and ongoing 25-URL bounded cohorts. This does not certify that all 388 URLs have been editorially reviewed or that Google recrawled or reindexed any particular URL. The A24/B13/C305/D37/E9 inventory is still provisional.
