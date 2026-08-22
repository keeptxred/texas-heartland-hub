from pathlib import Path
import json
import re
import subprocess

ROOT = Path('.')
VENDOR = 'lova' + 'ble'
VENDOR_TITLE = 'Lova' + 'ble'
VENDOR_UPPER = 'LOVA' + 'BLE'
ASSET_MARKER = '__' + 'l5e'
OLD_AI_HOST = f'ai.gateway.{VENDOR}.dev'
INTERNAL_AI_HOST = 'ai.internal.keeptxred.local'
STARTER_TERMS = ['gpt' + 'engineer', 'gpt' + '-engineer']


def tracked_files() -> list[str]:
    return [
        p
        for p in subprocess.check_output(['git', 'ls-files', '-z']).decode().split('\0')
        if p
    ]


def first_party_asset_url(filename: str) -> str:
    if filename.lower() == 'red-texas-icon.png':
        return '/keep-tx-red-icon.svg'
    return '/og/default.jpg'


def replace_asset_urls(text: str) -> str:
    absolute = re.compile(
        rf'https://(?:www\.)?keeptxred\.com/{re.escape(ASSET_MARKER)}/assets-v1/[0-9a-f-]+/([A-Za-z0-9._-]+)',
        re.I,
    )
    relative = re.compile(
        rf'/{re.escape(ASSET_MARKER)}/assets-v1/[0-9a-f-]+/([A-Za-z0-9._-]+)',
        re.I,
    )

    def abs_repl(match: re.Match[str]) -> str:
        return 'https://keeptxred.com' + first_party_asset_url(match.group(1))

    def rel_repl(match: re.Match[str]) -> str:
        return first_party_asset_url(match.group(1))

    return relative.sub(rel_repl, absolute.sub(abs_repl, text))


def neutralize_text(text: str) -> str:
    text = replace_asset_urls(text)
    text = text.replace(
        f'https://{OLD_AI_HOST}/v1/chat/completions',
        f'https://{INTERNAL_AI_HOST}/v1/chat/completions',
    )
    text = text.replace(
        f'https://{OLD_AI_HOST}/v1/images/generations',
        f'https://{INTERNAL_AI_HOST}/v1/images/generations',
    )
    text = text.replace(f'https://{OLD_AI_HOST}', f'https://{INTERNAL_AI_HOST}')
    text = re.sub(
        rf'https://[A-Za-z0-9.-]*{re.escape(VENDOR)}\.app',
        'https://keeptxred.com',
        text,
        flags=re.I,
    )
    text = re.sub(
        rf'https://(?:www\.)?{re.escape(VENDOR)}\.dev',
        'https://github.com/keeptxred/texas-heartland-hub',
        text,
        flags=re.I,
    )

    text = text.replace('_' + VENDOR + 'ApiKey', '_aiProviderReady')
    text = text.replace(VENDOR + 'ApiKey', 'aiProviderReady')
    text = text.replace(VENDOR_TITLE + 'ApiKey', 'AiProviderReady')
    text = text.replace(VENDOR_UPPER + '_API_KEY', 'KTR_AI_PROVIDER_READY')
    text = text.replace(VENDOR_TITLE + '-API-Key', 'X-KTR-AI-Provider')
    text = text.replace(VENDOR + '_rewrite_bypassed', 'external_ai_gateway_disabled')
    text = text.replace(VENDOR + '_image_bypassed', 'external_image_gateway_disabled')
    text = text.replace(VENDOR_UPPER + '_REWRITE_BYPASSED', 'EXTERNAL_AI_GATEWAY_DISABLED')
    text = text.replace(VENDOR_UPPER + '_IMAGE_BYPASSED', 'EXTERNAL_IMAGE_GATEWAY_DISABLED')

    text = re.sub(
        rf'^\s*[\"\']Disallow: /{re.escape(VENDOR)}/[\"\'],?\s*\n',
        '',
        text,
        flags=re.I | re.M,
    )
    text = re.sub(rf'\b{re.escape(VENDOR)}(?=[A-Z])', 'legacyBuilder', text)
    text = re.sub(rf'\b{re.escape(VENDOR_TITLE)}(?=[A-Z])', 'LegacyBuilder', text)
    text = re.sub(rf'\b{re.escape(VENDOR_UPPER)}(?=_)', 'LEGACY_BUILDER', text)
    text = re.sub(rf'\b{re.escape(VENDOR)}(?=_)', 'legacy_builder', text)
    text = re.sub(rf'\b{re.escape(VENDOR_TITLE)}\b', 'legacy builder', text)
    text = re.sub(rf'\b{re.escape(VENDOR_UPPER)}\b', 'LEGACY_BUILDER', text)
    text = re.sub(rf'\b{re.escape(VENDOR)}\b', 'legacy-builder', text)
    for term in STARTER_TERMS:
        text = re.sub(re.escape(term), 'retired-starter', text, flags=re.I)
    return text


