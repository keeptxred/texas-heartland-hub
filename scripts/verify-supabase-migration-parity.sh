#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${SUPABASE_PUBLIC_ENV_FILE:-$ROOT_DIR/.env}"
MIGRATIONS_DIR="${SUPABASE_MIGRATIONS_DIR:-$ROOT_DIR/supabase/migrations}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Supabase parity verification failed: public environment file not found: $ENV_FILE" >&2
  exit 2
fi

# These values are intentionally public frontend configuration. Do not use a
# service-role key here: this verifier is designed to prove migration ledger
# parity without granting GitHub Actions database write access.
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

if [[ ! -d "$MIGRATIONS_DIR" ]]; then
  echo "Supabase parity verification failed: migrations directory not found: $MIGRATIONS_DIR" >&2
  exit 2
fi

mapfile -t expected_versions < <(
  find "$MIGRATIONS_DIR" -maxdepth 1 -type f -name '*.sql' -printf '%f\n' \
    | sed -nE 's/^([0-9]+)_.*/\1/p' \
    | sort -u
)

if (( ${#expected_versions[@]} == 0 )); then
  echo 'Supabase parity verification failed: no versioned migration files were found.' >&2
  exit 2
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
  echo "SUPABASE_MIGRATION_PARITY_OK count=${#expected_versions[@]} mode=read-only-rpc"
  exit 0
fi

missing="$(jq -r --argjson expected "$versions_json" '
  . as $actual
  | $expected[]
  | select(any($actual[]; .version == . and .applied == true) | not)
' "$response_file" 2>/dev/null || true)"

# The expression above is intentionally followed by a simpler set check so the
# failure output stays useful even if PostgREST returns rows in a different order.
missing="$(jq -nr --argjson expected "$versions_json" --slurpfile actual "$response_file" '
  [$actual[0][] | select(.applied == true) | .version] as $applied
  | $expected[]
  | select(($applied | index(.)) == null)
' 2>/dev/null || true)"

if [[ -n "$missing" ]]; then
  echo 'Supabase migration parity check found repository migrations absent from production:' >&2
  printf '  %s\n' $missing >&2
else
  echo 'Supabase migration parity check failed because production returned an incomplete or inconsistent migration ledger.' >&2
fi

echo 'No database writes were attempted. Configure SUPABASE_DB_URL (preferred) or the linked-project credentials to apply missing migrations.' >&2
exit 1
