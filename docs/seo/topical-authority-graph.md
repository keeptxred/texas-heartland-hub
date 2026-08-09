# Keep TX Red topical authority graph

Keep TX Red uses nine canonical editorial pillars. `src/lib/content-pillars.ts` is the single source of truth for pillar names, canonical hub URLs, classification signals, subtopics, and cross-pillar relationships.

## Canonical pillars

1. Texas Politics & Government
2. Texas Elections
3. Texas Border & Immigration
4. Texas Energy & Oil
5. Texas Economy & Small Business
6. Texas Agriculture & Rural Texas
7. Texas Veterans & Military
8. Texas Law Enforcement & Public Safety
9. Texas Laws & Legislature

## Rules

- Every pillar has exactly one canonical hub URL.
- New topical aliases must point to the canonical hub rather than creating competing indexable hubs.
- Article/feed classification uses the same pillar slugs. Persisted classifications win over later keyword drift.
- A story may have one primary pillar and up to two secondary pillar relationships; the primary must remain first.
- Pillar pages must expose their defined subtopics and intentional related-pillar links.
- Cross-pillar links are editorial relationships, not a generic all-to-all footer. Related links must come from the central `related` graph.
- Geography is a secondary dimension. Houston, DFW, Austin, San Antonio, El Paso, RGV, West Texas, East Texas, and other locations should not replace the article's topical pillar.
- People, agencies, bills, courts, elections, offices, and other entities remain article-level relationships and should be represented in structured data when the article has verified entity data.
- The `/topics` page is the public map of the graph and should remain indexable and canonical.

## Implementation contract

Use `classifyContentPillar()` when a single primary topic is needed. Use `classifyContentPillars()` when a feature can represent secondary relationships. Use `getRelatedContentPillars()` for internal-link recommendations and `getContentPillarByHref()` when a route needs to resolve canonical pillar ownership.

Tests in `src/lib/content-pillars.test.ts` guard classification, canonical href ownership, multi-topic ordering, subtopic completeness, and graph connectivity.
