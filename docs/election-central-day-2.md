# Election Central — Day 2 handoff

## Delivered

Day 2 connects the public races, candidates, polls, forecasts, and results
experiences to read-only repository contracts. List and detail pages use shared
query keys, query defaults, loading/error/empty states, canonical metadata,
source attribution, freshness cues, and trust disclosures.

The admin workspace now provides read-only repository views for races,
candidates, polls, forecasts, and results. No admin mutation workflow is
enabled.

## Repository modes

- `mock` is the safe default and returns empty collections.
- `supabase` and `api` remain explicit future modes.
- Selecting an unimplemented mode fails clearly rather than silently falling
  back or fabricating records.
- Public repository bundles expose read operations only.

Configure the adapter with `VITE_ELECTION_REPOSITORY_MODE`.

## Public routes

- `/elections`
- `/elections/races` and race detail
- `/elections/candidates` and candidate detail
- `/elections/polls` and poll detail
- `/elections/forecast` and forecast detail
- `/elections/results` and result detail
- `/elections/methodology`
- `/elections/voting`

## Admin routes

The existing session gate protects `/admin/elections` and its read-only race,
candidate, poll, forecast, and result views. Admin queries use the shared admin
query defaults.

## Election-night behavior

Active result queries refresh every 30 seconds. Substantially complete results
slow to two-minute refreshes. Complete and certified results stop polling.
Every results surface states that election-night totals remain unofficial until
certified.

## Safety boundaries

- No person-level voter registration records are modeled.
- No person-level ballot or ballot-tracking records are modeled.
- Election data remains source-backed and read-only on public surfaces.
- Polls, forecasts, and official results remain visually and semantically
  distinct.
- Empty mock repositories never imply that election records exist.

## Verification

Focused Vitest coverage includes repository contracts, model validation, query
hook states, route links, accessibility, trust disclosures, and SEO metadata.
Focused files are also checked with ESLint and Prettier.

The full application build currently remains blocked by a pre-existing missing
`ELECTION_PRIMARY_NAVIGATION` export from `src/lib/elections/index.ts`. Do not
interpret that unrelated build failure as validation of Election Central
changes.
