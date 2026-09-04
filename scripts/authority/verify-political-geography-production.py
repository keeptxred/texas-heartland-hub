#!/usr/bin/env python3
"""Verify deployed Texas political-geography authority routes and sitemap ownership."""

from __future__ import annotations

import html
import json
import os
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urljoin

SITE_URL = os.environ.get(
    "SITE_URL",
    "https://keeptxred-site.freddy-coppola.workers.dev",
).rstrip("/")
CANONICAL_SITE = "https://keeptxred.com"

ROUTES = {
    "/texas-politics/texas-political-geography-history":
        "Texas Political Geography: How Regions Built the State's Electoral Map",
    "/texas-politics/texas-urban-suburban-rural-politics-history":
        "Urban, Suburban and Rural Texas Politics: How the Divide Developed",
    "/texas-politics/south-texas-rio-grande-valley-political-history":
        "South Texas and Rio Grande Valley Political History",
    "/texas-politics/texas-metro-regional-realignment-history":
        "Texas Metro and Regional Realignment: Dallas, Houston, Austin, San Antonio and Beyond",
}


class AuthorityHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.h1_depth = 0
        self.h1_parts: list[str] = []
        self.h1s: list[str] = []
        self.canonicals: list[str] = []
        self.robots: list[str] = []
        self.hrefs: list[str] = []
        self.in_json_ld = False
        self.json_ld_parts: list[str] = []
        self.json_ld_blocks: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value or "" for key, value in attrs}
        lowered = tag.lower()
        if lowered == "h1":
            self.h1_depth += 1
            if self.h1_depth == 1:
                self.h1_parts = []
        elif lowered == "link":
            rel_tokens = {token.strip().lower() for token in values.get("rel", "").split()}
            if "canonical" in rel_tokens and values.get("href"):
                self.canonicals.append(values["href"])
        elif lowered == "meta" and values.get("name", "").lower() == "robots":
            self.robots.append(values.get("content", ""))
        elif lowered == "a" and values.get("href"):
            self.hrefs.append(values["href"])
        elif lowered == "script" and values.get("type", "").lower() == "application/ld+json":
            self.in_json_ld = True
            self.json_ld_parts = []

    def handle_endtag(self, tag: str) -> None:
        lowered = tag.lower()
        if lowered == "h1" and self.h1_depth:
            self.h1_depth -= 1
            if self.h1_depth == 0:
                normalized = re.sub(r"\s+", " ", "".join(self.h1_parts)).strip()
                self.h1s.append(html.unescape(normalized))
        elif lowered == "script" and self.in_json_ld:
            self.in_json_ld = False
            self.json_ld_blocks.append("".join(self.json_ld_parts).strip())

    def handle_data(self, data: str) -> None:
        if self.h1_depth:
            self.h1_parts.append(data)
        if self.in_json_ld:
            self.json_ld_parts.append(data)


