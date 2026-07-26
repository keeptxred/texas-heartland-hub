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
  },
];
