#!/usr/bin/env python3
"""Refresh the complete official 2026 TEA district Tier One MCR table.

Fail closed: never overwrite the last verified snapshot with incomplete,
duplicate, out-of-range or unexpected official source data.
"""
import json
import pathlib
import re
import subprocess
import tempfile
from datetime import date
from urllib.request import Request, urlopen

SOURCE = "https://tea.texas.gov/about-tea/state-funding/ty2026-final-mcrs.pdf"
DEST = pathlib.Path("src/data/tea-2026-final-mcr.json")
ROW = re.compile(r"^\s*(\d{6})\s+(.+?)\s+(0\.\d{4})\s*$", re.MULTILINE)

def main():
    with urlopen(Request(SOURCE, headers={"User-Agent": "KeepTXRed-TEA-Data-Refresh/1.0"}), timeout=50) as r:
        pdf = r.read(2_000_001)
    if not pdf.startswith(b"%PDF") or len(pdf) > 2_000_000:
        raise RuntimeError("Unexpected TEA PDF or oversized response")
    with tempfile.TemporaryDirectory() as temp:
        path = pathlib.Path(temp) / "mcr.pdf"
        path.write_bytes(pdf)
        try:
            text = subprocess.check_output(["pdftotext", "-layout", str(path), "-"], text=True)
        except FileNotFoundError:
            raise RuntimeError("pdftotext missing; install poppler-utils on the GitHub runner")
    if "Final Maximum Compressed Tax Rate" not in text or "2026" not in text:
        raise RuntimeError("TEA source title/year validation failed")
    records = {}
    for district_id, name, raw_rate in ROW.findall(text):
        rate = float(raw_rate)
        if district_id in records:
            raise RuntimeError(f"Duplicate TEA district ID: {district_id}")
        if not 0.5628 <= rate <= 0.6254:
            raise RuntimeError(f"Out-of-range MCR: {district_id}={rate}")
        records[district_id] = {"id": district_id, "name": name.strip(), "mcr": raw_rate}
    # The published final 2026 snapshot contains exactly 1,013 districts. A broad
    # range can silently accept a truncated PDF while four spot checks still pass.
    if len(records) != 1013:
        raise RuntimeError(f"Expected all 1,013 final 2026 TEA districts; found {len(records)} rows")
    checks = {"101902": "0.5973", "101903": "0.6254", "227901": "0.6254", "043905": "0.6110"}
    for district_id, expected in checks.items():
        if records.get(district_id, {}).get("mcr") != expected:
            raise RuntimeError(f"Official reference mismatch for district {district_id}")
    payload = {
        "taxYear": 2026,
        "source": SOURCE,
        "sourcePublished": "2026-08-27",
        "rateType": "Tier One maximum compressed rate, not adopted M&O or I&S tax rate",
        "districtCount": len(records),
        "districts": sorted(records.values(), key=lambda x: (x["name"], x["id"])),
    }
    DEST.parent.mkdir(parents=True, exist_ok=True)
    content = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    if not DEST.exists() or DEST.read_text() != content:
        DEST.write_text(content)
        print(f"Updated {DEST} with {len(records)} verified districts")
    else:
        print(f"Already current: {len(records)} districts")

if __name__ == "__main__":
    main()
