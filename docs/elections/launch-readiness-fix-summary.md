# Election Central launch-readiness fixes

This branch addresses the highest-priority findings from the July 29, 2026 launch audit.

## Included

- Makes every currently published candidate reachable from the candidate directory instead of limiting the public list to the first 50 records.
- Adds complete Open Graph and Twitter image metadata to the candidate directory.
- Adds `scripts/elections/public-launch-audit.mjs`, which checks candidate-directory capacity, forecast scope, candidate image coverage, required route files, the default social image, and unfinished/mock/demo markers.
- Adds a dedicated GitHub Actions workflow that runs election validation, link-aware election QA, the new public-launch audit, lint, typecheck, unit tests, and the production build.

## Deliberately not enabled

The Election Central homepage takeover remains disabled. The new audit reports limited forecast coverage and blocks an enabled homepage takeover while the public product scope would overstate that coverage.
