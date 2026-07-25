# Entity Relationship Map

## 1. Relationship notation

- `1:1` — one-to-one
- `1:N` — one-to-many
- `N:1` — many-to-one
- `N:N` — many-to-many
- **Required** means the relationship must exist before an entity can become verified or published.
- **Optional** means the relationship may be absent without invalidating the entity.

## 2. Domain map

```text
Region ──contains──> County ──contains──> City/Community
  │                     │                    │
  └──contains──────────> Destinations <────near──── Businesses/Services
                              │
              ┌───────────────┼────────────────┐
              │               │                │
          contains         supports        habitat_for
              │               │                │
         Facilities       Activities         Species
              │               │                │
              └────governed_by Laws/Rules──────┘
                              │
                         documented_by
                              │
                           Sources
```

## 3. Geography relationships

| Source | Relationship | Target | Cardinality | Required |
|---|---|---|---|---:|
| Region | `contains` | County | 1:N | Yes |
| County | `belongs_to` | Region | N:1 | Yes |
| County | `contains` | City | 1:N | No |
| City | `located_in` | County | N:1 | Yes |
| Destination | `located_in` | County | N:N | Yes |
| Destination | `located_in` | Region | N:N | Yes |
| Destination | `near` | City | N:N | No |
| Business | `located_in` | City | N:1 | No |
| Facility | `located_at` | Destination | N:1 | Yes |

## 4. Destination relationships

### Lake and reservoir

| Relationship | Target | Cardinality | Required |
|---|---|---|---:|
| `located_in` | County | N:N | Yes |
| `near` | City | N:N | No |
| `managed_by` | Agency/Organization | N:N | Yes |
| `contains` | BoatRamp/Marina/Pier/SwimmingArea | 1:N | No |
| `adjacent_to` | Park/Campground/Business | N:N | No |
| `supports` | Activity | N:N | Yes |
| `has_amenity` | Amenity | N:N | No |
| `habitat_for` | Species | N:N | No |
| `governed_by` | Law/Regulation/Rule | N:N | Yes |
| `documented_by` | Source | N:N | Yes |

### Park and natural area

| Relationship | Target | Cardinality | Required |
|---|---|---|---:|
| `located_in` | County/Region | N:N | Yes |
| `managed_by` | Agency | N:N | Yes |
| `contains` | Campground/Trail/Facility/Waterbody | 1:N | No |
| `supports` | Activity | N:N | Yes |
| `has_amenity` | Amenity | N:N | No |
| `habitat_for` | Species | N:N | No |
| `associated_with` | HistoricSite/Event/Person | N:N | No |
| `governed_by` | Regulation/Rule | N:N | Yes |
| `near` | Business/EmergencyService | N:N | No |

### Campground

| Relationship | Target | Cardinality | Required |
|---|---|---|---:|
| `located_within` | Park/Lake/NaturalArea | N:1 | No |
| `located_in` | County/City | N:N | Yes |
| `operated_by` | Agency/Business | N:1 | Yes |
| `contains` | Campsite/Facility | 1:N | No |
| `offers` | CampsiteType/HookupType | N:N | Yes |
| `supports` | Activity | N:N | No |
| `has_amenity` | Amenity | N:N | No |
| `governed_by` | Reservation/Fire/Pet/Generator/QuietHours Policy | N:N | Yes |
| `near` | Business/EmergencyService | N:N | No |

### Historic site and museum

| Relationship | Target | Cardinality | Required |
|---|---|---|---:|
| `located_in` | City/County | N:N | Yes |
| `managed_by` | Agency/Organization | N:N | Yes |
| `associated_with` | Era/Event/Person/Topic | N:N | Yes |
| `contains` | Museum/VisitorCenter/Facility | 1:N | No |
| `offers` | GuidedTour/Activity | N:N | No |
| `governed_by` | SiteRule/PreservationRule | N:N | No |
| `near` | Destination/Business | N:N | No |

## 5. Nature relationships

| Source | Relationship | Target | Cardinality | Required |
|---|---|---|---:|---:|
| Species | `belongs_to` | SpeciesCategory/Taxon | N:1 | Yes |
| Species | `native_to` | Region/Habitat | N:N | No |
| Species | `found_at` | Destination | N:N | No |
| Species | `prefers` | Habitat | N:N | No |
| Species | `visible_during` | Season | N:N | No |
| Species | `protected_by` | Law/Regulation | N:N | No |
| Species | `associated_with` | Activity | N:N | No |
| SpeciesObservation | `observes` | Species | N:1 | Yes |
| SpeciesObservation | `recorded_at` | Destination | N:1 | Yes |
| SpeciesObservation | `documented_by` | Source | N:N | Yes |

## 6. Activity and amenity relationships

| Source | Relationship | Target | Cardinality | Required |
|---|---|---|---:|---:|
| Activity | `available_at` | Destination | N:N | No |
| Activity | `requires` | Equipment/Permit/Facility | N:N | No |
| Activity | `governed_by` | Law/Regulation | N:N | No |
| Activity | `appropriate_for` | ExperienceLevel | N:N | No |
| Activity | `best_during` | Season | N:N | No |
| Amenity | `available_at` | Destination/Campground | N:N | No |
| Facility | `provides` | Amenity | N:N | Yes |
| Facility | `located_at` | Destination | N:1 | Yes |

