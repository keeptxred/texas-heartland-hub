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

repo="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
verify_workflow='shared-vitest.yml'
deploy_workflow='deploy-cloudflare-after-verify.yml'

dispatch_and_watch_verify() {
  local ref="$1"
  local expected_sha="$2"
  local before run_id

  before="$(gh run list --repo "$repo" --workflow "$verify_workflow" --branch "$ref" --event workflow_dispatch --limit 1 --json databaseId --jq '.[0].databaseId // 0')"
  gh workflow run "$verify_workflow" --ref "$ref" --repo "$repo"

  run_id=''
  for attempt in $(seq 1 60); do
    run_id="$(gh run list --repo "$repo" --workflow "$verify_workflow" --branch "$ref" --event workflow_dispatch --limit 20 --json databaseId,headSha --jq ".[] | select(.headSha == \"$expected_sha\" and .databaseId > $before) | .databaseId" | head -n 1)"
    [[ -n "$run_id" ]] && break
    sleep 2
  done

  if [[ -z "$run_id" ]]; then
    echo "::error title=Verification run not found::Could not resolve workflow_dispatch verify for $ref at $expected_sha."
    return 1
  fi

  echo "Watching protected verify run $run_id for $expected_sha."
  gh run watch "$run_id" --repo "$repo" --exit-status
}

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
pr_url="$(gh pr create --repo "$repo" --base main --head "$branch" --title "$PR_TITLE" --body "$PR_BODY")"
echo "Opened $pr_url"

for cycle in 1 2 3; do
  branch_sha="$(git rev-parse HEAD)"
  dispatch_and_watch_verify "$branch" "$branch_sha"

  git fetch origin main
  if git merge-base --is-ancestor origin/main HEAD; then
    echo 'Automation branch contains current main and passed protected verify.'
    break
  fi

  if [[ "$cycle" -eq 3 ]]; then
    echo "::error title=Main kept advancing::Refusing to merge an automation branch that could not be reconciled and reverified against current main after three cycles."
    exit 1
  fi

  echo 'main advanced during verification; rebasing and reverifying.'
  git rebase origin/main
  git push --force-with-lease origin "$branch"
done

gh pr merge "$pr_url" --repo "$repo" --squash --delete-branch
merged_sha="$(gh pr view "$pr_url" --repo "$repo" --json mergeCommit --jq '.mergeCommit.oid // empty')"
if [[ -z "$merged_sha" ]]; then
  echo '::error title=Merge SHA unavailable::Automation PR merged but GitHub did not return the merge commit SHA.'
  exit 1
fi

git fetch origin main
main_sha="$(git rev-parse origin/main)"
if [[ "$main_sha" != "$merged_sha" ]]; then
  echo "A newer main revision exists ($main_sha); automation PR merged as $merged_sha, so stale post-merge deployment is skipped."
  exit 0
fi

dispatch_and_watch_verify main "$merged_sha"

git fetch origin main
main_sha="$(git rev-parse origin/main)"
if [[ "$main_sha" != "$merged_sha" ]]; then
  echo "A newer main revision exists ($main_sha); skipping stale deployment of verified $merged_sha."
  exit 0
fi

gh workflow run "$deploy_workflow" --ref main --repo "$repo" -f verified_sha="$merged_sha"
echo "Post-merge protected verify passed; dispatched Cloudflare deployment for exact current main revision $merged_sha."
