export type PrivateNaturalLandmarkOwnership =
  | "private-nonprofit-preserve"
  | "private-family-operated";

export type PrivateNaturalLandmarkAccessModel =
  | "reservation-guided-access"
  | "scheduled-public-program-access"
  | "ticketed-day-use-and-overnight-access";

export type PrivateNaturalLandmarkRecord = {
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
  ownershipClassification: PrivateNaturalLandmarkOwnership;
  ownershipLabel: string;
  publicAccess: boolean;
  accessModel: PrivateNaturalLandmarkAccessModel;
  admissionRequired: boolean;
  reservationsRequired: boolean;
  swimmingStatus: "permitted" | "not-permitted";
  overnightAccess: boolean;
  activities: string[];
  amenities: string[];
  categories: string[];
  tags: string[];
  accessNotes: string;
  conservationNotes: string;
  verificationStatus: "official-source-reviewed";
  lastReviewed: string;
};

export const privateNaturalLandmarkCatalog: readonly PrivateNaturalLandmarkRecord[] = [
  {
    id: "private-natural-landmark-westcave-preserve",
    slug: "westcave-preserve",
    name: "Westcave Preserve",
    city: "Round Mountain",
    county: "Travis County",
    region: "Hill Country",
    latitude: 30.3392,
    longitude: -98.1426,
    officialUrl: "https://www.westcave.org/home",
    sourceName: "Westcave Outdoor Discovery Center",
    summary:
      "A privately protected Hill Country canyon preserve with limestone formations, a grotto, waterfall habitat, upland trails, and guided conservation-focused visitor access.",
    operator: "Westcave Outdoor Discovery Center",
    ownershipClassification: "private-nonprofit-preserve",
    ownershipLabel: "Private nonprofit nature preserve",
    publicAccess: true,
    accessModel: "reservation-guided-access",
    admissionRequired: true,
    reservationsRequired: true,
    swimmingStatus: "not-permitted",
    overnightAccess: false,
    activities: [
      "Guided hiking",
      "Birding",
      "Wildlife observation",
      "Geology interpretation",
      "Environmental education",
      "Nature photography",
    ],
    amenities: [
      "Environmental learning center",
      "Upland trails",
      "Bird blinds",
      "Restrooms",
      "Picnic tables",
      "Parking",
    ],
    categories: [
      "Private natural landmark",
      "Nature preserve",
      "Hill Country canyon",
      "Conservation destination",
    ],
    tags: [
      "Westcave Preserve",
      "Westcave Outdoor Discovery Center",
      "grotto",
      "waterfall",
      "guided nature hike",
      "Hill Country",
    ],
    accessNotes:
      "Canyon, grotto, waterfall, and cave-area access is limited to scheduled guided hikes. Reservations are required for guided preserve experiences, and swimming or water contact is not permitted.",
    conservationNotes:
      "The nonprofit preserve protects fragile limestone-canyon, spring, savanna, and wildlife habitat through guided access, restoration, monitoring, and environmental education.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "private-natural-landmark-chalk-bluff-river-resort",
    slug: "chalk-bluff-river-resort",
    name: "Chalk Bluff River Resort",
    city: "Uvalde",
    county: "Uvalde County",
    region: "South Texas",
    latitude: 29.2728,
    longitude: -99.9797,
    officialUrl: "https://www.chalkbluffriverresort.com/",
    sourceName: "Chalk Bluff River Resort",
    summary:
      "A family-operated private park and resort along the spring-fed Nueces River, centered on a prominent limestone bluff and two miles of river recreation frontage.",
    operator: "Chalk Bluff River Resort",
    ownershipClassification: "private-family-operated",
    ownershipLabel: "Family-operated private river park and resort",
    publicAccess: true,
    accessModel: "ticketed-day-use-and-overnight-access",
    admissionRequired: true,
    reservationsRequired: false,
    swimmingStatus: "permitted",
    overnightAccess: true,
    activities: [
      "Swimming",
      "Fishing",
      "Kayaking",
      "Tubing",
      "Hiking",
      "Birding",
      "Camping",
    ],
    amenities: [
      "Cabins",
      "Tent camping",
      "RV sites",
      "River access",
      "Convenience store",
      "Playground",
      "Parking",
    ],
    categories: [
      "Private natural landmark",
      "River bluff",
      "Private recreation park",
      "Nueces River destination",
    ],
    tags: [
      "Chalk Bluff",
      "Nueces River",
      "Uvalde",
      "limestone bluff",
      "river swimming",
      "private campground",
    ],
    accessNotes:
      "Public access is available through paid day-use admission or overnight reservations. Seasonal closures, river conditions, and property guidelines should be confirmed before travel.",
    conservationNotes:
      "The property preserves a long-established recreation landscape along a spring-fed reach of the Nueces River and its prominent limestone bluff.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    id: "private-natural-landmark-selah-bamberger-ranch-preserve",
    slug: "selah-bamberger-ranch-preserve",
    name: "Selah, Bamberger Ranch Preserve",
    city: "Johnson City",
    county: "Blanco County",
    region: "Hill Country",
    latitude: 30.1872,
    longitude: -98.4761,
    officialUrl: "https://www.bambergerranch.org/",
    sourceName: "Selah, Bamberger Ranch Preserve",
    summary:
      "A 5,500-acre privately protected Hill Country ranch restored from degraded land into native grassland, woodland, spring, lake, and wildlife habitat used for conservation education and research.",
    operator: "Selah, Bamberger Ranch Preserve",
    ownershipClassification: "private-nonprofit-preserve",
    ownershipLabel: "Private nonprofit ranch preserve",
    publicAccess: true,
    accessModel: "scheduled-public-program-access",
    admissionRequired: true,
    reservationsRequired: true,
    swimmingStatus: "not-permitted",
    overnightAccess: false,
    activities: [
      "Guided ranch tours",
      "Birding",
      "Wildlife observation",
      "Land stewardship education",
      "Nature photography",
      "Bat watching",
      "Fossil interpretation",
    ],
    amenities: [
      "Research and education center",
      "Nature trails",
      "Madrone Lake",
      "Chiroptorium bat habitat",
      "Restrooms",
      "Parking",
    ],
    categories: [
      "Private natural landmark",
      "Ranch preserve",
      "Habitat restoration",
      "Conservation education destination",
    ],
    tags: [
      "Bamberger Ranch Preserve",
      "Selah",
      "Johnson City",
      "land restoration",
      "Hill Country conservation",
      "Chiroptorium",
      "Madrone Lake",
    ],
    accessNotes:
      "The preserve is not open for unscheduled individual visitation. Public access is limited to ticketed scheduled tours, workshops, family events, educational programs, or advance-arranged group visits.",
    conservationNotes:
      "The preserve demonstrates more than five decades of watershed repair, habitat restoration, biodiversity research, and practical land-stewardship education across 5,500 protected acres.",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
] as const;

const privateNaturalLandmarkBySlug = new Map(
  privateNaturalLandmarkCatalog.map((landmark) => [landmark.slug, landmark]),
);

export function getPrivateNaturalLandmarkBySlug(
  slug: string,
): PrivateNaturalLandmarkRecord | null {
  return privateNaturalLandmarkBySlug.get(slug) ?? null;
}
