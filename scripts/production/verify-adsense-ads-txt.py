#!/usr/bin/env python3
from __future__ import annotations

import os
import time
import urllib.error
import urllib.request

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred.com").rstrip("/")
EXPECTED = "google.com, pub-1891256141359926, DIRECT, f08c47fec0942fa0"


def main() -> None:
    url = f"{SITE_URL}/ads.txt"
    last_reason = "not attempted"

    for attempt in range(1, 7):
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": "KeepTXRed-AdSense-Smoke/1.0",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                status = response.status
                content_type = (response.headers.get("content-type") or "").lower()
                challenged = (response.headers.get("cf-mitigated") or "").lower() == "challenge"
                body = response.read().decode("utf-8", errors="replace").strip()

            failures: list[str] = []
            if status != 200:
                failures.append(f"HTTP {status}")
            if challenged:
                failures.append("Cloudflare challenge")
            if not content_type.startswith("text/plain"):
                failures.append(f"unexpected content type {content_type!r}")
            if body != EXPECTED:
                failures.append(f"unexpected body {body!r}")

            if not failures:
                print("PASS ads.txt: HTTP 200; text/plain; exact AdSense publisher declaration present.")
                return

            last_reason = "; ".join(failures)
            print(f"RETRY attempt {attempt}: {last_reason}")
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            last_reason = f"request error: {error}"
            print(f"RETRY attempt {attempt}: {last_reason}")

        if attempt < 6:
            time.sleep(5)

    raise SystemExit(f"Live AdSense ads.txt verification failed: {last_reason}")


if __name__ == "__main__":
    main()
