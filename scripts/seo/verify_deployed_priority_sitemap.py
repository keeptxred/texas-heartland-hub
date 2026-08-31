#!/usr/bin/env python3
import json
import os
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

SITE_ORIGIN = "https://keeptxred.com"
DEFAULT_WORKER_ORIGIN = "https://keeptxred-site.freddy-coppola.workers.dev"
PRIORITY_SOURCE = Path("src/data/search-console-priority-sitemap-urls.json")
SITEMAP_NAMESPACE = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class IndexabilityParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonicals: list[str] = []
        self.robots: list[str] = []

    def handle_starttag(self, tag, attrs):
        values = {str(key).lower(): value for key, value in attrs}
        if tag.lower() == "link":
            rel = {part.lower() for part in (values.get("rel") or "").split()}
            href = values.get("href")
            if "canonical" in rel and href:
                self.canonicals.append(href.strip())
        elif tag.lower() == "meta":
            name = (values.get("name") or "").strip().lower()
            if name in {"robots", "googlebot"}:
                self.robots.append((values.get("content") or "").strip().lower())


def _github_error(message: str) -> None:
    if os.environ.get("GITHUB_ACTIONS") != "true":
        return
    escaped = (
        message.replace("%", "%25")
        .replace("\r", "%0D")
        .replace("\n", "%0A")
    )
    print(f"::error title=Deployed priority sitemap/indexability smoke failed::{escaped}", flush=True)


def _curl(url: str) -> tuple[int, str, str]:
    with tempfile.NamedTemporaryFile() as header_file, tempfile.NamedTemporaryFile() as body_file:
        result = subprocess.run(
            [
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
                url,
            ],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or f"curl exited {result.returncode}")
        status = int((result.stdout or "0").strip())
        headers = Path(header_file.name).read_text(encoding="utf-8", errors="replace")
        body = Path(body_file.name).read_text(encoding="utf-8", errors="replace")
        return status, headers, body


def _header_values(headers: str, name: str) -> list[str]:
    needle = name.lower() + ":"
    values: list[str] = []
    for raw in headers.splitlines():
        if raw.lower().startswith(needle):
            values.append(raw.split(":", 1)[1].strip())
    return values


def _priority_urls() -> list[str]:
    data = json.loads(PRIORITY_SOURCE.read_text(encoding="utf-8"))
    if not isinstance(data, list) or any(not isinstance(item, str) for item in data):
        raise RuntimeError("priority sitemap source must be a JSON array of URL strings")
    return data


def verify_priority_sitemap(site_url: str | None = None) -> None:
    worker_origin = (site_url or os.environ.get("SITE_URL") or DEFAULT_WORKER_ORIGIN).rstrip("/")
    expected = _priority_urls()
    failures: list[str] = []

    if len(expected) != 30 or len(set(expected)) != len(expected):
        failures.append(f"priority source must contain exactly 30 unique URLs; got {len(expected)} entries/{len(set(expected))} unique")

    for url in expected:
        parsed = urlsplit(url)
        if f"{parsed.scheme}://{parsed.netloc}" != SITE_ORIGIN or parsed.query or parsed.fragment:
            failures.append(f"priority source contains non-canonical URL {url!r}")

    sitemap_url = f"{worker_origin}/sitemap-priority.xml"
    try:
        status, headers, body = _curl(sitemap_url)
        if status != 200:
            failures.append(f"priority sitemap returned HTTP {status}, expected 200")
        content_types = ", ".join(_header_values(headers, "content-type")).lower()
        if "xml" not in content_types:
            failures.append(f"priority sitemap content-type is not XML: {content_types!r}")
        try:
            root = ET.fromstring(body)
            if not root.tag.endswith("urlset"):
                failures.append(f"priority sitemap root is {root.tag!r}, expected urlset")
                observed: list[str] = []
            else:
                observed = [
                    node.text.strip()
                    for node in root.findall("sm:url/sm:loc", SITEMAP_NAMESPACE)
                    if node.text and node.text.strip()
                ]
            if observed != expected:
                failures.append(f"priority sitemap URLs differ from source inventory: expected={expected!r} observed={observed!r}")
        except ET.ParseError as exc:
            failures.append(f"priority sitemap XML parse failed: {exc}")
    except RuntimeError as exc:
        failures.append(f"priority sitemap fetch failed: {exc}")

    for canonical_url in expected:
        parsed = urlsplit(canonical_url)
        path = parsed.path or "/"
        target = f"{worker_origin}{path}"
        try:
            status, headers, body = _curl(target)
        except RuntimeError as exc:
            failures.append(f"{path}: fetch failed ({exc})")
            continue

        if status != 200:
            failures.append(f"{path}: returned HTTP {status}, expected direct 200 with no redirect")
            continue

        x_robots = ", ".join(_header_values(headers, "x-robots-tag")).lower()
        if "noindex" in x_robots:
            failures.append(f"{path}: X-Robots-Tag contains noindex ({x_robots!r})")

        parser = IndexabilityParser()
        parser.feed(body)
        if parser.canonicals != [canonical_url]:
            failures.append(f"{path}: expected one canonical {canonical_url!r}, got {parser.canonicals!r}")
        if any("noindex" in value for value in parser.robots):
            failures.append(f"{path}: robots meta contains noindex ({parser.robots!r})")

        print(f"priority {path}: status={status} canonical={parser.canonicals!r} robots={parser.robots!r}")

    if failures:
        for failure in failures:
            _github_error(failure)
        raise RuntimeError("Deployed priority sitemap/indexability smoke failed:\n- " + "\n- ".join(failures))

    print(f"Deployed priority sitemap smoke passed for {len(expected)} canonical URLs on {worker_origin}.")


if __name__ == "__main__":
    verify_priority_sitemap()
