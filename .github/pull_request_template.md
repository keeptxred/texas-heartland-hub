## What changed

<!-- Describe the user-facing result and the repository areas affected. -->

## Sites affected

- [ ] KeepTXRed
- [ ] TexasDefined
- [ ] Shared platform
- [ ] No live-site behavior changed

## Validation

- [ ] Relevant automated checks passed
- [ ] I reviewed the affected routes or workflows
- [ ] No secrets, credentials, or local environment files were committed
- [ ] This pull request contains one related batch of work

## Workflow safety

<!-- Complete these when .github/workflows, generators, imports, or scheduled jobs change. -->

- [ ] No workflow can trigger itself from files it writes
- [ ] No new duplicate full build/typecheck/test pipeline was added
- [ ] Recurring jobs use narrow triggers, a timeout, and appropriate concurrency cancellation
- [ ] Generated-data writers use a strict output allowlist and reject stale-main publication
- [ ] External/network-dependent checks are not unnecessarily blocking ordinary PR validation
- [ ] CI/runtime versions are pinned where version drift could change results

## Publishing and risk

- [ ] Safe to merge into `main`
- [ ] Urgent production fix
- [ ] Requires a manual post-merge step

## Notes

<!-- Add deployment, migration, rollback, or follow-up details when relevant. -->
