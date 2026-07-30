# Election Central — Day 1 Foundation

## Status

Day 1 establishes the reusable Election Central foundation for KeepTXRed. It does not yet connect live election databases, polling feeds, forecast models, or election-night result sources.

Active branch: `agent/election-central-day-1`

Active cycle: 2026 Texas elections

Time zone: `America/Chicago`

## Day 1 scope

The Day 1 implementation includes:

- Election Central route definitions and navigation
- Shared TypeScript interfaces and configuration
- Public Election Central layout and homepage foundation
- Election countdown and voting-date components
- Candidate, race, poll, and forecast cards
- Loading, empty, no-data, and error states
- SEO, canonical, structured-data, and sitemap helpers
- Contextual internal-link policy and verified KeepTXRed routes
- Election Central feature flag
- Admin navigation and admin dashboard shell

The foundation intentionally uses placeholders where imported election data does not yet exist. Placeholder counts must never be presented as real election records.

## Public routes

The route constants are maintained in `src/lib/elections/routes.ts`.

Day 1 supports or reserves the following Election Central route families:

- `/elections`
- `/elections/races`
- `/elections/candidates`
- `/elections/polls`
- `/elections/forecast`
- `/elections/results`
- `/elections/methodology`
- Election voting-information pages
- Future race and candidate detail routes

Only routes that are actually implemented should be linked as active navigation targets. Planned routes must remain disabled or clearly identified until their pages exist.

## Admin routes

The Election Central admin workspace begins at:

- `/admin/elections`

The following management sections are reserved for later implementation:

- `/admin/elections/races`
- `/admin/elections/candidates`
- `/admin/elections/polls`
- `/admin/elections/forecast`
- `/admin/elections/results`

The admin dashboard reuses the existing KeepTXRed session-based admin unlock. It is marked `noindex, nofollow`.

## Main component locations

Public components:

- `src/components/elections/layout/`
- `src/components/elections/navigation/`
- `src/components/elections/home/`
- `src/components/elections/cards/`
- `src/components/elections/resources/`
- `src/components/elections/states/`

Admin components:

- `src/components/admin/elections/ElectionAdminMenu.tsx`
- `src/components/admin/elections/ElectionAdminDashboard.tsx`

Shared library code:

- `src/lib/elections/config.ts`
- `src/lib/elections/routes.ts`
- `src/lib/elections/seo.ts`
- `src/lib/elections/sitemap.ts`
- `src/lib/elections/internalLinks.ts`
- `src/lib/elections/internalLinkPolicy.ts`

## Configuration

`src/lib/elections/config.ts` is the central configuration source for:

- Election Central branding
- Locale and time zone
- Active election cycle
- Election Day, registration, and early-voting dates
- Default display limits
- Refresh intervals
- Stale and expired data thresholds
- Editorial safeguards
- Attribution requirements
- Accessibility defaults

Dates should be stored as ISO timestamps with explicit offsets. Public displays should use the configured locale and Central Time.

## Data-quality rules

Election Central must follow these rules before live data is published:

1. Every poll must identify its pollster, field dates, sample, voter universe, methodology, margin of error when available, and source URL.
2. Polling and forecasts must be labeled as different products.
3. Forecasts must identify their update time, model version or methodology, and confidence or probability basis.
4. Election results must be labeled unofficial until certified by the appropriate authority.
5. Result refreshes must preserve source attribution and update timestamps.
6. Stale or expired data must trigger the appropriate warning or error state rather than silently appearing current.
7. Missing data must not be replaced by invented estimates, inferred totals, placeholder candidates, or fabricated polling.
8. Admin placeholder metrics must remain explicitly labeled until connected to verified data tables.

## Internal-link requirements

Election Central pages must include contextual links to existing KeepTXRed content when relevant.

Verified supporting routes include:

- `/register-to-vote`
- `/laws`
- `/texas-politics`
- `/contact-legislators`
- `/get-involved`
- `/living-in-texas`
- `/happening-now`

Rules:

- Use only verified routes.
- Do not invent polling-place or election-office routes.
- Use descriptive anchor text.
- Add links where they help the reader complete a related task or understand the election context.
- Avoid generic anchors such as “click here.”
- Follow the minimum contextual-link requirement in the Election Central configuration.

## State components

The reusable state system is exported from `src/components/elections/states/index.ts`.

### Loading

`ElectionLoading.tsx` provides page, section, card-grid, list, metric, and detail skeletons. Loading states include accessible status messaging and fixed dimensions to reduce layout shift.

### Empty

`ElectionEmptyState.tsx` provides specific empty states for races, candidates, polls, forecasts, results, searches, filters, and admin collections.

### No data

`ElectionNoData.tsx` handles verified situations where election information is not yet available and can include contextual resource links.

### Errors

`ElectionErrorState.tsx` covers failed loads, network errors, timeouts, stale data, unavailable providers, missing records, admin-access problems, and failed admin operations.

## SEO and indexing

Public Election Central pages should use the helpers in `src/lib/elections/seo.ts` for:

- Page titles
- Canonical URLs
- Robots directives
- Open Graph metadata
- Twitter metadata
- Social images
- Last-updated timestamps
- Breadcrumb and page JSON-LD

Empty detail pages should not be indexed unless the configuration explicitly allows it.

Election routes are registered through the Election Central sitemap helper and `src/routes/sitemap-elections.xml.ts`.

## Accessibility

Election Central components should:

- Use text in addition to color for status and ratings
- Preserve visible keyboard focus
- Use live regions for loading, errors, and live result updates where appropriate
- Maintain minimum touch-target sizes
- Avoid motion-dependent meaning
- Respect reduced-motion preferences
- Mark disabled planned admin routes with accessible disabled states

## Admin workflow

The current admin shell is a readiness workspace, not yet a complete election content management system.

Recommended operational sequence for later phases:

1. Import or enter verified race records.
2. Attach verified candidate records to each race.
3. Add poll records with complete methodology and source attribution.
4. Add forecast records only after methodology is documented.
5. Configure result providers and election-night refresh behavior.
6. Review stale-data and missing-source warnings.
7. Preview public pages.
8. Publish only after editorial checks pass.

## Recommended next phase

The next implementation phase should prioritize the data layer before adding additional public polish.

Recommended order:

1. Define Supabase election tables and migrations.
2. Add typed data-access helpers.
3. Build race and candidate admin CRUD.
4. Build public race and candidate indexes and detail pages.
5. Add poll ingestion and review workflow.
6. Add forecast methodology and publishing workflow.
7. Add election-result provider integration and live refresh controls.
8. Add automated freshness, attribution, and validation checks.
9. Add tests for routes, state components, SEO output, and stale-data handling.

## Day 1 completion checklist

- [x] Folder structure
- [x] Shared TypeScript interfaces
- [x] Constants
- [x] Routes
- [x] Election layout
- [x] Navigation
- [x] Feature flag
- [x] Election homepage
- [x] Countdown
- [x] Voting dates
- [x] Featured race cards
- [x] Candidate card
- [x] Race card
- [x] Poll card
- [x] Forecast card
- [x] No-data component
- [x] SEO helpers
- [x] Sitemap
- [x] Configuration
- [x] Admin menu
- [x] Admin dashboard shell
- [x] Loading states
- [x] Empty states
- [x] Error states
- [x] Documentation

Day 1 foundation status: complete.