## 7. Business, service, and advertising relationships

| Source | Relationship | Target | Cardinality | Required |
|---|---|---|---:|---:|
| Business | `belongs_to` | BusinessCategory | N:1 | Yes |
| Business | `located_in` | City/County | N:N | Yes |
| Business | `near` | Destination | N:N | No |
| Business | `supports` | Activity | N:N | No |
| Business | `offers` | Service | N:N | No |
| Advertiser | `operates` | AdCampaign | 1:N | No |
| AdCampaign | `uses` | AdCreative | 1:N | Yes |
| AdCampaign | `targets` | Destination/Activity/Region/Audience | N:N | No |
| AdPlacement | `appears_in` | Page/PDF/PlannerSection | N:N | Yes |
| BusinessPromotion | `promotes` | Business | N:1 | Yes |

## 8. Government, laws, and source relationships

| Source | Relationship | Target | Cardinality | Required |
|---|---|---|---:|---:|
| Agency | `manages` | Destination | N:N | No |
| Agency | `issues` | Law/Regulation/Advisory | 1:N | No |
| Law/Regulation | `applies_to` | Destination/Activity/Species | N:N | Yes |
| Law/Regulation | `effective_during` | DateRange/Season | N:N | No |
| Law/Regulation | `supersedes` | Law/Regulation | N:N | No |
| Source | `supports_claim` | SourceClaim | 1:N | Yes |
| SourceClaim | `describes` | Entity/Relationship/Field | N:1 | Yes |
| VerificationRecord | `verifies` | Entity/Relationship/Claim | N:1 | Yes |

## 9. Planner and output relationships

| Source | Relationship | Target | Cardinality | Required |
|---|---|---|---:|---:|
| TripPlan | `belongs_to` | TravelerProfile | N:1 | No |
| TripPlan | `contains` | TripStop | 1:N | Yes |
| TripStop | `visits` | Destination | N:1 | Yes |
| TripPlan | `selects` | Activity/Preference | N:N | No |
| PlannerRule | `matches` | Preference/EntityRelationship | N:N | Yes |
| Recommendation | `recommends` | Destination/Business/Activity | N:1 | Yes |
| GeneratedGuide | `generated_from` | TripPlan | N:1 | Yes |
| GeneratedGuide | `contains` | GuideSection | 1:N | Yes |
| GuideSection | `references` | Entity/Relationship/Source | N:N | No |
| GeneratedGuide | `uses` | PdfTemplate | N:1 | Yes |

## 10. Real Texas examples

These examples are illustrative and must be verified against official sources before publication.

### Lake Livingston

```text
Lake Livingston
  located_in -> Polk County, San Jacinto County, Trinity County, Walker County
  adjacent_to -> Lake Livingston State Park
  supports -> fishing, boating, kayaking, camping
  habitat_for -> largemouth bass, white bass, crappie, catfish
  governed_by -> statewide fishing and boating regulations plus applicable local rules
  near -> Livingston and nearby campgrounds, marinas, fuel, groceries, and emergency care
```

### Garner State Park

```text
Garner State Park
  located_in -> Uvalde County
  contains -> campgrounds, trails, visitor facilities, river access
  supports -> camping, hiking, swimming, paddling, wildlife viewing
  managed_by -> Texas Parks and Wildlife Department
  governed_by -> state park rules and site-specific notices
```

### Enchanted Rock State Natural Area

```text
Enchanted Rock State Natural Area
  located_in -> Gillespie and Llano counties
  supports -> hiking, climbing, photography, stargazing
  habitat_for -> regional birds, mammals, reptiles, and native plants
  governed_by -> natural-area rules, climbing rules, pet rules, and fire restrictions
```

### San Jacinto Battleground State Historic Site

```text
San Jacinto Battleground State Historic Site
  located_in -> Harris County
  associated_with -> Battle of San Jacinto and Texas Revolution history
  contains -> monument, museum, visitor facilities, and grounds
  managed_by -> applicable Texas state authority
  near -> Houston-area lodging, restaurants, and other historic destinations
```

## 11. Feature consumption map

| Relationship family | Search | Destination pages | Planner | PDF | Advertising |
|---|---:|---:|---:|---:|---:|
| Geography/location | Yes | Yes | Yes | Yes | Yes |
| Destination containment | Yes | Yes | Yes | Yes | Limited |
| Activities | Yes | Yes | Yes | Yes | Yes |
| Amenities/facilities | Yes | Yes | Yes | Yes | Yes |
| Species/habitats | Yes | Yes | Yes | Yes | Yes |
| Laws/rules | Yes | Yes | Yes | Yes | No |
| Nearby businesses/services | Yes | Yes | Yes | Yes | Yes |
| Sources/verification | Internal | Yes | Internal | Yes | No |
| Seasonality | Yes | Yes | Yes | Yes | Yes |
| Sponsorship/ad targeting | No | Limited | Limited | Yes | Yes |
