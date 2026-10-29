# KeepTXRed newsroom publishing recovery — live checkpoint

Updated: 2026-10-29 (America/Chicago). This file records verified evidence and is intentionally **not** a completion certificate.

## Baseline / repository

- Source repository: `keeptxred/texas-heartland-hub`; protected `main` at start of this batch: `602ba9572732ae88da433a1f8c05f9e886608d2e`.
- Prior confirmed merge: PR #2994, `946845cb3226d538af282936c0430761fba119e1`. Do not rebuild preceding PRs #2972–#2994.
- Deployment workflow #40939380592 reported success for `602ba9572732ae88da433a1f8c05f9e886608d2e`; verify the Worker again after this PR merges.
- Run Daily News Now #40940133686 failed; preprocessing reported 500 packets (623 source records, 10 primary items), eight source-page fetches, seven source updates and **280 pages cooling down**. The writer returned `insufficient_independent_sources`; overdue fallback timed out (`HTTP 000000`).
- Subsequent newsroom run #40940732175 also finished as failure; its details remain to investigate rather than assuming a successful publication.

## Database snapshot

- Five `daily_articles` published in the previous 14 days as of this check; **all five matched `reserve_article_publications`**. No newly confirmed normal newsroom article.
- 895 recent pending research packets: 112 have multiple source records, but only 44 have multiple apparent domains and 23 have raw extracted text over 5k across those domains. This is **not** genuine independence: syndicated copies and feed transport domains inflate apparent diversity.
- Eleven pending primary-source packets; none reached 5k of raw extracted text at the sampled time. A Secretary of State packet had ~4,702 characters, just short of the unchanged normal publication evidence floor.
- 57 generated drafts remained, and at least 19 generated election-related drafts were visible from October 11 onward. These are not verified/published merely because draft validation reasons were empty.
- Fifteen last-30-days published records had absent or non-ready image state under a broad preliminary SQL filter; manually classify historical/evergreen and recover only real failures.

## Changes proposed in this batch

1. Primary-source pages with 4k–5k cached content can receive another bounded source hydration attempt; ordinary source cooldown and network caps stay intact. This never lowers the 5k/9k editorial floors or grants extra source independence.
2. The October 11–25 approved replay no longer arbitrarily excludes independently verifiable factual election/campaign drafts. Exact event/title overlap is required, along with all pre-existing validation, uniqueness, retrospective and signed workflow checks.
3. Source and election regression tests added. This checkpoint exists to prevent repeating audits after a chat crash.

## Remaining work (NOT COMPLETE)

- Review PR checks, merge only if green, then confirm deployment SHA and smoke tests. Requery production evidence and distinguish `normal` from `reserve` articles.
- Repair upstream acquisition of **genuinely independent original reporting** and official primary documentation. A syndication mirror or Google News wrapper is not independent corroboration. Do not reduce editorial gates to reach article volume.
- Investigate #40940732175 and overdue fallback six-minute timeout. Avoid poll/retry loops; do other useful work.
- Reconcile each approved held election draft by event: published / duplicate / held / rejected / obsolete, with factual reasons; expire retrospective replay safely.
- Verify image backlog recovery separately: GitHub image workflow #40940146792 succeeded only by **skipping** on a missing marker; it did not repair the failed Henry Cuellar image.
- Check Facebook actual image attachments and logs, not just successful workflow status.
- PR #2156 (official statewide election refresh) is still open at this checkpoint; do not treat its updated generated artifacts as deployed.
- Get fresh GSC page/query evidence before claiming CTR improvement. Distinguish low rankings from snippet optimization.
- Update this checkpoint with merged commit, deployment, live normal-article URL and concrete residual blockers after every substantial batch.

## Guardrails

Concurrent editors: refresh `main` before writes, preserve unrelated changes, use narrow PRs. Do not poll Cloudflare OAuth token verification endpoints, weaken sourcing, omit image-vision checks, bypass OIDC/CI, or manufacture publishing success. A successful reserve article, workflow or deployment is NOT acceptance. Normal publication requires a verified qualifying article in production with approved featured image.


## Approved election-draft reconciliation — 2026-10-29 production snapshot

A bounded query of `newsroom_generation_drafts` (publish mode, generated October 11–25 UTC, `texas-elections` pillar), joined to current `news_publish_candidates` and `news_research_packets`, returned **30 draft versions**: **11 GENERATED/HELD**, **18 REJECTED/REJECTED**, **1 PUBLISHED/PUBLISHED**. These are database lifecycle states, not a claim that all 30 are separate events or that source-independence checks are complete.

