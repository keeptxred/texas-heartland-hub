import { catalogDestination, type CatalogSeed } from "./catalog.shared";

const additionalDestinations = ["The Alamo", "Space Center Houston", "Fort Worth Stockyards", "Dallas Arboretum and Botanical Garden", "Dallas Museum of Art", "Perot Museum of Nature and Science", "Kimbell Art Museum", "Amon Carter Museum of American Art", "Houston Museum of Natural Science", "Museum of Fine Arts Houston", "Bullock Texas State History Museum", "Texas State Capitol", "Sixth Floor Museum at Dealey Plaza", "George W. Bush Presidential Center", "George H.W. Bush Presidential Library and Museum", "LBJ Presidential Library", "National Cowgirl Museum and Hall of Fame", "Texas Ranger Hall of Fame and Museum", "Dr Pepper Museum", "Witte Museum", "McNay Art Museum", "San Antonio Botanical Garden", "Houston Zoo", "Dallas Zoo", "Fort Worth Zoo", "San Antonio Zoo", "Cameron Park Zoo", "Moody Gardens", "Schlitterbahn New Braunfels", "Natural Bridge Caverns", "Caverns of Sonora", "Inner Space Cavern", "Wonder World Cave and Adventure Park", "Cascade Caverns", "Longhorn Cavern", "Kickapoo Cavern", "Jacob's Well Natural Area", "Barton Springs Pool", "Krause Springs", "Blue Hole Regional Park", "San Solomon Springs", "Balmorhea Springs", "Fort Davis Scenic Loop", "River Road FM 170", "Willow City Loop", "Texas Swiss Alps Scenic Drive", "Davis Mountains Scenic Loop", "Twisted Sisters Scenic Route", "Pineywoods Autumn Trail", "El Camino del Rio", "Ross Maxwell Scenic Drive", "Queen Isabella Causeway", "Marfa", "Fredericksburg", "Wimberley", "Gruene Historic District", "Jefferson", "Granbury Historic Square", "Gonzales", "Lockhart", "Luckenbach", "Salado", "Nacogdoches", "San Augustine", "Alpine", "Terlingua", "Port Isabel", "Rockport", "Port Aransas", "South Padre Island", "Galveston Historic Strand", "Kemah Boardwalk", "Corpus Christi Marina", "Amarillo Route 66 Historic District", "Cadillac Ranch", "Palo Duro Canyon Lighthouse Trail", "Monahans Sandhills Dunes", "Marfa Lights Viewing Area", "Prada Marfa", "Chinati Foundation", "National Butterfly Center", "Santa Ana National Wildlife Refuge", "Aransas National Wildlife Refuge", "Balcones Canyonlands National Wildlife Refuge", "Laguna Atascosa National Wildlife Refuge", "Anahuac National Wildlife Refuge", "Brazoria National Wildlife Refuge", "Hagerman National Wildlife Refuge", "Attwater Prairie Chicken National Wildlife Refuge", "Guadalupe Mountains Salt Basin Dunes", "Big Bend Chisos Basin", "Big Bend Santa Elena Canyon", "Big Bend Lost Mine Trail", "Guadalupe Peak Trail", "McKittrick Canyon", "El Capitan Overlook", "Gorman Falls", "Hamilton Pool Preserve", "Westcave Outdoor Discovery Center", "Japanese Tea Garden San Antonio", "San Antonio River Walk", "Pearl District San Antonio", "The Domain Austin", "Fort Worth Water Gardens", "Discovery Green", "Klyde Warren Park", "Zilker Metropolitan Park", "Hermann Park", "Buffalo Bayou Park", "White Rock Lake Park"];

type ForestServiceDestination = {
  name: string;
  designation: "National Forest" | "National Grassland";
  city: string;
  county: string | null;
  region: string;
  latitude: number;
  longitude: number;
  summary: string;
  activities: string[];
  amenities: string[];
};

