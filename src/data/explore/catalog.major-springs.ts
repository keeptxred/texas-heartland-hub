export type MajorSpringIntegrationMode = "create" | "enrich-existing";

export type MajorSpringAccessStatus =
  | "open-public-access"
  | "open-limited-program-access"
  | "open-no-swimming";

export type MajorSpringCatalogRecord = {
  id: string;
  slug: string;
  name: string;
  city: string;
  county: string;
  region: string;
  latitude: number;
  longitude: number;
  officialUrl: string;
  sourceName: string;
  summary: string;
  integrationMode: MajorSpringIntegrationMode;
  existingDestinationSlug: string | null;
  managingOrganization: string;
  ownership: string;
  publicAccess: boolean;
  accessStatus: MajorSpringAccessStatus;
  swimmingStatus: "permitted" | "program-only" | "not-permitted";
  feeRequired: boolean;
  reservationsRecommended: boolean;
  activities: string[];
  amenities: string[];
  categories: string[];
  tags: string[];
  accessNotes: string;
  ecologicalNotes: string;
  verificationStatus: "official-source-reviewed";
  lastReviewed: string;
};

export const majorSpringCatalog: readonly MajorSpringCatalogRecord[] = [
  {
    id: "major-spring-san-solomon-springs",
    slug: "san-solomon-springs",
    name: "San Solomon Springs",
    city: "Toyahvale",
    county: "Reeves County",
    region: "West Texas",
    latitude: 30.945036,
    longitude: -103.786663,
    officialUrl: "https://tpwd.texas.gov/state-parks/balmorhea/endangered-species-san-solomon-springs",
    sourceName: "Texas Parks and Wildlife Department",
    summary:
      "A major artesian spring system that fills Balmorhea State Park's historic spring-fed pool and supports rare desert-wetland wildlife.",
    integrationMode: "enrich-existing",
    existingDestinationSlug: "balmorhea-state-park",
    managingOrganization: "Texas Parks and Wildlife Department",
    ownership: "Public state park resource",
    publicAccess: true,
    accessStatus: "open-public-access",
    swimmingStatus: "permitted",
    feeRequired: true,
    reservationsRecommended: true,
    activities: ["Swimming", "Snorkeling", "Scuba diving", "Wildlife observation", "Nature study"],
    amenities: ["Spring-fed pool", "Restrooms", "Parking", "Camping", "Historic lodging"],
    categories: ["Major Texas spring", "Artesian spring", "State park spring", "Desert oasis"],
    tags: ["San Solomon Springs", "Balmorhea", "spring-fed swimming", "West Texas", "cienega"],
    accessNotes:
      "Public access is through Balmorhea State Park. The park frequently reaches capacity, and advance day-pass reservations are strongly recommended.",
    ecologicalNotes:
      "The spring system supports federally and state-protected aquatic species and restored desert wetlands within Balmorhea State Park.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "major-spring-barton-springs",
    slug: "barton-springs-pool",
    name: "Barton Springs Pool",
    city: "Austin",
    county: "Travis County",
    region: "Central Texas",
    latitude: 30.2638,
    longitude: -97.7713,
    officialUrl: "https://www.austintexas.gov/services/visit-barton-springs-pool",
    sourceName: "City of Austin Parks and Recreation",
    summary:
      "A three-acre, spring-fed public swimming pool in Zilker Park supplied by the Barton Springs system and known for year-round cool water.",
    integrationMode: "create",
    existingDestinationSlug: null,
    managingOrganization: "City of Austin Parks and Recreation Department",
    ownership: "Municipal public park facility",
    publicAccess: true,
    accessStatus: "open-public-access",
    swimmingStatus: "permitted",
    feeRequired: true,
    reservationsRecommended: false,
    activities: ["Swimming", "Sunbathing", "Ecology interpretation", "Wildlife observation"],
    amenities: ["Lifeguarded swimming", "Restrooms", "Changing facilities", "Parking", "Educational exhibits"],
    categories: ["Major Texas spring", "Spring-fed pool", "Urban natural landmark", "Public swimming"],
    tags: ["Barton Springs", "Zilker Park", "Austin", "Edwards Aquifer", "spring-fed swimming"],
    accessNotes:
      "Admission, guarded-swim periods, cleaning closures, and parking rules vary by day and season; visitors should verify the current City of Austin schedule before arrival.",
    ecologicalNotes:
      "The Barton Springs system is habitat for protected aquatic species, including the endangered Barton Springs salamander.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "major-spring-san-marcos-springs",
    slug: "san-marcos-springs-spring-lake",
    name: "San Marcos Springs at Spring Lake",
    city: "San Marcos",
    county: "Hays County",
    region: "Central Texas",
    latitude: 29.8937,
    longitude: -97.9304,
    officialUrl: "https://www.meadowscenter.txst.edu/explorespringlake.html",
    sourceName: "The Meadows Center for Water and the Environment at Texas State University",
    summary:
      "A large aquifer-driven spring system forming Spring Lake and the headwaters of the San Marcos River, interpreted through public ecological tours and programs.",
    integrationMode: "create",
    existingDestinationSlug: null,
    managingOrganization: "Texas State University",
    ownership: "Public university-managed natural and educational resource",
    publicAccess: true,
    accessStatus: "open-limited-program-access",
    swimmingStatus: "program-only",
    feeRequired: true,
    reservationsRecommended: true,
    activities: ["Glass-bottom boat tours", "Guided snorkeling", "Guided paddling", "Environmental education", "Wildlife observation"],
    amenities: ["Visitor center", "Tour facilities", "Restrooms", "Parking", "Educational exhibits"],
    categories: ["Major Texas spring", "Aquifer spring system", "Educational attraction", "Critical habitat"],
    tags: ["San Marcos Springs", "Spring Lake", "San Marcos River", "Edwards Aquifer", "glass-bottom boats"],
    accessNotes:
      "General visitors experience the springs through Spring Lake park facilities and scheduled programs. In-water access is limited to authorized tours, courses, or stewardship programs.",
    ecologicalNotes:
      "Spring Lake and the upper San Marcos River support multiple threatened and endangered species and are managed as a sensitive freshwater ecosystem.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "major-spring-jacobs-well",
    slug: "jacobs-well-natural-area",
    name: "Jacob's Well Natural Area",
    city: "Wimberley",
    county: "Hays County",
    region: "Hill Country",
    latitude: 30.0341,
    longitude: -98.1263,
    officialUrl: "https://www.hayscountytx.gov/449/Things-to-Do",
    sourceName: "Hays County Parks and Natural Resources",
    summary:
      "A Hill Country artesian spring and karst natural area at the headwaters of Cypress Creek, protected for water, habitat, and public education.",
    integrationMode: "create",
    existingDestinationSlug: null,
    managingOrganization: "Hays County Parks and Natural Resources",
    ownership: "County-owned public natural area",
    publicAccess: true,
    accessStatus: "open-no-swimming",
    swimmingStatus: "not-permitted",
    feeRequired: false,
    reservationsRecommended: false,
    activities: ["Hiking", "Guided nature tours", "Birding", "Geocaching", "Scenic photography"],
    amenities: ["Trails", "Nature center", "Restrooms", "Parking", "Picnic areas", "Interpretive gardens"],
    categories: ["Major Texas spring", "Karst spring", "County natural area", "Conservation destination"],
    tags: ["Jacob's Well", "Wimberley", "Cypress Creek", "Trinity Aquifer", "karst"],
    accessNotes:
      "The natural area is open for hiking and educational access, but swimming has remained closed because of low spring flow and unsafe water conditions. Pets are not permitted.",
    ecologicalNotes:
      "The preserve protects a sensitive karst spring, groundwater recharge features, native habitat, and the headwaters of Cypress Creek.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "major-spring-hancock-springs",
    slug: "hancock-springs-park",
    name: "Hancock Springs Park",
    city: "Lampasas",
    county: "Lampasas County",
    region: "Hill Country",
    latitude: 31.0516,
    longitude: -98.1817,
    officialUrl: "https://lampasas.org/367/Hancock-Springs-Park",
    sourceName: "City of Lampasas",
    summary:
      "A historic municipal park centered on a free-flowing spring-fed swimming pool and shaded community recreation grounds in Lampasas.",
    integrationMode: "create",
    existingDestinationSlug: null,
    managingOrganization: "City of Lampasas",
    ownership: "Municipal public park facility",
    publicAccess: true,
    accessStatus: "open-public-access",
    swimmingStatus: "permitted",
    feeRequired: true,
    reservationsRecommended: false,
    activities: ["Swimming", "Picnicking", "Playground recreation", "Volleyball"],
    amenities: ["Spring-fed pool", "Hostess house", "Playground", "Picnic area", "Volleyball court"],
    categories: ["Major Texas spring", "Spring-fed pool", "Municipal park", "Family recreation"],
    tags: ["Hancock Springs", "Lampasas", "spring-fed swimming", "historic pool", "Hill Country"],
    accessNotes:
      "Park grounds are publicly accessible during posted hours. Aquatic-facility admission and seasonal pool operations should be confirmed with the City of Lampasas.",
    ecologicalNotes:
      "The free-flowing spring is part of the Lampasas River watershed and has long supported recreation and settlement in the area.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "major-spring-blue-hole-regional-park",
    slug: "blue-hole-regional-park",
    name: "Blue Hole Regional Park",
    city: "Wimberley",
    county: "Hays County",
    region: "Hill Country",
    latitude: 30.002089,
    longitude: -98.087,
    officialUrl: "https://www.cityofwimberley.com/facilities/facility/details/Blue-Hole-Regional-Park-2",
    sourceName: "City of Wimberley Parks and Recreation",
    summary:
      "A municipal Hill Country park centered on a clear Cypress Creek swimming area shaded by mature bald cypress trees.",
    integrationMode: "create",
    existingDestinationSlug: null,
    managingOrganization: "City of Wimberley Parks and Recreation",
    ownership: "Municipal public park and protected swimming area",
    publicAccess: true,
    accessStatus: "open-public-access",
    swimmingStatus: "permitted",
    feeRequired: true,
    reservationsRecommended: true,
    activities: ["Swimming", "Hiking", "Biking", "Picnicking", "Nature observation"],
    amenities: ["Seasonal swim area", "Restrooms", "Changing facilities", "Parking", "Trails", "Picnic areas", "Life jackets"],
    categories: ["Major Texas spring", "Spring-fed swimming hole", "Municipal park", "Hill Country recreation"],
    tags: ["Blue Hole", "Wimberley", "Cypress Creek", "spring-fed swimming", "Hill Country"],
    accessNotes:
      "The park is open during posted daily hours. Advance online reservations are required to enter the swim area during swim season, and swimming may be suspended when groundwater flow, visibility, bacteria, or severe-weather conditions are unsafe.",
    ecologicalNotes:
      "The swimming area is sustained by Cypress Creek springs and seeps downstream of Jacob's Well and is managed with routine seasonal water-quality monitoring.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "major-spring-krause-springs",
    slug: "krause-springs",
    name: "Krause Springs",
    city: "Spicewood",
    county: "Burnet County",
    region: "Hill Country",
    latitude: 30.4805,
    longitude: -98.145889,
    officialUrl: "https://www.krausesprings.net/",
    sourceName: "Krause Springs official website",
    summary:
      "A privately owned Hill Country swimming and camping destination where dozens of natural springs feed landscaped and natural pools above Lake Travis.",
    integrationMode: "create",
    existingDestinationSlug: null,
    managingOrganization: "Krause family",
    ownership: "Private family-owned natural recreation property",
    publicAccess: true,
    accessStatus: "open-public-access",
    swimmingStatus: "permitted",
    feeRequired: true,
    reservationsRecommended: false,
    activities: ["Swimming", "Camping", "Picnicking", "Nature photography", "Garden walks"],
    amenities: ["Natural swimming pool", "Manmade spring-fed pool", "Restrooms", "Showers", "Parking", "Tent camping", "RV sites", "Butterfly garden"],
    categories: ["Major Texas spring", "Private natural landmark", "Spring-fed swimming", "Camping destination"],
    tags: ["Krause Springs", "Spicewood", "spring-fed swimming", "camping", "Lake Travis", "Hill Country"],
    accessNotes:
      "Public day-use access is offered during the property's posted operating season and hours. Admission is required, pets are generally prohibited, and visitors should confirm seasonal closures and current policies before travel.",
    ecologicalNotes:
      "Thirty-two springs on the property feed the swimming pools and flow toward Little Cypress Creek and Lake Travis.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "major-spring-las-moras-springs",
    slug: "las-moras-springs-fort-clark",
    name: "Las Moras Springs at Fort Clark",
    city: "Brackettville",
    county: "Kinney County",
    region: "South Texas",
    latitude: 29.3108,
    longitude: -100.4176,
    officialUrl: "https://www.fortclark.com/las-moras-springs",
    sourceName: "Fort Clark Springs Association",
    summary:
      "A large artesian spring group at historic Fort Clark that forms the headwaters of Las Moras Creek and supplies a landmark spring-fed swimming pool.",
    integrationMode: "create",
    existingDestinationSlug: null,
    managingOrganization: "Fort Clark Springs Association",
    ownership: "Private association-managed historic community and visitor destination",
    publicAccess: true,
    accessStatus: "open-public-access",
    swimmingStatus: "permitted",
    feeRequired: true,
    reservationsRecommended: false,
    activities: ["Swimming", "Hiking", "Biking", "Birding", "Historic interpretation", "Picnicking"],
    amenities: ["Spring-fed pool", "Picnic area", "Restrooms", "Parking", "Motel", "RV park", "Campground", "Historic sites"],
    categories: ["Major Texas spring", "Artesian spring", "Historic destination", "Spring-fed swimming"],
    tags: ["Las Moras Springs", "Fort Clark", "Brackettville", "spring-fed swimming", "historic fort", "South Texas"],
    accessNotes:
      "Visitors may access the spring-fed pool under current Fort Clark Springs Association admission and identification policies. Pool rules, guest eligibility, fees, and operating conditions should be verified before arrival.",
    ecologicalNotes:
      "The artesian springs emerge through a fault over Edwards limestone, form the headwaters of Las Moras Creek, and vary in flow with regional recharge conditions.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
] as const;

const majorSpringBySlug = new Map(majorSpringCatalog.map((spring) => [spring.slug, spring]));

export function getMajorSpringBySlug(slug: string): MajorSpringCatalogRecord | null {
  return majorSpringBySlug.get(slug) ?? null;
}
