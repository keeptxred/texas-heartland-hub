# Data Dictionary

This document defines shared field contracts for the Explore Texas platform. It is intentionally implementation-neutral so the same rules can drive database schemas, TypeScript types, validation, APIs, search, planner logic, and PDF generation.

## 1. Shared enumerations

### Lifecycle status

| Value | Meaning |
|---|---|
| `draft` | Internal work in progress. |
| `review` | Ready for editorial or factual review. |
| `verified` | Fact-checked but not necessarily public. |
| `published` | Eligible for public use after launch approval. |
| `archived` | Retained but inactive. |

### Visibility

| Value | Meaning |
|---|---|
| `internal` | Never returned by public consumers. |
| `restricted` | Available only to authorized internal tools. |
| `unlisted` | Addressable by internal ID but excluded from discovery. |
| `public` | Eligible for public pages, search, planner, and PDFs. |

### Confidence

| Value | Score guidance |
|---|---:|
| `low` | 0–39 |
| `medium` | 40–69 |
| `high` | 70–89 |
| `authoritative` | 90–100 |

### Relationship strength

`primary`, `direct`, `adjacent`, `nearby`, `regional`, `contextual`

## 2. Universal fields

| Field | Type | Rules |
|---|---|---|
| `id` | UUID | Immutable; generated once. |
| `entityType` | enum | Must match registered entity catalog. |
| `slug` | string | Lowercase kebab-case; unique within entity type; historical slugs preserved as aliases. |
| `name` | string | 1–200 characters. |
| `alternateNames` | string[] | Deduplicated, trimmed. |
| `shortDescription` | string | Plain text; target 80–300 characters. |
| `longDescription` | rich text | Original content; no unsupported claims. |
| `status` | lifecycle enum | Default `draft`. |
| `visibility` | visibility enum | Default `internal`. |
| `featured` | boolean | Default `false`. |
| `latitude` | decimal | -90 through 90. |
| `longitude` | decimal | -180 through 180. |
| `timezone` | string | IANA identifier; Texas default generally `America/Chicago`, but record explicitly where needed. |
| `phone` | string | Store normalized and display forms where possible. |
| `email` | string | Valid email format. |
| `websiteUrl` | URL | HTTPS preferred. |
| `createdAt` | datetime | UTC; immutable. |
| `updatedAt` | datetime | UTC; system maintained. |
| `verifiedAt` | datetime | Required for `verified` and `published`. |
| `lastReviewedAt` | datetime | Editorial review timestamp. |
| `dataQualityScore` | integer | 0–100. |
| `sourceIds` | UUID[] | At least one before verification. |

## 3. Geography fields

| Field | Type | Meaning |
|---|---|---|
| `regionType` | enum | Tourism, ecological, geographic, administrative, or editorial region. |
| `countyFips` | string | Official county identifier where available. |
| `countySeat` | string | Canonical place name. |
| `population` | integer | Must include census/source year. |
| `areaSquareMiles` | decimal | Include source and measurement basis. |
| `boundaryAssetId` | UUID | Polygon or multipolygon map asset. |
| `elevationFeet` | decimal | Source and measurement point required. |

## 4. Destination fields

| Field | Type | Meaning |
|---|---|---|
| `destinationType` | enum | Lake, park, campground, historic site, trail, etc. |
| `officialName` | string | Name used by managing authority. |
| `operatorName` | string | Cached display only; canonical relationship points to organization entity. |
| `reservationRequired` | boolean/unknown | Use `unknown` when not verified. |
| `reservationUrl` | URL | Official booking source preferred. |
| `hoursText` | string | Human-readable summary; structured schedules stored separately. |
| `operatingScheduleId` | UUID | Structured hours and seasonal closures. |
| `feeIds` | UUID[] | References Fee records. |
| `accessibilityNotes` | text | Original, factual description; standardized features use catalog relationships. |
| `emergencyNotes` | text | Must not replace official emergency services or 911 guidance. |

## 5. Lake and reservoir fields

| Field | Type | Validation/meaning |
|---|---|---|
| `waterbodyType` | enum | Natural lake, reservoir, oxbow, playa, coastal lagoon, other. |
| `surfaceAcres` | decimal | Non-negative; include reference water level/date when relevant. |
| `maximumDepthFeet` | decimal | Non-negative; source required. |
| `averageDepthFeet` | decimal | Non-negative; source required. |
| `shorelineMiles` | decimal | Non-negative. |
| `normalPoolElevationFeet` | decimal | Datum must be documented. |
| `damName` | string | Link to separate facility/structure record later if needed. |
| `waterLevelSourceUrl` | URL | Official or authoritative source preferred. |
| `waterClarity` | enum/text | Prefer standardized categories plus notes. |
| `swimmingAllowed` | boolean/unknown | Location-specific exceptions belong in relationships or rules. |

## 6. Park and campground fields

| Field | Type | Validation/meaning |
|---|---|---|
| `acreage` | decimal | Non-negative. |
| `establishedDate` | date/partial date | Support year-only values. |
| `siteCount` | integer | Non-negative; timestamp/source required because counts change. |
| `tentSiteCount` | integer | Non-negative. |
| `rvSiteCount` | integer | Non-negative. |
| `primitiveSiteCount` | integer | Non-negative. |
| `cabinCount` | integer | Non-negative. |
| `maxRvLengthFeet` | decimal | Nullable; source required. |
| `checkInTime` | local time | Include timezone and exceptions. |
| `checkOutTime` | local time | Include timezone and exceptions. |
| `generatorPolicyId` | UUID | References current policy record. |
| `petPolicyId` | UUID | References current policy record. |
| `firePolicyId` | UUID | References current policy record. |
| `quietHoursPolicyId` | UUID | References current policy record. |

