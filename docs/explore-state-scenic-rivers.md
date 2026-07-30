# Explore Texas: State Scenic Rivers

## Overview

State scenic river support is implemented through the existing Explore Texas water catalog. The catalog models scenic river corridors as `river_access` entities so they automatically participate in the unified destination registry, search, maps, detail routes, nearby-destination discovery, trip planning, APIs, SEO, structured data, and admin workflows already driven by `exploreDestinations`.

The collection uses the user-facing label **Texas State Scenic Rivers** while preserving the source designation in entity metadata as **Texas Natural Rivers System scenic corridor**. This avoids representing the records as a separate statutory park system.

## Source and review policy

Records are based on official Texas Parks and Wildlife Department river, state natural area, and significant-stream-segment resources. Each record includes:

- official TPWD source attribution;
- a representative map coordinate;
- access and private-property guidance;
- ecological significance;
- variable-condition and safety guidance;
- related destination slugs for parks, natural areas, lakes, and established river access points;
- an official-source review date.

Current access, streamflow, weather, flood conditions, reservations, permits, closures, and private-property rules must be verified before travel.

## Catalog integration

Primary implementation files:

- `src/data/explore/catalog.state-scenic-rivers.entities.ts`
- `src/data/explore/catalog.water.ts`
- `src/data/explore/catalog.state-scenic-rivers.regression.test.ts`

The water catalog appends the scenic-river entities before the unified catalog normalization and deduplication stage. Existing destinations such as state parks, river access points, and lakes are referenced through `profile.relatedDestinationSlugs` rather than recreated.

## Included corridors

- Devils River Scenic Corridor
- Frio River Scenic Corridor
- Upper Guadalupe River Scenic Corridor
- Upper Nueces River Scenic Corridor
- Sabinal River Scenic Corridor
- Brazos River Scenic Corridor of North Texas
- Lower Pecos River Scenic Corridor
- Central Texas Colorado River Scenic Corridor

## Maintenance

When adding or revising a corridor:

1. Use an official government source.
2. Preserve existing TPWD destinations and access-point slugs.
3. Add related destinations by slug instead of creating duplicate entities.
4. Keep categories and tags lowercase-compatible with unified catalog normalization.
5. Update `LAST_REVIEWED` and the regression expectations when the collection changes.
6. Run lint, type checking, tests, and the production build before release.