The 11 GENERATED/HELD draft versions represent **10 underlying subject groups**:

| Underlying report | Drafts held | Production disposition as checked |
| --- | ---: | --- |
| Gina Hinojosa gubernatorial education/affordability campaign priorities | 1 | Held; TPR and KUT/UT-standard share identical headline; verify distinct original reporting before replay |
| Latino voters' changing views of major parties | 1 | Held; Texas Tribune article, its own feed URL and San Antonio Current same-headline republication do not prove three originals |
| Bexar County first-day early-voting turnout | 1 | Held after story-match image rejection; a cluster also contains Travis County turnout, so isolate the Bexar event before publication |
| Bexar County first-day ballot errors | 2 | Held as two draft versions of one incident; verify county election-office record and same-event independent reports, select only one valid retrospective |
| Hinojosa lawsuit about Abbott/Musk communications | 1 | Held after image rejection; KUT and Texas Standard repeat the same original reporting; requires distinct independent evidence and accurate representative imagery |
| Texas 500,000-registration lawsuit | 1 | **Already published** as a separate October 14 Elections article with image status ready: `2026-10-14-texas-sued-for-failing-to-process-over-500-000-voter-registrations`. Do not republish |
| Vikki Goodwin / Dan Patrick campaign | 1 | Held; TPR and San Antonio Current share identical headline; independent attribution not established |
| 19 million registered Texas voters | 1 | Held; Texas Tribune original, its own feed link, KVUE and San Antonio Current shared headline; corroboration still must be verified |
| James Talarico David / GOP spending campaign report | 1 | Held; identical WFAA/KWTX headline requires original-report provenance check |
| Elon Musk donations to Senate Republican PAC backing Paxton | 1 | Held; Tribune article + its feed + KWTX same headline do not establish independent reports |

The **18 rejected** draft versions are not authorized to bypass editorial rejection and require specific provenance review if ever reconsidered. The **1 published** generated version remains published; do not duplicate. Two of the held drafts have explicit prior image-verification rejection; the normal election replay intentionally excludes candidates with a non-null rejection reason. Remaining unrejected generated drafts will continue through original publisher source checks, evidence floors, uniqueness checks, event-title matching, and retrospective context on the authorized recovery path.

**Status definitions for next recovery batch:** published (verified live slug and image); duplicate (same verified event already published); held (additional original reporting, exact event proof or visual match needed); rejected (editorial/model failure); obsolete (historical claim no longer safely actionable as retrospective). Retain exact candidate IDs and decisions in the database telemetry or a subsequent checkpoint; never silently mark a held candidate as successfully published.

Other production facts: `article_search_metrics` was refreshed October 29, latest Search Console window October 26, **24 impressions, zero clicks, weighted average rank 40.9** for 24 rows. This is primarily an insufficient visibility/rank sample, not proof of a snippet CTR defect. Official election refresh PR #2156 still has a failing launch QA: numerous districts not source-verified for ~69 days and at least one candidate ~86 days; do **not** reset timestamps or force merge.

### Follow-on PR and deployment state

- PR #3282 merged as `503806753aa282f3263032b2827b204a69357a9c`; required checks passed. Check matching deployed Cloudflare revision and run actual source-quality publishing evidence before declaring victory.
- PR #3283 merged as `77c47df1f9789bea16098b07e3e2faff8fb1a000`, with the `[run-image-backlog]` commit sentinel to trigger exactly two October 14 failed-hero repairs only **after** verified matching production deployment. Merge does not verify actual image success.
- PR #3284 adds source-prioritized clustering inside the unchanged 500-item limit. Verify CI, merge, deploy and compare genuinely independent source packets to prior baseline; no new original reporting is inferred from increasing candidate counts.


## Repair-batch production checkpoint — October 29 20:14 UTC (awaiting deployed image proof)

Work in the source repository is complete through the following **verified merged PRs**. No success claim below is inferred from a PR alone:

