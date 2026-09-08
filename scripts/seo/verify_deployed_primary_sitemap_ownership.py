#!/usr/bin/env python3
import os
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

SITE_ORIGIN = "https://keeptxred.com"
DEFAULT_SITE_URL = "https://keeptxred-site.freddy-coppola.workers.dev"
DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

DERIVATIVE_SITEMAPS = {
    f"{SITE_ORIGIN}/sitemap-news.xml",
    f"{SITE_ORIGIN}/sitemap-images.xml",
    f"{SITE_ORIGIN}/sitemap-priority.xml",
}

SUPPRESSED_BULK_SITEMAPS = {
    f"{SITE_ORIGIN}/sitemap-districts.xml",
    f"{SITE_ORIGIN}/sitemap-representatives.xml",
    f"{SITE_ORIGIN}/sitemap-bills.xml",
}

DMV_EVERGREEN_PATHS = {
    "/dmv",
    "/dmv/cdl",
    "/dmv/cdl-classes",
    "/dmv/cdl-endorsements",
    "/dmv/change-address",
    "/dmv/dps-appointments",
    "/dmv/driver-license",
    "/dmv/driver-license-documents",
    "/dmv/driver-license-renewal",
    "/dmv/forms-downloads",
    "/dmv/identification-card",
    "/dmv/license-status",
    "/dmv/real-id",
    "/dmv/replace-lost-license",
    "/dmv/texas-dmv-vs-dps",
    "/vehicles/auto-insurance-requirements",
    "/vehicles/bonded-titles",
    "/vehicles/buying-a-car",
    "/vehicles/buying-selling",
    "/vehicles/commercial-fleet-irp",
    "/vehicles/disabled-parking",
    "/vehicles/duplicate-titles",
    "/vehicles/farm-antique-specialty",
    "/vehicles/financial-responsibility",
    "/vehicles/inspections",
    "/vehicles/inspections-emissions",
    "/vehicles/liens-duplicate-corrected-titles",
    "/vehicles/new-residents",
    "/vehicles/personalized-plates",
    "/vehicles/plates",
    "/vehicles/private-party-sales",
    "/vehicles/registration",
    "/vehicles/registration-fees-taxes",
    "/vehicles/renewal",
    "/vehicles/salvage-rebuilt-titles",
    "/vehicles/selling-a-car",
    "/vehicles/temporary-tags",
    "/vehicles/title-transfer",
}

EXPECTED_PRIMARY_OWNER = {
    f"{SITE_ORIGIN}/find-representative": f"{SITE_ORIGIN}/sitemap-elections.xml",
    f"{SITE_ORIGIN}/bills": f"{SITE_ORIGIN}/sitemap-legislature.xml",
    f"{SITE_ORIGIN}/districts": f"{SITE_ORIGIN}/sitemap-pages.xml",
    f"{SITE_ORIGIN}/representatives": f"{SITE_ORIGIN}/sitemap-pages.xml",
    f"{SITE_ORIGIN}/contact-legislators": f"{SITE_ORIGIN}/sitemap-pages.xml",
    f"{SITE_ORIGIN}/laws": f"{SITE_ORIGIN}/sitemap-pages.xml",
    f"{SITE_ORIGIN}/texas-legislature": f"{SITE_ORIGIN}/sitemap-pages.xml",
    f"{SITE_ORIGIN}/elections/2026": f"{SITE_ORIGIN}/sitemap-elections.xml",
    **{
        f"{SITE_ORIGIN}{path}": f"{SITE_ORIGIN}/sitemap-dmv.xml"
        for path in DMV_EVERGREEN_PATHS
    },
}


def github_error(message: str) -> None:
    if os.environ.get("GITHUB_ACTIONS") != "true":
        return
    escaped = (
        message.replace("%", "%25")
        .replace("\r", "%0D")
        .replace("\n", "%0A")
    )
    print(f"::error title=Deployed primary sitemap ownership failed::{escaped}", flush=True)


