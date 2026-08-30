#!/usr/bin/env python3
import os
import re
import subprocess
from html.parser import HTMLParser

from verify_deployed_priority_sitemap import verify_priority_sitemap

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev").rstrip("/")
PARENT_H1 = "Texas Laws Explained:"
CHECKS = [
    ("/laws", PARENT_H1, "https://keeptxred.com/laws", False, False),
    ("/laws/constitutional-amendments", "Texas Constitutional Amendments Tracker", "https://keeptxred.com/laws/constitutional-amendments", True, True),
    ("/laws/effective-dates", "Texas Laws Taking Effect in 2026", "https://keeptxred.com/laws/effective-dates", True, True),
    ("/laws/topics", "Texas Law Library", "https://keeptxred.com/laws/topics", True, True),
    ("/laws/topic/property-tax-law", "Texas Property Tax Law Explained", "https://keeptxred.com/laws/topic/property-tax-law", True, True),
]


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.h1_depth = 0
        self.h1_parts: list[str] = []
        self.canonicals: list[str] = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag == "h1":
            self.h1_depth += 1
        if tag == "link":
            values = dict(attrs)
            rel = {part.lower() for part in (values.get("rel") or "").split()}
            href = values.get("href")
            if "canonical" in rel and href:
                self.canonicals.append(href)

    def handle_endtag(self, tag):
        if tag.lower() == "h1" and self.h1_depth:
            self.h1_depth -= 1

    def handle_data(self, data):
        if self.h1_depth:
            self.h1_parts.append(data)


def fetch(url: str) -> str:
    result = subprocess.run(
        [
            "curl", "--location", "--retry", "12", "--retry-delay", "2", "--retry-all-errors",
            "--connect-timeout", "10", "--max-time", "60", "--fail-with-body", "--silent", "--show-error",
            "-H", "cache-control: no-cache", "-H", "pragma: no-cache", url,
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f"curl exited {result.returncode}")
    return result.stdout


def main() -> int:
    failures: list[str] = []
    for path, expected_h1, expected_canonical, exact_h1, forbid_parent in CHECKS:
        try:
            body = fetch(f"{SITE_URL}{path}")
        except RuntimeError as exc:
            failures.append(f"{path}: fetch failed ({exc})")
            continue

        parser = PageParser()
        parser.feed(body)
        h1 = normalize(" ".join(parser.h1_parts))
        canonicals = [normalize(value) for value in parser.canonicals]

        if not h1:
            failures.append(f"{path}: missing H1")
        elif exact_h1 and h1 != expected_h1:
            failures.append(f"{path}: expected H1 {expected_h1!r}, got {h1!r}")
        elif not exact_h1 and expected_h1 not in h1:
            failures.append(f"{path}: expected H1 containing {expected_h1!r}, got {h1!r}")

        if forbid_parent and PARENT_H1 in h1:
            failures.append(f"{path}: child route is still rendering the /laws parent H1 ({h1!r})")

        if canonicals != [expected_canonical]:
            failures.append(f"{path}: expected one canonical {expected_canonical!r}, got {canonicals!r}")

        print(f"{path}: h1={h1!r} canonical={canonicals!r}")

    if failures:
        raise SystemExit("Deployed laws route smoke failed:\n- " + "\n- ".join(failures))

    print(f"Deployed laws route smoke passed for {len(CHECKS)} routes on {SITE_URL}.")
    try:
        verify_priority_sitemap(SITE_URL)
    except RuntimeError as exc:
        raise SystemExit(str(exc)) from exc
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
