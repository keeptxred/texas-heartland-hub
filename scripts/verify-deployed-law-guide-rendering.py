#!/usr/bin/env python3
"""Verify the public child-support law guide's source links and reading order."""
import os
import re
import subprocess

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev").rstrip("/")
PATH = "/guides/texas-child-support-guidelines-law"
CALCULATOR_HEADING = "Texas Attorney General Child Support Calculator"
CALCULATOR_URL = "https://www.texasattorneygeneral.gov/child-support/get-started"
FAQ_HEADING = "Frequently Asked Questions"
LAW_REFERENCE_HEADING = "Texas law reference"

def main() -> None:
    response = subprocess.run(
        ["curl", "--location", "--retry", "3", "--retry-delay", "2", "--retry-all-errors",
         "--connect-timeout", "10", "--max-time", "60", "--fail-with-body",
         "--silent", "--show-error", "-H", "cache-control: no-cache",
         "-H", "pragma: no-cache", f"{SITE_URL}{PATH}"],
        capture_output=True, text=True,
    )
    if response.returncode:
        raise SystemExit(f"{PATH}: fetch failed: {response.stderr.strip()}")
    html = response.stdout
    faq_pos = html.find(FAQ_HEADING)
    law_pos = html.find(LAW_REFERENCE_HEADING)
    heading_pos = html.find(CALCULATOR_HEADING)
    before_faq = html[:faq_pos] if faq_pos >= 0 else html
    calculator_link = re.compile(
        rf'<a[^>]+href=["\']{re.escape(CALCULATOR_URL)}["\'][^>]*>.*?'
        rf'{re.escape(CALCULATOR_HEADING)}.*?</a>',
        re.IGNORECASE | re.DOTALL,
    )
    errors = []
    if heading_pos < 0:
        errors.append("missing child-support calculator heading")
    if not calculator_link.search(before_faq):
        errors.append("official calculator link not present in the guide body before FAQs")
    if "provides an official calculator" in html:
        errors.append("outdated official-calculator claim remains")
    if faq_pos < 0:
        errors.append("missing FAQ section")
    if law_pos < 0:
        errors.append("missing law reference section")
    if faq_pos >= 0 and law_pos >= 0 and law_pos < faq_pos:
        errors.append("legal references appear before the article's FAQ section")
    if errors:
        raise SystemExit(f"{PATH} on {SITE_URL}: " + "; ".join(errors))
    print(f"{PATH}: supporting law-guide contract passed on {SITE_URL}")

if __name__ == "__main__":
    main()
