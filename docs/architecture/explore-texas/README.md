# Explore Texas Platform Architecture

**Phase I — Texas Knowledge Platform**  
**Step 1 — Master Data Model and Relationship Architecture**

## Status

This work is internal-only and must not be exposed through public routes, navigation, sitemaps, menus, feeds, or launch surfaces until a later release phase.

## Purpose

The Explore Texas platform will support structured content and future applications for Texas lakes, campgrounds, state parks, historic sites, wildlife, plants, birds, fish, activities, regulations, trip planning, printable PDFs, recommendations, search, and contextual advertising.

The architecture follows four rules:

1. **Single source of truth** — facts are stored once and reused everywhere.
2. **Entities before pages** — structured records generate pages, search results, planner output, and PDFs.
3. **Relationships are first-class data** — connections include direction, type, distance, priority, seasonality, sources, and verification.
4. **Soft deletion only** — production records are archived rather than destroyed.

## Documents

- `master-data-model.md` — canonical entity catalog and shared fields.
- `entity-relationship-map.md` — domain-level relationship map and cardinality rules.
- `relationship-catalog.md` — allowed relationship types, metadata, lifecycle, and feature consumers.
- `data-dictionary.md` — field definitions, types, validation rules, and controlled values.

## Release boundary

Phase I Step 1 does not create:

- public pages;
- routes;
- navigation links;
- sitemap entries;
- searchable public indexes;
- advertisements;
- planner UI;
- PDF output;
- external API endpoints.

Those features will consume this architecture in later phases after implementation, testing, editorial review, and launch approval.

## Lifecycle

All Explore Texas content should support:

- `draft`
- `review`
- `verified`
- `published`
- `archived`

Until launch, all new records remain `draft` or `review` and are not publicly discoverable.
