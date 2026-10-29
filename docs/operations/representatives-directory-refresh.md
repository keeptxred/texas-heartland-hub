# Representatives directory — refresh and recovery

**Scope:** `/representatives`, `/representatives/$representativeSlug`, `/find-representative`.

## Sources and trust hierarchy
- Sitting Texas House: https://house.texas.gov/members
- Sitting Texas Senate: https://senate.texas.gov/members.php
- Legislative history: https://lrl.texas.gov/legeLeaders/members/membersearch.cfm
- U.S. House members and vacancies: https://www.house.gov/representatives
- U.S. senators: https://www.senate.gov/states/TX/intro.htm
- Current officeholder lookup by address: https://wrm.capitol.texas.gov/home
- Election candidates are **not** current officeholders; a 2026 election district can differ from the district seated in the current Congress.

## Automation
Existing `.github/workflows/sync-texas-legislators.yml` runs Monday at 12:17 UTC and an additional quarterly backstop on the second of January, April, July and October at 12:41 UTC. It generates `src/data/texas-legislators.generated.ts` from official House, Senate and legislative-service sources; the validator ensures exactly 150 House and 31 Senate district records, distinguishes **seats** from **seated members**, rejects duplicate IDs or impossible vacancy counts, and requires a current successful source review date. Approved differences are staged via an automation PR with protected verification, safe merge and deployment. Failed runs raise/update a GitHub issue instead of silently declaring success.

The generated file's `TEXAS_ROSTER_REVIEWED_AT` is the last **full source review**, not an indicator of continuous freshness. Do not hand-edit this date. Federal and statewide officeholder entries in `src/data/representatives.ts` remain separately maintained and should be cross-checked with their official directories at the quarterly review.

## Initial corrections (Oct 29, 2026)
- Texas House District 1: vacant (Gary VanDeaver former); HD93: vacant (Nate Schatzline former); Texas Senate District 22 already carried as vacant.
- Retain old /representatives/gary-vandeaver and /nate-schatzline profile paths solely as noindex historical records; never render them in the sitting directory.
- Correct Senator Brett Ligon's Senate service start to 2026.
- Distinguish Texas-only legislation coverage from federal Congress.gov; avoid misleading zero federal bill counts.
- Restrict remote portrait images to official government hosts, and separate current officeholders from the 2026 race lookup.
- If `scripts/legislators/sync-official-roster.mjs` fails due upstream source structure changes, update the source adapter and parser tests, **do not** weaken the integrity gate to accept incomplete rosters.

## Recovery checklist
1. Check Actions > **Sync Texas legislator authority profiles** for last successful run and any open issue titled “Texas legislator roster sync failed.”
2. Validate the generated roster with `node scripts/legislators/validate-roster.mjs` after a fresh generation and run `npx vitest run src/data/representatives.test.ts src/lib/election-calendar.test.ts`.
3. Review any automation PR for vacancies, seats and direct profile changes; use official chamber sites, not campaign sites.
4. Confirm protected CI success, production deploy, and the rendered page. The most recent reviewed date must match the successful regeneration; never update it solely to clear a staleness warning.
