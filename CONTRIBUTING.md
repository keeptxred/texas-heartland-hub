# Contribution workflow

This repository uses batched feature branches to reduce duplicate GitHub Actions work while keeping `main` publishable.

## Default workflow

1. Create one branch for a related group of changes.
2. Commit as often as needed on that branch.
3. Open one pull request when the batch is ready.
4. Merge the pull request into `main` after the relevant checks pass.
5. Delete the branch after merge.

Use branch names such as:

- `feature/<short-description>`
- `fix/<short-description>`
- `content/<short-description>`
- `chore/<short-description>`

A batch should represent one feature, one repair group, or one work session. Do not combine unrelated work merely to reduce CI usage.

## Direct pushes to main

Direct pushes remain available for urgent production fixes and integrations that currently require them. Routine development should use a branch and pull request.

## GitHub Actions usage

- Superseded workflow runs should be cancelled automatically where configured.
- Heavy audits run on a schedule or manually rather than on every push.
- Comprehensive validation should run once for the final pull request or merged batch, not repeatedly for small intermediate commits.

## Before merging

Confirm that:

- the change belongs to the intended site or shared package;
- no secrets or local environment files were committed;
- relevant checks completed successfully;
- the pull request description explains the user-facing result;
- urgent follow-up work is recorded separately rather than hidden in the batch.
