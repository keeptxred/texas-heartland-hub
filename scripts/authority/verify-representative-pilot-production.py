#!/usr/bin/env python3
"""Verify indexability and official-source research for representative pilot profiles.

The check is bound to the actual deployed Worker, not the preview source code.
Source retrieval is recorded separately; an upstream agency bot block is not
misreported as a broken URL or a false zero activity count.
"""
from __future__ import annotations

import html
import http.client
import os
import re
import socket
import sys
import time
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlparse

SITE_URL = os.environ.get("SITE_URL", "https://keeptxred-site.freddy-coppola.workers.dev").rstrip("/")
CANONICAL = "https://keeptxred.com"
READY = (
    "bryan-hughes", "judith-zaffirini", "terri-leo-wilson", "mihaela-plesa",
    "brent-money", "will-metcalf", "tan-parker", "royce-west",
    "joanne-shofner", "lois-kolkhorst", "richard-hayes", "cesar-blanco",
    "bob-hall", "robert-nichols", "charles-schwertner", "carol-alvarado",
    "paul-bettencourt", "angela-paxton", "phil-king", "mayes-middleton",
    "borris-miles", "sarah-eckhardt", "molly-cook", "nathan-johnson",
    "joan-huffman", "roland-gutierrez", "chuy-hinojosa", "pete-flores",
    "donna-campbell", "jose-menendez", "adam-hinojosa", "charles-perry",
    "brent-hagenbuch", "kevin-sparks",
    "angelia-orr", "paul-dyson", "janis-holt",
    "greg-bonnen", "cody-vasut", "matt-morgan", "ron-reynolds", "gary-gates",
    "ryan-guillen", "todd-hunter", "katrina-pierson",
    "denise-villalobos", "oscar-longoria", "sergio-munoz", "janie-lopez",
    "erin-gamez", "mando-martinez", "terry-canales", "bobby-guerra",
    "richard-raymond", "alan-schoolcraft", "erin-zwiener",
    "sheryl-cole", "vikki-goodwin", "donna-howard", "gina-hinojosa", "james-talarico",
    "lulu-flores", "caroline-harris-davila", "brad-buckley", "hillary-hickland", "shelby-slawson",
    "cecil-bell", "keith-bell", "cole-hefner", "daniel-alders", "jay-dean",
    "cody-harris", "trent-ashby", "brian-harrison", "trey-wharton",
    "steve-toth", "stan-gerdes", "ellen-troxclair", "terry-wilson",
    "keresa-richardson", "ben-bumgarner", "andy-hopper",
    "shelley-luther", "mitch-little",
    "matt-shaheen", "jeff-leach", "david-spiller", "james-frank",
    "stan-lambert", "drew-darby", "carrie-isaac", "eddie-morales",
    "mary-gonzalez", "suleman-lalani", "vince-perez", "joe-moody",
    "claudia-ordaz", "don-mclaughlin", "brooks-landgraf", "tom-craddick",
    "dustin-burrows",
)
NOT_READY = ("dan-crenshaw", "john-cornyn", "greg-abbott", "jeff-barry")
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class ParsedHtml(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.meta: list[dict[str, str]] = []
        self.links: list[dict[str, str]] = []
        self.h1 = 0
        self.anchors: list[str] = []
        self.words: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        row = {name.lower(): (value or "") for name, value in attrs}
        if tag == "meta":
            self.meta.append(row)
        elif tag == "link":
            self.links.append(row)
        elif tag == "h1":
            self.h1 += 1
        elif tag == "a":
            self.anchors.append(row.get("href", ""))

    def handle_data(self, data: str) -> None:
        if data.strip():
            self.words.append(data.strip())


# Retrying an interrupted TCP/HTTP transfer does not waive any page-level check.
# HTTP status codes, wrong canonicals, missing sources and failed robots gates are
# deliberately not retried or interpreted as successes.
MAX_INTERRUPTED_READ_ATTEMPTS = 3
INTERRUPTED_TRANSFER_ERRORS = (
    http.client.IncompleteRead,
    http.client.RemoteDisconnected,
    ConnectionResetError,
    TimeoutError,
    socket.timeout,
)


def get(path: str) -> tuple[int, str]:
    headers = {
        "User-Agent": "KeepTXRed-representative-pilot-smoke/1.0",
        "Cache-Control": "no-cache",
    }
    if "workers.dev" in SITE_URL:
        headers["x-keeptxred-deployment-smoke"] = "canonical"
    req = urllib.request.Request(SITE_URL + path, headers=headers)
    for attempt in range(1, MAX_INTERRUPTED_READ_ATTEMPTS + 1):
        try:
            with urllib.request.urlopen(req, timeout=40) as response:
                payload = response.read()
                declared_size = response.headers.get("Content-Length")
                if declared_size is not None and len(payload) != int(declared_size):
                    raise http.client.IncompleteRead(
                        payload, int(declared_size) - len(payload)
                    )
                return response.status, payload.decode("utf-8", errors="replace")
        except urllib.error.HTTPError as error:
            # A bad status is a page/deployment failure; never hide it by retrying.
            return error.code, error.read().decode("utf-8", errors="replace")
        except INTERRUPTED_TRANSFER_ERRORS as error:
            if attempt == MAX_INTERRUPTED_READ_ATTEMPTS:
                raise AssertionError(
                    f"{SITE_URL}{path}: interrupted HTTP response after "
                    f"{attempt} complete-fetch attempts: {error!r}"
                ) from error
            print(
                f"Transport interrupted at {SITE_URL}{path} "
                f"(attempt {attempt}/{MAX_INTERRUPTED_READ_ATTEMPTS}); "
                "retrying the entire document, not bypassing checks",
                file=sys.stderr,
            )
            time.sleep(attempt * 0.5)
    raise AssertionError(f"{SITE_URL}{path}: unexpected transport retry state")


def robots_tags(parsed: ParsedHtml) -> list[str]:
    return [entry.get("content", "").lower()
            for entry in parsed.meta if entry.get("name", "").lower() == "robots"]


def check_profile(slug: str, expected_index: bool) -> None:
    path = "/representatives/" + slug
    status, body = get(path)
    assert status == 200, f"{path}: HTTP {status} (expected 200)"
    parsed = ParsedHtml()
    parsed.feed(body)
    expected = CANONICAL + path
    canonical_links = [row["href"] for row in parsed.links if row.get("rel", "").lower() == "canonical"]
    assert canonical_links == [expected], f"{path}: wrong canonical {canonical_links}"
    values = robots_tags(parsed)
    assert len(values) == 1, f"{path}: expected exactly one robots meta, got {values}"
    robots = values[0].replace(" ", "")
    if expected_index:
        assert "index,follow" in robots and "noindex" not in robots, f"{path}: {robots}"
    else:
        assert "noindex,follow" in robots, f"{path}: {robots}"
    assert parsed.h1 == 1, f"{path}: expected one visible H1, got {parsed.h1}"
    assert not re.search(r'"@type"\s*:\s*"ProfilePage"', html.unescape(body)), f"{path}: unsupported ProfilePage schema"
    titles = [r.get("title", "") for r in parsed.meta if r.get("name") == "title"]
    assert "<title>" in body.lower() or titles, f"{path}: no title"
    if expected_index:
        copy = " ".join(parsed.words)
        assert "Coverage and freshness" in copy, f"{path}: missing coverage boundaries"
        if slug == "dustin-burrows":
            assert "89th Legislature: documented Speaker actions" in copy, f"{path}: missing Speaker record module"
            assert "not evidence" in copy, f"{path}: missing no-bill-authorship disclaimer"
            speaker_links = {
                link for link in parsed.anchors
                if ((urlparse(link).hostname == "lrl.texas.gov" and
                     urlparse(link).path.startswith("/scanned/leadershipdocs/")) or
                    (urlparse(link).hostname == "www.house.texas.gov" and
                     urlparse(link).path.startswith("/pdfs/speaker/")))
            }
            assert len(speaker_links) >= 16, f"{path}: only {len(speaker_links)} real Speaker document links"
            assert "89th Legislature: official bill-role research" not in copy, f"{path}: misrepresented Speaker sponsorship"
        else:
            assert "89th Legislature: official bill-role research" in copy, f"{path}: missing source-linked research module"
            official_bill_links = {
                link for link in parsed.anchors
                if urlparse(link).hostname == "capitol.texas.gov" and "BillLookup/History.aspx" in link
            }
            assert len(official_bill_links) >= 16, f"{path}: only {len(official_bill_links)} linked official bills"
    print(f"PASS {path}: status=200 robots={robots} canonical={expected} server_html=True")


def main() -> None:
    for slug in READY:
        check_profile(slug, True)
    for slug in NOT_READY:
        check_profile(slug, False)

    status, body = get("/sitemap-representatives.xml")
    assert status == 200, f"representative sitemap HTTP {status}"
    root = ET.fromstring(body)
    urls = {item.text.strip() for item in root.findall("sm:url/sm:loc", NS) if item.text}
    expected = {CANONICAL + "/representatives/" + slug for slug in READY}
    assert urls == expected, f"sitemap mismatch actual={sorted(urls)} expected={sorted(expected)}"
    status, directory = get("/representatives")
    assert status == 200, f"directory returned {status}"
    parsed = ParsedHtml()
    parsed.feed(directory)
    assert not any("noindex" in meta for meta in robots_tags(parsed)), "directory became noindex"
    print(f"PASS representative sitemap: {len(urls)} certified URLs, non-ready excluded; directory indexable")


if __name__ == "__main__":
    main()