const forestServiceDestinations: ForestServiceDestination[] = [
  {
    name: "Angelina National Forest",
    designation: "National Forest",
    city: "Zavalla",
    county: null,
    region: "East Texas",
    latitude: 31.2258,
    longitude: -94.3727,
    summary: "Explore East Texas pine forests, Sam Rayburn Reservoir shorelines, scenic trails, campgrounds, fishing access, and wildlife habitat across Angelina National Forest.",
    activities: ["hiking", "camping", "fishing", "boating", "paddling", "hunting", "wildlife", "nature study"],
    amenities: ["camping", "boat ramp", "trails", "picnic areas", "restrooms", "parking"],
  },
  {
    name: "Davy Crockett National Forest",
    designation: "National Forest",
    city: "Kennard",
    county: null,
    region: "East Texas",
    latitude: 31.3485,
    longitude: -95.1502,
    summary: "Discover pine and hardwood forests, Ratcliff Lake, the Four C National Recreation Trail, equestrian routes, campsites, and wildlife viewing in Davy Crockett National Forest.",
    activities: ["hiking", "camping", "fishing", "swimming", "horseback riding", "hunting", "wildlife", "nature study"],
    amenities: ["camping", "trails", "picnic areas", "restrooms", "showers", "parking"],
  },
  {
    name: "Sabine National Forest",
    designation: "National Forest",
    city: "Hemphill",
    county: null,
    region: "East Texas",
    latitude: 31.4874,
    longitude: -93.8371,
    summary: "Visit the easternmost national forest in Texas for Toledo Bend Reservoir access, lakeside camping, fishing, paddling, forest trails, and quiet Piney Woods scenery.",
    activities: ["hiking", "camping", "fishing", "boating", "paddling", "swimming", "hunting", "wildlife"],
    amenities: ["camping", "boat ramp", "trails", "picnic areas", "restrooms", "parking"],
  },
  {
    name: "Sam Houston National Forest",
    designation: "National Forest",
    city: "New Waverly",
    county: null,
    region: "East Texas",
    latitude: 30.5326,
    longitude: -95.433,
    summary: "Plan hiking, camping, fishing, hunting, and trail adventures close to Houston in Sam Houston National Forest, home to the long-distance Lone Star Hiking Trail.",
    activities: ["hiking", "camping", "fishing", "boating", "horseback riding", "hunting", "wildlife", "off-highway vehicles"],
    amenities: ["camping", "boat ramp", "trails", "picnic areas", "restrooms", "parking"],
  },
  {
    name: "Caddo National Grassland",
    designation: "National Grassland",
    city: "Honey Grove",
    county: "Fannin County",
    region: "North Texas",
    latitude: 33.7349,
    longitude: -95.9216,
    summary: "Explore prairie, woodland, lakes, trails, campsites, fishing areas, and equestrian recreation across the Caddo National Grassland near the Red River region.",
    activities: ["hiking", "camping", "fishing", "boating", "horseback riding", "hunting", "wildlife", "nature study"],
    amenities: ["camping", "boat ramp", "trails", "picnic areas", "restrooms", "parking"],
  },
  {
    name: "Lyndon B. Johnson National Grassland",
    designation: "National Grassland",
    city: "Decatur",
    county: "Wise County",
    region: "North Texas",
    latitude: 33.3516,
    longitude: -97.5909,
    summary: "Discover Cross Timbers scenery, grasslands, equestrian trails, lakes, campsites, hunting areas, and wildlife habitat at Lyndon B. Johnson National Grassland.",
    activities: ["hiking", "camping", "fishing", "horseback riding", "hunting", "wildlife", "nature study"],
    amenities: ["camping", "trails", "equestrian facilities", "picnic areas", "restrooms", "parking"],
  },
];

type WildlifeRefugeDestination = {
  name: string;
  alternateNames: string[];
  officialUrl: string;
  city: string;
  county: string;
  latitude: number;
  longitude: number;
  summary: string;
  activities: string[];
  amenities: string[];
  publicAccess: boolean;
  accessNotes: string;
  parentUnit: string;
  ownership?: string;
  region?: string;
};

