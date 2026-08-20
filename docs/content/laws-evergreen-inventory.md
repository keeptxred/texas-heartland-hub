# KTR Texas Laws Evergreen Inventory

Updated: 2026-08-13

## Purpose

This document tracks the migration of the Keep TX Red laws section from a small collection of newsroom guides into a maintained evergreen Texas-law reference library.

## Existing guides currently linked from `/laws`

### Texas Laws Explained

- `texas-gun-laws-explained`
- `texas-property-tax-laws-explained`
- `texas-election-laws-explained`
- `constitutional-carry-one-year-later`
- `how-a-bill-becomes-texas-law`

### Laws You Should Know

- `homestead-exemption-explained`
- `texas-open-meetings-public-info`
- `appraisal-protest-playbook`
- `texas-voter-registration-guide`

### Legislative Updates

- `texas-new-laws-2026`
- `property-tax-relief-package`
- `speaker-special-session`
- `texas-constitutional-amendments-guide`

These existing pages are treated as legacy guides until each one is migrated through the new verification workflow. Legacy status preserves current indexability and does not represent a new legal review.

## Topic taxonomy for expansion

1. Driving & Traffic
2. Landlord & Tenant
3. HOA & Property
4. Self-Defense & Firearms
5. Everyday Criminal Law
6. Marriage & Family
7. Wills, Probate & Inheritance
8. Employment
9. Consumer Rights
10. Small Business
11. Schools & Parental Rights
12. Open Government & Civic Rights
13. Elections & Voting
14. Outdoors, Hunting & Fishing
15. Alcohol & Everyday Regulations
16. Animals & Pets
17. Property Tax
18. Legislative Process

## Publication states

- `draft`: content can exist in development but is not ready to be treated as a verified law guide.
- `verified`: primary-source review is complete and required source/freshness metadata is present.
- `needs-review`: a previously reviewed guide needs new legal/source review before verified publication.
- `legacy`: pre-registry content that remains live while it is migrated.

## Required metadata for newly verified law guides

- stable slug
- topic
- canonical path
- statute or code citation when applicable
- at least one primary authority link
- last verified date
- effective date when the rule has a specific effective date
- related law guides
- title and description that are unique to the page

## Verification rules

1. Do not promote a new law guide to `verified` without a primary authority.
2. Use HTTPS source links.
3. Do not invent statute numbers, deadlines, penalties, exceptions, or legal conclusions.
4. Prefer Texas Legislature, Texas Constitution and Statutes, Texas courts, and the responsible Texas agency over third-party summaries.
5. Keep the current 90-day review cadence for law content.
6. If a material legal change is detected, move the guide to `needs-review` until the affected claims are checked.
7. Existing legacy pages should be migrated without changing their canonical URLs unless a deliberate consolidation/redirect plan exists.

## Batch 1 implementation

- Central law-topic taxonomy: `src/lib/law-guides.ts`
- Law-guide metadata registry and publication states: `src/lib/law-guides.ts`
- Draft metadata factory and verification validator: `src/lib/law-guides.ts`
- Reusable quick-answer, statute/reference, disclaimer, and related-guide UI: `src/components/laws/law-guide-ui.tsx`
- Existing evergreen maintenance cadence: `src/lib/content-maintenance.ts`
- Existing FAQ and breadcrumb structured-data support remains in the article route.
- Sitemap guard is applied to registered law guides so future draft/review-required entries cannot be advertised as verified evergreen law content.

## Next migration step

Before Batch 2 publishes new driving-law guides, add every new guide to the registry as `draft`, complete the content and primary-source review, then promote it to `verified`. Existing legacy pages can be reviewed and migrated incrementally without blocking the new library build.
