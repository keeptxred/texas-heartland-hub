#!/usr/bin/env python3
from __future__ import annotations

import html
import os
import re
import sys
import time
import urllib.error
import urllib.request

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev").rstrip("/")


def fetch(path: str) -> tuple[str, str]:
    url = f"{SITE_URL}{path}"
    last_error: Exception | None = None
    for attempt in range(1, 13):
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": "KeepTXRed-Texas-Bills-Deploy-Smoke/1.0",
                "Accept": "text/html,application/xhtml+xml",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                if response.status != 200:
                    raise RuntimeError(f"{url} returned HTTP {response.status}")
                body = response.read().decode("utf-8", errors="replace")
                if not body.strip():
                    raise RuntimeError(f"{url} returned an empty body")
                return url, body
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, RuntimeError) as exc:
            last_error = exc
            if attempt == 12:
                break
            time.sleep(min(2 * attempt, 10))
    raise RuntimeError(f"Unable to fetch {url}: {last_error}")


def visible_text(body: str) -> str:
    text = re.sub(r"<script\b[^>]*>.*?</script>", " ", body, flags=re.I | re.S)
    text = re.sub(r"<style\b[^>]*>.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def require(text: str, needle: str, *, context: str) -> None:
    if needle not in text:
        raise AssertionError(f"{context}: missing expected text {needle!r}")


def forbid(text: str, needle: str, *, context: str) -> None:
    if needle in text:
        raise AssertionError(f"{context}: found stale text {needle!r}")


def require_canonical(body: str, path: str, *, context: str) -> None:
    expected = f"https://keeptxred.com{path}"
    canonical_tags = re.findall(r"<link\b[^>]*rel=[\"']canonical[\"'][^>]*>", body, flags=re.I)
    if not canonical_tags:
        canonical_tags = re.findall(r"<link\b[^>]*href=[\"'][^\"']+[\"'][^>]*rel=[\"']canonical[\"'][^>]*>", body, flags=re.I)
    if not canonical_tags or not any(expected in tag for tag in canonical_tags):
        raise AssertionError(f"{context}: canonical must be {expected!r}")


def check(path: str, required: list[str], forbidden: list[str] | None = None, canonical: str | None = None) -> None:
    url, body = fetch(path)
    text = visible_text(body)
    for needle in required:
        require(text, needle, context=url)
    for needle in forbidden or []:
        forbid(text, needle, context=url)
    if canonical:
        require_canonical(body, canonical, context=url)
    print(f"PASS {url}")


def main() -> int:
    check(
        "/bills",
        ["Texas Bills and Legislation", "89(2) · 2nd Called Session"],
    )
    check(
        "/bills/texas/89",
        ["89th Texas Legislature Bills", "89(2) · 2nd Called Session"],
    )
    check(
        "/bills/texas/89/hb/1056",
        [
            "89(R) · Regular Session",
            "Effective-date schedule",
            "September 1, 2026",
            "May 1, 2027",
        ],
        forbidden=["89th Texas Legislature · Session R"],
        canonical="/bills/texas/89/hb/1056",
    )
    check(
        "/bills/texas/89/sb/5",
        [
            "89(R) · Regular Session",
            "Effective-date schedule",
            "December 1, 2025",
            "Condition status: Satisfied",
        ],
        forbidden=["89th Texas Legislature · Session R"],
        canonical="/bills/texas/89/sb/5",
    )
    check(
        "/bills/texas/89/2/hb/16",
        [
            "89(2) · 2nd Called Session",
            "Effective-date schedule",
            "January 1, 2029",
            "Condition status: Failed",
        ],
        forbidden=["89th Texas Legislature · Called Session 2"],
        canonical="/bills/texas/89/2/hb/16",
    )
    check(
        "/bills/texas/89/2/sb/18",
        [
            "89(2) · 2nd Called Session",
            "Vetoed",
            "It did not become law and therefore has no effective date.",
        ],
        forbidden=["89th Texas Legislature · Called Session 2"],
        canonical="/bills/texas/89/2/sb/18",
    )
    print("Texas Bills deployed-render smoke passed")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"Texas Bills deployed-render smoke failed: {exc}", file=sys.stderr)
        raise
