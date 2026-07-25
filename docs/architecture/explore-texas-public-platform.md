# Explore Texas public platform

## Scope

Phase II Steps 5–7 extend the existing import platform with a public, RLS-protected destination read model, searchable routes, entity details, an explainable trip planner, maps, a reusable public endpoint, and print output.

## Routes and rendering

- `/explore` loads query-backed featured and typed collections on the server.
- `/explore/search` validates URL search parameters and provides paginated, faceted results.
- `/explore/$slug` only resolves published entities and composes profile, observation, relationship, nearby, source, map, and structured-data sections when data exists.
- `/explore/trip-planner` generates and edits itineraries and persists the current draft in the browser.
- `/api/public/explore/entities` exposes the validated public search result shape.

All public reads use the publishable Supabase key and Row Level Security. Components do not issue direct Supabase queries.

## Search and geography

`search_explore_entities` combines PostgreSQL full-text ranking, trigram name tolerance, alternate names, taxonomy fields, safe array filters, pagination, and a Texas-bounded Haversine radius filter. The calculation runs in PostgreSQL; clients never load a full entity table to calculate distances. Result limits are capped at 100 in SQL and 48 in the public application schema.

The initial map provider is OpenStreetMap's embeddable map. It requires no secret and only renders when verified coordinates exist. A directions/map link accompanies the embed.

## Visibility and security

Anonymous users can read only `status = 'published'` entities, relationships whose endpoints are published, and current public observations. Admin policies are added when the existing `has_role` helper is available. Trips are owner-only unless explicitly shared with a non-null token. The current browser planner does not publish trips or personal inputs.

The public API validates all input with Zod, returns structured errors and request IDs, caps pagination, sends cache controls, and uses a conservative process-local burst limit. Edge or CDN rate limiting should additionally be enabled in production for multi-instance enforcement.

## Recommendations and trip generation

Scoring is centralized in `public.functions.ts`. It rewards exact activity matches and applicable family, pet, accessibility, RV, and regional fields. Tie-breaking is stable by entity name. Every stop receives explanations derived from those same structured fields. Generated schedules use up to three stops per day and label any fee or policy uncertainty for official-source verification.

The itinerary editor supports removal and keyboard-operable reordering controls. Drafts persist in versioned local storage. It deliberately does not claim live travel times, hours, availability, prices, or reservation status.

## SEO, sitemap, and print

Landing and planner pages have canonical metadata. Search pages are `noindex,follow` to avoid filtered-URL duplication. Entity pages derive titles, descriptions, images, canonical URLs, and Schema.org place types from published data.

The static sitemap includes the Explore landing and planner. Dynamic entity sitemap generation should be enabled after the migration is deployed and the production publishable-key environment is available to the sitemap worker.

Print uses browser print and “Save as PDF,” avoiding a deployment-sensitive browser dependency. Print CSS removes controls and navigation, sets letter margins, and avoids splitting day blocks.

## Environment and deployment

Required server variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Deploy `20260725120000_explore_public_platform.sql` before the application release. Regenerate checked-in Supabase TypeScript types after linking the target project. Confirm CSP permits `https://www.openstreetmap.org` in frames. No map secret is required.

## Verification

Run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build`. Database verification should additionally apply all migrations to a clean Supabase instance and confirm anonymous users cannot select draft, archived, rejected, or non-public observation records.
