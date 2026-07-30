# Election Central static-data operations

## Production architecture

Election Central uses version-controlled JSON and read-only static repositories in production.

- Canonical cycle URL: `/elections/2026`
- Legacy alias: `/elections` redirects to the canonical cycle URL
- Production repository mode: `static`
- Test and empty-state mode: `mock`
- Reserved future modes: `supabase`, `api`
- Public records must be both `published` and `verified`
- The homepage takeover defaults to disabled

Canonical data is stored in `src/data/elections/2026/`.

## Standard refresh

Run:

```bash
pnpm elections:refresh
```

The refresh sequence performs these operations in order:

1. Rebuild the 227-race launch directory.
2. Import authoritative candidate records.
3. Add available federal and state campaign-finance summaries.
4. Add sourced geography and county election links.
5. Normalize imported records to the TypeScript contracts.
6. Recalculate eligible forecasts.
7. Validate every canonical record.
8. Run route, sitemap, source, calculation, and launch-readiness QA.

The weekly GitHub Action performs the same sequence and commits changed JSON files.

## Official candidate import

The preferred full source is the Texas Secretary of State Candidate Listing Information application linked from the November 2026 Current Election Information page.

The importer accepts JSON, CSV, or an HTML table through either:

```bash
ELECTION_CANDIDATE_IMPORT=/path/to/candidates.json pnpm elections:import:candidates
```

or:

```bash
ELECTION_CANDIDATE_LIST_URL=https://authoritative.example/candidates.csv pnpm elections:import:candidates
```

For a repository-maintained import, place normalized rows in:

```text
scripts/elections/import/candidates.json
```

The input contract is documented in:

```text
scripts/elections/import/candidates.schema.json
```

Minimum fields:

```json
{
  "fullName": "Candidate Name",
  "ballotName": "Candidate Name",
  "party": "republican",
  "raceId": "race-2026-us-senate",
  "sourceName": "Texas Secretary of State Candidate Listing",
  "sourceUrl": "https://...",
  "sourceType": "official",
  "sourceRetrievedAt": "2026-07-28T12:00:00.000Z"
}
```

Do not use campaign announcements, finance filings, inferred incumbency, or news speculation as proof of ballot qualification. The importer may preserve editorial enrichment from an existing record, but it will not create a public candidate without a source-backed race relationship.

## Poll workflow

The admin poll form validates a poll and generates one normalized `ElectionPoll` JSON record. Editors can copy or download the record, add it to `polls.json`, and submit it through Git.

After editing polls, run:

```bash
pnpm elections:validate
pnpm elections:qa
```

Polling averages use one canonical weighted formula:

```text
recency × sample size × population × pollster quality × independence × methodology
```

Missing candidate responses are never imputed.

## Forecast workflow

Run:

```bash
pnpm elections:forecast
```

The deterministic forecast runner consumes complete sourced model inputs and stores one snapshot per race per day. It preserves prior snapshots and external forecast records. Races without complete candidates or source-backed inputs remain in an honest no-forecast state.

The daily GitHub Action runs forecast, validation, QA, and commits changed snapshots without external services or repository secrets.

## Launch readiness

Run:

```bash
pnpm elections:readiness
```

The generated repository report is:

```text
src/data/elections/2026/readiness.json
```

The takeover is blocked unless:

- All 227 launch-scope races are published and verified.
- Every race has reciprocal published candidate relationships.
- Contested races have at least two published candidates.
- Uncontested races have at least one published candidate.
- Public records are fresh.
- Validation, route QA, sitemap QA, calculation fixtures, source checks, and production build pass.

Only after `readiness.json` reports `"ready": true` should the deployment environment set:

```text
VITE_ENABLE_ELECTION_CENTRAL_HOMEPAGE=true
```

Until then, the normal homepage remains active and Election Central remains available at `/elections/2026`.

## Browser QA

Election-specific mobile Chromium tests run through:

```bash
pnpm elections:test:mobile
```

They verify the normal homepage remains active while the flag is disabled, major election routes render, detail routes work, empty states remain factual, and pages do not overflow a mobile viewport.

## Deferred election-night work

Live precinct ingestion, estimated vote remaining, county result maps, failover providers, and real-time election-night administration remain a separate project. They are not part of the public research-site launch.
