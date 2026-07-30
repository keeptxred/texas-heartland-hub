export type PrivateCulturalLandmarkOwnership =
  | "private-land-public-art"
  | "private-family-operated-attraction";

export type PrivateCulturalLandmarkAccessModel =
  | "free-open-public-access"
  | "reservation-ticketed-tour-access";

export type PrivateCulturalLandmarkRecord = {
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
  operator: string;
  ownershipClassification: PrivateCulturalLandmarkOwnership;
  ownershipLabel: string;
  publicAccess: boolean;
  accessModel: PrivateCulturalLandmarkAccessModel;
  admissionRequired: boolean;
  reservationsRequired: boolean;
  guidedTourAvailable: boolean;
  overnightAccess: boolean;
  activities: string[];
  amenities: string[];
  categories: string[];
  tags: string[];
  accessNotes: string;
  culturalSignificance: string;
  verificationStatus: "official-source-reviewed";
  lastReviewed: string;
};

export const privateCulturalLandmarkCatalog: readonly PrivateCulturalLandmarkRecord[] = [
  {
    id: "private-cultural-landmark-cadillac-ranch",
    slug: "cadillac-ranch",
    name: "Cadillac Ranch",
    city: "Amarillo",
    county: "Potter County",
    region: "Panhandle",
    latitude: 35.18723,
    longitude: -101.98707,
    officialUrl: "https://www.visitamarillo.com/listing/cadillac-ranch/625/",
    sourceName: "Visit Amarillo",
    summary:
      "A landmark participatory art installation of ten vintage Cadillacs buried nose-first in a privately owned field beside Interstate 40 west of Amarillo.",
    operator: "Cadillac Ranch property management",
    ownershipClassification: "private-land-public-art",
    ownershipLabel: "Privately owned land with authorized public art access",
    publicAccess: true,
    accessModel: "free-open-public-access",
    admissionRequired: false,
    reservationsRequired: false,
    guidedTourAvailable: false,
    overnightAccess: false,
    activities: [
      "Public art viewing",
      "Participatory spray-paint art",
      "Photography",
      "Route 66 sightseeing",
    ],
    amenities: ["Roadside parking area", "Pedestrian gate", "Waste dumpsters"],
    categories: [
      "Private cultural landmark",
      "Public art installation",
      "Route 66 landmark",
      "Roadside attraction",
    ],
    tags: [
      "Cadillac Ranch",
      "Ant Farm",
      "Amarillo",
      "Route 66",
      "buried Cadillacs",
      "participatory art",
    ],
    accessNotes:
      "The installation is open without admission throughout the year. Visitors enter the privately owned field through the designated pedestrian gate and should use the established access area, respect posted rules, and remove or properly dispose of litter.",
    culturalSignificance:
      "Created in 1974 by the art group Ant Farm, Cadillac Ranch became an internationally recognized expression of automobile culture, roadside Americana, Route 66 travel, and continually changing participatory art.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "private-cultural-landmark-newmans-castle",
    slug: "newmans-castle",
    name: "Newman's Castle",
    city: "Bellville",
    county: "Austin County",
    region: "Gulf Coast",
    latitude: 29.9735,
    longitude: -96.2578,
    officialUrl: "https://newmanscastle.com/",
    sourceName: "Newman's Castle",
    summary:
      "A privately built medieval-inspired castle in the Bellville countryside featuring a moat, working drawbridge, chapel, turrets, courtyard, central keep, and visitor tours.",
    operator: "Newman's Castle Keepers",
    ownershipClassification: "private-family-operated-attraction",
    ownershipLabel: "Family-operated private cultural attraction and residence",
    publicAccess: true,
    accessModel: "reservation-ticketed-tour-access",
    admissionRequired: true,
    reservationsRequired: true,
    guidedTourAvailable: true,
    overnightAccess: true,
    activities: [
      "Guided castle tours",
      "Architecture interpretation",
      "Photography",
      "Special events",
      "Overnight stays",
    ],
    amenities: [
      "Moat",
      "Working drawbridge",
      "Courtyard",
      "Chapel",
      "Central keep",
      "Overnight rooms",
      "Parking",
    ],
    categories: [
      "Private cultural landmark",
      "Architectural attraction",
      "Private museum experience",
      "Texas roadside attraction",
    ],
    tags: [
      "Newman's Castle",
      "Bellville",
      "medieval architecture",
      "drawbridge",
      "castle tour",
      "private attraction",
    ],
    accessNotes:
      "Public visits require advance booking. Day tours are offered on scheduled operating days, and the property may also be reserved for photo sessions, special events, or overnight stays. Visitors should confirm current dates and arrival instructions before travel.",
    culturalSignificance:
      "Designed and largely built by Bellville baker Mike Newman beginning in 1998, the castle represents an individual Texas folk-architecture vision transformed into a family-operated visitor attraction.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
] as const;

const privateCulturalLandmarkBySlug = new Map(
  privateCulturalLandmarkCatalog.map((landmark) => [landmark.slug, landmark]),
);

export function getPrivateCulturalLandmarkBySlug(
  slug: string,
): PrivateCulturalLandmarkRecord | null {
  return privateCulturalLandmarkBySlug.get(slug) ?? null;
}
