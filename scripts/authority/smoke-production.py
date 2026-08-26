#!/usr/bin/env python3
"""Read-only production smoke checks for KeepTXRed authority resources and guarded redirects."""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from typing import Any

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred.com").rstrip("/")
TIMEOUT_SECONDS = 30
ATTEMPTS = 4
RETRY_SECONDS = 3
CITY_PROBE_QUERY = "utm_source=ktr-smoke&probe=city-migration"
CITY_REDIRECTS = {
    "/austin": "https://texasdefined.com/article/moving-to-austin-guide",
    "/dallas-fort-worth": "https://texasdefined.com/article/moving-to-dallas-fort-worth-guide",
    "/san-antonio": "https://texasdefined.com/article/moving-to-san-antonio-guide",
    "/el-paso": "https://texasdefined.com/article/moving-to-el-paso-guide",
}


class SmokeFailure(RuntimeError):
    pass


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # type: ignore[override]
        return None


def fetch(path: str) -> tuple[bytes, dict[str, str]]:
    url = f"{SITE_URL}{path}"
    last_error: Exception | None = None
    for attempt in range(1, ATTEMPTS + 1):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "KeepTXRed-authority-production-smoke/1.0"},
            )
            with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
                if response.status != 200:
                    raise SmokeFailure(f"{path} returned HTTP {response.status}")
                headers = {key.lower(): value for key, value in response.headers.items()}
                return response.read(), headers
        except (urllib.error.URLError, TimeoutError, SmokeFailure) as exc:
            last_error = exc
            if attempt < ATTEMPTS:
                time.sleep(RETRY_SECONDS)
    raise SmokeFailure(f"Unable to fetch {path}: {last_error}")


def fetch_without_redirect(path: str) -> tuple[int, dict[str, str]]:
    url = f"{SITE_URL}{path}"
    opener = urllib.request.build_opener(NoRedirect())
    last_error: Exception | None = None
    for attempt in range(1, ATTEMPTS + 1):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "KeepTXRed-city-migration-smoke/1.0"},
            )
            try:
                with opener.open(request, timeout=TIMEOUT_SECONDS) as response:
                    return response.status, {
                        key.lower(): value for key, value in response.headers.items()
                    }
            except urllib.error.HTTPError as exc:
                if 300 <= exc.code < 400:
                    return exc.code, {
                        key.lower(): value for key, value in exc.headers.items()
                    }
                raise
        except (urllib.error.URLError, TimeoutError) as exc:
            last_error = exc
            if attempt < ATTEMPTS:
                time.sleep(RETRY_SECONDS)
    raise SmokeFailure(f"Unable to fetch {path} without redirects: {last_error}")


def fetch_json(path: str) -> tuple[dict[str, Any], dict[str, str]]:
    raw, headers = fetch(path)
    content_type = headers.get("content-type", "").lower()
    if not content_type.startswith("application/json"):
        raise SmokeFailure(f"{path} content-type is {content_type!r}, expected application/json")
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise SmokeFailure(f"{path} returned invalid JSON: {exc}") from exc
    if not isinstance(payload, dict):
        raise SmokeFailure(f"{path} returned a non-object JSON root")
    return payload, headers


def require_equal(payload: dict[str, Any], expected: dict[str, Any], label: str) -> None:
    for key, value in expected.items():
        if payload.get(key) != value:
            raise SmokeFailure(
                f"{label} mismatch: {key}={payload.get(key)!r}, expected {value!r}"
            )


def ensure_no_keys(value: Any, forbidden: set[str], label: str) -> None:
    if isinstance(value, dict):
        leaked = forbidden.intersection(value)
        if leaked:
            raise SmokeFailure(f"{label} leaked forbidden keys: {sorted(leaked)}")
        for child in value.values():
            ensure_no_keys(child, forbidden, label)
    elif isinstance(value, list):
        for child in value:
            ensure_no_keys(child, forbidden, label)


def verify_elections() -> None:
    path = "/elections/reference.json"
    payload, headers = fetch_json(path)
    if "noindex" not in headers.get("x-robots-tag", "").lower():
        raise SmokeFailure(f"{path} is missing noindex X-Robots-Tag")

    require_equal(
        payload,
        {
            "schemaVersion": 1,
            "site": "Keep TX Red",
            "electionCycle": "2026",
            "canonicalHub": "https://keeptxred.com/elections/2026",
            "generatedFrom": "published_verified_records",
        },
        "Election reference",
    )

    races = payload.get("races")
    candidates = payload.get("candidates")
    if not isinstance(races, list) or not races:
        raise SmokeFailure("Election reference has no published verified races")
    if not isinstance(candidates, list) or not candidates:
        raise SmokeFailure("Election reference has no published verified candidates")

    for race in races:
        if not isinstance(race, dict) or not str(race.get("canonicalUrl", "")).startswith(
            "https://keeptxred.com/elections/races/"
        ):
            raise SmokeFailure(f"Invalid race canonical URL: {race!r}")
    for candidate in candidates:
        if not isinstance(candidate, dict) or not str(
            candidate.get("canonicalUrl", "")
        ).startswith("https://keeptxred.com/elections/candidates/"):
            raise SmokeFailure(f"Invalid candidate canonical URL: {candidate!r}")

    ensure_no_keys(
        payload,
        {
            "email",
            "phone",
            "dateOfBirth",
            "donationUrl",
            "biography",
            "campaignWebsite",
            "internalNotes",
            "forecast",
            "contactInfo",
        },
        "Election reference",
    )
    print(
        f"Election reference healthy: races={len(races)} "
        f"candidates={len(candidates)} asOf={payload.get('asOf')}"
    )


