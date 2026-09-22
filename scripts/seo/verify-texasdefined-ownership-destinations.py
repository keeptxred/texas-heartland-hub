#!/usr/bin/env python3
"""Verify every TexasDefined destination owned by the KTR migration boundary."""

from __future__ import annotations

import subprocess
import tempfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

TD_ORIGIN = "https://texasdefined.com"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
DESTINATIONS = [
    "https://texasdefined.com/article/moving-to-austin-guide",
    "https://texasdefined.com/article/moving-to-dallas-fort-worth-guide",
    "https://texasdefined.com/article/moving-to-el-paso-guide",
    "https://texasdefined.com/article/moving-to-houston-address-checklist",
    "https://texasdefined.com/article/moving-to-san-antonio-guide",
    "https://texasdefined.com/article/moving-to-texas-what-nobody-tells-you",
    "https://texasdefined.com/article/renting-vs-buying-in-texas",
    "https://texasdefined.com/article/salary-needed-to-buy-a-house-in-texas",
    "https://texasdefined.com/article/should-you-refinance-texas-mortgage",
    "https://texasdefined.com/article/texas-closing-costs-guide",
    "https://texasdefined.com/article/texas-home-equity-heloc-guide",
    "https://texasdefined.com/article/texas-homeowners-insurance-guide",
    "https://texasdefined.com/article/texas-house-down-payment-guide",
    "https://texasdefined.com/article/texas-mortgage-payment-guide",
    "https://texasdefined.com/article/texas-utility-costs-guide",
    "https://texasdefined.com/article/true-cost-of-owning-a-home-in-texas",
    "https://texasdefined.com/decide/property-taxes",
    "https://texasdefined.com/do/homestead-exemption",
    "https://texasdefined.com/do/property-tax-protest",
    "https://texasdefined.com/learn/appraisal-districts",
    "https://texasdefined.com/learn/property-taxes",
    "https://texasdefined.com/moving-to-texas",
    "https://texasdefined.com/property-tax-calculators",
    "https://texasdefined.com/texas-budget-planner",
    "https://texasdefined.com/texas-closing-cost-calculator",
    "https://texasdefined.com/texas-cost-of-living-calculator",
    "https://texasdefined.com/texas-down-payment-assistance-calculator",
    "https://texasdefined.com/texas-down-payment-calculator",
    "https://texasdefined.com/texas-first-time-homebuyer-programs",
    "https://texasdefined.com/texas-home-affordability-calculator",
    "https://texasdefined.com/texas-home-equity-calculator",
    "https://texasdefined.com/texas-home-equity-growth-calculator",
    "https://texasdefined.com/texas-home-insurance-calculator",
    "https://texasdefined.com/texas-homeownership-cost-calculator",
    "https://texasdefined.com/texas-mortgage-calculator",
    "https://texasdefined.com/texas-mortgage-payoff-calculator",
    "https://texasdefined.com/texas-moving-cost-calculator",
    "https://texasdefined.com/texas-refinance-savings-calculator",
    "https://texasdefined.com/texas-rent-vs-buy-calculator",
    "https://texasdefined.com/texas-salary-calculator",
    "https://texasdefined.com/texas-salary-comparison-by-city",
    "https://texasdefined.com/texas-utility-cost-calculator",
]


class PageSignals(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.canonicals: list[str] = []
        self.robots: list[str] = []
        self.h1_depth = 0
        self.h1_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): (value or "") for key, value in attrs}
        lower = tag.lower()
        if lower == "link":
            rel = {part.lower() for part in values.get("rel", "").split()}
            if "canonical" in rel and values.get("href"):
                self.canonicals.append(values["href"])
        elif lower == "meta" and values.get("name", "").lower() == "robots":
            self.robots.append(values.get("content", ""))
        elif lower == "h1":
            self.h1_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "h1" and self.h1_depth:
            self.h1_depth -= 1

    def handle_data(self, data: str) -> None:
        if self.h1_depth and data.strip():
            self.h1_parts.append(data.strip())

    @property
    def h1(self) -> str:
        return " ".join(self.h1_parts).strip()


def curl(url: str) -> tuple[int, str]:
    with tempfile.NamedTemporaryFile() as body_file:
        result = subprocess.run(
            [
                "curl",
                "--location",
                "--max-redirs", "5",
                "--retry", "5",
                "--retry-delay", "2",
                "--retry-all-errors",
                "--connect-timeout", "10",
                "--max-time", "60",
                "--silent",
                "--show-error",
                "-H", "cache-control: no-cache",
                "-H", "pragma: no-cache",
                "-o", body_file.name,
                "-w", "%{http_code}",
                url,
            ],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or f"curl exited {result.returncode}")
        body = Path(body_file.name).read_text(encoding="utf-8", errors="replace")
        return int((result.stdout or "0").strip()), body


def parse_sitemap(body: str) -> tuple[str, list[str]]:
    root = ET.fromstring(body)
    kind = root.tag.rsplit("}", 1)[-1]
    if kind == "urlset":
        path = "sm:url/sm:loc"
    elif kind == "sitemapindex":
        path = "sm:sitemap/sm:loc"
    else:
        raise ValueError(f"unexpected sitemap root {root.tag!r}")
    return kind, [
        node.text.strip()
        for node in root.findall(path, NS)
        if node.text and node.text.strip()
    ]


def sitemap_urls() -> set[str]:
    status, body = curl(f"{TD_ORIGIN}/sitemap.xml")
    if status != 200:
        raise RuntimeError(f"{TD_ORIGIN}/sitemap.xml returned HTTP {status}")
    kind, locs = parse_sitemap(body)
    if kind == "urlset":
        return set(locs)

    urls: set[str] = set()
    for child in locs:
        status, child_body = curl(child)
        if status != 200:
            raise RuntimeError(f"{child} returned HTTP {status}")
        child_kind, child_locs = parse_sitemap(child_body)
        if child_kind != "urlset":
            raise RuntimeError(f"{child} is not a URL sitemap")
        urls.update(child_locs)
    return urls


def main() -> None:
    failures: list[str] = []
    advertised = sitemap_urls()

    for url in DESTINATIONS:
        try:
            status, body = curl(url)
        except RuntimeError as exc:
            failures.append(f"{url}: fetch failed ({exc})")
            continue
        if status != 200:
            failures.append(f"{url}: expected HTTP 200, got {status}")
            continue

        signals = PageSignals()
        signals.feed(body)
        if signals.canonicals != [url]:
            failures.append(f"{url}: expected one self-canonical, got {signals.canonicals}")
        if any("noindex" in value.lower() for value in signals.robots):
            failures.append(f"{url}: unexpectedly declares noindex: {signals.robots}")
        if not signals.h1:
            failures.append(f"{url}: missing H1")
        if url not in advertised:
            failures.append(f"{url}: missing from TexasDefined sitemap ownership")

    if failures:
        raise RuntimeError(
            "TexasDefined ownership destination verification failed:\n- "
            + "\n- ".join(failures)
        )

    print(
        "TexasDefined ownership destinations passed: "
        f"{len(DESTINATIONS)} live HTTP 200 pages, all self-canonical, "
        "indexable, H1-bearing, and sitemap-owned."
    )


if __name__ == "__main__":
    main()
