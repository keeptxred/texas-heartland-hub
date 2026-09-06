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
HB1056_PATH = "/bills/texas/89/hb/1056"
HB1056_CANONICAL = "https://keeptxred.com/bills/texas/89/hb/1056"
HB1056_ARTICLE_PATH = "/news/texas-gold-silver-legal-tender-hb-1056"
HB1056_ARTICLE_TITLE = "Texas Gold and Silver Legal Tender Law Takes Effect Sept. 1"
HB1056_MISSING_ARTICLE_FALLBACK = "KeepTXRed has not linked a related article to this bill yet."
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
        self.anchor_depth = 0
        self.anchor_href: str | None = None
        self.anchor_parts: list[str] = []
        self.anchors: list[dict[str, str]] = []
        self.text_parts: list[str] = []

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
        if tag == "a":
            if self.anchor_depth == 0:
                values = dict(attrs)
                self.anchor_href = values.get("href")
                self.anchor_parts = []
            self.anchor_depth += 1

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag == "h1" and self.h1_depth:
            self.h1_depth -= 1
        if tag == "a" and self.anchor_depth:
            self.anchor_depth -= 1
            if self.anchor_depth == 0:
                self.anchors.append({
                    "href": normalize(self.anchor_href or ""),
                    "text": normalize(" ".join(self.anchor_parts)),
                })
                self.anchor_href = None
                self.anchor_parts = []

    def handle_data(self, data):
        self.text_parts.append(data)
        if self.h1_depth:
            self.h1_parts.append(data)
        if self.anchor_depth:
            self.anchor_parts.append(data)


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
        "hb1056_relationship": {
            "path": HB1056_PATH,
            "fetch": "pending",
            "fetch_error": None,
            "canonicals": [],
            "article_link_found": False,
            "article_title_found": False,
            "missing_article_fallback_found": False,
        },
        "priority_sitemap": {"status": "not_run", "error": None},
        "bills_platform": {"status": "not_run", "error": None},
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

    hb_observation = report["hb1056_relationship"]
    try:
        hb_body = fetch(f"{SITE_URL}{HB1056_PATH}")
        hb_observation["fetch"] = "ok"
        hb_parser = PageParser()
        hb_parser.feed(hb_body)
        hb_canonicals = [normalize(value) for value in hb_parser.canonicals]
        hb_observation["canonicals"] = hb_canonicals
        matching_links = [
            anchor for anchor in hb_parser.anchors
            if anchor["href"] == HB1056_ARTICLE_PATH
        ]
        visible_text = normalize(" ".join(hb_parser.text_parts))
        hb_observation["article_link_found"] = bool(matching_links)
        hb_observation["article_title_found"] = any(
            HB1056_ARTICLE_TITLE in anchor["text"] for anchor in matching_links
        )
        hb_observation["missing_article_fallback_found"] = HB1056_MISSING_ARTICLE_FALLBACK in visible_text

        if hb_canonicals != [HB1056_CANONICAL]:
            failures.append(
                f"{HB1056_PATH}: expected one canonical {HB1056_CANONICAL!r}, got {hb_canonicals!r}"
            )
        if not hb_observation["article_link_found"]:
            failures.append(
                f"{HB1056_PATH}: missing related article link {HB1056_ARTICLE_PATH!r}"
            )
        elif not hb_observation["article_title_found"]:
            failures.append(
                f"{HB1056_PATH}: related article link is present but title {HB1056_ARTICLE_TITLE!r} is not rendered inside it"
            )
        if hb_observation["missing_article_fallback_found"]:
            failures.append(
                f"{HB1056_PATH}: stale missing-related-article fallback is still rendered"
            )

        print(
            f"{HB1056_PATH}: canonical={hb_canonicals!r} "
            f"article_link={hb_observation['article_link_found']} "
            f"article_title={hb_observation['article_title_found']} "
            f"fallback={hb_observation['missing_article_fallback_found']}"
        )
    except RuntimeError as exc:
        hb_observation["fetch"] = "failed"
        hb_observation["fetch_error"] = str(exc)
        failures.append(f"{HB1056_PATH}: fetch failed ({exc})")
    write_report(report)

    if failures:
        write_report(report)
        for failure in failures:
            github_error("Deployed laws route smoke failed", failure)
        raise SystemExit("Deployed laws route smoke failed:\n- " + "\n- ".join(failures))

    print(f"Deployed laws route smoke passed for {len(CHECKS)} routes plus the HB 1056 related article on {SITE_URL}.")
    try:
        verify_priority_sitemap(SITE_URL)
        report["priority_sitemap"] = {"status": "passed", "error": None}
    except RuntimeError as exc:
        report["priority_sitemap"] = {"status": "failed", "error": str(exc)}
        write_report(report)
        raise SystemExit(str(exc)) from exc

    bills_smoke = Path(__file__).resolve().parents[1] / "legislature" / "verify-deployed-bills-platform.py"
    bills_result = subprocess.run(
        ["python3", str(bills_smoke)],
        env={**os.environ, "SITE_URL": SITE_URL},
        capture_output=True,
        text=True,
    )
    if bills_result.stdout:
        print(bills_result.stdout, end="" if bills_result.stdout.endswith("\n") else "\n")
    if bills_result.returncode != 0:
        error = bills_result.stderr.strip() or f"Texas Bills smoke exited {bills_result.returncode}"
        report["bills_platform"] = {"status": "failed", "error": error}
        write_report(report)
        github_error("Deployed Texas Bills smoke failed", error)
        raise SystemExit(error)
    report["bills_platform"] = {"status": "passed", "error": None}

    write_report(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
