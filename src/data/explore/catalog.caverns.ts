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
  },
];