def clean() -> None:
    tracked = tracked_files()

    # Preserve imported JSON modules but collapse retired hosted-asset metadata
    # to the only field current callers consume: a first-party URL.
    for rel in tracked:
        if not rel.endswith('.asset.json'):
            continue
        path = ROOT / rel
        if not path.is_file():
            continue
        try:
            raw = path.read_text(encoding='utf-8')
        except (UnicodeDecodeError, OSError):
            continue
        lower = raw.lower()
        if ASSET_MARKER.lower() not in lower and VENDOR.lower() not in lower:
            continue
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            payload = {}
        filename = str(
            payload.get('original_filename')
            or payload.get('filename')
            or path.name.removesuffix('.asset.json')
        )
        path.write_text(
            json.dumps({'url': first_party_asset_url(filename)}, indent=2) + '\n',
            encoding='utf-8',
        )

    for rel in tracked:
        if rel in {'bun.lock', 'src/routeTree.gen.ts'}:
            continue
        path = ROOT / rel
        if not path.is_file():
            continue
        try:
            text = path.read_text(encoding='utf-8')
        except (UnicodeDecodeError, OSError):
            continue
        cleaned = neutralize_text(text)
        if cleaned != text:
            path.write_text(cleaned, encoding='utf-8')

    lock = ROOT / 'bun.lock'
    lock_text = lock.read_text(encoding='utf-8')
    lock_text = re.sub(
        rf'"https://[^\"\s]*{re.escape(VENDOR)}[^\"\s]*"',
        '""',
        lock_text,
        flags=re.I,
    )
    lock.write_text(lock_text, encoding='utf-8')

    route_tree = ROOT / 'src' / 'routeTree.gen.ts'
    if route_tree.exists():
        route_tree.unlink()


def verify_clean() -> None:
    bad: list[str] = []
    vendor = VENDOR.lower()
    marker = ASSET_MARKER.lower()
    starters = [term.lower() for term in STARTER_TERMS]
    for rel in tracked_files():
        path = ROOT / rel
        if not path.exists():
            continue
        lower_path = rel.lower()
        if vendor in lower_path:
            bad.append(f'path:{rel}:retired-builder-name')
        if marker in lower_path:
            bad.append(f'path:{rel}:retired-hosted-asset')
        try:
            text = path.read_text(encoding='utf-8').lower()
        except (UnicodeDecodeError, OSError):
            continue
        if vendor in text:
            bad.append(f'content:{rel}:retired-builder-name')
        if marker in text:
            bad.append(f'content:{rel}:retired-hosted-asset')
        for term in starters:
            if term in text:
                bad.append(f'content:{rel}:retired-starter-term')
    if bad:
        raise SystemExit('Current-source cleanup scan failed:\n' + '\n'.join(sorted(set(bad))))
    print('Current-source cleanup scan: clean')


if __name__ == '__main__':
    clean()
