#!/usr/bin/env python3
"""Confirm the deployed lobbying guide uses its reviewed 2026 source data."""
import json
from pathlib import Path

source = json.loads(Path("src/data/lobbying-2026-source-status.json").read_text())
assert source["expenditures"]["year2026"]["total"] == 1882474.25
print("Source snapshot checked")