const upperGulfCoastRefuges: WildlifeRefugeDestination[] = [
  {
    name: "Jocelyn Nungaray National Wildlife Refuge",
    alternateNames: ["Anahuac National Wildlife Refuge"],
    officialUrl: "https://www.fws.gov/refuge/jocelyn-nungaray",
    city: "Anahuac",
    county: "Chambers County",
    latitude: 29.6119092,
    longitude: -94.5350045,
    summary: "Explore coastal marshes, freshwater wetlands, bayous, birding trails, wildlife drives, fishing access, and major migratory-bird habitat at the refuge formerly known as Anahuac National Wildlife Refuge.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "fishing", "crabbing", "boating", "auto tour", "hunting", "nature study"],
    amenities: ["visitor center", "trails", "boardwalk", "boat ramp", "wildlife drive", "observation areas", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Open daily during posted refuge hours; some areas and activities are seasonal or permit-controlled.",
    parentUnit: "Texas Chenier Plain National Wildlife Refuge Complex",
  },
  {
    name: "McFaddin National Wildlife Refuge",
    alternateNames: [],
    officialUrl: "https://www.fws.gov/refuge/mcfaddin",
    city: "Sabine Pass",
    county: "Jefferson County",
    latitude: 29.668442,
    longitude: -94.073883,
    summary: "Visit one of the Texas coast's largest remaining freshwater marsh landscapes for birding, wildlife watching, fishing, crabbing, waterfowl hunting, coastal scenery, and beach access.",
    activities: ["birding", "wildlife", "wildlife photography", "fishing", "crabbing", "auto tour", "hunting", "beachcombing", "nature study"],
    amenities: ["observation areas", "fishing access", "beach access", "restrooms", "information kiosk", "parking"],
    publicAccess: true,
    accessNotes: "Open free of charge during posted daylight hours; hunting and some recreation are seasonal and regulated.",
    parentUnit: "Texas Chenier Plain National Wildlife Refuge Complex",
  },
  {
    name: "Texas Point National Wildlife Refuge",
    alternateNames: [],
    officialUrl: "https://www.fws.gov/refuge/texas-point",
    city: "Sabine Pass",
    county: "Jefferson County",
    latitude: 29.6897,
    longitude: -93.9568,
    summary: "Discover coastal marshes and chenier habitat near Sabine Pass, with opportunities for birding, fishing, hiking, wildlife observation, photography, and regulated waterfowl hunting.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "fishing", "hunting", "nature study"],
    amenities: ["trails", "fishing access", "observation areas", "information kiosk", "parking"],
    publicAccess: true,
    accessNotes: "Public access and individual recreation areas follow posted refuge hours, closures, and seasonal regulations.",
    parentUnit: "Texas Chenier Plain National Wildlife Refuge Complex",
  },
  {
    name: "Moody National Wildlife Refuge",
    alternateNames: [],
    officialUrl: "https://www.fws.gov/refuge/moody",
    city: "Anahuac",
    county: "Chambers County",
    latitude: 29.706,
    longitude: -94.714,
    summary: "Learn about a privately owned coastal-wetland conservation easement protected as part of the National Wildlife Refuge System for resident, migratory, and wintering birds and other Gulf Coast wildlife.",
    activities: [],
    amenities: [],
    publicAccess: false,
    accessNotes: "Closed to public access. The refuge is privately owned and protected through a conservation easement managed for wildlife and habitat.",
    parentUnit: "Texas Chenier Plain National Wildlife Refuge Complex",
    ownership: "Private conservation easement",
  },
];

const centralGulfCoastRefuges: WildlifeRefugeDestination[] = [
  {
    name: "Brazoria National Wildlife Refuge",
    alternateNames: [],
    officialUrl: "https://www.fws.gov/refuge/brazoria",
    city: "Freeport",
    county: "Brazoria County",
    latitude: 29.0474,
    longitude: -95.3208,
    summary: "Explore coastal prairie, salt marsh, freshwater wetlands, tidal flats, wildlife drives, trails, fishing areas, and exceptional year-round birding along the Central Flyway.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "fishing", "auto tour", "hunting", "nature study"],
    amenities: ["discovery center", "wildlife drive", "trails", "observation areas", "fishing access", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Public recreation areas are generally open from sunrise to sunset; individual units, hunting areas, and facilities may have seasonal schedules.",
    parentUnit: "Texas Mid-Coast National Wildlife Refuge Complex",
  },
  {
    name: "San Bernard National Wildlife Refuge",
    alternateNames: [],
    officialUrl: "https://www.fws.gov/refuge/san-bernard",
    city: "Brazoria",
    county: "Brazoria County",
    latitude: 28.8669,
    longitude: -95.5705,
    summary: "Discover Gulf beaches, salt marshes, freshwater wetlands, coastal prairie, bottomland forest, wildlife trails, fishing access, and habitat used by more than 320 bird species.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "fishing", "auto tour", "hunting", "nature study", "environmental education"],
    amenities: ["trails", "boardwalk", "wildlife drive", "observation areas", "fishing access", "information kiosk", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Public-use areas follow posted refuge hours; remote units, hunting areas, and roads may be seasonal, permit-controlled, or weather-dependent.",
    parentUnit: "Texas Mid-Coast National Wildlife Refuge Complex",
  },
  {
    name: "Big Boggy National Wildlife Refuge",
    alternateNames: [],
    officialUrl: "https://www.fws.gov/refuge/big-boggy",
    city: "Wadsworth",
    county: "Matagorda County",
    latitude: 28.7572,
    longitude: -95.8086,
    summary: "Experience protected saline and intermediate marsh habitat supporting wintering waterfowl, shorebirds, wading birds, eastern black rails, alligators, and colonial nesting birds at Dressing Point Island.",
    activities: ["fishing", "boating", "hunting", "birding", "wildlife", "wildlife photography"],
    amenities: ["boat access", "limited parking", "hunter access"],
    publicAccess: true,
    accessNotes: "Not open for general public use. Access is limited primarily to regulated waterfowl hunting and fishing on Boggy Creek, with no refuge restrooms or developed visitor facilities.",
    parentUnit: "Texas Mid-Coast National Wildlife Refuge Complex",
  },
  {
    name: "Matagorda Island National Wildlife Refuge",
    alternateNames: ["Matagorda Island Unit of Aransas National Wildlife Refuge"],
    officialUrl: "https://www.fws.gov/refuge/aransas/about-us",
    city: "Port O'Connor",
    county: "Calhoun County",
    latitude: 28.2255,
    longitude: -96.6417,
    summary: "Explore a remote barrier-island landscape of beaches, dunes, marshes, bays, historic lighthouse scenery, migratory-bird habitat, sea-turtle nesting areas, and undeveloped Gulf Coast wilderness.",
    activities: ["birding", "wildlife", "wildlife photography", "fishing", "boating", "paddling", "hiking", "beachcombing", "camping", "nature study"],
    amenities: ["primitive camping", "trails", "historic lighthouse", "boat access"],
    publicAccess: true,
    accessNotes: "There is no public road or ferry. Visitors must arrange private boat access and follow Texas Parks and Wildlife Department rules, closures, camping requirements, and island-specific safety guidance.",
    parentUnit: "Aransas National Wildlife Refuge",
    ownership: "Federal/state management overlay",
  },
];

const southTexasRefuges: WildlifeRefugeDestination[] = [
  {
    name: "Laguna Atascosa National Wildlife Refuge",
    alternateNames: [],
    officialUrl: "https://www.fws.gov/refuge/laguna-atascosa",
    city: "Los Fresnos",
    county: "Cameron County",
    latitude: 26.2293,
    longitude: -97.3483,
    summary: "Explore one of South Texas's premier wildlife refuges, protecting coastal prairie, thornscrub, wetlands, tidal flats, and critical habitat for ocelots, aplomado falcons, waterfowl, and hundreds of bird species.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "biking", "fishing", "paddling", "auto tour", "hunting", "nature study"],
    amenities: ["visitor center", "trails", "wildlife drive", "observation areas", "boat ramp", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Public-use areas follow posted refuge hours. Wildlife drives, roads, trails, fishing access, and hunting units may close seasonally or because of weather and habitat-management work.",
    parentUnit: "South Texas National Wildlife Refuge Complex",
    region: "South Texas",
  },
  {
    name: "Lower Rio Grande Valley National Wildlife Refuge",
    alternateNames: ["Lower Rio Grande Valley NWR"],
    officialUrl: "https://www.fws.gov/refuge/lower-rio-grande-valley",
    city: "Alamo",
    county: "Cameron, Hidalgo, Starr, and Willacy Counties",
    latitude: 26.1858,
    longitude: -98.1067,
    summary: "Discover a connected network of South Texas tracts protecting Rio Grande floodplain forest, Tamaulipan thornscrub, wetlands, resacas, and wildlife corridors used by rare birds, butterflies, ocelots, and other borderlands species.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "butterfly viewing", "nature study", "environmental education", "hunting"],
    amenities: ["trails", "observation areas", "information kiosks", "parking"],
    publicAccess: true,
    accessNotes: "The refuge is made up of many separate tracts. Public access, trails, parking, hunting opportunities, and operating hours vary by unit, and some conservation tracts are closed to general visitation.",
    parentUnit: "South Texas National Wildlife Refuge Complex",
    region: "South Texas",
  },
  {
    name: "Santa Ana National Wildlife Refuge",
    alternateNames: [],
    officialUrl: "https://www.fws.gov/refuge/santa-ana",
    city: "Alamo",
    county: "Hidalgo County",
    latitude: 26.0858,
    longitude: -98.1346,
    summary: "Visit a celebrated Lower Rio Grande Valley birding destination where subtropical thorn forest, resacas, wetlands, and Rio Grande floodplain habitat support green jays, chachalacas, raptors, butterflies, and diverse borderlands wildlife.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "butterfly viewing", "nature study", "environmental education"],
    amenities: ["visitor center", "trails", "observation tower", "observation deck", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Open during posted refuge hours. Trails, tram service, observation facilities, and visitor-center operations may vary seasonally or close temporarily for weather and maintenance.",
    parentUnit: "South Texas National Wildlife Refuge Complex",
    region: "South Texas",
  },
  {
    name: "Aransas National Wildlife Refuge",
    alternateNames: ["Aransas NWR"],
    officialUrl: "https://www.fws.gov/refuge/aransas",
    city: "Austwell",
    county: "Aransas and Refugio Counties",
    latitude: 28.3135,
    longitude: -96.8044,
    summary: "Experience coastal prairie, live-oak woodlands, tidal marshes, bays, wildlife drives, trails, and observation areas at the principal wintering grounds of the endangered whooping crane.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "auto tour", "fishing", "boating", "hunting", "nature study"],
    amenities: ["visitor contact station", "wildlife drive", "trails", "observation tower", "observation areas", "fishing access", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Public-use areas follow posted refuge hours. Roads, trails, fishing areas, hunting units, and facilities may be seasonal or temporarily closed because of weather, prescribed fire, and habitat-management work.",
    parentUnit: "Aransas National Wildlife Refuge Complex",
    region: "Gulf Coast",
  },
];

const inlandRefuges: WildlifeRefugeDestination[] = [
  {
    name: "Hagerman National Wildlife Refuge",
    alternateNames: ["Hagerman NWR"],
    officialUrl: "https://www.fws.gov/refuge/hagerman",
    city: "Sherman",
    county: "Grayson County",
    latitude: 33.7342,
    longitude: -96.7805,
    summary: "Explore Lake Texoma shoreline, wetlands, grasslands, woodlands, wildlife drives, trails, and major wintering habitat for geese, ducks, shorebirds, and other North Texas wildlife.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "fishing", "boating", "auto tour", "hunting", "nature study", "environmental education"],
    amenities: ["visitor center", "wildlife drive", "trails", "observation areas", "boat ramp", "fishing access", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Public-use areas follow posted refuge hours. Roads, trails, boating access, fishing areas, and hunting units may be seasonally restricted or temporarily closed because of weather and habitat-management work.",
    parentUnit: "Hagerman National Wildlife Refuge",
    region: "North Texas",
  },
  {
    name: "Attwater Prairie Chicken National Wildlife Refuge",
    alternateNames: ["Attwater's Prairie-Chicken National Wildlife Refuge"],
    officialUrl: "https://www.fws.gov/refuge/attwater-prairie-chicken",
    city: "Eagle Lake",
    county: "Colorado County",
    latitude: 29.6685,
    longitude: -96.2696,
    summary: "Visit one of the largest protected remnants of coastal prairie in Texas and learn about recovery efforts for the critically endangered Attwater's prairie-chicken and its grassland ecosystem.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "auto tour", "nature study", "environmental education"],
    amenities: ["visitor center", "trails", "auto tour route", "observation areas", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Public-use areas operate during posted hours. Prairie-chicken viewing, guided programs, trails, and refuge roads may be seasonal, reservation-based, or temporarily closed for habitat work and wildlife protection.",
    parentUnit: "Texas Mid-Coast National Wildlife Refuge Complex",
    region: "Gulf Coast Prairie",
  },
  {
    name: "Balcones Canyonlands National Wildlife Refuge",
    alternateNames: ["Balcones Canyonlands NWR"],
    officialUrl: "https://www.fws.gov/refuge/balcones-canyonlands",
    city: "Marble Falls",
    county: "Burnet, Travis, and Williamson Counties",
    latitude: 30.5824,
    longitude: -98.0267,
    summary: "Discover rugged Hill Country canyons, limestone hills, oak-juniper woodlands, springs, and habitat protected for the endangered golden-cheeked warbler, black-capped vireo, and diverse native wildlife.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "nature study", "environmental education", "hunting"],
    amenities: ["visitor contact station", "trails", "observation areas", "information kiosks", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Public access is concentrated at designated tracts and trailheads. Hours, trail availability, hunting closures, and access to individual refuge units vary seasonally and by conservation needs.",
    parentUnit: "Balcones Canyonlands National Wildlife Refuge",
    region: "Hill Country",
  },
  {
    name: "Caddo Lake National Wildlife Refuge",
    alternateNames: ["Caddo Lake NWR"],
    officialUrl: "https://www.fws.gov/refuge/caddo-lake",
    city: "Karnack",
    county: "Harrison County",
    latitude: 32.6757,
    longitude: -94.1363,
    summary: "Explore East Texas bottomland hardwood forest, wetlands, bayous, historic structures, trails, paddling waters, and wildlife habitat adjoining the internationally significant Caddo Lake ecosystem.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "paddling", "fishing", "boating", "hunting", "nature study"],
    amenities: ["trails", "paddling access", "observation areas", "historic sites", "information kiosks", "parking"],
    publicAccess: true,
    accessNotes: "Designated public-use areas follow posted hours and rules. Roads, trails, waterways, historic areas, and hunting units may have seasonal closures, limited facilities, or weather-dependent access.",
    parentUnit: "Caddo Lake National Wildlife Refuge",
    region: "East Texas",
  },
  {
    name: "Muleshoe National Wildlife Refuge",
    alternateNames: ["Muleshoe NWR"],
    officialUrl: "https://www.fws.gov/refuge/muleshoe",
    city: "Muleshoe",
    county: "Bailey County",
    latitude: 33.9515,
    longitude: -102.7423,
    summary: "Experience High Plains grasslands, playa lakes, sandhills, wildlife drives, and one of the continent's notable winter concentrations of sandhill cranes at the oldest national wildlife refuge in Texas.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "auto tour", "nature study", "environmental education", "hunting"],
    amenities: ["visitor contact station", "wildlife drive", "trails", "observation areas", "primitive camping", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Public-use areas are open during posted hours. Playa conditions, crane viewing, refuge roads, camping, and hunting access vary with weather, migration, seasonal regulations, and habitat-management activity.",
    parentUnit: "Muleshoe National Wildlife Refuge",
    region: "High Plains",
  },
  {
    name: "Buffalo Lake National Wildlife Refuge",
    alternateNames: ["Buffalo Lake NWR"],
    officialUrl: "https://www.fws.gov/refuge/buffalo-lake",
    city: "Umbarger",
    county: "Randall County",
    latitude: 34.9012,
    longitude: -102.1211,
    summary: "Discover shortgrass prairie, riparian woodland, seasonal wetlands, canyon scenery, wildlife drives, trails, and important habitat for migratory birds and native High Plains wildlife southwest of Amarillo.",
    activities: ["birding", "wildlife", "wildlife photography", "hiking", "auto tour", "nature study", "environmental education", "hunting"],
    amenities: ["visitor contact station", "wildlife drive", "trails", "observation areas", "picnic areas", "restrooms", "parking"],
    publicAccess: true,
    accessNotes: "Public-use areas follow posted refuge hours. Lake and wetland conditions are highly variable, and roads, trails, hunting units, and facilities may close because of weather, wildfire risk, or habitat-management work.",
    parentUnit: "Buffalo Lake National Wildlife Refuge",
    region: "High Plains",
  },
];

const wildlifeRefuges = [
  ...upperGulfCoastRefuges,
  ...centralGulfCoastRefuges,
  ...southTexasRefuges,
  ...inlandRefuges,
];

const structuredWildlifeRefugeNames = [
  "Anahuac National Wildlife Refuge",
  "Aransas National Wildlife Refuge",
  "Attwater Prairie Chicken National Wildlife Refuge",
  "Balcones Canyonlands National Wildlife Refuge",
  "Brazoria National Wildlife Refuge",
  "Buffalo Lake National Wildlife Refuge",
  "Caddo Lake National Wildlife Refuge",
  "Hagerman National Wildlife Refuge",
  "Laguna Atascosa National Wildlife Refuge",
  "Muleshoe National Wildlife Refuge",
  "Santa Ana National Wildlife Refuge",
];

const genericSeeds: CatalogSeed[] = additionalDestinations
  .filter((name) => !structuredWildlifeRefugeNames.includes(name))
  .map((name) => ({
    name,
    entityType: "attraction",
    collection: "Texas attractions, towns, scenic drives, caves, springs, and wildlife destinations",
    sourceUrl: "https://www.traveltexas.com/",
    sourceName: "Travel Texas",
    categories: ["texas attraction"],
  }));

const forestDestinations = forestServiceDestinations.map((site) => {
  const seed: CatalogSeed = {
    name: site.name,
    entityType: site.designation === "National Forest" ? "national_forest" : "national_grassland",
    collection: "U.S. Forest Service lands in Texas",
    sourceUrl: "https://www.fs.usda.gov/r08/texas",
    sourceName: "U.S. Forest Service",
    categories: ["federal public land", "u.s. forest service", site.designation.toLowerCase(), "outdoors"],
  };
  const destination = catalogDestination(seed);

  return {
    ...destination,
    summary: site.summary,
    description: `${site.summary} Use this Explore Texas guide to plan a visit, compare nearby destinations, and confirm current access, fire restrictions, closures, camping rules, permits, fees, and seasonal conditions with the U.S. Forest Service before traveling.`,
    city: site.city,
    county: site.county,
    region: site.region,
    latitude: site.latitude,
    longitude: site.longitude,
    activities: site.activities,
    amenities: site.amenities,
    isFamilyFriendly: true,
    isPetFriendly: true,
    isAccessible: null,
    feeRequired: null,
    profile: {
      collection: "U.S. Forest Service lands in Texas",
      ownership: "Federal",
      managingOrganization: "U.S. Forest Service",
      parentUnit: "National Forests and Grasslands in Texas",
      designation: site.designation,
    },
    categories: ["federal public land", "u.s. forest service", site.designation.toLowerCase(), "outdoors", site.region],
    tags: [...site.activities, "federal land", "public land", "forest service", site.city.toLowerCase()],
    sourceUrl: "https://www.fs.usda.gov/r08/texas",
    sourceName: "U.S. Forest Service",
  };
});

const wildlifeRefugeDestinations = wildlifeRefuges.map((refuge) => {
  const region = refuge.region ?? "Gulf Coast";
const regionTaxonomy = region.trim().toLowerCase();
  const seed: CatalogSeed = {
    name: refuge.name,
    entityType: "wildlife_area",
    collection: "National Wildlife Refuges in Texas",
    sourceUrl: refuge.officialUrl,
    sourceName: "U.S. Fish and Wildlife Service",
    categories: ["national wildlife refuge", "federal public land", "wildlife", "birding", regionTaxonomy],
  };
  const destination = catalogDestination(seed);

  return {
    ...destination,
    alternateNames: refuge.alternateNames,
    officialUrl: refuge.officialUrl,
    sourceUrl: refuge.officialUrl,
    sourceName: "U.S. Fish and Wildlife Service",
    summary: refuge.summary,
    description: `${refuge.summary} ${refuge.accessNotes} Confirm current hours, road and trail conditions, weather closures, hunting seasons, permits, and refuge-specific regulations with the U.S. Fish and Wildlife Service before traveling.`,
    city: refuge.city,
    county: refuge.county,
    region,
    latitude: refuge.latitude,
    longitude: refuge.longitude,
    activities: refuge.activities,
    amenities: refuge.amenities,
    isFamilyFriendly: refuge.publicAccess,
    isPetFriendly: false,
    isAccessible: refuge.publicAccess ? null : false,
    feeRequired: false,
    profile: {
      collection: "National Wildlife Refuges in Texas",
      ownership: refuge.ownership ?? "Federal",
      managingOrganization: "U.S. Fish and Wildlife Service",
      parentUnit: refuge.parentUnit,
      designation: "National Wildlife Refuge",
      publicAccess: refuge.publicAccess,
      accessNotes: refuge.accessNotes,
    },
    categories: ["national wildlife refuge", "federal public land", "u.s. fish and wildlife service", "wildlife", "birding", regionTaxonomy],
    tags: [...refuge.activities, ...refuge.alternateNames.map((name) => name.toLowerCase()), "migratory birds", "wildlife refuge", region.toLowerCase(), refuge.city.toLowerCase()],
  };
});

export const destinations = [
  ...genericSeeds.map(catalogDestination),
  ...forestDestinations,
  ...wildlifeRefugeDestinations,
];
