#!/usr/bin/env bash
set -euo pipefail

pr_number="${1:?usage: finalize-automation-pr.sh <pr-number> <automation-branch>}"
automation_branch="${2:?usage: finalize-automation-pr.sh <pr-number> <automation-branch>}"
repository="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"

head_sha="$(gh api "repos/$repository/pulls/$pr_number" --jq '.head.sha')"
base_sha="$(gh api "repos/$repository/pulls/$pr_number" --jq '.base.sha')"
current_main="$(gh api "repos/$repository/git/ref/heads/main" --jq '.object.sha')"

if [[ "$base_sha" != "$current_main" ]]; then
  echo "Automation PR #$pr_number is not based on current main ($base_sha != $current_main); refusing stale merge." >&2
  exit 1
fi

before_branch_verify="$(gh run list --repo "$repository" --workflow shared-vitest.yml --branch "$automation_branch" --event workflow_dispatch --limit 1 --json databaseId --jq '.[0].databaseId // 0')"
gh workflow run shared-vitest.yml --ref "$automation_branch" --repo "$repository"
echo "Dispatched native required verify for automation PR #$pr_number at $head_sha."

branch_verify_run=""
for _ in $(seq 1 90); do
  branch_verify_run="$(gh run list --repo "$repository" --workflow shared-vitest.yml --branch "$automation_branch" --event workflow_dispatch --limit 30 --json databaseId,headSha --jq ".[] | select(.headSha == \"$head_sha\" and .databaseId > $before_branch_verify) | .databaseId" | head -n 1)"
  [[ -n "$branch_verify_run" ]] && break
  sleep 2
done
if [[ -z "$branch_verify_run" ]]; then
  echo "Could not resolve native verify run for automation PR #$pr_number at $head_sha." >&2
  exit 1
fi

gh run watch "$branch_verify_run" --repo "$repository" --exit-status

# Do not merge a branch that became stale while the required check was running.
latest_main="$(gh api "repos/$repository/git/ref/heads/main" --jq '.object.sha')"
latest_base="$(gh api "repos/$repository/pulls/$pr_number" --jq '.base.sha')"
latest_head="$(gh api "repos/$repository/pulls/$pr_number" --jq '.head.sha')"
if [[ "$latest_main" != "$latest_base" || "$latest_head" != "$head_sha" ]]; then
  echo "main or the automation PR changed during verification; refusing stale merge and leaving the PR for the next refresh." >&2
  exit 1
fi

gh pr merge "$pr_number" --repo "$repository" --squash --match-head-commit "$head_sha"
merged_sha="$(gh api "repos/$repository/pulls/$pr_number" --jq '.merge_commit_sha')"
if [[ -z "$merged_sha" || "$merged_sha" == "null" ]]; then
  echo "Automation PR #$pr_number merged without a resolvable merge commit SHA." >&2
  exit 1
fi

echo "Merged automation PR #$pr_number as $merged_sha after native required verify passed."

before_main_verify="$(gh run list --repo "$repository" --workflow shared-vitest.yml --branch main --event workflow_dispatch --limit 1 --json databaseId --jq '.[0].databaseId // 0')"
gh workflow run shared-vitest.yml --ref main --repo "$repository"

main_verify_run=""
for _ in $(seq 1 90); do
  main_verify_run="$(gh run list --repo "$repository" --workflow shared-vitest.yml --branch main --event workflow_dispatch --limit 30 --json databaseId,headSha --jq ".[] | select(.headSha == \"$merged_sha\" and .databaseId > $before_main_verify) | .databaseId" | head -n 1)"
  [[ -n "$main_verify_run" ]] && break
  sleep 2
done
if [[ -z "$main_verify_run" ]]; then
  echo "Could not resolve current-main verify for merged automation revision $merged_sha." >&2
  exit 1
fi

gh run watch "$main_verify_run" --repo "$repository" --exit-status

current_main="$(gh api "repos/$repository/git/ref/heads/main" --jq '.object.sha')"
if [[ "$current_main" != "$merged_sha" ]]; then
  echo "A newer main revision exists ($current_main); verified $merged_sha but skipping stale deployment."
  exit 0
fi

gh workflow run deploy-cloudflare-after-verify.yml --ref main --repo "$repository" -f verified_sha="$merged_sha"
echo "Dispatched Cloudflare deployment for exact verified automation revision $merged_sha."
