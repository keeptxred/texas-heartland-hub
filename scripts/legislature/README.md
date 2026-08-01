# Texas legislative ingestion

The importer uses Texas Legislature Online's official bulk bill-history XML feed. TLO explicitly directs bulk consumers to `ftp.legis.state.tx.us` rather than repeatedly mining the public website.

```powershell
$env:SUPABASE_URL="https://project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="..."
npm run legislature:sync -- --sessions=89R,88R
```

The `history.xml` manifest is checked first. SHA-256 hashes in `legislative_source_records` prevent unchanged bill files from being rewritten. Database upserts preserve editorial columns such as `plain_language_summary`, `seo_title`, and `seo_description` because the importer never sends those fields.

Use `--dry-run` to validate discovery and parsing without database writes, and `--limit=25` for a bounded smoke test. Historical sessions can be appended to `--sessions`; TLO publishes bill history from the 71st Legislature onward.

## Election and agency relationships

Each completed sync also links verified election races to canonical district pages. Official sponsor district fields link bills and representatives to districts, while affected-agency fields link bills to Texas government authority pages. All links are bidirectional and scored.
