import type { ExploreEntity, ExploreJson } from "@/types/explore/public";

type ScenicRiverRecord = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  counties: string[];
  region: string;
  latitude: number;
  longitude: number;
  sourceUrl: string;
  sourceName: string;
  accessNotes: string;
  ecologicalNotes: string;
  activities: string[];
  relatedDestinationSlugs: string[];
};

const LAST_REVIEWED = "2026-07-26";

const scenicRiverCatalog: readonly ScenicRiverRecord[] = [
  {
    slug: "devils-river-scenic-corridor",
    name: "Devils River Scenic Corridor",
    summary:
      "A remote, spring-fed West Texas river corridor known for exceptionally clear water, rugged limestone canyons, primitive conditions, and demanding multi-day paddling.",
    description:
      "The Devils River is one of Texas' most intact and least-developed river systems. Public recreation is concentrated at Devils River State Natural Area and a limited network of authorized access and paddler camps. Extended trips require advanced planning, strong paddling skills, confirmed take-out arrangements, and a Devils River Access Permit when TPWD-managed lands are used.",
    counties: ["Sutton County", "Val Verde County"],
    region: "West Texas",
    latitude: 29.939694,
    longitude: -100.970206,
    sourceUrl: "https://tpwd.texas.gov/state-parks/devils-river/river-trips",
    sourceName: "Texas Parks and Wildlife Department",
    accessNotes:
      "Public access is limited. Reservations are required for state natural area access, and a Devils River Access Permit is required when an extended river trip uses TPWD-managed access points or paddler camps.",
    ecologicalNotes:
      "Spring flow, limited development, no main-stem impoundments, and restricted access support an ecologically intact river with sensitive native fish and riparian habitats.",
    activities: ["paddling", "fishing", "swimming", "wildlife", "photography"],
    relatedDestinationSlugs: [
      "devils-river-state-natural-area",
      "devils-river-state-natural-area-del-norte-unit",
      "devils-river-at-bakers-crossing",
      "lake-amistad",
    ],
  },
  {
    slug: "frio-river-scenic-corridor",
    name: "Frio River Scenic Corridor",
    summary:
      "A clear, spring-influenced Hill Country river corridor flowing through limestone canyons, cypress-lined recreation areas, Garner State Park, and the communities around Concan.",
    description:
      "The upper Frio River is recognized for exceptional scenery, aquatic life, groundwater connections, and high recreational value. Access is provided through public parks, road crossings, and private outfitters, while many riverbanks remain privately owned.",
    counties: ["Real County", "Uvalde County"],
    region: "Hill Country",
    latitude: 29.5947,
    longitude: -99.7392,
    sourceUrl: "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionj.phtml",
    sourceName: "Texas Parks and Wildlife Department",
    accessNotes:
      "Use established public access points or authorized private facilities. River conditions, parking, fees, capacity limits, and floatability vary seasonally.",
    ecologicalNotes:
      "The corridor contributes to Edwards Aquifer recharge and supports high water quality, exceptional aquatic life, and scenic riparian habitat.",
    activities: ["paddling", "tubing", "swimming", "fishing", "camping", "wildlife"],
    relatedDestinationSlugs: ["garner-state-park", "frio-river-at-garner-state-park", "frio-river-at-concan"],
  },
  {
    slug: "guadalupe-river-scenic-corridor",
    name: "Upper Guadalupe River Scenic Corridor",
    summary:
      "A cypress-lined Hill Country river corridor with clear pools, limestone banks, public park access, paddling, fishing, and important freshwater habitat.",
    description:
      "The upper Guadalupe River and its forks cross a scenic Hill Country landscape upstream of Canyon Lake. TPWD planning resources identify portions of the river for exceptional aquatic life, aesthetic value, groundwater functions, and rare freshwater-mussel habitat.",
    counties: ["Kerr County", "Kendall County", "Comal County"],
    region: "Hill Country",
    latitude: 30.0036,
    longitude: -98.2701,
    sourceUrl: "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionj.phtml",
    sourceName: "Texas Parks and Wildlife Department",
    accessNotes:
      "Public entry is available at designated parks, crossings, and leased-access locations. Visitors must avoid trespassing on private banks and verify releases, flood conditions, and local rules.",
    ecologicalNotes:
      "The corridor supports groundwater recharge and discharge, exceptional aquatic life, riparian conservation areas, and remnant populations of endemic freshwater mussels.",
    activities: ["paddling", "tubing", "fishing", "swimming", "camping", "wildlife"],
    relatedDestinationSlugs: [
      "guadalupe-river-state-park",
      "guadalupe-river-at-guadalupe-river-state-park",
      "guadalupe-river-at-canyon-lake",
      "guadalupe-river-at-gruene",
      "canyon-lake",
    ],
  },
  {
    slug: "nueces-river-scenic-corridor",
    name: "Upper Nueces River Scenic Corridor",
    summary:
      "A remote, spring-fed river corridor of clear pools, limestone shelves, rugged ranch country, and exceptional Hill Country scenery.",
    description:
      "The upper Nueces River is identified in state water-planning resources for outstanding fish and wildlife values, Edwards Aquifer recharge, and exceptional aesthetic value. Recreation depends on lawful access because much of the surrounding land is private.",
    counties: ["Edwards County", "Real County", "Uvalde County"],
    region: "Hill Country",
    latitude: 29.5127,
    longitude: -100.0034,
    sourceUrl: "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionj.phtml",
    sourceName: "Texas Parks and Wildlife Department",
    accessNotes:
      "Use established public crossings, parks, or authorized private access. Confirm flow, road conditions, fire restrictions, and local property rules before travel.",
    ecologicalNotes:
      "The river supports aquifer recharge, high-quality aquatic habitat, scenic canyon reaches, and native fish and wildlife communities.",
    activities: ["paddling", "fishing", "swimming", "camping", "wildlife", "photography"],
    relatedDestinationSlugs: ["nueces-river-at-uvalde", "nueces-river-at-chalk-bluff-park"],
  },
  {
    slug: "sabinal-river-scenic-corridor",
    name: "Sabinal River Scenic Corridor",
    summary:
      "A spring-influenced Hill Country river corridor passing through wooded canyons and the protected landscapes surrounding Lost Maples State Natural Area.",
    description:
      "The upper Sabinal River is recognized in TPWD planning resources for exceptional aesthetic value, aquatic habitat, and its relationship to protected riparian lands and native Guadalupe bass genetics.",
    counties: ["Bandera County", "Uvalde County"],
    region: "Hill Country",
    latitude: 29.808,
    longitude: -99.5707,
    sourceUrl: "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionj.phtml",
    sourceName: "Texas Parks and Wildlife Department",
    accessNotes:
      "Public access is concentrated at Lost Maples State Natural Area and lawful road crossings. Water levels can be intermittent, and adjacent land is largely private.",
    ecologicalNotes:
      "The corridor includes high-value riparian habitat, aquifer-connected flows, scenic limestone terrain, and a genetic refuge for native Guadalupe bass.",
    activities: ["hiking", "fishing", "wildlife", "photography", "nature study"],
    relatedDestinationSlugs: ["lost-maples-state-natural-area", "sabinal-river-at-lost-maples"],
  },
  {
    slug: "brazos-river-scenic-corridor-north-texas",
    name: "Brazos River Scenic Corridor of North Texas",
    summary:
      "A broad North Texas river corridor with limestone bluffs, wooded bottoms, paddling reaches, fishing access, and nationally recognized scenic and recreational value.",
    description:
      "Selected Brazos River reaches in Hood, Johnson, Bosque, Palo Pinto, and Parker counties are identified in TPWD planning resources as Texas Natural Rivers System nominees with outstanding wildlife, scenic, and recreational values.",
    counties: ["Bosque County", "Hood County", "Johnson County", "Palo Pinto County", "Parker County"],
    region: "North Texas",
    latitude: 32.5306,
    longitude: -97.8505,
    sourceUrl: "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regiong.phtml",
    sourceName: "Texas Parks and Wildlife Department",
    accessNotes:
      "Use public parks, boat ramps, leased access, and authorized crossings. Flows and hazards vary significantly below reservoirs and during storms.",
    ecologicalNotes:
      "The corridor contains bottomland habitat, important wildlife values, and habitat for rare endemic freshwater mussels.",
    activities: ["paddling", "fishing", "boating", "wildlife", "camping", "photography"],
    relatedDestinationSlugs: [
      "brazos-river-at-stephen-f-austin-state-park",
      "brazos-river-at-washington-on-the-brazos",
      "brazos-river-at-waco-riverwalk",
      "possum-kingdom-lake",
      "lake-granbury",
    ],
  },
  {
    slug: "pecos-river-scenic-corridor",
    name: "Lower Pecos River Scenic Corridor",
    summary:
      "A dramatic West Texas river corridor of desert canyons, clear tributary springs, archeological landscapes, high bridges, and remote paddling reaches above Lake Amistad.",
    description:
      "The lower Pecos River is recognized in TPWD planning resources for exceptional aesthetic value, fish and wildlife importance, and sensitive native aquatic species. Access is sparse and conditions can be severe.",
    counties: ["Crockett County", "Val Verde County"],
    region: "West Texas",
    latitude: 29.7049,
    longitude: -101.3514,
    sourceUrl: "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionj.phtml",
    sourceName: "Texas Parks and Wildlife Department",
    accessNotes:
      "Public access is limited to established crossings, overlooks, parks, and reservoir approaches. Remote travel requires careful logistics, weather awareness, and respect for private property.",
    ecologicalNotes:
      "The corridor supports desert-river habitat, diverse aquatic communities, sensitive native fishes, and Lower Pecos cultural resources.",
    activities: ["paddling", "fishing", "boating", "photography", "wildlife", "history"],
    relatedDestinationSlugs: ["pecos-river-high-bridge-overlook", "seminole-canyon-state-park", "lake-amistad"],
  },
  {
    slug: "colorado-river-scenic-corridor-central-texas",
    name: "Central Texas Colorado River Scenic Corridor",
    summary:
      "A varied Central Texas river corridor linking limestone canyons, state parks, wooded floodplains, paddling routes, reservoirs, and historic communities.",
    description:
      "Central Texas reaches of the Colorado River provide scenic and recreational connections among Colorado Bend State Park, the Highland Lakes, Bastrop, McKinney Roughs, and downstream paddling access. TPWD planning resources identify upstream reaches for exceptional aesthetic and wildlife values.",
    counties: ["Burnet County", "Lampasas County", "Travis County", "Bastrop County"],
    region: "Central Texas",
    latitude: 30.3508,
    longitude: -97.3039,
    sourceUrl: "https://tpwd.texas.gov/landwater/water/habitats/rivers/",
    sourceName: "Texas Parks and Wildlife Department",
    accessNotes:
      "Access is available through parks, reservoirs, designated paddling routes, and public ramps. Conditions depend on dam releases, rainfall, flood risk, and local restrictions.",
    ecologicalNotes:
      "The corridor links aquatic and riparian habitats across multiple ecoregions and supports migratory wildlife, native fish, and floodplain forests.",
    activities: ["paddling", "fishing", "boating", "camping", "hiking", "wildlife"],
    relatedDestinationSlugs: [
      "colorado-bend-state-park",
      "colorado-river-at-colorado-bend-state-park",
      "colorado-river-at-mckinney-roughs",
      "colorado-river-at-bastrop",
      "colorado-river-at-lady-bird-lake",
      "lake-travis",
      "lady-bird-lake",
    ],
  },
];

