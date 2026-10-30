#!/usr/bin/env python3
"""Close lobbying automation issue only after a genuinely unattended source-change release.

Runs weekly on GitHub Actions. Read-only unless every release-acceptance gate passes.
No synthetic source edits, token disclosure, or branch-protection bypasses.
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request

REPO = os.environ.get("GITHUB_REPOSITORY", "keeptxred/texas-heartland-hub")
ISSUE = 3263
TOKEN = os.environ["GH_TOKEN"]
CUTOFF = "2026-10-30T22:37:48Z"  # First verified Actions secret presence.
SOURCE_PATH = "src/data/lobbying-2026-source-status.json"
PR_TITLE = "Refresh verified Texas lobbying primary-source fingerprints"
WORKFLOW = ".github/workflows/texas-lobbying-2026-source-check.yml"


def api(path, method="GET", payload=None):
    body = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(
        "https://api.github.com/repos/" + REPO + path,
        method=method,
        data=body,
        headers={
            "Authorization": "Bearer " + TOKEN,
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "KTR-lobbying-release-acceptance",
            **({"Content-Type": "application/json"} if body is not None else {}),
        },
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def eligible(pr):
    number = pr["number"]
    if pr.get("title") != PR_TITLE or pr.get("created_at", "") <= CUTOFF:
        return None
    if not pr.get("merged_at") or pr.get("base", {}).get("ref") != "main":
        return None
    match = re.fullmatch(r"automation/texas-lobbying-2026-(\d+)", pr.get("head", {}).get("ref", ""))
    if not match:
        return None

    source_run_id = int(match.group(1))
    source_run = api(f"/actions/runs/{source_run_id}")
    if not (
        source_run.get("name") == "Verify Texas 2026 lobbying primary sources"
        and source_run.get("path") == WORKFLOW
        and source_run.get("head_branch") == "main"
        and source_run.get("conclusion") == "success"
        and source_run.get("created_at", "") <= pr["created_at"] <= source_run.get("updated_at", "")
    ):
        return None

    changed = api(f"/pulls/{number}/files?per_page=100")
    if len(changed) != 1 or changed[0].get("filename") != SOURCE_PATH or changed[0].get("status") != "modified":
        return None

    timeline = api(f"/issues/{number}/timeline?per_page=100")
    if len(timeline) == 100:  # Do not infer a complete timeline from a truncated page.
        return None
    if any(item.get("event") == "reopened" for item in timeline):
        return None
    if not any(
        item.get("event") in ("auto_squash_enabled", "auto_merge_enabled", "auto_rebase_enabled")
        and item.get("created_at", "") < pr["merged_at"]
        and item.get("actor", {}).get("login") == "github-actions[bot]"
        for item in timeline
    ):
        return None

    head_sha = pr["head"]["sha"]
    prs = api("/actions/runs?" + urllib.parse.urlencode(
        {"head_sha": head_sha, "event": "pull_request", "per_page": 100}
    )).get("workflow_runs", [])
    genuine_checks = [
        run for run in prs
        if run.get("name") == "Repository test and build health"
        and run.get("conclusion") == "success"
        and pr["created_at"] <= run.get("created_at", "") <= pr["merged_at"]
    ]
    if not genuine_checks:
        return None
    check_run = genuine_checks[0]
    jobs = api(f"/actions/runs/{check_run['id']}/jobs?per_page=100").get("jobs", [])
    if not any(job.get("name") == "verify" and job.get("conclusion") == "success" for job in jobs):
        return None

    merge_sha = pr["merge_commit_sha"]
    lineage = api(f"/compare/{merge_sha}...main")
    if lineage.get("status") not in ("ahead", "identical"):
        return None
    releases = api("/actions/runs?" + urllib.parse.urlencode(
        {"head_sha": merge_sha, "per_page": 100}
    )).get("workflow_runs", [])
    deployments = [
        run for run in releases
        if run.get("name") == "Deploy verified KeepTXRed to Cloudflare"
        and run.get("conclusion") == "success"
        and run.get("updated_at", "") >= pr["merged_at"]
    ]
    if not deployments:
        return None
    deploy = max(deployments, key=lambda item: item["updated_at"])
    acceptances = [
        run for run in releases
        if run.get("name") == "Verify live Texas lobbying 2026 authority"
        and run.get("conclusion") == "success"
        and run.get("created_at", "") >= deploy["updated_at"]
    ]
    if not acceptances:
        return None

    acceptance = min(acceptances, key=lambda item: item["created_at"])
    return {
        "number": number,
        "source_run": source_run_id,
        "check_run": check_run["id"],
        "merge_sha": merge_sha,
        "deployment": deploy["id"],
        "acceptance": acceptance["id"],
    }


def main():
    issue = api(f"/issues/{ISSUE}")
    if issue["state"] != "open":
        print("Acceptance issue already closed; no work.")
        return

    query = f'repo:{REPO} is:pr is:merged "{PR_TITLE}" created:>=2026-10-30'
    search = api("/search/issues?" + urllib.parse.urlencode(
        {"q": query, "per_page": 100, "sort": "updated", "order": "desc"}
    ))
    for item in search.get("items", []):
        if not item.get("pull_request"):
            continue
        pr = api(f"/pulls/{item['number']}")
        result = eligible(pr)
        if not result:
            continue

        base = f"https://github.com/{REPO}"
        evidence = (
            "Automated lobbying source-change release acceptance passed.\n\n"
            f"- Source-check workflow: {base}/actions/runs/{result['source_run']}\n"
            f"- Source-only bot PR: {base}/pull/{result['number']} (no reopen)\n"
            f"- Genuine pull_request required verification: {base}/actions/runs/{result['check_run']}\n"
            f"- Protected merge SHA: `{result['merge_sha']}` (ancestor of main)\n"
            f"- Successful deployment: {base}/actions/runs/{result['deployment']}\n"
            f"- Successful live Worker and public-host acceptance: {base}/actions/runs/{result['acceptance']}\n\n"
            "The one-time CI-triggering token has been proven across a real source change; "
            "closing #3263 without weakening protected main."
        )
        api(f"/issues/{ISSUE}/comments", "POST", {"body": evidence})
        api(f"/issues/{ISSUE}", "PATCH", {"state": "closed", "state_reason": "completed"})
        print(f"PASS: Closed #{ISSUE} after fully verified source-change release in PR #{result['number']}.")
        return

    print("No eligible fully unattended changed-source release yet. Leaving issue open; no source changes manufactured.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Acceptance verification failed closed: {type(exc).__name__}: {exc}", file=sys.stderr)
        raise
