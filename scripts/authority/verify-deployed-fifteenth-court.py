#!/usr/bin/env python3
import os
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

SITE_ORIGIN = "https://keeptxred.com"
DEFAULT_SITE_URL = "https://keeptxred-site.freddy-coppola.workers.dev"
DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical"
COURT_PATH = "/texas-government/fifteenth-court-of-appeals"
COURT_CANONICAL = f"{SITE_ORIGIN}{COURT_PATH}"
COURT_H1 = "Texas Fifteenth Court of Appeals: The Statewide Court That Changed the Appellate Map"
GOVERNMENT_SITEMAP_PATH = "/sitemap-government.xml"
SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.h1_depth = 0
        self.h1_parts: list[str] = []
        self.canonicals: list[str] = []
        self.robots: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        values = {str(key).lower(): value for key, value in attrs}
        tag = tag.lower()
        if tag == "h1":
            self.h1_depth += 1
        elif tag == "link":
            rel = {part.lower() for part in (values.get("rel") or "").split()}
            href = values.get("href")
            if "canonical" in rel and href:
                self.canonicals.append(href.strip())
        elif tag == "meta":
            name = (values.get("name") or "").strip().lower()
            if name in {"robots", "googlebot"}:
                self.robots.append((values.get("content") or "").strip().lower())

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "h1" and self.h1_depth:
            self.h1_depth -= 1

    def handle_data(self, data: str) -> None:
        if self.h1_depth:
            self.h1_parts.append(data)


def normalize(value: str) -> str:
    return " ".join(value.split())


def github_error(message: str) -> None:
    if os.environ.get("GITHUB_ACTIONS") != "true":
        return
    escaped = (
        message.replace("%", "%25")
        .replace("\r", "%0D")
        .replace("\n", "%0A")
    )
    print(f"::error title=Deployed Fifteenth Court authority smoke failed::{escaped}", flush=True)


def curl(site_url: str, path: str) -> tuple[int, str, str]:
    with tempfile.NamedTemporaryFile() as header_file, tempfile.NamedTemporaryFile() as body_file:
        command = [
            "curl",
            "--retry", "8",
            "--retry-delay", "2",
            "--retry-all-errors",
            "--connect-timeout", "10",
            "--max-time", "60",
            "--max-redirs", "0",
            "--silent",
            "--show-error",
            "-H", "cache-control: no-cache",
            "-H", "pragma: no-cache",
            "-D", header_file.name,
            "-o", body_file.name,
            "-w", "%{http_code}",
        ]
        if "workers.dev" in site_url:
            command.extend(["-H", DEPLOYMENT_SMOKE_HEADER])
        command.append(f"{site_url}{path}")
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or f"curl exited {result.returncode}")
        status = int((result.stdout or "0").strip())
        headers = Path(header_file.name).read_text(encoding="utf-8", errors="replace")
        body = Path(body_file.name).read_text(encoding="utf-8", errors="replace")
        return status, headers, body


def header_values(headers: str, name: str) -> list[str]:
    needle = name.lower() + ":"
    return [
        raw.split(":", 1)[1].strip()
        for raw in headers.splitlines()
        if raw.lower().startswith(needle)
    ]


def verify_page(site_url: str, failures: list[str]) -> None:
    try:
        status, headers, body = curl(site_url, COURT_PATH)
    except RuntimeError as exc:
        failures.append(f"{COURT_PATH}: fetch failed ({exc})")
        return

    if status != 200:
        failures.append(f"{COURT_PATH}: returned HTTP {status}, expected direct 200 with no redirect")
        return

    content_type = ", ".join(header_values(headers, "content-type")).lower()
    if "text/html" not in content_type:
        failures.append(f"{COURT_PATH}: content-type is not HTML: {content_type!r}")

    x_robots = ", ".join(header_values(headers, "x-robots-tag")).lower()
    if "noindex" in x_robots:
        failures.append(f"{COURT_PATH}: X-Robots-Tag contains noindex ({x_robots!r})")

    parser = PageParser()
    parser.feed(body)
    h1 = normalize(" ".join(parser.h1_parts))
    canonicals = [normalize(value) for value in parser.canonicals]

    if h1 != COURT_H1:
        failures.append(f"{COURT_PATH}: expected H1 {COURT_H1!r}, got {h1!r}")
    if canonicals != [COURT_CANONICAL]:
        failures.append(f"{COURT_PATH}: expected one canonical {COURT_CANONICAL!r}, got {canonicals!r}")
    if not parser.robots:
        failures.append(f"{COURT_PATH}: missing robots meta")
    if any("noindex" in value for value in parser.robots):
        failures.append(f"{COURT_PATH}: robots meta contains noindex ({parser.robots!r})")

    print(
        f"Fifteenth Court page: status={status} h1={h1!r} "
        f"canonical={canonicals!r} robots={parser.robots!r}"
    )


def verify_government_sitemap(site_url: str, failures: list[str]) -> None:
    try:
        status, headers, body = curl(site_url, GOVERNMENT_SITEMAP_PATH)
    except RuntimeError as exc:
        failures.append(f"{GOVERNMENT_SITEMAP_PATH}: fetch failed ({exc})")
        return

    if status != 200:
        failures.append(f"{GOVERNMENT_SITEMAP_PATH}: returned HTTP {status}, expected 200")
        return

    content_type = ", ".join(header_values(headers, "content-type")).lower()
    if "xml" not in content_type:
        failures.append(f"{GOVERNMENT_SITEMAP_PATH}: content-type is not XML: {content_type!r}")

    try:
        root = ET.fromstring(body)
    except ET.ParseError as exc:
        failures.append(f"{GOVERNMENT_SITEMAP_PATH}: XML parse failed ({exc})")
        return

    if not root.tag.endswith("urlset"):
        failures.append(f"{GOVERNMENT_SITEMAP_PATH}: root is {root.tag!r}, expected urlset")
        return

    locs = [
        node.text.strip()
        for node in root.findall("sm:url/sm:loc", SITEMAP_NS)
        if node.text and node.text.strip()
    ]
    count = locs.count(COURT_CANONICAL)
    if count != 1:
        failures.append(
            f"{GOVERNMENT_SITEMAP_PATH}: expected exactly one {COURT_CANONICAL!r}, found {count}"
        )
    print(f"Government sitemap: {COURT_CANONICAL} count={count}")


def main() -> int:
    site_url = (os.environ.get("SITE_URL") or DEFAULT_SITE_URL).rstrip("/")
    failures: list[str] = []
    verify_page(site_url, failures)
    verify_government_sitemap(site_url, failures)

    if failures:
        for failure in failures:
            github_error(failure)
        raise SystemExit(
            "Deployed Fifteenth Court authority smoke failed:\n- " + "\n- ".join(failures)
        )

    print(
        "Deployed Fifteenth Court authority smoke passed: direct 200, canonical/indexable HTML, "
        f"and single government-sitemap entry on {site_url}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
