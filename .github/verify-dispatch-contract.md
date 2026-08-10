# Verify dispatch contract

The repository health workflow must validate the exact synthetic PR merge commit that GitHub evaluates at the branch-protection gate.

When `main` changes, the workflow's `refresh-open-prs` job updates same-repository PR branches and explicitly dispatches `shared-vitest.yml` with the PR number. The dispatched run checks out `refs/pull/<pr_number>/merge` and publishes the required `verify` status against that checked-out merge SHA.

This explicit dispatch is required because branch updates performed with the repository `GITHUB_TOKEN` do not emit a normal `pull_request` `synchronize` workflow event.
