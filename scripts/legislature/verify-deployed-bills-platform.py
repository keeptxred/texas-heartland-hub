#!/usr/bin/env python3
"""Compatibility entrypoint for the current one-indexable-page Texas bills contract.

The former deploy smoke required retired bill-detail pages to return 200 and
render deep historical pagination. The authoritative production contract now
has one indexable /bills search hub, noindex search states, retired 410 detail
URLs, and the read-only bill-detail API. Reuse its existing end-to-end checker
instead of maintaining contradictory deployment assertions here.
"""
from pathlib import Path
import subprocess
import sys


def main() -> int:
    verifier = Path(__file__).with_name("verify-bills-consolidation.py")
    return subprocess.call([sys.executable, str(verifier)])


if __name__ == "__main__":
    raise SystemExit(main())
