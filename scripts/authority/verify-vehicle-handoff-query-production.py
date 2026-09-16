#!/usr/bin/env python3
"""Verify retired vehicle ownership handoffs preserve complete query strings in production."""

from __future__ import annotations

import os
import time
import urllib.error
import urllib.request

PUBLIC_ORIGIN = "https://keeptxred.com"
WORKER_ORIGIN = os.environ.get(
    "SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev"
).rstrip("/")
ATTEMPTS = 4
TIMEOUT_SECONDS = 30
RETRY_SECONDS = 3
PROBE_QUERY = (
    "utm_source=ktr-smoke&utm_medium=referral&foo=bar&vehicle_smoke="
    f"{os.environ.get('GITHUB_RUN_ID', 'local')}-{os.environ.get('GITHUB_RUN_ATTEMPT', '0')}"
)
HANDOFFS = {
    "/vehicles/registration": "https://texasdefined.com/texas-vehicle-registration",
    "/vehicles/renewal": "https://texasdefined.com/texas-vehicle-registration-renewal",
    "/vehicles/registration-fees-taxes": "https://texasdefined.com/texas-vehicle-registration-fees-taxes",
    "/vehicles/new-residents": "https://texasdefined.com/find-my-dmv",
    "/dmv": "https://texasdefined.com/texas-dmv",
}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # type: ignore[override]
        return None


def request_without_redirect(url: str, headers: dict[str, str]) -> tuple[int, dict[str, str]]:
    opener = urllib.request.build_opener(NoRedirect())
    request = urllib.request.Request(url, headers=headers)
    try:
        with opener.open(request, timeout=TIMEOUT_SECONDS) as response:
            return response.status, {key.lower(): value for key, value in response.headers.items()}
    except urllib.error.HTTPError as exc:
        if 300 <= exc.code < 400:
            return exc.code, {key.lower(): value for key, value in exc.headers.items()}
        raise


def final_status(url: str) -> int:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "KeepTXRed-vehicle-handoff-production-smoke/1.0"},
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        return response.status


def verify(origin: str, path: str, destination: str, *, deployment_smoke: bool) -> None:
    probe_url = f"{origin}{path}?{PROBE_QUERY}"
    expected = f"{destination}?{PROBE_QUERY}"
    headers = {
        "User-Agent": "KeepTXRed-vehicle-handoff-production-smoke/1.0",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
    }
    if deployment_smoke:
        headers["x-keeptxred-deployment-smoke"] = "canonical"

    last_error: Exception | None = None
    for attempt in range(1, ATTEMPTS + 1):
        try:
            status, response_headers = request_without_redirect(probe_url, headers)
            location = response_headers.get("location")
            if status != 301 or location != expected:
                raise RuntimeError(
                    f"expected HTTP 301 Location {expected!r}; got HTTP {status} Location {location!r}"
                )

            destination_status = final_status(expected)
            if destination_status != 200:
                raise RuntimeError(
                    f"direct handoff was correct but destination returned HTTP {destination_status}"
                )

            print(f"PASS {origin}{path} -> {location} -> HTTP 200")
            return
        except (OSError, urllib.error.URLError, RuntimeError) as exc:
            last_error = exc
            if attempt < ATTEMPTS:
                time.sleep(RETRY_SECONDS)

    raise SystemExit(f"FAIL {origin}{path}: {last_error}")


def main() -> int:
    origins = [(PUBLIC_ORIGIN, False)]
    if WORKER_ORIGIN != PUBLIC_ORIGIN:
        origins.append((WORKER_ORIGIN, True))

    for origin, deployment_smoke in origins:
        for path, destination in HANDOFFS.items():
            verify(origin, path, destination, deployment_smoke=deployment_smoke)

    print("Vehicle ownership handoff query-preservation production smoke passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