function toJsonArray(values: string[]): ExploreJson {
  return values;
}

function toScenicRiverDestination(river: ScenicRiverRecord): ExploreEntity {
  return {
    id: river.slug,
    entityType: "river_access",
    name: river.name,
    slug: river.slug,
    summary: river.summary,
    description: river.description,
    city: null,
    county: river.counties.join(", "),
    region: river.region,
    latitude: river.latitude,
    longitude: river.longitude,
    heroImageUrl: null,
    heroImageAlt: `Scenic view along ${river.name} in Texas`,
    amenities: [],
    activities: river.activities,
    isFamilyFriendly: null,
    isPetFriendly: null,
    isAccessible: null,
    feeRequired: null,
    alternateNames: [river.name.replace(" Scenic Corridor", " River"), "Texas scenic river"],
    officialUrl: river.sourceUrl,
    phone: null,
    email: null,
    address: null,
    profile: {
      collection: "Texas state scenic rivers",
      designation: "Texas Natural Rivers System scenic corridor",
      managingOrganization: "Texas Parks and Wildlife Department",
      accessType: "Multiple public and private access points",
      counties: toJsonArray(river.counties),
      accessNotes: river.accessNotes,
      ecologicalNotes: river.ecologicalNotes,
      relatedDestinationSlugs: toJsonArray(river.relatedDestinationSlugs),
    },
    hours: null,
    fees: null,
    regulations: {
      access: river.accessNotes,
      privateProperty:
        "River use does not authorize trespass across private land. Use established public or authorized access points.",
      safety:
        "Verify current streamflow, weather, flood conditions, closures, permits, and skill requirements before entering the water.",
    },
    seasonalGuidance: {
      verificationStatus: "official-source-reviewed",
      lastReviewed: LAST_REVIEWED,
      conditionsVariable: true,
    },
    categories: [
      "state scenic river",
      "texas natural rivers system",
      "river corridor",
      "paddling",
      "freshwater",
    ],
    tags: [
      ...river.activities,
      ...river.counties,
      river.region,
      "river",
      "rivers",
      "scenic river",
      "waterway",
      "riparian habitat",
    ],
    sourceUrl: river.sourceUrl,
    sourceName: river.sourceName,
    sourceUpdatedAt: LAST_REVIEWED,
    updatedAt: `${LAST_REVIEWED}T00:00:00.000Z`,
    observations: [],
    related: [],
    nearby: [],
  };
}

export const stateScenicRiverDestinations: ExploreEntity[] = scenicRiverCatalog.map(
  toScenicRiverDestination,
);

export const stateScenicRiverSlugs = scenicRiverCatalog.map((river) => river.slug);
