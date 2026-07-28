# Election Central — Day 2 completion

## Completion checklist

- [x] Repository mode configuration and swappable factory
- [x] Read-only repository provider integration
- [x] Shared query keys, defaults, and result refresh policy
- [x] Public race, candidate, poll, forecast, and result list experiences
- [x] Public race, candidate, poll, forecast, and result detail experiences
- [x] Repository-backed filters and URL search state
- [x] Loading, error, empty, stale, invalid, and unavailable states
- [x] Source attribution, freshness labels, and update timestamps
- [x] Poll, forecast, unofficial-result, and certification disclosures
- [x] Read-only Election Central admin overview and entity lists
- [x] Link, accessibility, trust, and SEO audits
- [x] Repository, model-validation, and hook-state tests
- [x] Day 2 operational documentation

## Deferred work

The following work is intentionally deferred and is not simulated:

- Supabase repository adapters
- API repository adapters
- Authoritative production election-data ingestion
- Admin create, update, publish, correction, and audit-log workflows
- Live election-night operational monitoring
- Production analytics and alerting

These items must preserve the current read-only public contracts. They must not
introduce person-level voter registration, ballot, or ballot-tracking records.

## Risks and constraints

1. The mock adapter intentionally returns no election records. Visual behavior
   with real records must be verified when an authoritative adapter is
   connected.
2. The full application build is blocked by the pre-existing missing
   `ELECTION_PRIMARY_NAVIGATION` export consumed by
   `ElectionNavigation.tsx`. Focused Election Central lint and tests pass, but
   the full build must not be reported as passing.
3. The existing admin session gate is inherited from the editorial dashboard.
   Production mutation work will require server-enforced authorization before
   any write capability is added.
4. Result refresh behavior depends on repositories returning accurate reporting
   and certification states.
5. Generated route-tree output must be regenerated and reviewed after the
   unrelated full-build blocker is resolved.

## Day 3 starting point

Begin Day 3 by resolving the shared navigation export blocker, then run the
full TypeScript build and test suite. After the baseline is green, implement
one authoritative repository adapter behind the existing factory, beginning
with election cycles and races. Validate source attribution, relationships,
freshness, publication, and verification metadata before enabling any public
records.

Do not add placeholder production records or fake election data while building
the adapter.