- **#3282** merged `503806753aa282f3263032b2827b204a69357a9c`: targeted rehydration of 4k–5k direct **primary** records and revalidation of factual Oct 11–25 election drafts outside the former administration-only filter. Editorial and source floors are unchanged. Verified Cloudflare deploy workflow #40943795854 succeeded on this SHA.
- **#3283** merged `77c47df1f9789bea16098b07e3e2faff8fb1a000`: two precisely selected October 14 missing-image articles in the governed marker. The first attempted image job #40943842543 **FAILED**: both HTTP 409 because visually rejected old images remained staged. Treat this as an actual defect, not success.
- **#3284** merged `24efe558c424768a72320cb239e6f35b2c4501aa`: reserves up to 240 verified KeepTXRed direct publisher records in the **existing 500-item** bounded cluster sample, excluding Google News wrappers. This changes evidence discovery priority only; no syndication mirror becomes independent. Production before/after packet outcomes are still required.
- **#3286** merged `46b9ccda95e884f6ac294c99d227e12ded85e0e5`: preserves detailed approved-window election draft ledger already above.
- **#3289** merged `fca9fd6735c23635d85beecd303d19f6e4f76193`: when the overdue writer times out or fails HTTP validation, keep the failure visible but continue to the existing independent, 480s vision-gated reserve. Preserve the 24h *normal* publisher stall alarm; reserve success is not normal success.
- **#3288** merged `0fca65419b88113a1386d5e6f4140634c25dbb6f`: after verified deployment of that exact sentinel commit (`[run-image-backlog]`), run two scoped hero recovery attempts. Exact-marker push execution before deployment was removed. All required build, migration-contract and verify checks passed.

**Database fix applied and read back, not merely committed:** The exact source-controlled SQL file `supabase/migrations/20261029195600_requeue_two_visual_rejected_news_heroes.sql` was executed through the Supabase SQL API against `ftkznprjljkhymknvhye` after `main` reached `0fca654...`. It matched **exactly two** rows with rejected image candidate URL, failed image status, no featured hero, and original `stored-cloudflare-vision-v5 rejected:` note:

1. `2026-10-14-house-republicans-pull-3-million-reserved-for-ads-against-henry-cuellar`
2. `2026-10-14-texas-penalties-for-data-center-violations-are-light-despite-tough-talk-from-abb`

Read-after-write confirmed both rows have `image_candidate_url=NULL`, `image_generation_status=failed`, `featured_image_url=NULL`, and `image_validation_history` contains five events. **No new image was approved, and no hero URL was fabricated.** The next step is a production image workflow triggered by successful verified deploy of exact `0fca654...`, then read-back `ready` and actual approved image URL per article. Do not open a new merge until this sentinel is actually deployed because concurrent `main` advancement skips stale deployments.

**Broader image state:** At the audit, 15 articles in the most recent 30 days had failed/missing hero images, including those two. The other 13 were older Oct 1–10 published news with generated-visual rejection and no staged candidate; they still need individualized verified imagery. Do not bulk approve or reuse generic fallback. Facebook *Auto Facebook Posts* run #40944070251 was positively verified with a photo-backed post, no text fallback, real Facebook post ID and image hash.

**Newsroom still not proven healthy:** At database baseline, five articles in the prior 14 days matched `reserve_article_publications`. No new production normal article was confirmed. Failed newsroom #40940133686 had only 10 primary-source records among 623 and 280 sources in cooldown; writer returned `insufficient_independent_sources` and overdue HTTP 000. The two new source changes need after-deployment sampling of **independently original reporting**, not just packet counts. The approved election ledger above accounts for held/rejected/published drafts, not all are eligible. SOS had an actual authoritative 2026-10-16 release recording 19,041,684 registered voters, already present as feed item #6364983 with ~6.8k extracted body; its separate draft failed `repeated_newsroom_paragraphs`, and the syndicated 19m story remains HELD. Do not silently merge unrelated reporting or bypass repetition rules.

**Official election refresh/SEO:** PR #2156 remained unmerged owing to source verification freshness failures (many 69-day-old districts, one older candidate). No timestamps reset. Fresh GSC window Oct 26 had 24 impressions, no clicks, rank about 40.9; ranking exposure, not a validated snippet CTR defect.

**Immediate next steps after this checkpoint:** (1) Verify GitHub deploy run #40947193677 on current main `0fca654...` **finishes successfully**, and verify latest Cloudflare Worker revision; (2) retrieve exact successful post-deploy image job, per-slug HTTP result and independent vision approval, then verify published URL+image at rest; (3) inspect automatically dispatched normal newsroom job and resulting DB `daily_articles` vs `reserve_article_publications`; if still no real normal article, diagnose source packets and do **not** archive; (4) update this checkpoint with exact source outcome and production SHA; (5) finish remaining image and candidate data verification without reducing editorial quality. Avoid Cloudflare token loops and repetitive CI polling.
