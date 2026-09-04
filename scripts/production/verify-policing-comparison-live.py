#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import os
import pathlib
import re
import time
import urllib.error
import urllib.parse
import urllib.request

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred.com").rstrip("/")
ARTICLE_PATH = "/news/texas-policing-agencies-compared"
HERO_PATH = "/images/news/texas-policing-agencies-compared-seven-role-0c284fef115e.webp"
WRONG_HASHED_HERO_PATH = "/images/news/texas-policing-agencies-compared-full-c089e1bb.jpg"
OLD_HERO_PATH = "/images/news/texas-policing-agencies-compared.jpg"
EXPECTED_BYTES = 59616
EXPECTED_SHA256 = "0c284fef115ecc633eeae984a79fbbacac6e80f2f0a3526c3a1a5c8e6396814a"
REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]
REPO_HERO = REPO_ROOT / "public" / HERO_PATH.removeprefix("/")
STAMP = f"{os.environ.get('GITHUB_RUN_ID', 'local')}-{os.environ.get('GITHUB_RUN_ATTEMPT', '1')}"


def fetch(url: str, *, attempts: int = 6) -> tuple[int, dict[str, str], bytes]:
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": "KeepTXRed-Policing-Smoke/1.0",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                return response.status, {key.lower(): value for key, value in response.headers.items()}, response.read()
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            last_error = error
            print(f"RETRY attempt {attempt}/{attempts}: {url}: {error}")
            if attempt < attempts:
                time.sleep(3)
    raise SystemExit(f"Production request failed after {attempts} attempts: {url}: {last_error}")


def main() -> None:
    if not REPO_HERO.is_file() or REPO_HERO.stat().st_size == 0:
        raise SystemExit(f"Expected repository hero is missing: {REPO_HERO}")

    article_url = f"{SITE_URL}{ARTICLE_PATH}?ktr_live_smoke={urllib.parse.quote(STAMP)}"
    status, _headers, article_bytes = fetch(article_url)
    if status != 200:
        raise SystemExit(f"Expected policing comparison HTTP 200, got {status}")

    article = article_bytes.decode("utf-8", errors="replace")
    if "Texas Law Enforcement" not in article:
        raise SystemExit("Live article HTML is missing the expected Texas Law Enforcement headline.")
    if HERO_PATH not in article:
        raise SystemExit(f"Live article HTML does not reference the seven-role policing hero: {HERO_PATH}")
    if WRONG_HASHED_HERO_PATH in article:
        raise SystemExit(f"Live article HTML still references the wrong four-role hashed hero: {WRONG_HASHED_HERO_PATH}")
    if OLD_HERO_PATH in article:
        raise SystemExit(f"Live article HTML still references the retired policing hero path: {OLD_HERO_PATH}")

    og_match = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]*>', article, flags=re.I)
    twitter_match = re.search(r'<meta[^>]+name=["\']twitter:image["\'][^>]*>', article, flags=re.I)
    og_line = og_match.group(0) if og_match else ""
    twitter_line = twitter_match.group(0) if twitter_match else ""
    if HERO_PATH not in og_line:
        raise SystemExit(f"Open Graph image metadata does not use the seven-role hero: {og_line!r}")
    if HERO_PATH not in twitter_line:
        raise SystemExit(f"Twitter image metadata does not use the seven-role hero: {twitter_line!r}")

    hero_url = f"{SITE_URL}{HERO_PATH}?ktr_live_smoke={urllib.parse.quote(STAMP)}"
    hero_status, hero_headers, hero_bytes = fetch(hero_url)
    if hero_status != 200:
        raise SystemExit(f"Expected policing hero HTTP 200, got {hero_status}")
    content_type = hero_headers.get("content-type", "").lower()
    if not content_type.startswith("image/webp"):
        raise SystemExit(f"Policing hero did not return a WebP content type: {content_type!r}")

    repo_bytes = REPO_HERO.read_bytes()
    if hero_bytes != repo_bytes:
        raise SystemExit(
            "Live policing hero bytes do not match the repository-approved seven-role asset. "
            f"repo_sha256={hashlib.sha256(repo_bytes).hexdigest()} live_sha256={hashlib.sha256(hero_bytes).hexdigest()}"
        )

    digest = hashlib.sha256(hero_bytes).hexdigest()
    if len(hero_bytes) != EXPECTED_BYTES:
        raise SystemExit(f"Unexpected policing hero byte count: {len(hero_bytes)} != {EXPECTED_BYTES}")
    if digest != EXPECTED_SHA256:
        raise SystemExit(f"Unexpected policing hero SHA-256: {digest} != {EXPECTED_SHA256}")

    print(
        "PASS policing comparison: HTTP 200; seven-role hero and social metadata referenced; "
        f"exact bytes match ({len(hero_bytes)} bytes, sha256 {digest})."
    )


if __name__ == "__main__":
    main()
