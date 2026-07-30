export type CommercialCavernVerificationStatus =
  | "official-source-reviewed"
  | "needs-review"
  | "unverified";

export type CommercialCavernMediaStatus =
  | "awaiting-approved-asset"
  | "approved"
  | "not-required";

export type CommercialCavernCatalogRecord = {
  id: string;
  slug: string;
  name: string;
  city: string;
  county: string;
  region: string;
  latitude: number;
  longitude: number;
  officialUrl: string;
  summary: string;
  admission_required: boolean;
  reservations_recommended: boolean;
  guided_tours: boolean;
  duration: string;
  accessibility: string;
  minimum_age: number | null;
  pet_policy: string;
  operating_season: string;
  operator: string;
  activities: string[];
  amenities: string[];
  categories: string[];
  tags: string[];
  experience_type: string;
  geology: string;
  family_friendly: boolean;
  photography: string;
  educational: boolean;
  image_url: string | null;
  image_alt: string;
  image_credit: string | null;
  image_source_url: string | null;
  image_license: string | null;
  media_status: CommercialCavernMediaStatus;
  source_attribution: string;
  verification_status: CommercialCavernVerificationStatus;
  last_reviewed: string;
};

export const commercialCavernCatalog: CommercialCavernCatalogRecord[] = [
  {
    id: "commercial-cavern-natural-bridge-caverns",
    slug: "natural-bridge-caverns",
    name: "Natural Bridge Caverns",
    city: "San Antonio",
    county: "Comal County",
    region: "Hill Country",
    latitude: 29.692,
    longitude: -98.3425,
    officialUrl: "https://naturalbridgecaverns.com/",
    summary:
      "Explore Texas' largest commercial cavern system, known for active limestone formations, expansive underground chambers, and guided tours beneath the Hill Country.",
    admission_required: true,
    reservations_recommended: true,
    guided_tours: true,
    duration: "Approximately 60 to 75 minutes for standard cavern tours",
    accessibility:
      "Cavern tours include stairs, steep grades, wet surfaces, and restrictive natural passages and are not wheelchair or stroller accessible.",
    minimum_age: null,
    pet_policy:
      "Leashed pets are permitted on outdoor park grounds; only ADA-recognized service animals are permitted on cavern tours or inside buildings.",
    operating_season: "Year-round, with tour schedules and park hours varying by date",
    operator: "Natural Bridge Caverns",
    activities: [
      "Guided cavern tours",
      "Canopy and ropes-course adventures",
      "Gem and mineral mining",
      "Outdoor maze",
      "Seasonal bat-viewing experiences",
    ],
    amenities: [
      "Visitor center",
      "Food service",
      "Gift shop",
      "Restrooms",
      "On-site parking",
      "Picnic areas",
    ],
    categories: ["Commercial cavern", "Geological attraction", "Family attraction"],
    tags: [
      "limestone cavern",
      "show cave",
      "underground tour",
      "formations",
      "family adventure",
      "Hill Country",
    ],
    experience_type: "Large-scale guided show-cave and outdoor adventure attraction",
    geology:
      "Active limestone cave system with large chambers, stalactites, stalagmites, flowstone, columns, and other calcite formations.",
    family_friendly: true,
    photography:
      "Personal photography is generally suitable on standard tours, subject to guide instructions, lighting limits, and restrictions on equipment or flash.",
    educational: true,
    image_url: null,
    image_alt:
      "Illuminated limestone formations and a large underground chamber at Natural Bridge Caverns near San Antonio, Texas.",
    image_credit: null,
    image_source_url: null,
    image_license: null,
    media_status: "awaiting-approved-asset",
    source_attribution: "Natural Bridge Caverns official website",
    verification_status: "official-source-reviewed",
    last_reviewed: "2026-07-26",
  },
  {
    id: "commercial-cavern-inner-space-cavern",
    slug: "inner-space-cavern",
    name: "Inner Space Cavern",
    city: "Georgetown",
    county: "Williamson County",
    region: "Hill Country",
    latitude: 30.5821,
    longitude: -97.6895,
    officialUrl: "https://innerspacecavern.com/",
    summary:
      "Tour a well-preserved limestone cavern discovered during Interstate 35 construction, featuring large rooms, growing formations, and prehistoric animal remains.",
    admission_required: true,
    reservations_recommended: false,
    guided_tours: true,
    duration: "Approximately 60 to 75 minutes for the standard Adventure Tour",
    accessibility:
      "The cavern has steep and uneven slopes and does not permit wheelchairs, strollers, or other wheeled devices; surface facilities are wheelchair accessible.",
    minimum_age: null,
    pet_policy: "Only ADA-recognized service animals are permitted in the cavern.",
    operating_season:
      "Year-round except Thanksgiving, Christmas Eve, Christmas Day, and Easter Day",
    operator: "Inner Space Cavern",
    activities: [
      "Guided cavern tours",
      "Geology interpretation",
      "Fossil and prehistoric-life interpretation",
      "Gem and mineral mining",
    ],
    amenities: [
      "Visitor center",
      "Gift shop",
      "Snack service",
      "Restrooms",
      "On-site parking",
    ],
    categories: ["Commercial cavern", "Geological attraction", "Educational attraction"],
    tags: [
      "limestone cavern",
      "show cave",
      "prehistoric fossils",
      "living formations",
      "underground tour",
      "Georgetown",
    ],
    experience_type: "Guided show-cave tour with geology and paleontology interpretation",
    geology:
      "Limestone cave with active calcite formations, broad chambers, flowstone, stalactites, stalagmites, and preserved prehistoric animal remains.",
    family_friendly: true,
    photography:
      "Personal handheld photography is generally appropriate on public tours when it does not delay the group; visitors should follow guide instructions.",
    educational: true,
    image_url: null,
    image_alt:
      "Calcite formations and a guided passage inside Inner Space Cavern in Georgetown, Texas.",
    image_credit: null,
    image_source_url: null,
    image_license: null,
    media_status: "awaiting-approved-asset",
    source_attribution: "Inner Space Cavern official website",
    verification_status: "official-source-reviewed",
    last_reviewed: "2026-07-26",
  },
  {
    id: "commercial-cavern-caverns-of-sonora",
    slug: "caverns-of-sonora",
    name: "Caverns of Sonora",
    city: "Sonora",
    county: "Sutton County",
    region: "West Texas",
    latitude: 30.55495,
    longitude: -100.812217,
    officialUrl: "https://www.cavernsofsonora.com/",
    summary:
      "Discover an internationally recognized West Texas show cave celebrated for exceptionally dense crystal formations and intimate guided underground tours.",
    admission_required: true,
    reservations_recommended: true,
    guided_tours: true,
    duration: "Approximately 1 hour 45 minutes for the Crystal Palace Tour",
    accessibility:
      "The standard tour descends 155 feet and includes approximately 360 stair steps; visitors should be able to manage extensive stairs and walking.",
    minimum_age: null,
    pet_policy:
      "Animals are not permitted in the cave; free on-site kennels are available.",
    operating_season: "Open daily year-round except Christmas Day",
    operator: "Caverns of Sonora",
    activities: [
      "Guided cavern tours",
      "Formation photography",
      "Geology interpretation",
      "Camping",
      "Wildlife observation on the grounds",
    ],
    amenities: [
      "Visitor center",
      "Gift shop",
      "Restrooms",
      "On-site parking",
      "Tent and RV camping",
      "Pet kennels",
    ],
    categories: ["Commercial cavern", "Geological attraction", "West Texas destination"],
    tags: [
      "crystal formations",
      "show cave",
      "calcite",
      "underground tour",
      "camping",
      "West Texas",
    ],
    experience_type: "Intimate guided crystal-cavern tour with extensive stair travel",
    geology:
      "Highly decorated limestone cave known for dense calcite crystal formations, helictites, soda straws, flowstone, and delicate speleothems.",
    family_friendly: true,
    photography:
      "Personal photography is a notable part of the visitor experience, but tripods, large equipment, and activities that delay the tour may be restricted.",
    educational: true,
    image_url: null,
    image_alt:
      "Dense white calcite crystals and delicate cave formations inside the Caverns of Sonora in West Texas.",
    image_credit: null,
    image_source_url: null,
    image_license: null,
    media_status: "awaiting-approved-asset",
    source_attribution: "Caverns of Sonora official website",
    verification_status: "official-source-reviewed",
    last_reviewed: "2026-07-26",
  },
  {
    id: "commercial-cavern-cave-without-a-name",
    slug: "cave-without-a-name",
    name: "Cave Without a Name",
    city: "Boerne",
    county: "Kendall County",
    region: "Hill Country",
    latitude: 29.882355,
    longitude: -98.630531,
    officialUrl: "https://www.cavewithoutaname.com/",
    summary:
      "Visit a living Hill Country cavern with six major rooms, abundant stalactites and flowstone, and a renowned underground chamber used for special events.",
    admission_required: true,
    reservations_recommended: true,
    guided_tours: true,
    duration: "Approximately 60 minutes",
    accessibility:
      "Cavern entry and exit require 126 steps with handrails and landings; there is no wheelchair access to the cave.",
    minimum_age: null,
    pet_policy:
      "No general pet policy is published for cavern tours; contact the operator before visiting with an animal.",
    operating_season:
      "Year-round, with additional tour times from Memorial Day through Labor Day",
    operator: "Cave Without a Name",
    activities: [
      "Guided cavern tours",
      "Underground concerts and special events",
      "Geology interpretation",
      "Nature exploration",
    ],
    amenities: [
      "Visitor center",
      "Gift shop",
      "Restrooms",
      "On-site parking",
      "Outdoor gathering areas",
    ],
    categories: ["Commercial cavern", "Geological attraction", "Underground event venue"],
    tags: [
      "living cave",
      "underground concert",
      "stalactites",
      "flowstone",
      "show cave",
      "Boerne",
    ],
    experience_type: "Guided living-cave tour and underground cultural-event venue",
    geology:
      "Living limestone cavern with six principal rooms containing stalactites, stalagmites, flowstone, rimstone dams, columns, and drapery formations.",
    family_friendly: true,
    photography:
      "Personal photography is generally compatible with public tours and events, subject to guide, performer, flash, and equipment restrictions.",
    educational: true,
    image_url: null,
    image_alt:
      "Stalactites, flowstone, and a spacious underground chamber inside Cave Without a Name near Boerne, Texas.",
    image_credit: null,
    image_source_url: null,
    image_license: null,
    media_status: "awaiting-approved-asset",
    source_attribution: "Cave Without a Name official website",
    verification_status: "official-source-reviewed",
    last_reviewed: "2026-07-26",
  },
  {
    id: "commercial-cavern-cascade-caverns",
    slug: "cascade-caverns",
    name: "Cascade Caverns",
    city: "Boerne",
    county: "Kendall County",
    region: "Hill Country",
    latitude: 29.76369,
    longitude: -98.67889,
    officialUrl: "https://www.cascadecaverns.com/",
    summary:
      "Explore one of Texas' oldest touring caves, where guided routes descend through limestone passages, historic rooms, and an active underground ecosystem.",
    admission_required: true,
    reservations_recommended: true,
    guided_tours: true,
    duration: "Approximately 45 to 60 minutes for the standard tour",
    accessibility:
      "The cave has a long descending stairway, low-clearance sections, and no elevator and is not wheelchair accessible.",
    minimum_age: null,
    pet_policy:
      "Pets, including guide dogs, are not permitted in the cave because of protected cave species.",
    operating_season:
      "Open daily year-round, subject to flooding, capacity, and other cave conditions",
    operator: "Cascade Caverns",
    activities: [
      "Guided cavern tours",
      "Geology interpretation",
      "Camping",
      "Picnicking",
      "Nature observation",
    ],
    amenities: [
      "Visitor center",
      "Gift shop",
      "Restrooms",
      "On-site parking",
      "Campground",
      "Picnic areas",
    ],
    categories: ["Commercial cavern", "Geological attraction", "Campground destination"],
    tags: [
      "historic show cave",
      "limestone cavern",
      "underground ecosystem",
      "camping",
      "guided tour",
      "Boerne",
    ],
    experience_type: "Historic guided show-cave tour with campground access",
    geology:
      "Limestone cavern shaped by groundwater dissolution, with passageways, chambers, calcite formations, and a seasonally active underground environment.",
    family_friendly: true,
    photography:
      "Personal handheld photography may be possible during tours when conditions allow; visitors must follow guide and cave-protection instructions.",
    educational: true,
    image_url: null,
    image_alt:
      "A guided limestone passage and natural cave formations inside Cascade Caverns near Boerne, Texas.",
    image_credit: null,
    image_source_url: null,
    image_license: null,
    media_status: "awaiting-approved-asset",
    source_attribution: "Cascade Caverns official website",
    verification_status: "official-source-reviewed",
    last_reviewed: "2026-07-26",
  },
  {
    id: "commercial-cavern-wonder-world-cave-adventure-park",
    slug: "wonder-world-cave-adventure-park",
    name: "Wonder World Cave & Adventure Park",
    city: "San Marcos",
    county: "Hays County",
    region: "Hill Country",
    latitude: 29.8724,
    longitude: -97.9569,
    officialUrl: "https://www.wonderworldpark.com/",
    summary:
      "Tour a Balcones Fault cave in San Marcos and learn how geological forces exposed its chambers, fossils, rock layers, and distinctive dry-cave formations.",
    admission_required: true,
    reservations_recommended: true,
    guided_tours: true,
    duration:
      "Approximately 2 hours for the all-in-one guided experience; cave-only duration varies",
    accessibility:
      "The cave and anti-gravity house are not wheelchair or stroller accessible; the wildlife-park train is wheelchair accessible.",
    minimum_age: null,
    pet_policy:
      "Only small service dogs are permitted in the cave and anti-gravity house; no pets are permitted on the wildlife-park train.",
    operating_season: "Open daily year-round, with hours varying by season",
    operator: "Wonder World Cave & Adventure Park",
    activities: [
      "Guided cave tours",
      "Anti-gravity house experience",
      "Wildlife-park train ride",
      "Observation-tower visit",
      "Geology and fossil interpretation",
    ],
    amenities: [
      "Visitor center",
      "Gift shop",
      "Restrooms",
      "On-site parking",
      "Combination attraction tickets",
    ],
    categories: ["Commercial cavern", "Family attraction", "Adventure park"],
    tags: [
      "Balcones Fault",
      "dry cave",
      "fossils",
      "wildlife park",
      "observation tower",
      "San Marcos",
    ],
    experience_type: "Multi-attraction guided cave and family adventure-park experience",
    geology:
      "Dry fault-zone cave associated with the Balcones Fault, exposing tilted rock layers, fossils, fracture features, and evidence of regional uplift and movement.",
    family_friendly: true,
    photography:
      "Personal photography is generally suitable across the attraction, subject to staff directions and safety restrictions in the cave and moving attractions.",
    educational: true,
    image_url: null,
    image_alt:
      "Exposed rock layers and a dry fault cave passage at Wonder World Cave & Adventure Park in San Marcos, Texas.",
    image_credit: null,
    image_source_url: null,
    image_license: null,
    media_status: "awaiting-approved-asset",
    source_attribution: "Wonder World Cave & Adventure Park official website",
    verification_status: "official-source-reviewed",
    last_reviewed: "2026-07-26",
  },
];
