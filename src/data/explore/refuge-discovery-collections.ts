import { destinations } from "./catalog.additional";

export type RefugeDiscoveryCollection = {
  slug: string;
  title: string;
  description: string;
  destinationNames: string[];
};

const allRefugeNames = [
  "Jocelyn Nungaray National Wildlife Refuge",
  "McFaddin National Wildlife Refuge",
  "Texas Point National Wildlife Refuge",
  "Moody National Wildlife Refuge",
  "Brazoria National Wildlife Refuge",
  "San Bernard National Wildlife Refuge",
  "Big Boggy National Wildlife Refuge",
  "Matagorda Island National Wildlife Refuge",
  "Laguna Atascosa National Wildlife Refuge",
  "Lower Rio Grande Valley National Wildlife Refuge",
  "Santa Ana National Wildlife Refuge",
  "Aransas National Wildlife Refuge",
  "Hagerman National Wildlife Refuge",
  "Attwater Prairie Chicken National Wildlife Refuge",
  "Balcones Canyonlands National Wildlife Refuge",
  "Caddo Lake National Wildlife Refuge",
  "Muleshoe National Wildlife Refuge",
  "Buffalo Lake National Wildlife Refuge",
] as const;

export const refugeDiscoveryCollections: RefugeDiscoveryCollection[] = [
  {
    slug: "texas-national-wildlife-refuges",
    title: "Texas National Wildlife Refuges",
    description: "Browse every structured national wildlife refuge in the Explore Texas catalog, from Gulf Coast marshes and South Texas thornscrub to East Texas wetlands and High Plains playa country.",
    destinationNames: [...allRefugeNames],
  },
  {
    slug: "best-texas-refuges-for-birding",
    title: "Best Texas Refuges for Birding",
    description: "Discover Texas refuges known for migratory birds, coastal specialties, rare species, crane concentrations, and year-round wildlife observation.",
    destinationNames: [
      "Jocelyn Nungaray National Wildlife Refuge",
      "McFaddin National Wildlife Refuge",
      "Brazoria National Wildlife Refuge",
      "San Bernard National Wildlife Refuge",
      "Laguna Atascosa National Wildlife Refuge",
      "Lower Rio Grande Valley National Wildlife Refuge",
      "Santa Ana National Wildlife Refuge",
      "Aransas National Wildlife Refuge",
      "Hagerman National Wildlife Refuge",
      "Attwater Prairie Chicken National Wildlife Refuge",
      "Balcones Canyonlands National Wildlife Refuge",
      "Caddo Lake National Wildlife Refuge",
      "Muleshoe National Wildlife Refuge",
      "Buffalo Lake National Wildlife Refuge",
    ],
  },
  {
    slug: "gulf-coast-wildlife-refuges",
    title: "Gulf Coast Wildlife Refuges",
    description: "Explore coastal marshes, beaches, barrier islands, tidal flats, prairie, and wintering habitat along the Texas Gulf Coast.",
    destinationNames: [
      "Jocelyn Nungaray National Wildlife Refuge",
      "McFaddin National Wildlife Refuge",
      "Texas Point National Wildlife Refuge",
      "Moody National Wildlife Refuge",
      "Brazoria National Wildlife Refuge",
      "San Bernard National Wildlife Refuge",
      "Big Boggy National Wildlife Refuge",
      "Matagorda Island National Wildlife Refuge",
      "Aransas National Wildlife Refuge",
      "Attwater Prairie Chicken National Wildlife Refuge",
    ],
  },
  {
    slug: "east-texas-river-refuges",
    title: "East Texas River Refuges",
    description: "Browse refuge landscapes shaped by East Texas bayous, bottomland hardwood forests, wetlands, and river-connected wildlife corridors.",
    destinationNames: ["Caddo Lake National Wildlife Refuge"],
  },
  {
    slug: "south-texas-wildlife-refuges",
    title: "South Texas Wildlife Refuges",
    description: "Explore thornscrub, resacas, coastal prairie, wetlands, and wildlife corridors across the Lower Rio Grande Valley and South Texas coast.",
    destinationNames: [
      "Laguna Atascosa National Wildlife Refuge",
      "Lower Rio Grande Valley National Wildlife Refuge",
      "Santa Ana National Wildlife Refuge",
    ],
  },
  {
    slug: "high-plains-wildlife-refuges",
    title: "High Plains Wildlife Refuges",
    description: "Discover playa lakes, shortgrass prairie, sandhills, canyon scenery, cranes, and migratory-bird habitat in the Texas Panhandle and High Plains.",
    destinationNames: [
      "Muleshoe National Wildlife Refuge",
      "Buffalo Lake National Wildlife Refuge",
    ],
  },
  {
    slug: "hill-country-wildlife-refuges",
    title: "Hill Country Wildlife Refuges",
    description: "Explore protected limestone canyons, oak-juniper woodlands, springs, and endangered-songbird habitat in the Texas Hill Country.",
    destinationNames: ["Balcones Canyonlands National Wildlife Refuge"],
  },
  {
    slug: "refuges-with-wildlife-drives",
    title: "Refuges with Wildlife Drives",
    description: "Plan scenic auto tours and wildlife-drive experiences at Texas refuges with designated vehicle routes or drive-based viewing areas.",
    destinationNames: [
      "Jocelyn Nungaray National Wildlife Refuge",
      "McFaddin National Wildlife Refuge",
      "Brazoria National Wildlife Refuge",
      "San Bernard National Wildlife Refuge",
      "Laguna Atascosa National Wildlife Refuge",
      "Aransas National Wildlife Refuge",
      "Hagerman National Wildlife Refuge",
      "Attwater Prairie Chicken National Wildlife Refuge",
      "Muleshoe National Wildlife Refuge",
      "Buffalo Lake National Wildlife Refuge",
    ],
  },
  {
    slug: "refuges-with-hiking-trails",
    title: "Refuges with Hiking Trails",
    description: "Find Texas wildlife refuges with designated hiking trails, boardwalks, trailheads, or public walking routes.",
    destinationNames: [
      "Jocelyn Nungaray National Wildlife Refuge",
      "Texas Point National Wildlife Refuge",
      "Brazoria National Wildlife Refuge",
      "San Bernard National Wildlife Refuge",
      "Matagorda Island National Wildlife Refuge",
      "Laguna Atascosa National Wildlife Refuge",
      "Lower Rio Grande Valley National Wildlife Refuge",
      "Santa Ana National Wildlife Refuge",
      "Aransas National Wildlife Refuge",
      "Hagerman National Wildlife Refuge",
      "Attwater Prairie Chicken National Wildlife Refuge",
      "Balcones Canyonlands National Wildlife Refuge",
      "Caddo Lake National Wildlife Refuge",
      "Muleshoe National Wildlife Refuge",
      "Buffalo Lake National Wildlife Refuge",
    ],
  },
  {
    slug: "refuges-with-fishing-or-paddling",
    title: "Refuges with Fishing or Paddling",
    description: "Browse Texas refuges that support fishing, boating, paddling, crabbing, or other water-based public recreation where regulations allow.",
    destinationNames: [
      "Jocelyn Nungaray National Wildlife Refuge",
      "McFaddin National Wildlife Refuge",
      "Texas Point National Wildlife Refuge",
      "Brazoria National Wildlife Refuge",
      "San Bernard National Wildlife Refuge",
      "Big Boggy National Wildlife Refuge",
      "Matagorda Island National Wildlife Refuge",
      "Laguna Atascosa National Wildlife Refuge",
      "Aransas National Wildlife Refuge",
      "Hagerman National Wildlife Refuge",
      "Caddo Lake National Wildlife Refuge",
    ],
  },
  {
    slug: "limited-access-conservation-only-refuges",
    title: "Limited-access and Conservation-only Refuges",
    description: "Review Texas refuges where public use is closed, boat-only, unit-specific, permit-controlled, hunting-focused, or otherwise substantially limited.",
    destinationNames: [
      "Moody National Wildlife Refuge",
      "Big Boggy National Wildlife Refuge",
      "Matagorda Island National Wildlife Refuge",
      "Lower Rio Grande Valley National Wildlife Refuge",
    ],
  },
];

const destinationByName = new Map(destinations.map((destination) => [destination.name, destination]));

export const resolvedRefugeDiscoveryCollections = refugeDiscoveryCollections.map((collection) => ({
  ...collection,
  destinations: collection.destinationNames.map((name) => {
    const destination = destinationByName.get(name);

    if (!destination) {
      throw new Error(`Missing Explore Texas refuge destination: ${name}`);
    }

    return destination;
  }),
}));

export const getRefugeDiscoveryCollection = (slug: string) =>
  resolvedRefugeDiscoveryCollections.find((collection) => collection.slug === slug) ?? null;
