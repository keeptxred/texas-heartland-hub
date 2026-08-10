# Batch 6 — SEO/AEO verification

This pass verifies the Batch 1–5 stack and closes residual canonical-routing gaps before release.

## Release findings

- The SEO work remains stacked as PRs #255, #257, #258, #259, and #260.
- Only the first PR currently exposes a completed `verify` status; later stacked PRs do not yet have their own status entries because they target intermediate feature branches.
- Branch protection correctly prevents merging while the required `verify` check is considered expected/pending.

## Residual routing fixes

- Every `/texas-news` path, including nested legacy topic routes, must permanently redirect to `/news` rather than rendering the retired culture/lifestyle taxonomy.
- Internal Legislature links must target `/laws` directly rather than `/texas-laws` or `/texas-law-policy`.

## Release order

Merge/retarget in dependency order only:

1. #255
2. #257
3. #258
4. #259
5. #260
6. Batch 6 verification fixes

Do not bypass the required `verify` protection. After each base lands, retarget the next PR to `main` and let its normal checks run.