def verify_bill() -> None:
    path = "/bills/texas/89/sb/37/reference.json"
    payload, headers = fetch_json(path)
    if "noindex" not in headers.get("x-robots-tag", "").lower():
        raise SmokeFailure(f"{path} is missing noindex X-Robots-Tag")

    canonical = "https://keeptxred.com/bills/texas/89/sb/37"
    link = headers.get("link", "")
    if canonical not in link or 'rel="canonical"' not in link:
        raise SmokeFailure(f"{path} canonical Link header is invalid: {link!r}")

    require_equal(
        payload,
        {
            "schemaVersion": 1,
            "site": "Keep TX Red",
            "jurisdiction": "Texas",
            "billIdentifier": "SB 37",
            "legislature": 89,
            "canonicalUrl": canonical,
        },
        "Bill reference",
    )

    official_bill_url = payload.get("officialBillUrl")
    if not isinstance(official_bill_url, str) or "capitol.texas.gov" not in official_bill_url:
        raise SmokeFailure(
            f"Bill reference missing Texas Legislature source URL: {official_bill_url!r}"
        )

    documents = payload.get("documents")
    actions = payload.get("actions")
    if not isinstance(documents, list) or not isinstance(actions, list):
        raise SmokeFailure("Bill reference documents/actions are not arrays")
    if not documents and not actions:
        raise SmokeFailure("Bill reference contains no primary-source documents or official actions")

    for document in documents:
        if not isinstance(document, dict):
            raise SmokeFailure(f"Bill reference document is not an object: {document!r}")
        official_url = document.get("officialUrl")
        if not isinstance(official_url, str) or "capitol.texas.gov" not in official_url:
            raise SmokeFailure(
                f"Bill document is not an official Texas Legislature URL: {official_url!r}"
            )

    ensure_no_keys(
        payload,
        {
            "id",
            "metadata",
            "internal_note",
            "internalNotes",
            "editorialRelationships",
            "ingestionMetadata",
            "created_at",
            "updated_at",
        },
        "Bill reference",
    )
    print(
        f"Bill reference healthy: documents={len(documents)} "
        f"actions={len(actions)} lastSyncedAt={payload.get('lastSyncedAt')}"
    )


def verify_manifest() -> None:
    path = "/citation-magnets.json"
    payload, _headers = fetch_json(path)
    serialized = json.dumps(payload, sort_keys=True)
    required = (
        "/elections/reference.json",
        "/bills/texas/{legislature}/{bill-type}/{bill-number}/reference.json",
    )
    missing = [needle for needle in required if needle not in serialized]
    if missing:
        raise SmokeFailure(f"Citation manifest is missing authority resources: {missing}")
    print("Citation manifest advertises both authority JSON resource families")


def verify_city_migration() -> None:
    for path, target in CITY_REDIRECTS.items():
        probe_path = f"{path}?{CITY_PROBE_QUERY}"
        status, headers = fetch_without_redirect(probe_path)
        expected_location = f"{target}?{CITY_PROBE_QUERY}"
        location = headers.get("location")
        if status != 301:
            raise SmokeFailure(f"{path} returned HTTP {status}, expected permanent 301")
        if location != expected_location:
            raise SmokeFailure(
                f"{path} redirected to {location!r}, expected {expected_location!r}"
            )
        print(f"City migration healthy: {path} -> {location}")

    houston_path = f"/houston?{CITY_PROBE_QUERY}"
    status, headers = fetch_without_redirect(houston_path)
    if status != 200:
        raise SmokeFailure(f"/houston returned HTTP {status}, expected 200 on KeepTXRed")
    if headers.get("location"):
        raise SmokeFailure(f"/houston unexpectedly redirects to {headers.get('location')!r}")
    print("Houston remains on KeepTXRed with HTTP 200")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--city-migration-only",
        action="store_true",
        help="Verify the retired city 301s and Houston retention without authority JSON checks.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        if args.city_migration_only:
            verify_city_migration()
            print(f"City migration smoke passed against {SITE_URL}")
            return 0
        verify_elections()
        verify_bill()
        verify_manifest()
    except SmokeFailure as exc:
        print(f"AUTHORITY SMOKE FAILED: {exc}", file=sys.stderr)
        return 1
    print("Authority JSON production smoke passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
