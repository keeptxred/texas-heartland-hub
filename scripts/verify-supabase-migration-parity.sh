#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${SUPABASE_PUBLIC_ENV_FILE:-$ROOT_DIR/.env}"
EXPECTED_VERSIONS_FILE="${SUPABASE_EXPECTED_VERSIONS_FILE:-}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Supabase parity verification failed: public environment file not found: $ENV_FILE" >&2
  exit 2
fi

# These values are intentionally public frontend configuration. Do not use a
# service-role key here: this verifier proves migration ledger membership
# without granting GitHub Actions database write access.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

supabase_url="${SUPABASE_URL:-${VITE_SUPABASE_URL:-}}"
publishable_key="${SUPABASE_PUBLISHABLE_KEY:-${VITE_SUPABASE_PUBLISHABLE_KEY:-}}"

if [[ -z "$supabase_url" || -z "$publishable_key" ]]; then
  echo 'Supabase parity verification failed: public SUPABASE_URL/publishable key is missing.' >&2
  exit 2
fi

expected_versions=()
if [[ -n "$EXPECTED_VERSIONS_FILE" ]]; then
  if [[ ! -f "$EXPECTED_VERSIONS_FILE" ]]; then
    echo "Supabase parity verification failed: expected-version file not found: $EXPECTED_VERSIONS_FILE" >&2
    exit 2
  fi
  mapfile -t expected_versions < <(sed '/^[[:space:]]*$/d' "$EXPECTED_VERSIONS_FILE" | sort -u)
elif (( $# > 0 )); then
  mapfile -t expected_versions < <(printf '%s\n' "$@" | sed '/^[[:space:]]*$/d' | sort -u)
else
  echo 'Supabase parity verification failed: no expected migration delta was supplied.' >&2
  echo 'Pass migration versions as arguments or set SUPABASE_EXPECTED_VERSIONS_FILE.' >&2
  exit 2
fi

for version in "${expected_versions[@]}"; do
  if [[ ! "$version" =~ ^[0-9]+$ ]]; then
    echo "Supabase parity verification failed: invalid migration version: $version" >&2
    exit 2
  fi
done

if (( ${#expected_versions[@]} == 0 )); then
  echo 'SUPABASE_MIGRATION_PARITY_OK count=0 mode=read-only-rpc scope=current-delta'
  exit 0
fi

versions_json="$(printf '%s\n' "${expected_versions[@]}" | jq -R . | jq -s .)"
payload="$(jq -cn --argjson expected "$versions_json" '{expected_versions:$expected}')"
response_file="$(mktemp)"
trap 'rm -f "$response_file"' EXIT

curl -fsS \
  --retry 3 \
  --retry-all-errors \
  --connect-timeout 15 \
  --max-time 60 \
  -X POST \
  -H "apikey: $publishable_key" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  --data "$payload" \
  "$supabase_url/rest/v1/rpc/verify_repo_migrations" \
  > "$response_file"

if ! jq -e 'type == "array"' "$response_file" >/dev/null; then
  echo 'Supabase parity verification failed: read-only RPC returned an unexpected response.' >&2
  jq -c . "$response_file" >&2 || true
  exit 1
fi

if jq -e --argjson expected "$versions_json" '
  (length == ($expected | length))
  and (all(.[]; .applied == true))
  and (([.[].version] | sort) == ($expected | sort))
' "$response_file" >/dev/null; then
  echo "SUPABASE_MIGRATION_PARITY_OK count=${#expected_versions[@]} mode=read-only-rpc scope=current-delta"
  exit 0
fi

missing="$(jq -nr --argjson expected "$versions_json" --slurpfile actual "$response_file" '
  $actual[0] as $rows
  | $expected[]
  | . as $version
  | select(($rows | any(.version == $version and .applied == true)) | not)
  | $version
' 2>/dev/null || true)"

if [[ -n "$missing" ]]; then
  echo 'Supabase migration parity check found current-delta migrations absent from production:' >&2
  while IFS= read -r version; do
    [[ -n "$version" ]] && printf '  %s\n' "$version" >&2
  done <<< "$missing"
else
  echo 'Supabase migration parity check failed because production returned an incomplete or inconsistent migration ledger response.' >&2
fi

echo 'No database writes were attempted. Configure SUPABASE_DB_URL (preferred) or linked-project credentials to apply missing migrations.' >&2
exit 1
