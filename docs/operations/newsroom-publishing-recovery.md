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
