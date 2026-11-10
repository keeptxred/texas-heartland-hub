# Newsroom failed-story research and recovery — operational contract

**Applies to:** KeepTXRed and TexasDefined candidates in the shared newsroom. **Incident evidence:** November 9, 2026 Flyover audit and live failure review; checkpoint [#3621](https://github.com/keeptxred/texas-heartland-hub/issues/3621); implementation [PR #3628](https://github.com/keeptxred/texas-heartland-hub/pull/3628). This runbook is not a license to auto-publish, invent source claims or expand paid AI usage.

## Core principle

A failed draft is **not** evidence that its underlying story is worthless. Diagnose the specific failure first, then perform independent reporting research and rebuild a *source packet*, rather than sending the same headline/syndicated excerpt to AI again. A failed editorial fact check must never be addressed by relaxing the 5,000/9,000 *de-duplicated* evidence minimum, the corroboration requirements, by artificially padding word count or fabricating dates, quotes, figures, scene details or conclusions.

Existing source collection -> clustering -> candidate scoring -> packet building -> guarded generator -> independent preflight -> image/alt/license validation -> publication remains the single pipeline. Publishing still requires the protected GitHub Actions production flow.

## Diagnoses and exact remedies

| Failure observed | Appropriate response | May automatically retry? |
| --- | --- | --- |
| `no_readable_body`, short HTML excerpt, known RSS Google wrapper | Inspect original publisher URL and timestamps; look for JSON-LD `articleBody`/marked source body; find a separate first-party record or valid direct-publisher story | Rehydrate under the existing 40/page/4-concurrency source-fetch budget and 6h/24h cooldown. **Do not** copy unrelated related-story cards or bypass a block |
| Source/authority diversity failure | Search for a genuine original official record or an independently reported second publisher; verify unique source family and event-level agreement | Only when newly ingested verified source material causes the unchanged publisher check to pass |
| `below_news_word_floor`, `tiered_main_word_count`, redundant paragraphs | Read full original source material and primary documents; locate additional *distinct, verifiable* facts and original contextual comparisons | Once, only with at least 900 additional de-duplicated evidence characters since prior packet and full unchanged evidence threshold |
| `multisource_unattributed_claim`, unsupported or contradictory claim | Trace the exact claim to identifiable sources, reconcile disagreement, distinguish allegation/proposal from outcome | Not by paraphrasing unsupported claims; gather independent evidence and revalidate |
| Cloudflare 403 JSON Schema incompatible model; transient 55s/90s timeout | Use the existing tested Gemma4 schema model and guarded publisher; do not retry obsolete model automatically or bypass validation | One, after a 60-minute quiet period, within the existing 72-hour news window, and only if the packet passes the same source rules |
| `superseded_empty_reconciled_newsroom_cluster`, already-published canonical, outdated wanted notice, cancelled/expired event | Check live source and canonical article; prefer in-place update, post-event result or keep rejected | **Never** requeue as a new article |
| Missing hero, unsupported image rights, publication image-quality hold | Validate licensed source/image, regenerate through existing governed image flow if authorized, or leave website-only publication where publisher allows | No automatic AI draft retry to bypass the image gate |
| Unverifiable suspect claim, active investigation, medical treatment claim | Check current police/court/agency status and source date; preserve allegation vs proof and preclinical vs effective treatment | Editorial review required; refuse publication until verified |

## What the recovery code enforces

- Only the **80 most recent HELD/REJECTED** eligible story candidates, no older than 72 hours, are added to the ordinary zero-AI packet-building cohort. This conservatively retains the existing 40 original source-page fetches, 4 concurrent requests and existing cooldown persistence.
- Exclusions are explicit: already published, manually excluded, superseded, unsafe/fabricated, invalidated old drafts, outdated/captured suspect notices, image holds or non-news meta pages.
- For eligible failures, verify the complete current research packet has at least 5,000 (politics/public affairs) or 9,000 (sports/education/lifestyle) **unique supporting source characters** and a verified official/primary record or genuinely independently sourced publisher diversity. A Google News link, government newspaper clipping, and copied wire story are not a second source.
- For content insufficiency, the packet must contain **at least 900 more unique sourced characters** than the preceding packet. Model-only failures with already-adequate packets may receive one controlled retry, but not indefinite repetitions.
- A successful retry merely returns the candidate to `PENDING` for the *unchanged* protected quality-gated publisher; it does not write any article, force index, increase confidence or change source text. The retry count is recorded in `news_publish_candidates.score_breakdown.research_rescue`, and the state transition checks status, rejection reason and updated timestamp to avoid concurrent reclaims. **Only the signed current-main `Run Daily News Now` GitHub Actions OIDC caller is authorized to requeue**; public/unsigned requests may gather evidence but never reopen failed candidates.
- New source scanning is bounded to explicit first-party publisher indexes (no paid search, Google anti-bot bypass or arbitrary URL fetch): dated original First Alert 7 West Texas reports, official TLU football reports, UTEP university releases, Texas Biomed research announcements and City of Arlington original press notices. Only original publisher dates within 14 days can become fresh news. An old grant mentioned this week remains *old*.

## First-party starting points for this Flyover (verify live per story)

| Story / topic | Publisher evidence to research | Editorial destination |
| --- | --- | --- |
| Odessa MCM Grande shooting | https://www.firstalert7.com/2026/11/08/warrant-issued-man-mcm-grande-hotel-stairwell-shooting/ ; current Odessa Police notice, charges/warrant/custody state | KTR Texas News; allegations only until court resolution |
| UTEP mallard duck-genetics study | https://www.utep.edu/newsfeed/2026/november/utep-researcher-leads-first-of-its-kind-study-on-genetic-changes-in-wild-ducks.html ; actual underlying peer-reviewed paper | TD existing wildlife authority hub / `/explore/wildlife`; distinguish flyway differences |
| Arlington Veterans Day parade | https://www.arlingtontx.gov/News-Articles/2026/October/Texas-Veterans-Day-Parade-Set-for-Nov.-11-2026-in-Arlington ; organizer for last-minute changes | TD existing `/events`; preserve recurring event canonical, verify Nov 11 5:30pm |
| Texas Lutheran SCAC championship and memorial | https://tlubulldogs.com/news/2026/11/7/football-tlu-holds-on-for-28-20-win-over-centenary-la.aspx ; TLU Athletics, SCAC result records | TD Sports; separate confirmed 28–20 result from crash/tragedy coverage, no sensationalizing families |
| Texas Biomed grant | https://www.txbiomed.org/news-press/news/texas-biomed-awarded-200000-hill-prizes-grant/ | TD science background only; originally published in **August 2026**, NOT a November new grant, and not a clinically proven TB treatment |
| Houston executive order / HPD & ICE | https://www.houstontx.gov/policies/execorders/1-74.pdf ; Houston Public Media, Texas Tribune, original city press conference | KTR Houston/Politics; the order is PDF **source evidence**, not a source-page body guaranteed extractable by the HTML fetcher |
| Capitol SB 49 | https://capitol.texas.gov/tlodocs/90R/billtext/html/SB00049I.htm ; official introduced bill only, not enacted law | KTR Politics; explain bill status, effective-date conditions, committee steps; do not infer it passed |
| Kimpton Fredericksburg | Hotel/owner's official announcement and development applications; independently verified opening status | TD travel/Fredericksburg established authority, not duplicated promo |

## Operational checks (no production mutation)

Read the newest `news_publish_candidates` status/rejection reasons; join `news_story_clusters`, `news_story_cluster_items` and `texas_news_feed` to identify source URLs, primary flags, dates and body lengths. Inspect `news_research_packets` and `newsroom_source_page_fetch_state` to locate the actual defect. Run existing `newsroom-generation-diagnostics` for publication preflight counts (top-100 sample only), and inspect latest `Run Daily News Now` production logs and `Newsroom Production Observability` telemetry. Avoid promising all stories pass automatically; some need legally unavailable records, a real second reporter, original city updates or a justified editorial hold.

**Completion requires** showing the actual verified publisher sources and original update dates, a novel original article or documented existing-authority update, correct KTR/TD destination, passing local editorial and legal/image checks, canonical live URL, sitemap/index suitability and internal link. Research improvements are successful when *recoverable* failures resume with stronger evidence; permanent refusal of a false or stale item is also a correct outcome.
