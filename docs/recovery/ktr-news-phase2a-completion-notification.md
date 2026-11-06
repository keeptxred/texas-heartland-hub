# KeepTXRed news archive Phase 2A — completion notification

**Master issue:** https://github.com/keeptxred/texas-heartland-hub/issues/3421

This is a **GitHub-based, one-time completion notification**, not a promise that ChatGPT will send a later message. GitHub will create a comment mentioning @keeptxred, close issue #3421 as completed, and send the ordinary GitHub notifications allowed by that account's notification settings. No new paid service or ChatGPT task is used.

## Current status (2026-11-06)

- 388 URL ledger entries exist, but their editorial decisions are **provisional**.
- The existing archive workflow verifies **25 URLs/day**, saves actual HTTP/robots/canonical/sitemap evidence as a 30-day GitHub Actions artifact, and must not be mistaken for source/relevance certification or Google indexing.
- The completion signoff at \`docs/recovery/ktr-news-phase2a-completion-signoff.json\` starts **unapproved**. Do not approve or change final decision states without evidence.

## What unlocks a completion notification

1. Each of the **exactly 388** URLs in \`docs/recovery/ktr-news-phase2a-disposition-ledger.csv\` has been reviewed for its true source/provenance, page quality, stale links and redirect relevance, with a documented substantive \`reason\` and \`decision_state=FINAL_EDITORIAL_CERTIFIED\`. No B/pending classifications may remain: resolved URLs are A (keep indexable), C (public noindex), D (exact equivalent redirect), or E (true 404/410). Do not mass-retire ordinary archival pages merely because they were AI-assisted or received no impressions.
2. Fixes have been merged, deployed, and verified without bypassing any protected tests. Check the **actual non-skipped deploy** and **post-deploy newsroom smoke** jobs, not merely a workflow labeled successful. All historical article rows and publication dates remain preserved.
3. After the final release, record a new issue #3421 comment, authored by the maintainer account, documenting source/originality and redirect-equivalence reviews, exact final counts, evidence for completed repairs, and **no unresolved findings**. Include the literal audit marker \`KTR_PHASE2A_EDITORIAL_SIGNOFF_388\` and the words \`no unresolved findings\`. Save its issue-comment URL in \`final_editorial_evidence\` and the author login in \`approver\`.
4. Only then set \`approved: true\`, \`all_required_fixes_verified: true\`, \`unresolved_findings: []\`, \`production_run_url\`, \`production_sha\`, and \`verification_not_before\` in \`docs/recovery/ktr-news-phase2a-completion-signoff.json\`. Set the verification start to at least the last verified release; do not backdate. The guard independently checks the linked issue comment and GitHub deployment run.
5. The next bounded production cohorts must collectively verify **all 388 current URL policies** after \`verification_not_before\`, with zero report failures or sitemap errors. Reports are read from existing recent GitHub Actions artifacts, **without crawling the whole site anew**. Existing daily cohorts suffice after roughly one full 16-cohort cycle if all succeed; a legitimate failure must be **fixed at its source** and that cohort reverified. Run artifacts expire after 30 days; the verifier uses recent evidence.
6. \`.github/workflows/ktr-news-archive-completion-notification.yml\` checks on GitHub each day after the archive batch, on relevant main-branch changes, or by explicit manual dispatch. If any requirement fails it logs incomplete status and makes **no issue/comment changes**. Once all gates pass it closes #3421 as completed and posts the *only* completion comment using an idempotency marker and @keeptxred mention.

**Premature closure protection:** GitHub issue `closed` events are also inspected. When #3421 is closed with the state reason `completed` before the gate passes, the workflow automatically reopens it and records the unmet requirement. Intentional `not_planned` closure is respected. This prevents a repaired production milestone from being confused with 388 final editorial certifications.

**Not certified by this notifier:** Google's actual indexing, impressions, ranking, or eventual recovery; URL HTTP policy checks cannot establish those. Continue GSC monitoring separately.

**GitHub notification delivery:** the @mention and issue closure generate GitHub activity. Whether email/mobile notifications arrive depends on the @keeptxred account's GitHub notification settings and whether the account has repo access. The permanent completion proof will be visible in issue #3421 even if notification delivery is disabled.
