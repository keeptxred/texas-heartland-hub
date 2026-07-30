# Texas Lighthouses

Texas lighthouse destinations are implemented as first-class `ExploreEntity` records and flow through the existing unified Explore Texas catalog.

## Architecture

- Source records: `src/data/explore/catalog.lighthouses.ts`
- Entity normalization: `src/data/explore/catalog.lighthouses.entities.ts`
- Unified catalog integration: `src/data/explore/all-destinations.ts`
- Regression coverage: `src/data/explore/catalog.lighthouses.test.ts`

The implementation intentionally reuses the existing generic Explore Texas systems. Once lighthouse entities enter `exploreDestinations`, they are available to existing search facets, maps, nearby-destination calculations, public detail routes, trip planning, APIs, admin catalog views, SEO metadata, and structured-data rendering without a parallel lighthouse subsystem.

## Deduplication

Port Isabel Lighthouse already existed in the Texas Historical Commission catalog. The lighthouse catalog uses the same canonical slug, and the unified catalog's quality-based deduplication retains one enriched lighthouse record rather than creating a duplicate destination.

## Access classifications

Lighthouse records use explicit access models:

- `public-interior`: regular public access may include the tower interior.
- `public-exterior`: public grounds or exterior viewing, without routine tower access.
- `view-only`: private property; view only from lawful public locations or waterways.
- `remote-restricted`: access depends on boats, conservation rules, closures, weather, tides, or agency authorization.

Every record includes current-source attribution, access notes, tower-access status, reservation guidance, and a last-reviewed date. Public pages should continue to direct travelers to the official source before travel because coastal access and operating conditions can change quickly.

## Catalog maintenance

When adding a lighthouse:

1. Use a stable canonical slug and verify that no existing Explore destination represents the same site.
2. Prefer an official government, site operator, preservation organization, or destination-management source.
3. Record accurate coordinates suitable for map placement.
4. Distinguish public access from distant viewing and private-property restrictions.
5. Add alternate historical names for search discovery.
6. Update regression coverage for duplicates, source URLs, coordinates, and access restrictions.
