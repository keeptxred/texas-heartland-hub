#!/usr/bin/env python3
"""Bounded, fail-closed SSR acceptance check for the deployed school tax guide.

Called inside the existing protected production deployment workflow, before
the exact-main-SHA production-current status is published.
"""
import json
import os
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

AGENT = os.environ.get("SCHOOL_TAX_USER_AGENT", "KeepTXRed-Production-Acceptance/1.0")
BASE = os.environ.get("SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev").rstrip("/")
URL = BASE + "/news/isd-tax-burdens"
MARKERS = {
    "article heading": "Texas School Property Taxes in 2026",
    "calculator heading": "Estimate your school property-tax bill",
    "calculator field": "Applicable school exemptions",
    "calculator result": "Estimated annual school tax",
    "2025 vs 2026 comparison": "What changed in the statewide framework?",
    "district sample heading": "Verified district examples from TEA",
    "statewide finder": "Find your school district",
    "statewide district count": "1,013",
    "TEA official source": "ty2026-final-mcrs.pdf",
    "Comptroller official source": "comptroller.texas.gov/taxes/property-tax/rates/index.php",
    "MCR limitation": "not adopted total school-tax rates",
}

# Verify the complete shipped source dataset separately from the bounded SSR UI.
# The finder intentionally renders at most 30 rows at a time, but searches
# the entire imported dataset after hydration. Do not mistake a displayed
# count in HTML for proof that the underlying 1,013 records are present.
dataset_path = Path(__file__).resolve().parents[2] / "src/data/tea-2026-final-mcr.json"
with dataset_path.open(encoding="utf-8") as source_file:
    dataset = json.load(source_file)
records = dataset.get("districts")
if dataset.get("taxYear") != 2026 or dataset.get("districtCount") != 1013 or not isinstance(records, list) or len(records) != 1013:
    raise SystemExit("FAIL: school-tax dataset year/count does not match 1,013 verified 2026 records")
ids = [row.get("id") for row in records]
if any(not isinstance(district_id, str) or len(district_id) != 6 or not district_id.isdigit() for district_id in ids) or len(set(ids)) != len(ids):
    raise SystemExit("FAIL: school-tax district dataset contains invalid or duplicate TEA IDs")
if any(not row.get("name") or not row.get("mcr") for row in records):
    raise SystemExit("FAIL: school-tax district dataset has incomplete records")
print("PASS school-tax source dataset: 1,013 unique complete 2026 district records (distinct from bounded SSR display)")

for attempt in range(1, 5):
    try:
        req = Request(URL, headers={
            "User-Agent": AGENT,
            "Accept": "text/html",
            "x-keeptxred-deployment-smoke": "canonical",
        })
        with urlopen(req, timeout=25) as response:
            status = response.status
            content_type = response.headers.get("Content-Type", "")
            html = response.read(2_000_001).decode("utf-8", errors="replace")
        if status != 200:
            raise RuntimeError(f"HTTP {status}")
        if "text/html" not in content_type:
            raise RuntimeError(f"unexpected Content-Type: {content_type}")
        if len(html) > 2_000_000:
            raise RuntimeError("HTML exceeds bounded response size")
        missing = [name for name, marker in MARKERS.items() if marker not in html]
        if missing:
            raise RuntimeError(f"SSR HTML missing: {', '.join(missing)}")
        print(f"PASS school-tax production SSR acceptance: HTTP {status}, {len(MARKERS)} markers, {URL}")
        sys.exit(0)
    except (HTTPError, URLError, TimeoutError, RuntimeError) as error:
        print(f"Attempt {attempt}/4 failed: {error}", file=sys.stderr)
        if attempt < 4:
            time.sleep(3 * attempt)
raise SystemExit("FAIL: deployed school-tax article did not pass production acceptance")
