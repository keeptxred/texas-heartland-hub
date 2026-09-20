#!/usr/bin/env python3
"""Verify the original ten KeepTXRed political profiles on the deployed Worker."""

from __future__ import annotations

import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev").rstrip("/")
PRODUCTION_ORIGIN = "https://keeptxred.com"
TIMEOUT_SECONDS = 30
ATTEMPTS = 4
RETRY_SECONDS = 3

SLUGS = (
    "ronald-reagan-texas-conservative-legacy",
    "george-hw-bush-texas-political-life",
    "george-w-bush-texas-governor-president",
    "ted-cruz-texas-senator-profile",
    "john-cornyn-texas-senator-profile",
    "greg-abbott-texas-governor-profile",
    "dan-patrick-texas-lieutenant-governor-profile",
    "ken-paxton-texas-attorney-general-profile",
    "phil-gramm-texas-senator-fiscal-conservative",
    "rick-perry-texas-governor-energy-legacy",
)


class VerificationFailure(RuntimeError):
    pass


def fetch(path: str) -> tuple[bytes, dict[str, str]]:
    url = f"{SITE_URL}{path}"
    last_error: Exception | None = None
    for attempt in range(1, ATTEMPTS + 1):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "KeepTXRed-political-profile-production-smoke/1.0"},
            )
            with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
                if response.status != 200:
                    raise VerificationFailure(f"{path} returned HTTP {response.status}")
                headers = {key.lower(): value for key, value in response.headers.items()}
                return response.read(), headers
        except (urllib.error.URLError, TimeoutError, VerificationFailure) as exc:
            last_error = exc
            if attempt < ATTEMPTS:
                time.sleep(RETRY_SECONDS)
    raise VerificationFailure(f"Unable to fetch {path}: {last_error}")


def extract_meta(raw: str, *, property_name: str | None = None, name: str | None = None) -> list[str]:
    values: list[str] = []
    for tag in re.findall(r"<meta[^>]+>", raw, re.I):
        if property_name and not re.search(
            rf"property=[\"']{re.escape(property_name)}[\"']", tag, re.I
        ):
            continue
        if name and not re.search(rf"name=[\"']{re.escape(name)}[\"']", tag, re.I):
            continue
        match = re.search(r"content=[\"']([^\"']+)", tag, re.I)
        if match:
            values.append(html.unescape(match.group(1)))
    return values


def extract_canonical(raw: str) -> str | None:
    patterns = (
        r"<link[^>]+rel=[\"']canonical[\"'][^>]+href=[\"']([^\"']+)",
        r"<link[^>]+href=[\"']([^\"']+)[\"'][^>]+rel=[\"']canonical[\"']",
    )
    for pattern in patterns:
        match = re.search(pattern, raw, re.I)
        if match:
            return html.unescape(match.group(1))
    return None


def verify_image(image_url: str, label: str) -> None:
    parsed = urllib.parse.urlparse(image_url)
    if parsed.hostname in {"keeptxred.com", "www.keeptxred.com"}:
        path = parsed.path or "/"
        if parsed.query:
            path += f"?{parsed.query}"
        _body, headers = fetch(path)
    elif image_url.startswith("/"):
        _body, headers = fetch(image_url)
    else:
        raise VerificationFailure(
            f"{label} uses an unexpected external hero host: {image_url!r}"
        )
    content_type = headers.get("content-type", "").lower()
    if not content_type.startswith("image/"):
        raise VerificationFailure(
            f"{label} hero content-type is {content_type!r}, expected image/*"
        )


def verify_profile(slug: str) -> None:
    path = f"/texas-politics/figures/{slug}"
    expected_canonical = f"{PRODUCTION_ORIGIN}{path}"
    raw_bytes, headers = fetch(path)
    content_type = headers.get("content-type", "").lower()
    if not content_type.startswith("text/html"):
        raise VerificationFailure(
            f"{path} content-type is {content_type!r}, expected text/html"
        )

    raw = raw_bytes.decode("utf-8", errors="ignore")
    decoded = html.unescape(raw)
    lowered = decoded.casefold()
    if "page not found" in lowered or "not available" in lowered:
        raise VerificationFailure(f"{path} rendered a fallback/unavailable page")

    canonical = extract_canonical(raw)
    if canonical != expected_canonical:
        raise VerificationFailure(
            f"{path} canonical is {canonical!r}, expected {expected_canonical!r}"
        )

    robots = [value.casefold() for value in extract_meta(raw, name="robots")]
    if not robots:
        raise VerificationFailure(f"{path} is missing robots metadata")
    if any("noindex" in value or "nofollow" in value for value in robots):
        raise VerificationFailure(f"{path} has blocked robots directives: {robots!r}")
    if not any("index" in value and "follow" in value for value in robots):
        raise VerificationFailure(f"{path} is missing explicit index/follow directives: {robots!r}")

    if not re.search(r'"@type"\s*:\s*"ProfilePage"', decoded):
        raise VerificationFailure(f"{path} is missing ProfilePage structured data")
    if not re.search(r'"@type"\s*:\s*"Person"', decoded):
        raise VerificationFailure(f"{path} is missing Person structured data")
    if "Institutional sources and records" not in decoded:
        raise VerificationFailure(f"{path} is missing the visible institutional source section")

    hero_values = extract_meta(raw, property_name="og:image")
    if not hero_values:
        raise VerificationFailure(f"{path} is missing og:image metadata")
    verify_image(hero_values[0], path)

    print(
        f"Political profile healthy: {path} canonical=index/follow "
        "schema=ProfilePage+Person sources=visible hero=image"
    )


def verify_sitemap() -> None:
    raw, headers = fetch("/sitemap-political-figures.xml")
    content_type = headers.get("content-type", "").lower()
    if "xml" not in content_type:
        raise VerificationFailure(
            f"Political profile sitemap content-type is {content_type!r}, expected XML"
        )
    text = raw.decode("utf-8", errors="ignore")
    missing = [
        f"{PRODUCTION_ORIGIN}/texas-politics/figures/{slug}"
        for slug in SLUGS
        if f"{PRODUCTION_ORIGIN}/texas-politics/figures/{slug}" not in text
    ]
    if missing:
        raise VerificationFailure(f"Political profile sitemap is missing URLs: {missing!r}")
    print(f"Political profile sitemap healthy: {len(SLUGS)} original URLs present")


def main() -> int:
    try:
        verify_sitemap()
        for slug in SLUGS:
            verify_profile(slug)
    except VerificationFailure as exc:
        print(f"POLITICAL PROFILE SMOKE FAILED: {exc}", file=sys.stderr)
        return 1
    print(f"All {len(SLUGS)} original political profiles passed against {SITE_URL}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
