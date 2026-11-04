#!/usr/bin/env python3
"""Check the deployed server-rendered Texas border authority page.

Run from the existing protected Cloudflare deployment workflow against the
newly deployed workers.dev URL, which reaches the Worker without production
zone bot challenges. This is *not* a Google URL Inspection API verdict.
"""
from __future__ import annotations

import os
import re
import subprocess
import sys
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

CANONICAL = "https://keeptxred.com/texas-border-security"
REQUIRED_SECTIONS = {
    "border-powers",
    "border-spending",
    "border-litigation",
    "border-geography",
    "border-records",
}
REQUIRED_TEXT = (
    "Texas Border & Immigration",
    "Who controls what, what Texas budgeted, and how to check the law",
    "Texas and federal authority: a practical comparison",
    "2026–27 appropriations by agency",
    "SB 4: the orders behind the headlines",
    "Five border regions that should not be treated as one story",
    "Editorial accountability and limitations",
    "Keep TX Red editorial desk",
    "28 vehicle, 5 rail and 1 pedestrian",
    "May 29, 2026",
)
REQUIRED_LINKS = (
    "https://www.ca5.uscourts.gov/Opinions/pub/24/24-50149-CV2.pdf",
    "https://www.tmcec.com/wp-content/uploads/2026/05/26-50418_documents.pdf",
    "https://www.txdot.gov/projects/planning/international-trade-border-planning/btmp.html",
    "#border-powers",
)


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.canonicals: list[str] = []
        self.robots: list[str] = []
        self.anchors: set[str] = set()
        self.ids: set[str] = set()
        self.visible: list[str] = []
        self.h1: list[str] = []
        self.h1_count = 0
        self.in_h1 = False
        self.in_body = False
        self.ignored = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_map = dict(attrs)
        if tag == "body":
            self.in_body = True
        if tag in {"script", "style", "template"}:
            self.ignored += 1
        if tag == "link" and "canonical" in (attrs_map.get("rel") or "").lower().split():
            self.canonicals.append(attrs_map.get("href") or "")
        if tag == "meta" and (attrs_map.get("name") or "").lower() == "robots":
            self.robots.append(attrs_map.get("content") or "")
        if self.in_body:
            if attrs_map.get("id"):
                self.ids.add(attrs_map["id"] or "")
            if tag == "a" and attrs_map.get("href"):
                self.anchors.add(attrs_map["href"] or "")
            if tag == "h1":
                self.h1_count += 1
                self.in_h1 = True

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "template"} and self.ignored:
            self.ignored -= 1
        if tag == "h1":
            self.in_h1 = False
        if tag == "body":
            self.in_body = False

    def handle_data(self, data: str) -> None:
        if self.in_body and not self.ignored:
            self.visible.append(data)
            if self.in_h1:
                self.h1.append(data)


def fetch(site_url: str) -> tuple[int, str, str]:
    parsed = urlparse(site_url)
    if parsed.scheme != "https" or not parsed.netloc or parsed.username or parsed.password:
        raise ValueError("SITE_URL must be a valid HTTPS host")
    url = site_url.rstrip("/") + "/texas-border-security"
    with tempfile.TemporaryDirectory(prefix="ktr-border-verify-") as directory:
        body_path = Path(directory) / "body.html"
        headers_path = Path(directory) / "headers.txt"
        result = subprocess.run(
            [
                "curl", "--location", "--retry", "2", "--retry-delay", "2",
                "--connect-timeout", "8", "--max-time", "45",
                "--silent", "--show-error", "--dump-header", str(headers_path),
                "--output", str(body_path), "--write-out", "%{http_code}", url,
            ],
            capture_output=True, text=True, check=False,
        )
        if result.returncode:
            raise RuntimeError(f"GET {url} failed: curl exit={result.returncode}; {result.stderr.strip()[:250]}")
        status = int(result.stdout.strip()[-3:])
        return (
            status,
            body_path.read_text(encoding="utf-8", errors="replace"),
            headers_path.read_text(encoding="utf-8", errors="replace"),
        )


def main() -> int:
    site_url = os.environ.get("SITE_URL", "").strip()
    if not site_url:
        raise SystemExit("SITE_URL is required")
    status, html, headers = fetch(site_url)
    errors: list[str] = []
    if status != 200:
        errors.append(f"Expected HTTP 200; received {status}")
    if "<html" not in html.lower():
        errors.append("HTML document missing")
    page = Page()
    page.feed(html)
    h1 = compact(" ".join(page.h1))
    text = compact(" ".join(page.visible))
    if page.h1_count != 1 or h1 != "Texas Border & Immigration":
        errors.append(f"Expected one Texas Border & Immigration H1; found {page.h1_count} / {h1!r}")
    if page.canonicals != [CANONICAL]:
        errors.append(f"Expected exactly one self-canonical {CANONICAL}; found {page.canonicals!r}")
    if any("noindex" in tag.lower() for tag in page.robots):
        errors.append(f"HTML robots forbids indexing: {page.robots!r}")
    if re.search(r"(?im)^x-robots-tag:\s*.*noindex", headers):
        errors.append("HTTP X-Robots-Tag forbids indexing")
    missing_sections = REQUIRED_SECTIONS - page.ids
    if missing_sections:
        errors.append(f"Missing visible authority section IDs: {sorted(missing_sections)!r}")
    for marker in REQUIRED_TEXT:
        if marker not in text:
            errors.append(f"Missing rendered reader-visible text: {marker!r}")
    for href in REQUIRED_LINKS:
        if href not in page.anchors:
            errors.append(f"Missing source or navigation link in rendered document: {href!r}")
    research = text.find("Who controls what, what Texas budgeted, and how to check the law")
    articles = text.find("All Coverage in this Section")
    if research < 0 or articles < 0 or research >= articles:
        errors.append("Original research must render before the article directory")
    if errors:
        for issue in errors:
            print(f"::error title=Texas border SSR verification::{issue}", file=sys.stderr)
        print(f"FAIL: {len(errors)} border authority SSR checks failed at {site_url}", file=sys.stderr)
        return 1
    print(
        "PASS: Texas border page HTTP 200; indexable self-canonical; one correct H1; "
        f"{len(REQUIRED_SECTIONS)} visible sections; {len(REQUIRED_LINKS)} source/navigation links; "
        "new Texas-specific content is server rendered ahead of article directory."
    )
    print(f"Site: {site_url}; HTML bytes: {len(html.encode('utf-8'))}; H1: {h1}")
    print("Caveat: this verifies the deployed Worker response, not Google-selected canonical or indexing.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
