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

const genericSeeds: CatalogSeed[] = additionalDestinations.map((name) => ({
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

export const destinations = [
  ...genericSeeds.map(catalogDestination),
  ...forestDestinations,
];
