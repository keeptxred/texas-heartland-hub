#!/usr/bin/env python3
import os
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlsplit

KTR_ORIGIN = "https://keeptxred.com"
DEFAULT_SITE_URL = "https://keeptxred-site.freddy-coppola.workers.dev"
DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical"
CANONICAL_MAP = Path("src/lib/migrated-tool-canonical.ts")
SMOKE_QUERY = "ktr_smoke=1"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

ENTRY_RE = re.compile(r'^\s*"([^"]+)":\s*"([^"]+)",\s*$', re.MULTILINE)


def github_error(message: str) -> None:
    if os.environ.get("GITHUB_ACTIONS") != "true":
        return
    escaped = message.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
    print(f"::error title=Migrated-tool production handoff failed::{escaped}", flush=True)


def load_redirects() -> dict[str, str]:
    source = CANONICAL_MAP.read_text(encoding="utf-8")
    marker = "export const MIGRATED_TOOL_CANONICALS"
    start = source.find(marker)
    if start < 0:
        marker = "const MIGRATED_TOOL_CANONICALS"
        start = source.find(marker)
    if start < 0:
        raise RuntimeError("Unable to find MIGRATED_TOOL_CANONICALS in canonical source map.")
    block_start = source.find("{", start)
    block_end = source.find("};", block_start)
    if block_start < 0 or block_end < 0:
        raise RuntimeError("Unable to parse MIGRATED_TOOL_CANONICALS block.")

    redirects = dict(ENTRY_RE.findall(source[block_start:block_end]))
    if len(redirects) < 30:
        raise RuntimeError(f"Expected at least 30 migrated tool redirects, found {len(redirects)}.")

    bad_targets = sorted(
        (path, target)
        for path, target in redirects.items()
        if urlsplit(target).netloc != "texasdefined.com"
    )
    if bad_targets:
        raise RuntimeError(f"Migrated tool map contains non-TexasDefined targets: {bad_targets!r}")
    return redirects


def header_values(headers: str, name: str) -> list[str]:
    needle = name.lower() + ":"
    return [
        raw.split(":", 1)[1].strip()
        for raw in headers.splitlines()
        if raw.lower().startswith(needle)
    ]


def curl(url: str, *, follow: bool = False) -> tuple[int, str, str]:
    with tempfile.NamedTemporaryFile() as header_file, tempfile.NamedTemporaryFile() as body_file:
        command = [
            "curl",
            "--retry", "5",
            "--retry-delay", "2",
            "--retry-all-errors",
            "--connect-timeout", "10",
            "--max-time", "45",
            "--silent",
            "--show-error",
            "-H", "cache-control: no-cache",
            "-H", "pragma: no-cache",
            "-D", header_file.name,
            "-o", body_file.name,
            "-w", "%{http_code}",
        ]
        if follow:
            command.extend(["--location", "--max-redirs", "5"])
        else:
            command.extend(["--max-redirs", "0"])
        if "workers.dev" in url:
            command.extend(["-H", DEPLOYMENT_SMOKE_HEADER])
        command.append(url)

        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or f"curl exited {result.returncode}")

        status = int((result.stdout or "0").strip())
        headers = Path(header_file.name).read_text(encoding="utf-8", errors="replace")
        body = Path(body_file.name).read_text(encoding="utf-8", errors="replace")
        return status, headers, body


def parse_locs(body: str, expected_root: str) -> list[str]:
    root = ET.fromstring(body)
    if not root.tag.endswith(expected_root):
        raise ValueError(f"root is {root.tag!r}, expected {expected_root}")
    path = "sm:sitemap/sm:loc" if expected_root == "sitemapindex" else "sm:url/sm:loc"
    return [
        node.text.strip()
        for node in root.findall(path, NS)
        if node.text and node.text.strip()
    ]


def verify_one(site_url: str, path: str, target: str) -> list[str]:
    separator = "&" if "?" in target else "?"
    expected = f"{target}{separator}{SMOKE_QUERY}"
    request_url = f"{site_url}{path}?{SMOKE_QUERY}"
    failures: list[str] = []

    try:
        status, headers, _ = curl(request_url)
    except RuntimeError as exc:
        return [f"{path}: fetch failed ({exc})"]

    locations = header_values(headers, "location")
    location = locations[-1] if locations else ""

    if status != 301:
        failures.append(f"{path}: expected HTTP 301, got {status}")
    if location != expected:
        failures.append(f"{path}: expected direct Location {expected!r}, got {location!r}")

    if location:
        parts = urlsplit(location)
        if parts.netloc != "texasdefined.com":
            failures.append(f"{path}: redirect leaves ownership boundary at unexpected host {parts.netloc!r}")
        if parts.query != SMOKE_QUERY:
            failures.append(f"{path}: query string was not preserved exactly; got {parts.query!r}")

    return failures


def verify_sitemap_absence(site_url: str, redirects: dict[str, str], failures: list[str]) -> None:
    try:
        status, _, body = curl(f"{site_url}/sitemap.xml")
        if status != 200:
            failures.append(f"/sitemap.xml: expected HTTP 200, got {status}")
            return
        children = parse_locs(body, "sitemapindex")
    except (RuntimeError, ET.ParseError, ValueError) as exc:
        failures.append(f"/sitemap.xml: unable to verify migrated-tool absence ({exc})")
        return

    retired = {f"{KTR_ORIGIN}{path}" for path in redirects}
    found: dict[str, list[str]] = {url: [] for url in retired}

    for child_url in children:
        if not child_url.startswith(f"{KTR_ORIGIN}/"):
            continue
        child_path = child_url[len(KTR_ORIGIN):]
        try:
            status, _, child_body = curl(f"{site_url}{child_path}")
            if status != 200:
                failures.append(f"{child_path}: expected HTTP 200, got {status}")
                continue
            locs = set(parse_locs(child_body, "urlset"))
        except (RuntimeError, ET.ParseError, ValueError) as exc:
            failures.append(f"{child_path}: unable to inspect sitemap ({exc})")
            continue

        for retired_url in retired.intersection(locs):
            found[retired_url].append(child_url)

    for retired_url, owners in sorted(found.items()):
        if owners:
            failures.append(f"{retired_url}: migrated tool URL still appears in KTR sitemap(s): {owners}")


def main() -> None:
    site_url = (os.environ.get("SITE_URL") or DEFAULT_SITE_URL).rstrip("/")
    redirects = load_redirects()
    failures: list[str] = []

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {
            executor.submit(verify_one, site_url, path, target): path
            for path, target in sorted(redirects.items())
        }
        for future in as_completed(futures):
            try:
                failures.extend(future.result())
            except Exception as exc:  # pragma: no cover - defensive runner guard
                failures.append(f"{futures[future]}: unexpected smoke error ({exc})")

    verify_sitemap_absence(site_url, redirects, failures)

    if failures:
        for failure in sorted(failures):
            github_error(failure)
        raise RuntimeError(
            "Migrated-tool production handoff failed:\n- " + "\n- ".join(sorted(failures))
        )

    print(
        "Migrated-tool production handoff passed: "
        f"{len(redirects)} direct KTR 301 redirects to TexasDefined with query preservation "
        f"and {len(redirects)} migrated KTR URLs absent from advertised sitemaps."
    )


if __name__ == "__main__":
    main()
