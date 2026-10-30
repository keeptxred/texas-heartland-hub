#!/usr/bin/env python3
"""Fail the release when the deployed 2026 lobbying guide is stale."""
import html
import json
import os
import re
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

base = os.environ.get("SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev").rstrip("/")
path = "/texas-government/reference/texas-lobbying-2026"
canonical = "https://keeptxred.com" + path
source = json.loads(Path("src/data/lobbying-2026-source-status.json").read_text())
total = source["expenditures"]["year2026"]["total"]
assert round(sum(x["amount"] for x in source["expenditures"]["year2026"]["categories"]), 2) == round(total, 2)
amount = "$" + format(total, ",.2f")

def get(path):
    req = urllib.request.Request(base + path, headers={"User-Agent": "KeepTXRed-production-acceptance/1.0", "Cache-Control": "no-cache"})
    with urllib.request.urlopen(req, timeout=35) as response:
        assert response.status == 200, (path, response.status)
        return response.read().decode("utf-8", "replace")

def visible(markup):
    markup = re.sub(r"<script[^>]*>.*?</script>", " ", markup, flags=re.I | re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", markup))).strip()

for suffix in ("", "?acceptance=" + os.environ.get("GITHUB_SHA", "check")[:10]):
    markup = get(path + suffix)
    page = visible(markup)
    for expected in ("Texas Lobbyists in 2026", "Last verified: October 29, 2026",
                     "Explore the official 2026 lobbying records", "Coffey, Debra",
                     "Cantella, Richard C.", "Hughs, Ruth R.", amount):
        assert expected in page, (path + suffix, expected)
    assert "Last verified: September 28, 2026" not in page
    assert canonical in markup and 'rel="canonical"' in markup
    for file in ("2026LobbyGroupByClient.pdf", "LobbyExpendituresByCategory.pdf"):
        assert file in markup, (path + suffix, file)
    print("PASS lobbying guide", base + path + suffix)

root = ET.fromstring(get("/sitemap-government.xml"))
dates = []
for entry in root.iter():
    if entry.tag.rsplit("}", 1)[-1] == "url":
        fields = {x.tag.rsplit("}", 1)[-1]: (x.text or "") for x in entry}
        if fields.get("loc") == canonical:
            dates.append(fields.get("lastmod"))
assert dates == ["2026-10-29"], dates
print("PASS government sitemap lobbying lastmod 2026-10-29")
