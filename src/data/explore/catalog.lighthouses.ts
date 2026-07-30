export type TexasLighthouseRecord = {
  id: string;
  name: string;
  slug: string;
  alternateNames: string[];
  city: string | null;
  county: string;
  region: "Gulf Coast" | "South Texas";
  latitude: number;
  longitude: number;
  summary: string;
  description: string;
  ownership: string;
  operator: string | null;
  accessModel: "public-interior" | "public-exterior" | "view-only" | "remote-restricted";
  accessNotes: string;
  towerAccess: boolean;
  admissionRequired: boolean | null;
  reservationsRecommended: boolean;
  familyFriendly: boolean;
  accessible: boolean | null;
  petFriendly: boolean | null;
  activities: string[];
  amenities: string[];
  categories: string[];
  tags: string[];
  officialUrl: string;
  sourceName: string;
  lastReviewed: string;
};

export const texasLighthouseCatalog: TexasLighthouseRecord[] = [
  {
    id: "port-isabel-lighthouse-state-historic-site",
    name: "Port Isabel Lighthouse State Historic Site",
    slug: "port-isabel-lighthouse-state-historic-site",
    alternateNames: ["Port Isabel Lighthouse", "Point Isabel Lighthouse"],
    city: "Port Isabel",
    county: "Cameron County",
    region: "South Texas",
    latitude: 26.07682,
    longitude: -97.20745,
    summary:
      "Climb Texas' only lighthouse open to the public, visit the reconstructed keeper's cottage, and take in broad views across the Laguna Madre toward South Padre Island.",
    description:
      "Built in 1852 and first lighted in 1853, Port Isabel Lighthouse guided shipping at the southern end of the Texas coast before being decommissioned in 1905. The restored 72-foot tower is operated by the City of Port Isabel in partnership with the Texas Historical Commission. Weather permitting, visitors may climb the winding stairs and short ladders to the lantern room, where a reproduction third-order Fresnel lens was installed in 2022.",
    ownership: "State historic site",
    operator: "City of Port Isabel and Texas Historical Commission",
    accessModel: "public-interior",
    accessNotes:
      "The visitor center and lighthouse are open on posted schedules. Tower access is weather dependent, requires admission, and includes steep winding stairs and short ladders. Children must meet the site's minimum-age rules and be accompanied by a guardian.",
    towerAccess: true,
    admissionRequired: true,
    reservationsRecommended: false,
    familyFriendly: true,
    accessible: false,
    petFriendly: false,
    activities: ["history", "lighthouse tours", "museum", "scenic views", "photography"],
    amenities: ["visitor center", "museum", "restrooms", "parking", "interpretive exhibits"],
    categories: ["lighthouse", "state historic site", "maritime history", "south texas"],
    tags: ["fresnel lens", "laguna madre", "south padre island", "tower climb", "coastal history"],
    officialUrl: "https://thc.texas.gov/historic-sites/port-isabel-lighthouse",
    sourceName: "Texas Historical Commission",
    lastReviewed: "2026-07-26",
  },
  {
    id: "halfmoon-reef-lighthouse",
    name: "Halfmoon Reef Lighthouse",
    slug: "halfmoon-reef-lighthouse",
    alternateNames: ["Half Moon Reef Lighthouse", "Half Moon Reef Light"],
    city: "Port Lavaca",
    county: "Calhoun County",
    region: "Gulf Coast",
    latitude: 28.61538,
    longitude: -96.62603,
    summary:
      "See a rare surviving Texas screw-pile lighthouse, relocated from Matagorda Bay and preserved beside the bayfront in Port Lavaca.",
    description:
      "Halfmoon Reef Lighthouse was completed in 1858 on iron piles in Matagorda Bay. After its navigational service ended, the structure was moved to shore and ultimately preserved in Port Lavaca. The lighthouse is best experienced as an exterior maritime-history stop paired with the nearby bayfront and Calhoun County Museum resources.",
    ownership: "Publicly preserved historic structure",
    operator: "City of Port Lavaca",
    accessModel: "public-exterior",
    accessNotes:
      "The lighthouse is viewed from the surrounding public grounds. Interior and tower access are not regularly offered; verify local conditions before travel.",
    towerAccess: false,
    admissionRequired: false,
    reservationsRecommended: false,
    familyFriendly: true,
    accessible: true,
    petFriendly: true,
    activities: ["history", "maritime history", "photography", "bayfront walking"],
    amenities: ["parking", "public grounds"],
    categories: ["lighthouse", "maritime history", "gulf coast", "historic structure"],
    tags: ["screw-pile lighthouse", "matagorda bay", "port lavaca", "coastal history"],
    officialUrl: "https://www.portlavaca.org/",
    sourceName: "City of Port Lavaca",
    lastReviewed: "2026-07-26",
  },
  {
    id: "bolivar-point-lighthouse",
    name: "Bolivar Point Lighthouse",
    slug: "bolivar-point-lighthouse",
    alternateNames: ["Point Bolivar Lighthouse", "Bolivar Lighthouse"],
    city: "Port Bolivar",
    county: "Galveston County",
    region: "Gulf Coast",
    latitude: 29.36731,
    longitude: -94.7803,
    summary:
      "View the distinctive black iron Bolivar Point Lighthouse, a privately owned survivor of Gulf storms and a landmark near the Galveston-Port Bolivar ferry landing.",
    description:
      "The present Bolivar Point Lighthouse was completed in 1872 and served mariners approaching Galveston Bay until 1933. The privately owned tower is especially remembered as a refuge during the 1900 Galveston hurricane. Preservation work continues through the Bolivar Point Lighthouse Foundation.",
    ownership: "Private historic property",
    operator: "Bolivar Point Lighthouse Foundation",
    accessModel: "view-only",
    accessNotes:
      "The lighthouse stands on private property and is not open for unscheduled entry or tower climbs. View only from lawful public locations and follow all posted restrictions.",
    towerAccess: false,
    admissionRequired: null,
    reservationsRecommended: false,
    familyFriendly: true,
    accessible: null,
    petFriendly: null,
    activities: ["history", "maritime history", "photography", "scenic driving"],
    amenities: [],
    categories: ["lighthouse", "private historic landmark", "maritime history", "gulf coast"],
    tags: ["galveston bay", "port bolivar", "1900 hurricane", "iron lighthouse", "coastal history"],
    officialUrl: "https://www.bolivarlighthouse.org/",
    sourceName: "Bolivar Point Lighthouse Foundation",
    lastReviewed: "2026-07-26",
  },
  {
    id: "matagorda-island-lighthouse",
    name: "Matagorda Island Lighthouse",
    slug: "matagorda-island-lighthouse",
    alternateNames: ["Matagorda Lighthouse", "Pass Cavallo Lighthouse"],
    city: null,
    county: "Calhoun County",
    region: "Gulf Coast",
    latitude: 28.33156,
    longitude: -96.42414,
    summary:
      "Discover a remote 19th-century lighthouse on Matagorda Island, visible within a protected coastal landscape reached only through carefully planned water access.",
    description:
      "The cast-iron Matagorda Island Lighthouse has marked the Pass Cavallo area since the 19th century. It stands in a remote barrier-island environment associated with Matagorda Island Wildlife Management Area and federal refuge lands. The destination requires advance planning and should never be treated as a casual roadside stop.",
    ownership: "Public conservation land historic structure",
    operator: "Texas Parks and Wildlife Department and federal conservation partners",
    accessModel: "remote-restricted",
    accessNotes:
      "There is no public road access. Reachability depends on authorized boat access, weather, tides, wildlife-management rules, closures, and current agency guidance. The tower interior is not generally open for public climbing.",
    towerAccess: false,
    admissionRequired: null,
    reservationsRecommended: true,
    familyFriendly: false,
    accessible: false,
    petFriendly: false,
    activities: ["maritime history", "wildlife viewing", "photography", "boating"],
    amenities: [],
    categories: ["lighthouse", "wildlife management area", "remote destination", "gulf coast"],
    tags: ["matagorda island", "pass cavallo", "barrier island", "boat access", "coastal conservation"],
    officialUrl: "https://tpwd.texas.gov/huntwild/hunt/wma/find_a_wma/list/?id=44",
    sourceName: "Texas Parks and Wildlife Department",
    lastReviewed: "2026-07-26",
  },
  {
    id: "lydia-ann-lighthouse",
    name: "Lydia Ann Lighthouse",
    slug: "lydia-ann-lighthouse",
    alternateNames: ["Aransas Pass Lighthouse", "Lydia Ann Channel Lighthouse"],
    city: "Port Aransas",
    county: "Aransas County",
    region: "Gulf Coast",
    latitude: 27.86538,
    longitude: -97.05692,
    summary:
      "View the historic Lydia Ann Lighthouse from the water near Aransas Pass, where the privately owned tower remains a prominent coastal landmark.",
    description:
      "First lighted in the 1850s, Lydia Ann Lighthouse served traffic through Aransas Pass and is one of the Texas coast's best-known surviving light stations. The lighthouse and surrounding land are private, so responsible visits focus on distant views from authorized boat excursions and public waterways.",
    ownership: "Private historic property",
    operator: null,
    accessModel: "view-only",
    accessNotes:
      "The lighthouse is on private property with no routine public interior access. Do not land, dock, or enter without explicit authorization. Water-based viewing must follow navigation, weather, and operator safety guidance.",
    towerAccess: false,
    admissionRequired: null,
    reservationsRecommended: true,
    familyFriendly: true,
    accessible: null,
    petFriendly: null,
    activities: ["maritime history", "boat tours", "photography", "wildlife viewing"],
    amenities: [],
    categories: ["lighthouse", "private historic landmark", "boat-access view", "gulf coast"],
    tags: ["aransas pass", "lydia ann channel", "port aransas", "boat tour", "coastal history"],
    officialUrl: "https://www.portaransas.org/",
    sourceName: "Port Aransas Tourism Bureau",
    lastReviewed: "2026-07-26",
  },
];
