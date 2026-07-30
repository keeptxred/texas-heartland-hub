# Relationship Catalog

## 1. Relationship record

Each relationship is stored as its own record rather than as an unstructured array embedded in an entity.

```ts
interface EntityRelationship {
  id: string;
  sourceEntityId: string;
  sourceEntityType: string;
  relationshipType: RelationshipType;
  targetEntityId: string;
  targetEntityType: string;
  inverseRelationshipType?: RelationshipType;
  status: "draft" | "review" | "verified" | "published" | "archived";
  required: boolean;
  strength?: "primary" | "direct" | "adjacent" | "nearby" | "regional" | "contextual";
  priority?: number;
  distanceMiles?: number;
  drivingMinutes?: number;
  walkingMinutes?: number;
  seasonal?: boolean;
  validFrom?: string;
  validThrough?: string;
  confidenceScore?: number;
  sourceIds: string[];
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}
```

## 2. Canonical relationship types

| Type | Direction | Default inverse | Typical cardinality | Description |
|---|---|---|---|---|
| `belongs_to` | child → parent | `contains` | N:1 | Taxonomic, geographic, or catalog membership. |
| `contains` | parent → child | `belongs_to` / `located_within` | 1:N | Physical or logical containment. |
| `located_in` | entity → geography | `contains` | N:N | Geographic jurisdiction or boundary overlap. |
| `located_at` | facility → destination | `contains` | N:1 | Exact physical placement. |
| `located_within` | entity → destination | `contains` | N:1 | Nested destination or property. |
| `near` | entity → entity | `near` | N:N | Geographic proximity without direct adjacency. |
| `adjacent_to` | entity → entity | `adjacent_to` | N:N | Directly bordering or immediately neighboring. |
| `connected_to` | entity → entity | `connected_to` | N:N | Physical, hydrological, trail, or route connection. |
| `managed_by` | destination → organization | `manages` | N:N | Management responsibility. |
| `operated_by` | facility/business → organization | `operates` | N:1 | Day-to-day operation. |
| `issued_by` | rule/document → authority | `issues` | N:1 | Legal or administrative issuer. |
| `governed_by` | entity/activity → rule | `applies_to` | N:N | Governing law, rule, permit, or policy. |
| `applies_to` | rule → entity/activity | `governed_by` | N:N | Scope of a law, regulation, or advisory. |
| `supports` | destination/business → activity | `available_at` / `supported_by` | N:N | Activity or service supported. |
| `offers` | entity → service/product/site type | `offered_by` | N:N | A directly available offering. |
| `requires` | activity/entity → prerequisite | `required_for` | N:N | Equipment, permit, facility, or condition required. |
| `has_amenity` | destination → amenity | `available_at` | N:N | Standardized amenity availability. |
| `provides` | facility → amenity/service | `provided_by` | N:N | Physical facility providing capability. |
| `habitat_for` | destination/habitat → species | `found_at` | N:N | Supported or observed species occurrence. |
| `found_at` | species → destination | `habitat_for` | N:N | Species occurrence. |
| `native_to` | species → region/habitat | `has_native_species` | N:N | Native range. |
| `prefers` | species → habitat | `preferred_by` | N:N | Typical habitat preference. |
| `visible_during` | species/event → season | `features` | N:N | Seasonal visibility. |
| `best_during` | activity/destination → season | `recommended_for` | N:N | Recommended season. |
| `protected_by` | species/site → rule | `protects` | N:N | Legal protection. |
| `associated_with` | entity → topic/person/event | `associated_with` | N:N | Historical or thematic association. |
| `documented_by` | entity/relationship → source | `documents` | N:N | Provenance. |
| `supersedes` | rule → prior rule | `superseded_by` | N:N | Regulatory replacement. |
| `observes` | observation → species | `observed_in` | N:1 | Observation target. |
| `recorded_at` | observation → destination | `has_observation` | N:1 | Observation location. |
| `targets` | campaign/rule → audience/entity | `targeted_by` | N:N | Advertising or planner targeting. |
| `visits` | trip stop → destination | `visited_by` | N:1 | Planned visit. |
| `contains_stop` | trip plan → trip stop | `belongs_to_trip` | 1:N | Itinerary structure. |
| `generated_from` | guide → trip plan | `generates` | N:1 | Generated output lineage. |
| `references` | guide section → entity/source | `referenced_by` | N:N | Content attribution. |
| `promotes` | promotion → business/offer | `promoted_by` | N:1 | Paid or affiliate promotion. |

## 3. Metadata requirements

### Required on every relationship

- relationship ID;
- source entity ID and type;
- target entity ID and type;
- canonical relationship type;
- lifecycle status;
- source references;
- creation and update timestamps.

### Required before verification

- at least one authoritative or independently credible source;
- `verifiedAt` date;
- confidence score;
- reviewer or verification record;
- valid geographic or logical target.

### Required for proximity relationships

At least one of:

- straight-line distance;
- driving distance;
- estimated travel time;
- explicit adjacency evidence.

### Required for time-sensitive relationships

- `validFrom` when known;
- `validThrough` when known;
- seasonal flag when recurring;
- source and last verification date.

