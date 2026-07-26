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
      "A family-owned show-cave destination near San Antonio featuring extensive limestone passages and guided underground tours.",
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
      "A preserved limestone cavern beneath Georgetown offering guided tours through rooms filled with formations and prehistoric discoveries.",
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
      "A renowned West Texas show cave known for dense, actively growing calcite formations and intimate guided tours.",
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
      "A living limestone cavern northeast of Boerne featuring six major rooms, guided tours, and a natural underground concert venue.",
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
      "A historic show cave south of Boerne with guided tours through a living limestone system shaped by water and underground wildlife habitat.",
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
      "A long-running San Marcos attraction centered on guided tours of a dry-formed earthquake cave within a family adventure park.",
  },
];
