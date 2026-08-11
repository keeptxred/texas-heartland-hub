# Verify check contract

The repository has one required CI check named `verify`, produced only by the native GitHub Actions job in `.github/workflows/shared-vitest.yml`.

Do not create additional check runs or legacy commit statuses named `verify`. Multiple publishers using the same required-check name can leave branch protection waiting for a different check identity even when another `verify` reports success.

The workflow runs for pull requests targeting `main`, direct pushes to `main`, manual dispatches, and GitHub merge-queue `merge_group` events. GitHub Actions owns the required check end to end.

If branch protection or a ruleset requires `verify`, configure that requirement to use the native GitHub Actions `verify` check from the `Repository test and build health` workflow. Do not bind the requirement to a legacy status publisher.
