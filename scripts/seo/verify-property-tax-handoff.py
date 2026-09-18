#!/usr/bin/env python3
import os
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

KTR_ORIGIN = "https://keeptxred.com"
TD_ORIGIN = "https://texasdefined.com"
DEFAULT_SITE_URL = "https://keeptxred-site.freddy-coppola.workers.dev"
DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

REDIRECTS = {
    "/property-taxes": f"{TD_ORIGIN}/learn/property-taxes",
    "/texas/property-taxes-2026": f"{TD_ORIGIN}/learn/property-taxes",
    "/news/texas-property-tax-guide": f"{TD_ORIGIN}/learn/property-taxes",
    "/news/homestead-exemption-explained": f"{TD_ORIGIN}/do/homestead-exemption",
    "/news/appraisal-protest-playbook": f"{TD_ORIGIN}/do/property-tax-protest",
    "/news/county-appraisal-districts-explained": f"{TD_ORIGIN}/learn/appraisal-districts",
    "/texas-property-tax-protest-guide": f"{TD_ORIGIN}/do/property-tax-protest",
    "/tax-calculator": f"{TD_ORIGIN}/decide/property-taxes",
    "/texas-property-tax-calculator": f"{TD_ORIGIN}/decide/property-taxes",
    "/tools/property-tax-calculator": f"{TD_ORIGIN}/decide/property-taxes",
    "/texas-property-tax-increase-calculator": f"{TD_ORIGIN}/decide/property-taxes",
}

TD_DESTINATIONS = sorted(set(REDIRECTS.values()))
POLICY_PATH = "/issues/texas-property-tax-relief"
POLICY_CANONICAL = f"{KTR_ORIGIN}{POLICY_PATH}"


class PageSignals(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.canonicals: list[str] = []
        self.robots: list[str] = []
        self.h1_depth = 0
        self.h1_parts: list[str] = []
        self.text_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): (value or "") for key, value in attrs}
        if tag.lower() == "link":
            rel = {part.lower() for part in values.get("rel", "").split()}
            if "canonical" in rel and values.get("href"):
                self.canonicals.append(values["href"])
        if tag.lower() == "meta" and values.get("name", "").lower() == "robots":
            self.robots.append(values.get("content", ""))
        if tag.lower() == "h1":
            self.h1_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "h1" and self.h1_depth:
            self.h1_depth -= 1

    def handle_data(self, data: str) -> None:
        text = data.strip()
        if not text:
            return
        self.text_parts.append(text)
        if self.h1_depth:
            self.h1_parts.append(text)

    @property
    def h1(self) -> str:
        return " ".join(self.h1_parts).strip()

    @property
    def text(self) -> str:
        return " ".join(self.text_parts)


def github_error(message: str) -> None:
    if os.environ.get("GITHUB_ACTIONS") != "true":
        return
    escaped = message.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
    print(f"::error title=Property-tax production handoff failed::{escaped}", flush=True)


def curl(url: str, *, follow: bool = False) -> tuple[int, str, str]:
    with tempfile.NamedTemporaryFile() as header_file, tempfile.NamedTemporaryFile() as body_file:
        command = [
            "curl",
            "--retry", "6",
            "--retry-delay", "2",
            "--retry-all-errors",
            "--connect-timeout", "10",
            "--max-time", "60",
            "--silent",
            "--show-error",
            "-H", "cache-control: no-cache",
            "-H", "pragma: no-cache",
            "-D", header_file.name,
            "-o", body_file.name,
            "-w", "%{http_code}",
        ]
        if follow:
            command.extend(["--location", "--max-redirs", "5"])
        else:
            command.extend(["--max-redirs", "0"])
        if "workers.dev" in url:
            command.extend(["-H", DEPLOYMENT_SMOKE_HEADER])
        command.append(url)
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


def page_signals(body: str) -> PageSignals:
    parser = PageSignals()
    parser.feed(body)
    return parser


def parse_locs(body: str, expected_root: str) -> list[str]:
    root = ET.fromstring(body)
    if not root.tag.endswith(expected_root):
        raise ValueError(f"root is {root.tag!r}, expected {expected_root}")
    path = "sm:sitemap/sm:loc" if expected_root == "sitemapindex" else "sm:url/sm:loc"
    return [
        node.text.strip()
        for node in root.findall(path, NS)
        if node.text and node.text.strip()
    ]


def verify_direct_redirects(site_url: str, failures: list[str]) -> None:
    for path, expected in REDIRECTS.items():
        try:
            status, headers, _ = curl(f"{site_url}{path}")
        except RuntimeError as exc:
            failures.append(f"{path}: fetch failed ({exc})")
            continue
        locations = header_values(headers, "location")
        location = locations[-1] if locations else ""
        if status != 301:
            failures.append(f"{path}: expected HTTP 301, got {status}")
        if location != expected:
            failures.append(f"{path}: expected direct Location {expected!r}, got {location!r}")
        if location:
            parts = urlsplit(location)
            if parts.netloc != "texasdefined.com":
                failures.append(f"{path}: redirect leaves ownership boundary at unexpected host {parts.netloc!r}")