## 4. Required versus optional rules

A relationship can be required by entity type without requiring a specific target count beyond the minimum.

Examples:

- Every destination must be `located_in` at least one county and region.
- Every verified destination must be `managed_by` or `operated_by` at least one organization when applicable.
- Every verified destination must be `documented_by` at least one source.
- Every campground must be `operated_by` an agency or business.
- A lake may have zero known marinas, so `contains -> Marina` is optional.
- A species may have no verified destination occurrence yet, so `found_at` is optional.
- A historic site must be `associated_with` at least one era, event, person, or topic.

## 5. Delete and archival behavior

### General rule

Hard deletion is allowed only for never-published test records with no inbound references, source claims, observations, generated guides, or ad records.

All other records use soft archival.

### Entity archival

When an entity is archived:

1. retain the record and permanent ID;
2. set `status = archived`;
3. set `archivedAt` and reason;
4. deactivate outward and inward public-facing relationships;
5. preserve historical observations, claims, generated guides, analytics, and sponsorship records;
6. exclude it from new planner recommendations and public search unless historical results are explicitly requested.

### Relationship archival

When a relationship becomes invalid:

- set `status = archived`;
- set `validThrough` when the ending date is known;
- retain sources and verification history;
- create a replacement relationship when appropriate;
- never overwrite historic distance, operator, regulation, or seasonal facts without preserving history.

### Specific behaviors

| Record | Behavior |
|---|---|
| Closed business | Mark `closed` or `archived`; retain past guide/ad references. |
| Renamed destination | Keep same ID; update canonical name and add old name to alternate names. |
| Superseded law | Archive prior applicability or link via `supersedes`; retain historical effective dates. |
| Removed facility | Archive facility and its `located_at` relationship; keep historical map references. |
| Erroneous duplicate | Merge into canonical record and retain redirect/alias metadata internally. |
| Species observation | Never delete except confirmed spam or data corruption; mark disputed or invalidated. |

## 6. Relationship strength and ranking

| Strength | Meaning | Typical use |
|---|---|---|
| `primary` | Defining relationship | Main county, containing park, primary operator. |
| `direct` | Strong explicit connection | On-site campground, official boat ramp. |
| `adjacent` | Shares a boundary or entrance area | Park beside a lake. |
| `nearby` | Useful local proximity | Bait shop or hospital within planner radius. |
| `regional` | Broader-area relevance | Historic destination included in a regional road trip. |
| `contextual` | Relevant by topic rather than location | Statewide fishing law or species guide. |

Suggested recommendation score inputs:

- relationship strength;
- distance/travel time;
- source authority;
- verification freshness;
- seasonality;
- user activity match;
- amenity match;
- accessibility match;
- sponsor eligibility, applied only after relevance and disclosure requirements.

## 7. Feature consumers

### Search

Uses:

- `located_in`, `near`, `contains`, `supports`, `has_amenity`, `habitat_for`, `found_at`, `best_during`, `governed_by`.

Examples:

- lakes with bass and public boat ramps near Houston;
- campgrounds with showers, playgrounds, and electric hookups;
- historic sites near a selected state park;
- spring wildflower destinations.

### Destination pages

Uses:

- geography, management, contained facilities, activities, amenities, species, rules, nearby services, media, and sources.

### Planner logic

Uses:

- `visits`, `supports`, `requires`, `has_amenity`, `near`, `governed_by`, `best_during`, `habitat_for`, and emergency-service proximity.

### PDFs and offline guides

Uses:

- destination facts;
- exact facility locations;
- maps;
- activities and packing requirements;
- laws and safety notices;
- wildlife checklists;
- contacts and nearby services;
- source/verification dates;
- optional contextually relevant ad placements.

### Advertisements

Uses:

- activity match;
- geographic proximity;
- destination and trip type;
- business category;
- campaign dates;
- placement eligibility;
- sponsorship disclosure.

Advertising relationships must never alter factual ranking, emergency guidance, legal information, or safety recommendations.

## 8. Example relationship records

Illustrative only; facts require official verification before publication.

```json
{
  "sourceEntityType": "Lake",
  "sourceEntityId": "lake-livingston",
  "relationshipType": "adjacent_to",
  "targetEntityType": "StatePark",
  "targetEntityId": "lake-livingston-state-park",
  "strength": "direct",
  "required": false,
  "status": "draft",
  "sourceIds": ["official-source-placeholder"]
}
```

```json
{
  "sourceEntityType": "StatePark",
  "sourceEntityId": "garner-state-park",
  "relationshipType": "supports",
  "targetEntityType": "Activity",
  "targetEntityId": "camping",
  "strength": "primary",
  "required": false,
  "status": "draft",
  "sourceIds": ["official-source-placeholder"]
}
```

```json
{
  "sourceEntityType": "HistoricSite",
  "sourceEntityId": "san-jacinto-battleground",
  "relationshipType": "associated_with",
  "targetEntityType": "HistoricalEvent",
  "targetEntityId": "battle-of-san-jacinto",
  "strength": "primary",
  "required": true,
  "status": "draft",
  "sourceIds": ["official-source-placeholder"]
}
```
