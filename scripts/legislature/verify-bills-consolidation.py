#!/usr/bin/env python3
"""Production smoke for the one-indexable-page Texas bills contract.

Use on workers.dev immediately after deploy with the canonical deployment
smoke header so the request reaches the just-deployed Worker, not old production.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request

BASE = os.getenv("SITE_URL", "https://keeptxred.com").rstrip("/")
HEADERS = {
    "User-Agent": "KeepTXRedBillConsolidationSmoke/1.0",
    "x-keeptxred-deployment-smoke": "canonical",
}


def get(path):
    req = urllib.request.Request(BASE + path, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=35) as response:
            return response.status, response.headers, response.read().decode("utf-8", errors="replace"), response.geturl()
    except urllib.error.HTTPError as error:
        return error.code, error.headers, error.read().decode("utf-8", errors="replace"), error.geturl()


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def smoke():
    status, headers, html, final_url = get("/bills")
    require(status == 200, f"/bills must return HTTP 200, got {status}")
    require(final_url.startswith(BASE + "/bills"), f"/bills unexpectedly redirected: {final_url}")
    require("Texas Bill Lookup" in html, "/bills HTML has no bill search heading")
    require('https://keeptxred.com/bills' in html, "/bills HTML lacks canonical main hub")
    require("noindex" not in str(headers.get("X-Robots-Tag", "")).lower(), "/bills wrongly noindexed")
    print("PASS /bills: HTML 200, search and canonical found")

    status, headers, html, _ = get("/bills?page=2")
    require(status == 200, f"/bills?page=2 expected 200, got {status}")
    require("noindex" in headers.get("X-Robots-Tag", "").lower() or
            'name="robots" content="noindex' in html, "Pagination state must be noindex")
    print("PASS /bills?page=2: noindex search variation")

    for path in (
        "/bills/texas/89",
        "/bills/texas/89/hb",
        "/bills/texas/89/hb/4",
        "/bills/texas/89/2/hb/4",
        "/bills/subject/property-tax",
        "/bills/texas/89/hb/4/reference.json",
    ):
        status, headers, html, _ = get(path)
        require(status == 410, f"{path} expected 410 Gone, got {status}")
        require("noindex" in headers.get("X-Robots-Tag", "").lower(), f"{path} missing noindex")
        require('href="/bills"' in html, f"{path} missing useful return path")
        print(f"PASS {path}: 410 Gone, noindex, explanation")

    status, headers, body, _ = get("/api/public/bill-detail?bill=89-2-hb-4")
    require(status == 200, f"Session-specific bill lookup must return 200, got {status}")
    require("noindex" in headers.get("X-Robots-Tag", "").lower(), "Detail API missing noindex")
    payload = json.loads(body)
    bill = payload.get("bill") or {}
    require(
        bill.get("legislature_number") == 89
        and str(bill.get("session_code")).upper() == "2"
        and str(bill.get("bill_type")).lower() == "hb"
        and bill.get("bill_number") == 4,
        "Incorrect bill identity returned for 89(2) HB 4",
    )
    for name in ("sponsors", "actions", "committees", "documents"):
        require(isinstance((payload.get("relations") or {}).get(name), list), f"Missing {name} records list")
    for name in ("effectiveDates", "relatedBills"):
        require(isinstance(payload.get(name), list), f"Missing in-page bill details: {name}")
    for related in payload["relatedBills"]:
        require(
            isinstance(related, dict) and str(related.get("href", "")).startswith("/bills#bill="),
            "Related bill must link to a fragment within the single bills document",
        )
    require("SUPABASE_SERVICE_ROLE_KEY" not in body, "API exposed privileged credential")
    print("PASS bill API: correct 89(2) HB 4, official relations and noindex")

    status, _, feed, _ = get("/sitemap-bills.xml")
    require(status == 200, f"Bill sitemap expected HTTP 200, got {status}")
    locs = re.findall(r"<loc>\s*([^<]+)\s*</loc>", feed)
    require(locs == ["https://keeptxred.com/bills"], f"Unexpected bill sitemap locations: {locs[:10]}")
    print("PASS sitemap-bills.xml: sole /bills entry")
    print("Live bill consolidation verification passed.")


if __name__ == "__main__":
    try:
        smoke()
    except Exception as error:
        print(f"Bill consolidation production smoke FAILED: {error}", file=sys.stderr)
        raise SystemExit(1)