## 7. Species fields

| Field | Type | Validation/meaning |
|---|---|---|
| `commonName` | string | Canonical English common name. |
| `scientificName` | string | Binomial/trinomial formatting preserved. |
| `taxonomicFamily` | string | Controlled taxonomy source preferred. |
| `nativeStatus` | enum | Native, introduced, invasive, transient, unknown. |
| `conservationStatus` | enum/text | Include authority and assessment date. |
| `dangerLevel` | enum | None, caution, potentially dangerous, dangerous; editorially reviewed. |
| `identificationNotes` | text | Original description. |
| `habitatNotes` | text | Original description backed by sources. |
| `bestViewingMonths` | month[] | 1–12 values; region/destination differences stored in relationship metadata. |
| `bestFishingMonths` | month[] | Fish only; destination-specific differences remain relational. |
| `protected` | boolean/unknown | Must reference governing law when true. |

## 8. Amenity and facility fields

### Amenity

| Field | Type | Meaning |
|---|---|---|
| `amenityCode` | enum | Stable catalog key such as `restrooms`, `showers`, `playground`. |
| `displayName` | string | Public label. |
| `category` | enum | Sanitation, camping, boating, accessibility, food, connectivity, etc. |

### Facility

| Field | Type | Meaning |
|---|---|---|
| `facilityType` | enum | Restroom, boat ramp, playground, visitor center, etc. |
| `mapLabel` | string | Concise offline-map label. |
| `latitude` / `longitude` | decimal | Required when exact location is claimed. |
| `accessible` | boolean/unknown | Use standardized accessibility relationships for detail. |
| `seasonal` | boolean | Whether availability changes seasonally. |
| `hoursId` | UUID | Structured operating schedule when applicable. |

## 9. Law, regulation, and policy fields

| Field | Type | Meaning |
|---|---|---|
| `authorityId` | UUID | Issuing agency or government entity. |
| `legalType` | enum | Statute, regulation, local rule, site rule, policy, advisory. |
| `citation` | string | Official code, section, order, or rule reference. |
| `summary` | text | Plain-language original summary; not legal advice. |
| `officialTextUrl` | URL | Official source. |
| `effectiveFrom` | date | Required when known. |
| `effectiveThrough` | date | Nullable. |
| `jurisdiction` | enum/entity reference | Statewide, county, city, agency, or destination. |
| `timeSensitive` | boolean | Triggers freshness review. |
| `reviewIntervalDays` | integer | Suggested re-verification interval. |

## 10. Source and verification fields

| Field | Type | Meaning |
|---|---|---|
| `sourceType` | enum | Official agency, government dataset, nonprofit, academic, first-party business, editorial research, other. |
| `authorityLevel` | enum | Authoritative, primary, secondary, supplemental. |
| `title` | string | Source title. |
| `publisher` | string | Issuing organization. |
| `url` | URL | Canonical source URL. |
| `publishedAt` | datetime | When known. |
| `accessedAt` | datetime | Required for web sources. |
| `license` | string | Required for imported media/data where applicable. |
| `claimText` | text | Exact factual claim represented by SourceClaim. |
| `fieldPath` | string | Entity field or relationship supported. |
| `reviewerId` | UUID | Internal reviewer/audit identity. |
| `verificationOutcome` | enum | Confirmed, partially confirmed, rejected, stale, needs review. |

## 11. Planner fields

| Field | Type | Meaning |
|---|---|---|
| `tripLengthDays` | decimal | Supports day trips such as 0.5. |
| `adultCount` | integer | Non-negative. |
| `childCount` | integer | Non-negative. |
| `seniorCount` | integer | Non-negative. |
| `petCount` | integer | Non-negative. |
| `selectedActivityIds` | UUID[] | Activities chosen by traveler. |
| `equipmentOwnedIds` | UUID[] | Boat, kayak, RV, tent, binoculars, etc. |
| `accessibilityNeeds` | enum[] | Controlled catalog; free-text notes optional. |
| `budgetBand` | enum | Free, low, moderate, flexible, custom. |
| `experienceLevel` | enum | Beginner, intermediate, experienced. |
| `travelStartDate` | date | Optional until trip is dated. |
| `travelEndDate` | date | Must not precede start. |
| `offlineGuideRequested` | boolean | Controls generated output. |

## 12. Advertising fields

| Field | Type | Meaning |
|---|---|---|
| `campaignStatus` | enum | Draft, scheduled, active, paused, completed, archived. |
| `startsAt` / `endsAt` | datetime | Campaign eligibility period. |
| `targetRegionIds` | UUID[] | Geographic targeting. |
| `targetDestinationIds` | UUID[] | Specific destination targeting. |
| `targetActivityIds` | UUID[] | Contextual targeting. |
| `placementTypes` | enum[] | Page, planner, PDF, email, other. |
| `sponsoredLabelRequired` | boolean | Must be true for paid placement. |
| `priority` | integer | Applied only after relevance and safety rules. |
| `creativeAssetId` | UUID | Approved ad creative. |

## 13. Null, unknown, and not applicable

The system must distinguish:

- `null` — not yet known or not entered;
- `unknown` — explicitly researched but not confirmed;
- `not_applicable` — the concept does not apply;
- `false` — verified absence or negative answer.

Do not convert missing information into `false`.

## 14. Publication gates

A record cannot become `verified` or `published` unless:

1. required fields are present;
2. required relationships are valid;
3. factual claims have sources;
4. time-sensitive claims have a recent verification record;
5. media licensing is recorded;
6. duplicate detection has passed;
7. safety and legal content has an official source;
8. visibility is explicitly approved.

During Phase I, records remain internal and no public publishing gate is activated.
