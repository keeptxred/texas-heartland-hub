# Texas legislative ingestion

The importer uses Texas Legislature Online's official anonymous FTP bill-history feed. TLO explicitly directs bulk consumers to `ftp.legis.state.tx.us` rather than repeatedly mining the public website. The importer invokes the system `curl` transfer client because Node's built-in `fetch` does not support FTP URLs.

```powershell
$env:SUPABASE_URL="https://project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="..."
npm run legislature:sync -- --sessions=89R,88R
```

The `history.xml` manifest is checked first. SHA-256 hashes in `legislative_source_records` prevent unchanged bill files from being rewritten. Database upserts preserve editorial columns such as `plain_language_summary`, `seo_title`, and `seo_description` because the importer never sends those fields.

Use `--dry-run` to validate discovery and parsing without database writes, and `--limit=25` for a bounded smoke test. Historical sessions can be appended to `--sessions`; TLO publishes bill history from the 71st Legislature onward.

Optional transfer settings are `TLO_TRANSFER_TIMEOUT_SECONDS` (default `120`), `TLO_TRANSFER_COMMAND` (a custom `curl` path), and `TLO_BULK_ROOT` (an official mirror/root override).

## Election and agency relationships

Each completed sync also links verified election races to canonical district pages. Official sponsor district fields link bills and representatives to districts, while affected-agency fields link bills to Texas government authority pages. All links are bidirectional and scored.