def fetch(path: str, accept: str = "text/html") -> tuple[bytes, str]:
    url = urljoin(f"{SITE_URL}/", path.lstrip("/"))
    request = urllib.request.Request(
        url,
        headers={
            "Accept": accept,
            "User-Agent": "KeepTXRed-political-geography-smoke/1.0",
            "x-keeptxred-deployment-smoke": "canonical",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read()
            content_type = response.headers.get("content-type", "")
            if response.status != 200:
                raise RuntimeError(f"{url} returned HTTP {response.status}")
            return body, content_type
    except urllib.error.HTTPError as exc:
        detail = exc.read(1000).decode("utf-8", errors="replace")
        raise RuntimeError(f"{url} returned HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"{url} could not be fetched: {exc.reason}") from exc


def schema_types(parser: AuthorityHTMLParser) -> set[str]:
    observed: set[str] = set()
    for block in parser.json_ld_blocks:
        if not block:
            continue
        try:
            payload = json.loads(block)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"invalid JSON-LD block: {exc}") from exc
        objects = payload if isinstance(payload, list) else [payload]
        for obj in objects:
            if not isinstance(obj, dict):
                continue
            value = obj.get("@type")
            if isinstance(value, str):
                observed.add(value)
            elif isinstance(value, list):
                observed.update(item for item in value if isinstance(item, str))
    return observed


def verify_authority_page(path: str, expected_h1: str) -> None:
    body, content_type = fetch(path)
    if "html" not in content_type.lower():
        raise RuntimeError(f"{path} is not HTML: content-type={content_type!r}")
    parser = AuthorityHTMLParser()
    parser.feed(body.decode("utf-8", errors="replace"))

    if parser.h1s != [expected_h1]:
        raise RuntimeError(f"{path} H1 mismatch: observed={parser.h1s!r}")

    canonical = f"{CANONICAL_SITE}{path}"
    if parser.canonicals != [canonical]:
        raise RuntimeError(f"{path} canonical mismatch: observed={parser.canonicals!r}")

    robots = ",".join(parser.robots).lower()
    if "index" not in robots or "follow" not in robots or "noindex" in robots:
        raise RuntimeError(f"{path} robots metadata is not index/follow: {parser.robots!r}")

    missing_schema = {"Article", "BreadcrumbList", "FAQPage"} - schema_types(parser)
    if missing_schema:
        raise RuntimeError(f"{path} is missing JSON-LD types: {sorted(missing_schema)!r}")

    if "/texas-politics" not in parser.hrefs:
        raise RuntimeError(f"{path} lost its Texas Politics authority backlink")


def parse_locs(body: bytes, source: str) -> list[str]:
    try:
        root = ET.fromstring(body)
    except ET.ParseError as exc:
        raise RuntimeError(f"{source} is not valid XML: {exc}") from exc
    return [
        element.text.strip()
        for element in root.iter()
        if element.tag.rsplit("}", 1)[-1] == "loc" and element.text and element.text.strip()
    ]


def verify_sitemaps() -> None:
    child_body, child_type = fetch("/sitemap-political-geography.xml", "application/xml,text/xml;q=0.9,*/*;q=0.1")
    if "xml" not in child_type.lower():
        raise RuntimeError(f"political-geography sitemap is not XML: content-type={child_type!r}")
    observed = parse_locs(child_body, "political-geography sitemap")
    expected = [f"{CANONICAL_SITE}{path}" for path in ROUTES]
    if len(observed) != len(set(observed)):
        raise RuntimeError(f"political-geography sitemap contains duplicate URLs: {observed!r}")
    if set(observed) != set(expected) or len(observed) != len(expected):
        raise RuntimeError(
            "political-geography sitemap does not own exactly the four authority URLs: "
            f"observed={observed!r} expected={expected!r}"
        )

    root_body, root_type = fetch("/sitemap.xml", "application/xml,text/xml;q=0.9,*/*;q=0.1")
    if "xml" not in root_type.lower():
        raise RuntimeError(f"root sitemap is not XML: content-type={root_type!r}")
    root_locs = parse_locs(root_body, "root sitemap")
    child_url = f"{CANONICAL_SITE}/sitemap-political-geography.xml"
    if child_url not in root_locs:
        raise RuntimeError(f"root sitemap no longer advertises {child_url}")


def verify_politics_hub() -> None:
    body, content_type = fetch("/texas-politics")
    if "html" not in content_type.lower():
        raise RuntimeError(f"Texas Politics hub is not HTML: content-type={content_type!r}")
    parser = AuthorityHTMLParser()
    parser.feed(body.decode("utf-8", errors="replace"))
    missing = sorted(path for path in ROUTES if path not in parser.hrefs)
    if missing:
        raise RuntimeError(f"Texas Politics hub lost political-geography discovery links: {missing!r}")


def main() -> int:
    failures: list[str] = []
    for path, expected_h1 in ROUTES.items():
        try:
            verify_authority_page(path, expected_h1)
            print(f"PASS authority page: {path}")
        except RuntimeError as exc:
            failures.append(str(exc))

    for label, verifier in (("sitemaps", verify_sitemaps), ("politics hub", verify_politics_hub)):
        try:
            verifier()
            print(f"PASS {label}")
        except RuntimeError as exc:
            failures.append(str(exc))

    if failures:
        for failure in failures:
            print(f"FAIL: {failure}", file=sys.stderr)
        return 1

    print("Political-geography production smoke passed: four authority routes, canonicals, indexability, schema, hub discovery, and dedicated sitemap ownership are intact.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
