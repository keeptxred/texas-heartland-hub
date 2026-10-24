#!/usr/bin/env python3
import os
import re
import subprocess
from html.parser import HTMLParser

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev").rstrip("/")
PARENT_H1 = "Texas Laws Explained:"
CHECKS = [
    ("/laws", PARENT_H1, "https://keeptxred.com/laws", False, False),
    ("/laws/constitutional-amendments", "Texas Constitutional Amendments Tracker", "https://keeptxred.com/laws/constitutional-amendments", True, True),
    ("/laws/effective-dates", "Texas Laws Taking Effect in 2026", "https://keeptxred.com/laws/effective-dates", True, True),
    ("/laws/topics", "Texas Law Library", "https://keeptxred.com/laws/topics", True, True),
    ("/laws/topic/property-tax-law", "Texas Property Tax Policy & Law", "https://keeptxred.com/laws/topic/property-tax-law", True, True),
    ("/laws/topic/driving-traffic-insurance-law", "Texas Driving, Driver's Licenses, Traffic and Auto Insurance Laws", "https://keeptxred.com/laws/topic/driving-traffic-insurance-law", True, True),
    ("/laws/topic/landlord-tenant-rentals-law", "Texas Landlord-Tenant Law: Repairs, Deposits, Eviction and Tenant Rights", "https://keeptxred.com/laws/topic/landlord-tenant-rentals-law", True, True),
    ("/laws/topic/employment-wages-workplace-rights-law", "Texas Employment Law: Wages, Final Pay, Discrimination and Workplace Rights", "https://keeptxred.com/laws/topic/employment-wages-workplace-rights-law", True, True),
    ("/laws/topic/consumer-protection-deceptive-trade-law", "Texas Consumer Protection Law: Deceptive Practices, Complaints and Debt Collection", "https://keeptxred.com/laws/topic/consumer-protection-deceptive-trade-law", True, True),
    ("/laws/topic/family-custody-child-support-law", "Texas Family Law: Divorce, Child Custody, Visitation and Child Support", "https://keeptxred.com/laws/topic/family-custody-child-support-law", True, True),
    ("/laws/topic/wills-probate-inheritance-law", "Texas Wills, Probate and Inheritance Law Explained", "https://keeptxred.com/laws/topic/wills-probate-inheritance-law", True, True),
    ("/laws/topic/criminal-offenses-penalties-law", "Texas Criminal Law Explained: Offenses, Penalties and Legal Defenses", "https://keeptxred.com/laws/topic/criminal-offenses-penalties-law", True, True),
    ("/laws/topic/business-formation-llc-law", "Texas Business Formation Law: LLCs, Corporations and Registered Agents", "https://keeptxred.com/laws/topic/business-formation-llc-law", True, True),
]


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.h1_depth = 0
        self.h1_parts: list[str] = []
        self.page_text_parts: list[str] = []
        self.canonicals: list[str] = []
        self.hrefs: set[str] = set()

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag == "a":
            href = dict(attrs).get("href")
            if href:
                self.hrefs.add(href)
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
        self.page_text_parts.append(data)
        if self.h1_depth:
            self.h1_parts.append(data)


def fetch(path: str) -> str:
    result = subprocess.run(
        [
            "curl",
            "--location",
            "--retry",
            "12",
            "--retry-delay",
            "2",
            "--retry-all-errors",
            "--connect-timeout",
            "10",
            "--max-time",
            "60",
            "--fail-with-body",
            "--silent",
            "--show-error",
            "-H",
            "cache-control: no-cache",
            "-H",
            "pragma: no-cache",
            f"{SITE_URL}{path}",
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f"curl exited {result.returncode}")
    return result.stdout


def main() -> None:
    failures: list[str] = []
    for path, expected_h1, expected_canonical, exact_h1, forbid_parent in CHECKS:
        try:
            body = fetch(path)
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

        # Content freshness prevents a previously deployed but outdated hub from
        # passing on its unchanged H1 and canonical tags alone.
        page_text = normalize(" ".join(parser.page_text_parts))
        if path == "/laws":
            if "Find Texas laws by topic" not in page_text:
                failures.append("/laws: new authority topic navigation is absent from deployed HTML")
            if "made permanent by a 2019 constitutional amendment" in page_text:
                failures.append("/laws: outdated constitutional income-tax claim still deployed")
        if path == "/laws/topics" and "Search the Texas law-topic library" not in page_text:
            failures.append("/laws/topics: searchable authority directory is absent from deployed HTML")
        if path in {"/laws", "/laws/topics"}:
            required = {
                "/laws/topic/driving-traffic-insurance-law",
                "/laws/topic/landlord-tenant-rentals-law",
                "/laws/topic/employment-wages-workplace-rights-law",
                "/laws/topic/consumer-protection-deceptive-trade-law",
                "/laws/topic/family-custody-child-support-law",
                "/laws/topic/wills-probate-inheritance-law",
                "/laws/topic/criminal-offenses-penalties-law",
                "/laws/topic/business-formation-llc-law",
            }
            missing = sorted(required - parser.hrefs)
            if missing:
                failures.append(f"{path}: authority hub is missing law guide links: {missing!r}")

        print(f"{path}: h1={h1!r} canonical={canonicals!r}")

    if failures:
        raise SystemExit("Deployed laws route smoke failed:\n- " + "\n- ".join(failures))

    print(f"Deployed laws route smoke passed for {len(CHECKS)} routes on {SITE_URL}.")


if __name__ == "__main__":
    main()
