# Master Data Model

## 1. Shared base entity

Every first-class entity should inherit or compose these fields.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | UUID | Yes | Immutable primary key. |
| `entityType` | enum | Yes | Canonical entity type. |
| `slug` | string | Yes | Unique within entity type. |
| `name` | string | Yes | Canonical display name. |
| `alternateNames` | string[] | No | Historical, local, and alternate spellings. |
| `shortDescription` | string | No | Search/result summary. |
| `longDescription` | rich text | No | Original editorial description. |
| `status` | lifecycle enum | Yes | Defaults to `draft`. |
| `visibility` | enum | Yes | Defaults to `internal`. |
| `featured` | boolean | Yes | Defaults to `false`. |
| `latitude` | decimal | No | WGS84. |
| `longitude` | decimal | No | WGS84. |
| `addressId` | UUID | No | References an Address. |
| `regionIds` | UUID[] | No | Many-to-many where boundaries overlap. |
| `countyIds` | UUID[] | No | Supports destinations spanning counties. |
| `cityIds` | UUID[] | No | Nearby or containing municipalities. |
| `timezone` | string | No | IANA timezone. |
| `phone` | string | No | Normalized E.164 where possible. |
| `email` | string | No | Public contact address. |
| `websiteUrl` | URL | No | Official source preferred. |
| `heroMediaId` | UUID | No | References Media. |
| `createdAt` | datetime | Yes | System managed. |
| `updatedAt` | datetime | Yes | System managed. |
| `verifiedAt` | datetime | No | Last factual verification. |
| `lastReviewedAt` | datetime | No | Last editorial review. |
| `dataQualityScore` | integer 0–100 | No | Derived or editorial score. |
| `sourceIds` | UUID[] | Yes | At least one source before verification. |

## 2. Entity domains

### Geography

- `Region`
- `County`
- `City`
- `Community`
- `ZipCode`
- `Address`
- `CoordinatePoint`
- `Boundary`

### Destinations

- `Lake`
- `River`
- `Reservoir`
- `StatePark`
- `NationalPark`
- `CountyPark`
- `CityPark`
- `Campground`
- `HistoricSite`
- `Museum`
- `WildlifeManagementArea`
- `WildlifeRefuge`
- `ScenicDrive`
- `Trail`
- `Beach`
- `Waterfall`
- `Cave`
- `NaturalArea`

### Facilities and physical points of interest

- `Facility`
- `RestroomFacility`
- `Playground`
- `VisitorCenter`
- `BoatRamp`
- `Marina`
- `FishingPier`
- `SwimmingArea`
- `PicnicArea`
- `ObservationArea`
- `KayakLaunch`
- `Trailhead`
- `ParkingArea`
- `CampStore`
- `EmergencyStation`

### Nature and taxonomy

- `Species`
- `FishSpecies`
- `BirdSpecies`
- `MammalSpecies`
- `ReptileSpecies`
- `AmphibianSpecies`
- `InsectSpecies`
- `ButterflySpecies`
- `WildflowerSpecies`
- `TreeSpecies`
- `ShrubSpecies`
- `GrassSpecies`
- `Habitat`
- `SpeciesObservation`

### Recreation

- `Activity`
- `ActivityAvailability`
- `EquipmentItem`
- `ExperienceLevel`
- `Season`
- `Event`
- `GuidedTour`
- `TrailCondition`
- `FishingOpportunity`

### Camping

- `Campsite`
- `CampsiteType`
- `HookupType`
- `ReservationPolicy`
- `Fee`
- `OperatingSchedule`
- `QuietHoursPolicy`
- `GeneratorPolicy`
- `PetPolicy`
- `FirePolicy`

### Businesses and nearby services

- `Business`
- `BusinessCategory`
- `Restaurant`
- `Lodging`
- `CabinRental`
- `PrivateRvPark`
- `BoatRental`
- `FishingGuide`
- `HuntingGuide`
- `BaitShop`
- `SportingGoodsStore`
- `GasStation`
- `GroceryStore`
- `Hospital`
- `UrgentCare`
- `Veterinarian`
- `Pharmacy`

### Government and administration

- `Agency`
- `Office`
- `EmergencyService`
- `LawEnforcementOffice`
- `VisitorBureau`
- `ManagingOrganization`
- `Contact`

### Laws, rules, and safety

- `Law`
- `Regulation`
- `Rule`
- `PermitRequirement`
- `LicenseRequirement`
- `Advisory`
- `SafetyNotice`
- `Closure`
- `BurnBan`
- `WeatherAlert`
- `BagLimit`
- `SizeLimit`

### Content, media, and provenance

- `Source`
- `SourceClaim`
- `VerificationRecord`
- `Media`
- `MediaLicense`
- `MapAsset`
- `DocumentAsset`
- `AudioAsset`
- `VideoAsset`
- `EditorialNote`

### Planner and generated output

- `TripPlan`
- `TripStop`
- `TravelerProfile`
- `TripPreference`
- `PackingItem`
- `ChecklistItem`
- `PlannerRule`
- `Recommendation`
- `GeneratedGuide`
- `GuideSection`
- `PdfTemplate`
- `QrCodeTarget`

### Advertising and monetization

- `Advertiser`
- `AdCampaign`
- `AdCreative`
- `AdPlacement`
- `Sponsorship`
- `AffiliateOffer`
- `BusinessPromotion`

## 3. Specialized entity fields

### Lake / Reservoir

- waterbody type;
- surface acres;
- maximum and average depth;
- shoreline miles;
- elevation;
- inflow and outflow;
- dam information;
- managing organizations;
- water-level source;
- water clarity;
- boating restrictions;
- swimming designation;
- related ramps, marinas, campgrounds, parks, species, and regulations.

### Park

- park classification;
- acreage;
- established date;
- managing agency;
- entrance and day-use fees;
- reservation requirements;
- operating hours;
- camping inventory;
- activities;
- facilities;
- accessibility;
- trails;
- wildlife and plants;
- site-specific rules.

### Campground

- operator;
- containing destination;
- site count;
- campsite types;
- RV length limits;
- hookup availability;
- check-in/check-out;
- reservation system;
- fees;
- generator, fire, pet, and quiet-hours policies;
- restrooms, showers, water, dump station, laundry, and connectivity.

### Historic site

- official designation;
- historical era;
- associated events and people;
- date built/established;
- managing organization;
- museum/tour availability;
- admission;
- hours;
- photography, preservation, and site rules.

### Species

- common and scientific names;
- taxonomy;
- native/introduced status;
- conservation status;
- habitat;
- seasonality;
- identification details;
- behavior;
- viewing or catch guidance;
- safety significance;
- legal protections;
- destination occurrence records.

## 4. Controlled catalogs

The following should be centrally managed catalogs rather than free-text fields:

- entity types;
- lifecycle statuses;
- visibility statuses;
- relationship types;
- activity types;
- amenity types;
- facility types;
- business categories;
- species categories;
- habitat types;
- fee types;
- permit and license types;
- rule and regulation categories;
- source authority levels;
- confidence levels;
- accessibility features;
- ad placement types.

## 5. Core architecture constraints

1. Amenities describe capabilities; Facilities describe actual mapped places.
2. Species master records are not duplicated across destinations.
3. Destination-specific occurrence data belongs in `SpeciesObservation` or a destination-species relationship.
4. Statewide law records are referenced by destinations and activities; local exceptions are separate records.
5. Every verified factual claim must have at least one source and a verification date.
6. Public eligibility requires `status = published` and `visibility = public`; neither is used during this phase.
7. Hard deletion is prohibited for records that have been published, referenced, observed, used in a generated guide, or attached to an advertisement record.