def curl(url: str) -> tuple[int, str, str]:
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


def parse_locs(body: str, expected_root: str, path: str, label: str, failures: list[str]) -> list[str]:
    try:
        root = ET.fromstring(body)
    except ET.ParseError as exc:
        failures.append(f"{label}: XML parse failed ({exc})")
        return []
    if not root.tag.endswith(expected_root):
        failures.append(f"{label}: root is {root.tag!r}, expected {expected_root}")
        return []
    return [
        node.text.strip()
        for node in root.findall(path, NS)
        if node.text and node.text.strip()
    ]


def fetch_xml(site_url: str, path: str, expected_root: str, loc_path: str, failures: list[str]) -> list[str]:
    try:
        status, headers, body = curl(f"{site_url}{path}")
    except RuntimeError as exc:
        failures.append(f"{path}: fetch failed ({exc})")
        return []

    if status != 200:
        failures.append(f"{path}: returned HTTP {status}, expected 200")
        return []

    content_type = ", ".join(header_values(headers, "content-type")).lower()
    if "xml" not in content_type:
        failures.append(f"{path}: content-type is not XML: {content_type!r}")

    locs = parse_locs(body, expected_root, loc_path, path, failures)
    if len(locs) != len(set(locs)):
        failures.append(f"{path}: contains duplicate <loc> values")
    return locs


def verify_primary_sitemap_ownership(site_url: str | None = None) -> None:
    site_url = (site_url or os.environ.get("SITE_URL") or DEFAULT_SITE_URL).rstrip("/")
    failures: list[str] = []
    advertised = fetch_xml(
        site_url,
        "/sitemap.xml",
        "sitemapindex",
        "sm:sitemap/sm:loc",
        failures,
    )

    if not advertised:
        failures.append("/sitemap.xml: no advertised child sitemaps found")

    for suppressed in sorted(SUPPRESSED_BULK_SITEMAPS):
        if suppressed in advertised:
            failures.append(f"/sitemap.xml: crawl-budget sitemap is incorrectly advertised: {suppressed}")

    required_children = set(EXPECTED_PRIMARY_OWNER.values())
    for required in sorted(required_children):
        if required not in advertised:
            failures.append(f"/sitemap.xml: missing required primary child sitemap {required}")

    primary_children = [child for child in advertised if child not in DERIVATIVE_SITEMAPS]
    ownership: dict[str, list[str]] = {url: [] for url in EXPECTED_PRIMARY_OWNER}

    for child_url in primary_children:
        if not child_url.startswith(f"{SITE_ORIGIN}/"):
            failures.append(f"/sitemap.xml: non-canonical child sitemap URL {child_url}")
            continue
        child_path = child_url[len(SITE_ORIGIN):]
        locs = fetch_xml(site_url, child_path, "urlset", "sm:url/sm:loc", failures)
        for canonical_url in ownership:
            if canonical_url in locs:
                ownership[canonical_url].append(child_url)

    for canonical_url, expected_owner in EXPECTED_PRIMARY_OWNER.items():
        owners = ownership[canonical_url]
        if owners != [expected_owner]:
            failures.append(
                f"{canonical_url}: expected exactly one primary owner {expected_owner}, got {owners}"
            )

    if failures:
        for failure in failures:
            github_error(failure)
        raise RuntimeError(
            "Deployed primary sitemap ownership smoke failed:\n- " + "\n- ".join(failures)
        )

    print(
        "Deployed primary sitemap ownership passed: "
        f"{len(EXPECTED_PRIMARY_OWNER)} core canonical URLs, "
        f"{len(primary_children)} advertised primary sitemaps, "
        f"{len(SUPPRESSED_BULK_SITEMAPS)} suppressed bulk sitemaps on {site_url}."
    )


if __name__ == "__main__":
    verify_primary_sitemap_ownership()
