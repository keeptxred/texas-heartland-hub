#!/usr/bin/env python3
import json
import os
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path

from verify_deployed_priority_sitemap import verify_priority_sitemap

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev").rstrip("/")
DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical"
DEPLOYMENT_SMOKE_REPORT = os.environ.get("DEPLOYMENT_SMOKE_REPORT")
PARENT_H1 = "Texas Laws Explained:"
CHECKS = [
    ("/laws", PARENT_H1, "https://keeptxred.com/laws", False, False),
    ("/laws/constitutional-amendments", "Texas Constitutional Amendments Tracker", "https://keeptxred.com/laws/constitutional-amendments", True, True),
    ("/laws/effective-dates", "Texas Laws Taking Effect in 2026", "https://keeptxred.com/laws/effective-dates", True, True),
    ("/laws/topics", "Texas Law Library", "https://keeptxred.com/laws/topics", True, True),
    ("/laws/topic/property-tax-law", "Texas Property Tax Law Explained", "https://keeptxred.com/laws/topic/property-tax-law", True, True),
]


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def github_error(title: str, message: str) -> None:
    if os.environ.get("GITHUB_ACTIONS") != "true":
        return
    escaped = (
        message.replace("%", "%25")
        .replace("\r", "%0D")
        .replace("\n", "%0A")
    )
    print(f"::error title={title}::{escaped}", flush=True)


def write_report(report: dict) -> None:
    if not DEPLOYMENT_SMOKE_REPORT:
        return
    path = Path(DEPLOYMENT_SMOKE_REPORT)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.h1_depth = 0
        self.h1_parts: list[str] = []
        self.canonicals: list[str] = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag == "h1":
            self.h1_depth += 1
        if tag == "link":
            values = dict(attrs)
            rel = {part.lower() for part in (values.get("rel") or "").split()}
            href = values.get("href")
            if "canonical" in rel and href:
                self.canonicals.append(href)

    def handle_endtag(self, tag):
        if tag.lower() == "h1" and self.h1_depth:
            self.h1_depth -= 1

    def handle_data(self, data):
        if self.h1_depth:
            self.h1_parts.append(data)


def fetch(url: str) -> str:
    result = subprocess.run(
        [
            "curl", "--retry", "12", "--retry-delay", "2", "--retry-all-errors",
            "--connect-timeout", "10", "--max-time", "60", "--max-redirs", "0",
            "--fail-with-body", "--silent", "--show-error",
            "-H", DEPLOYMENT_SMOKE_HEADER,
            "-H", "cache-control: no-cache", "-H", "pragma: no-cache", url,
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f"curl exited {result.returncode}")
    return result.stdout


def main() -> int:
    failures: list[str] = []
    report = {
        "site_url": SITE_URL,
        "routes": [],
        "route_failures": failures,
        "priority_sitemap": {"status": "not_run", "error": None},
    }
    write_report(report)

    for path, expected_h1, expected_canonical, exact_h1, forbid_parent in CHECKS:
        observation = {
            "path": path,
            "expected_h1": expected_h1,
            "expected_h1_mode": "exact" if exact_h1 else "contains",
            "expected_canonical": expected_canonical,
            "fetch": "pending",
            "fetch_error": None,
            "h1": None,
            "canonicals": [],
        }
        report["routes"].append(observation)
        try:
            body = fetch(f"{SITE_URL}{path}")
            observation["fetch"] = "ok"
        except RuntimeError as exc:
            message = f"{path}: fetch failed ({exc})"
            observation["fetch"] = "failed"
            observation["fetch_error"] = str(exc)
            failures.append(message)
            write_report(report)
            continue

        parser = PageParser()
        parser.feed(body)
        h1 = normalize(" ".join(parser.h1_parts))
        canonicals = [normalize(value) for value in parser.canonicals]
        observation["h1"] = h1
        observation["canonicals"] = canonicals

        if not h1:
            failures.append(f"{path}: missing H1")
        elif exact_h1 and h1 != expected_h1:
            failures.append(f"{path}: expected H1 {expected_h1!r}, got {h1!r}")
        elif not exact_h1 and expected_h1 not in h1:
            failures.append(f"{path}: expected H1 containing {expected_h1!r}, got {h1!r}")

        if forbid_parent and PARENT_H1 in h1:
            failures.append(f"{path}: child route is still rendering the /laws parent H1 ({h1!r})")

        if canonicals != [expected_canonical]:
            failures.append(f"{path}: expected one canonical {expected_canonical!r}, got {canonicals!r}")

        print(f"{path}: h1={h1!r} canonical={canonicals!r}")
        write_report(report)

    if failures:
        write_report(report)
        for failure in failures:
            github_error("Deployed laws route smoke failed", failure)
        raise SystemExit("Deployed laws route smoke failed:\n- " + "\n- ".join(failures))

    print(f"Deployed laws route smoke passed for {len(CHECKS)} routes on {SITE_URL}.")
    try:
        verify_priority_sitemap(SITE_URL)
        report["priority_sitemap"] = {"status": "passed", "error": None}
    except RuntimeError as exc:
        report["priority_sitemap"] = {"status": "failed", "error": str(exc)}
        write_report(report)
        raise SystemExit(str(exc)) from exc

    write_report(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
