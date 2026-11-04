# Representative authority recovery — Script 1 durable checkpoint

**Mission:** KeepTXRed individual `/representatives/:slug` recovery. No unrelated SEO work.  
**Implementation branch:** `feature/representative-authority-certification-20261104`  
**Source examination / pilot capture:** 2026-11-04.  
**Release status:** Awaiting PR CI and deployment evidence. Never infer a deployment or Google quality approval from commits alone.

## Existing infrastructure deliberately reused

- TanStack Start SSR representative route `src/routes/representatives.$representativeSlug.tsx`.
- Existing main `/representatives` index, official House/Senate roster generator, cached legislative Supabase graph and approved article relationships.
- Existing `bills` and `bill_sponsors` tables, `getRepresentativeLegislation` and government sources. **No bills database rebuild.**
- Real prior editorials in `src/data/representative-authority.ts`, with the statewide/House/Senate catalog from `texas-legislators.generated.ts`.
- Official TLO bill histories have session identifiers and recorded outcomes. `bill_sponsors` records include distinct author, coauthor, sponsor and cosponsor roles.

## Mandatory quality contract

`src/lib/representative-quality-gates.ts` defines exactly three states:
- `AUTHORITY_READY`: all six gates A–F pass with verified, person-specific primary-source bill-role research and a checked editorial record.
- `NOT_READY`: no manual review and/or insufficient independent research. Still published and linked, but SSR robots `noindex,follow`, not in XML sitemap, no robots.txt block, and never 410.
- `VERIFICATION_FAILED`: reviewed record contradicts official identity, office, district, party or official URL; never index.
- The source-linked snapshot is **historical** 89th Texas Legislature, not live vote coverage or a member's entire sponsorship record. The query captured at most eight bill examples per recorded role. A successful template or a generic biography does not certify the page.
- Source retrieval and rendering are independent: when live Supabase bill lookup temporarily fails, a previously certified historical snapshot remains available, and its indexability does not toggle.
- Third-party officeholder pages use `WebPage`, `Person`, `BreadcrumbList`, never Google's publisher-affiliated `ProfilePage` result type.

### Six-profile pilot

| Existing route | Office | Expected internal certification (verify in CI and deployed HTML) | Independent research |
| --- | --- | --- | --- |
| `/representatives/bryan-hughes` | TX Senate District 1 (R) | `AUTHORITY_READY` | 32 dated/linked official bill-role records, four roles |
| `/representatives/judith-zaffirini` | TX Senate District 21 (D) | `AUTHORITY_READY` | 32 dated/linked official bill-role records, four roles |
| `/representatives/terri-leo-wilson` | TX House District 23 (R) | `AUTHORITY_READY` | 32 dated/linked official bill-role records, four roles |
| `/representatives/mihaela-plesa` | TX House District 70 (D) | `AUTHORITY_READY` | 32 dated/linked official bill-role records, four roles |
| `/representatives/dan-crenshaw` | US House TX-2 (R) | `NOT_READY` | Federal bills/votes not ingested; biography/links alone insufficient |
| `/representatives/john-cornyn` | US Senate (R) | `NOT_READY` | Federal bills/votes not ingested; biography/links alone insufficient |

**Real source evidence:** `src/data/representative-research-pilot.json` contains 128 distinct records (32 × 4), with `sponsor_role`, `session_code`, `bill_id`, official `source_url`, `last_action_date`, `last_synced_at`, bill status and `became_law`, recorded from existing KTR Supabase. Official source: `https://capitol.texas.gov/BillLookup/History.aspx?...&Bill=...`. The source data's last sync was August 2026; snapshot captured November 4, 2026. Do not report these 32 as full bill totals, and do not infer votes from sponsorship.

**Official identity sources:**
- `https://senate.texas.gov/member.php?d=1` (Bryan Hughes)
- `https://senate.texas.gov/member.php?d=21` (Judith Zaffirini)
- `https://house.texas.gov/members/4290` (Terri Leo Wilson)
- `https://house.texas.gov/members/4345` (Mihaela Pleșa)
- Primary House 70 member URL and district address corrected in generated roster. Roster generation source also guards member ID vs district ID confusion.

**Visibility:** indexable profile HTML must contain the source-linked research module, role breakdown, searchable/filterable records and bounded coverage. Incomplete sections and false education placeholders are suppressed; legacy 100-row sample counts are explicitly labeled as samples.

## Indexing and sitemap ownership

- `src/routes/representatives.$representativeSlug.tsx`: robots directives based on certified state (SSR).
- `src/routes/sitemap-representatives[.]xml.ts`: uses the same pure certification calculation; only READY slugs included.
- `src/routes/sitemap[.]xml.ts`: representative-only certified child sitemap now advertised. Directory remains in `sitemap-pages.xml`, indexable.
- `scripts/seo/verify_deployed_primary_sitemap_ownership.py`: verifies the exact four pilot URLs have one primary sitemap owner each and no retired election/DMV regressions.
- Indexability is **an internal publication decision**, not a guarantee of Google's treatment.

## Required execution evidence

1. PR must pass production build, all representative Vitest and other required repository checks.
2. The generated roster must preserve House 70 identity and contact repairs. Do not run a broad unrelated roster rebuild.
3. GitHub's protected auto-merge triggers exact-main health verification; production Cloudflare deploy only from verified main.
4. Deployment workflow now runs `scripts/authority/verify-representative-pilot-production.py` on actual deployed Worker (HTML content, 4 index/3 noindex, canonical, official links, XML ownership, directory noindex check).
5. Deployment workflow also runs `playwright.representatives-deployed.config.ts` using exactly **one Chromium worker** for mobile overflow, accessibility labels and search behavior.
6. Inspect the real `https://keeptxred.com` production responses and public sitemap independently where possible, not just workers.dev.
7. Update this checkpoint with PR, merged SHA, workflow run IDs, passing/failing checks and production status. Stop only for a genuine unresolvable permission/tooling/CI blocker.

## Script 2 continuation and non-pilot scope

The remaining ~219 listed current officeholders should remain `NOT_READY`/noindex until each obtains verified source-backed research and all mandatory gates; do not falsely certify federal officials using Texas-only data. Preserve all existing URLs. Build office-specific modules in batches using the *same* gate, avoid duplicate biographies and unverified claims. Do not automatically flip a previously reviewed profile on temporary upstream API downtime. Move the review ledger into a durable database only when the coverage expansion requires it; the pilot's reproducible source JSON and pure certification are its auditable ledger.

*Checkpoint created during implementation; CI/prod statuses must be added only after those events are actually observed.*