def verify_ktr_sitemap_absence(site_url: str, failures: list[str]) -> None:
    try:
        status, _, body = curl(f"{site_url}/sitemap.xml")
        if status != 200:
            failures.append(f"/sitemap.xml: expected HTTP 200, got {status}")
            return
        children = parse_locs(body, "sitemapindex")
    except (RuntimeError, ET.ParseError, ValueError) as exc:
        failures.append(f"/sitemap.xml: unable to verify migrated URL absence ({exc})")
        return

    retired = {f"{KTR_ORIGIN}{path}" for path in REDIRECTS}
    owners: dict[str, list[str]] = {url: [] for url in retired}

    for child_url in children:
        if not child_url.startswith(f"{KTR_ORIGIN}/"):
            continue
        child_path = child_url[len(KTR_ORIGIN):]
        try:
            status, _, child_body = curl(f"{site_url}{child_path}")
            if status != 200:
                failures.append(f"{child_path}: expected HTTP 200, got {status}")
                continue
            locs = set(parse_locs(child_body, "urlset"))
        except (RuntimeError, ET.ParseError, ValueError) as exc:
            failures.append(f"{child_path}: unable to inspect sitemap ({exc})")
            continue
        for retired_url in retired:
            if retired_url in locs:
                owners[retired_url].append(child_url)

    for retired_url, found in sorted(owners.items()):
        if found:
            failures.append(f"{retired_url}: migrated homeowner URL still appears in KTR sitemap(s): {found}")


def verify_texasdefined_destinations(failures: list[str]) -> None:
    for url in TD_DESTINATIONS:
        try:
            status, _, body = curl(url, follow=True)
        except RuntimeError as exc:
            failures.append(f"{url}: destination fetch failed ({exc})")
            continue
        if status != 200:
            failures.append(f"{url}: expected HTTP 200, got {status}")
            continue
        signals = page_signals(body)
        if signals.canonicals != [url]:
            failures.append(f"{url}: expected one self-canonical, got {signals.canonicals}")
        if any("noindex" in value.lower() for value in signals.robots):
            failures.append(f"{url}: destination unexpectedly declares noindex: {signals.robots}")
        if not signals.h1:
            failures.append(f"{url}: destination has no H1")

    try:
        status, _, sitemap_body = curl(f"{TD_ORIGIN}/sitemap.xml")
        if status != 200:
            failures.append(f"{TD_ORIGIN}/sitemap.xml: expected HTTP 200, got {status}")
            return
        locs = set(parse_locs(sitemap_body, "urlset"))
    except (RuntimeError, ET.ParseError, ValueError) as exc:
        failures.append(f"{TD_ORIGIN}/sitemap.xml: unable to verify destination ownership ({exc})")
        return

    for url in TD_DESTINATIONS:
        if url not in locs:
            failures.append(f"{url}: TexasDefined destination is missing from sitemap.xml")


def verify_policy_page(site_url: str, failures: list[str]) -> None:
    try:
        status, _, body = curl(f"{site_url}{POLICY_PATH}")
    except RuntimeError as exc:
        failures.append(f"{POLICY_PATH}: policy page fetch failed ({exc})")
        return
    if status != 200:
        failures.append(f"{POLICY_PATH}: expected HTTP 200, got {status}")
        return
    signals = page_signals(body)
    if signals.canonicals != [POLICY_CANONICAL]:
        failures.append(f"{POLICY_PATH}: expected self-canonical {POLICY_CANONICAL!r}, got {signals.canonicals}")
    if "Texas Property Tax Policy & Relief" not in signals.h1:
        failures.append(f"{POLICY_PATH}: policy H1 is not ownership-specific: {signals.h1!r}")
    for phrase in (
        "KTR covers policy; TexasDefined covers homeowner tasks",
        "Practical homeowner tasks belong on TexasDefined",
    ):
        if phrase not in signals.text:
            failures.append(f"{POLICY_PATH}: missing policy/homeowner ownership language {phrase!r}")
    if any("noindex" in value.lower() for value in signals.robots):
        failures.append(f"{POLICY_PATH}: legitimate KTR policy page unexpectedly declares noindex")


def main() -> None:
    site_url = (os.environ.get("SITE_URL") or DEFAULT_SITE_URL).rstrip("/")
    failures: list[str] = []
    verify_direct_redirects(site_url, failures)
    verify_ktr_sitemap_absence(site_url, failures)
    verify_texasdefined_destinations(failures)
    verify_policy_page(site_url, failures)

    if failures:
        for failure in failures:
            github_error(failure)
        raise RuntimeError("Property-tax production handoff failed:\n- " + "\n- ".join(failures))

    print(
        "Property-tax production handoff passed: "
        f"{len(REDIRECTS)} direct KTR 301 redirects, "
        f"{len(REDIRECTS)} retired KTR sitemap URLs absent, "
        f"{len(TD_DESTINATIONS)} live/indexable/canonical TexasDefined destinations, "
        "and KTR policy ownership preserved."
    )


if __name__ == "__main__":
    main()
