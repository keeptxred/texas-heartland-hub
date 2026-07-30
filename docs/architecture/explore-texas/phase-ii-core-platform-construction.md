# Explore Texas — Phase II Core Platform Construction

## Purpose

Phase II converts the approved Explore Texas architecture into production-ready infrastructure while keeping every public Explore Texas route disabled until launch approval.

## Non-negotiable constraints

- No public navigation links.
- No public sitemap entries.
- No publicly readable Explore Texas tables until explicit launch approval.
- All schema changes must be additive and reversible.
- Existing news, commerce, calculator, authentication, and publishing systems must remain unaffected.
- Explore Texas must remain a bounded module under `src/features/explore/`.
- Verified factual data, imported source data, and AI-authored narrative must remain separate.

## Implementation sequence

### Step 1 — Database foundation

Create the minimum reusable schema required for every later feature.

Initial tables:

- `explore_entity_types`
- `explore_entities`
- `explore_entity_slug_history`
- `explore_relationship_types`
- `explore_entity_relationships`
- `explore_sources`
- `explore_entity_sources`
- `explore_locations`
- `explore_media`
- `explore_entity_media`
- `explore_observations`
- `explore_entity_versions`
- `explore_import_runs`
- `explore_import_records`
- `explore_review_queue`

Initial profile tables:

- `explore_lake_profiles`
- `explore_park_profiles`
- `explore_campground_profiles`
- `explore_historic_site_profiles`
- `explore_species_profiles`
- `explore_business_profiles`
- `explore_law_profiles`
- `explore_facility_profiles`

### Step 2 — Database constraints and security

Required controls:

- UUID primary keys.
- Unique public slugs among non-archived entities.
- Foreign keys with deliberate delete behavior.
- Check constraints for lifecycle status and confidence values.
- PostGIS geography columns and GiST indexes.
- Created/updated timestamps with automatic update triggers.
- Row-level security enabled on every Explore Texas table.
- Default-deny public policies.
- Service-role and authorized-admin write access only.

### Step 3 — TypeScript contracts

Create stable contracts under:

```text
src/features/explore/types/
```

Required contracts:

- `ExploreEntity`
- `ExploreEntityType`
- `ExploreRelationship`
- `ExploreSource`
- `ExploreLocation`
- `ExploreMedia`
- `ExploreObservation`
- `ExploreReviewItem`
- profile types for lakes, parks, campgrounds, historic sites, species, businesses, laws, and facilities

Generated Supabase types remain the database truth, while domain types provide a safer application-facing API.

### Step 4 — Repository and service layer

Create:

```text
src/features/explore/data/
src/features/explore/services/
```

Repositories must isolate Supabase queries from UI components.

Initial repositories:

- entity repository
- relationship repository
- source repository
- location repository
- media repository
- review repository
- import repository

Initial services:

- entity lifecycle service
- slug service
- duplicate-candidate service
- publication-readiness service
- relationship validation service
- source-confidence service

### Step 5 — Internal API layer

Create internal-only endpoints for:

- entity lookup
- entity creation
- entity update
- relationship management
- source attachment
- media attachment
- review queue actions
- import-run inspection

Every endpoint must enforce admin authorization server-side. Hidden routes alone are not security.

### Step 6 — Internal admin shell

Create an Explore Texas section inside the existing admin experience with no public exposure.

Initial screens:

- overview dashboard
- entity list
- entity editor
- relationship viewer
- source viewer
- duplicate review
- import health
- review queue

### Step 7 — Seed taxonomy and relationship types

Seed only stable structural records, not destination content.

Initial entity types:

- region
- county
- city
- lake
- state_park
- campground
- historic_site
- fish
- bird
- mammal
- wildflower
- activity
- amenity
- facility
- business
- government_agency
- law

Initial relationship types:

- `located_in`
- `contains`
- `managed_by`
- `near`
- `supports_activity`
- `has_amenity`
- `has_facility`
- `habitat_for`
- `regulated_by`
- `related_to`
- `accessed_by`
- `recommended_with`

### Step 8 — Pilot dataset

Use a small controlled dataset before broad imports.

Recommended pilot entities:

- Lake Livingston
- Garner State Park
- one campground
- one historic site
- largemouth bass
- bluebonnet
- one managing agency
- one governing regulation

The pilot must exercise:

- geographic hierarchy
- profiles
- relationships
- source attribution
- media licensing
- lifecycle transitions
- duplicate detection
- review queue
- search indexing readiness

## Migration order

1. Extensions and enum/check foundations.
2. Entity types and entities.
3. Slug history and versioning.
4. Relationship types and relationships.
5. Sources and provenance.
6. Locations and geospatial indexes.
7. Media and media links.
8. Observations.
9. Import and review tables.
10. Profile tables.
11. triggers, helper functions, and indexes.
12. RLS policies.
13. structural seed data.

## Release gates

Phase II database work is complete only when:

- migrations apply cleanly to a fresh database;
- migrations apply cleanly to the current project database;
- rollback instructions exist;
- all Explore Texas tables have RLS enabled;
- anonymous users cannot read draft or internal records;
- TypeScript generation succeeds;
- lint and typecheck pass;
- existing application tests remain unaffected;
- no public route, navigation item, or sitemap entry exists;
- the pilot dataset can be created and queried through internal services.

## Phase II deliverables

- Supabase migrations.
- Generated and domain-specific TypeScript types.
- Repository and service layer.
- Internal API endpoints.
- Internal admin module shell.
- Structural seed data.
- Pilot dataset fixtures.
- Migration verification notes.
- Security and rollback checklist.

## Next implementation unit

The first code-producing unit is **Phase II, Step 1A — Core Entity and Relationship Migration**. It should create only the foundational entity, slug-history, relationship-type, relationship, source, and provenance tables, together with indexes, triggers, RLS, and stable seed records. Profile tables and public interfaces must wait until that foundation passes validation.
