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
