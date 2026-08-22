#!/usr/bin/env bash
set -euo pipefail

branch_prefix="${1:?usage: publish-automation-pr.sh <branch-prefix> <file...>}"
shift
if [[ "$#" -eq 0 ]]; then
  echo "::error title=Automation files required::At least one generated file must be supplied."
  exit 2
fi

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${PR_TITLE:?PR_TITLE is required}"
: "${PR_BODY:?PR_BODY is required}"
: "${COMMIT_MESSAGE:?COMMIT_MESSAGE is required}"

if [[ -z "${GITHUB_RUN_ID:-}" ]]; then
  echo "::error title=GitHub run id required::This publisher is intended for GitHub Actions runs."
  exit 2
fi

git fetch origin main
current="$(git rev-parse HEAD)"
main="$(git rev-parse origin/main)"
if [[ "$current" != "$main" ]]; then
  echo "::error title=Stale automation revision::main advanced during generation: $current -> $main. Refusing to publish stale generated data."
  exit 1
fi

git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
branch="automation/${branch_prefix}-${GITHUB_RUN_ID}"
git checkout -b "$branch"
git add -- "$@"

if git diff --cached --quiet; then
  echo 'No staged automation changes to publish.'
  exit 0
fi

git commit -m "$COMMIT_MESSAGE"
git push origin "$branch"
pr_url="$(gh pr create --base main --head "$branch" --title "$PR_TITLE" --body "$PR_BODY")"
echo "Opened $pr_url"
echo 'The existing protected verify check and trusted same-repository auto-merge workflow control the merge and deployment.'
