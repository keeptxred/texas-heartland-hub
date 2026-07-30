import type { ExploreJson, ExploreJsonObject } from "@/types/explore/public";

export type TpwdCavernDestinationEnrichment = {
  destinationId: "longhorn-cavern-state-park" | "kickapoo-cavern-state-park";
  alternateNames: string[];
  description: string;
  phone: string;
  email: string | null;
  address: ExploreJsonObject;
  profile: ExploreJsonObject;
  hours: ExploreJson;
  fees: ExploreJsonObject;
  regulations: ExploreJsonObject;
  seasonalGuidance: ExploreJsonObject;
  categories: string[];
  tags: string[];
  sourceUrl: string;
  sourceName: "Texas Parks and Wildlife Department";
  sourceUpdatedAt: string;
};

export const tpwdCavernDestinationEnrichments: Record<
  TpwdCavernDestinationEnrichment["destinationId"],
  TpwdCavernDestinationEnrichment
> = {
  "longhorn-cavern-state-park": {
    destinationId: "longhorn-cavern-state-park",
    alternateNames: ["Longhorn Cavern"],
    description:
      "Longhorn Cavern State Park protects a historic Hill Country limestone cavern shaped by an ancient underground river. Visitors can join paid guided cavern tours, explore Civilian Conservation Corps architecture and exhibits, hike short surface trails, picnic, and take in overlooks along Park Road 4. The park grounds are day-use only and do not offer overnight camping.",
    phone: "512-715-9000",
    email: "info@visitlonghorncavern.com",
    address: {
      street: "6211 Park Road 4 S",
      city: "Burnet",
      state: "TX",
      postalCode: "78611",
      country: "US",
    },
    profile: {
      ownership: "State of Texas",
      managingAgency: "Texas Parks and Wildlife Department",
      cavernTourOperator: "Longhorn Cavern State Park concession operator",
      accessType: "Public day-use state park with paid guided cavern access",
      destinationClass: "TPWD cavern destination",
      cavernType: "Developed show cave",
      geology:
        "Limestone cavern formed and enlarged by groundwater and an ancient underground river, with sculpted passages and natural chambers.",
      guidedTours: true,
      reservationsRecommended: true,
      campingAvailable: false,
      dayUseOnly: true,
      familyFriendly: true,
      accessibilityNotes:
        "Surface facilities include accessible features, but natural cavern routes include stairs, slopes, low clearances, wet surfaces, and uneven footing. Visitors should confirm the accessibility of a specific tour before booking.",
      petPolicy:
        "Pets may visit outdoor park grounds when permitted by Texas State Parks rules, but they are not allowed inside park buildings or on cavern tours. Service animals are handled under applicable accessibility rules.",
      photography:
        "Personal handheld photography may be allowed on standard tours subject to operator instructions, safety requirements, and restrictions on flash or bulky equipment.",
      educational: true,
      historicSignificance:
        "Civilian Conservation Corps crews cleared debris from the cavern and built park facilities and the scenic approach road during the 1930s.",
    },
    hours: {
      parkGrounds: "Open daily except December 25",
      cavernTours: "Tour schedules vary by date and must be verified with the cavern operator",
      notes: "The park is day-use only.",
    },
    fees: {
      parkGrounds: "Free",
      cavernTours: "Paid guided tours; prices vary by tour and date",
      notes: "Cavern admission is separate from access to the park grounds.",
    },
    regulations: {
      cavernAccess: "Cavern entry is permitted only through an authorized guided tour.",
      pets: "Pets are not permitted in buildings or on cavern tours.",
      camping: "No overnight camping is available at this park.",
      verification:
        "Visitors should verify current tour availability, age or mobility requirements, equipment rules, and closures before traveling.",
    },
    seasonalGuidance: {
      yearRound: true,
      holidayClosure: "Park grounds are closed December 25.",
      weather:
        "Surface trails and overlooks can be hot in summer. Cavern conditions are cooler and may be damp or slippery year-round.",
      planning:
        "Advance tour reservations are recommended, especially on weekends, holidays, and school-break dates.",
    },
    categories: [
      "state park",
      "cavern",
      "show cave",
      "guided underground tour",
      "geological attraction",
      "historic site",
      "family attraction",
      "Hill Country",
    ],
    tags: [
      "Longhorn Cavern",
      "limestone cavern",
      "guided cave tour",
      "wild cave tour",
      "Civilian Conservation Corps",
      "CCC architecture",
      "day-use park",
      "Burnet",
      "Hill Country cavern",
      "Texas caverns",
    ],
    sourceUrl: "https://tpwd.texas.gov/state-parks/longhorn-cavern",
    sourceName: "Texas Parks and Wildlife Department",
    sourceUpdatedAt: "2026-07-26",
  },
  "kickapoo-cavern-state-park": {
    destinationId: "kickapoo-cavern-state-park",
    alternateNames: ["Kickapoo Cavern"],
    description:
      "Kickapoo Cavern State Park is a remote West Texas park protecting undeveloped caves, Chihuahuan Desert and Edwards Plateau habitat, bat roosts, rugged trails, and dark skies. Authorized three-hour wild-cave tours enter Kickapoo Cavern on a limited schedule, while the surface park supports camping, hiking, mountain biking, birding, wildlife viewing, and seasonal bat-flight experiences.",
    phone: "830-563-2342",
    email: "KickapooCavernSP@tpwd.texas.gov",
    address: {
      city: "Brackettville",
      state: "TX",
      postalCode: "78832",
      country: "US",
    },
    profile: {
      ownership: "State of Texas",
      managingAgency: "Texas Parks and Wildlife Department",
      accessType: "Public state park with restricted guided cavern access",
      destinationClass: "TPWD cavern destination",
      cavernType: "Undeveloped wild cave",
      geology:
        "Natural limestone cave system with undeveloped passages, breakdown, uneven floors, and sensitive subterranean habitat.",
      guidedTours: true,
      reservationsRequiredForCavern: true,
      standardTourDurationMinutes: 180,
      minimumTourAge: 5,
      standardTourCapacity: 10,
      campingAvailable: true,
      familyFriendly: true,
      accessibilityNotes:
        "Kickapoo Cavern is an undeveloped, strenuous underground hike and is not an accessible route. Some campsites and surface facilities have wheelchair-accessible features.",
      petPolicy:
        "Pets may be allowed in designated surface areas under Texas State Parks rules but are not permitted in park buildings or on cavern tours. Visitors should confirm park-specific restrictions before arrival.",
      requiredTourEquipment: [
        "Sturdy closed-toe hiking or walking shoes with good traction",
        "Two independent light sources per person",
      ],
      educational: true,
      wildlifeSignificance:
        "The park protects important cave and surface habitat, including seasonal bat populations and diverse birdlife.",
    },
    hours: {
      gate: {
        fridayThroughSunday: "7:00 a.m. to 10:00 p.m.",
        monday: "7:00 a.m. to 4:30 p.m.",
      },
      headquarters: "Friday through Monday, 8:30 a.m. to 4:30 p.m.",
      closed: "Tuesday through Thursday",
      caveTours: "Standard wild-cave tours are scheduled Saturdays at 1:00 p.m.; verify availability before travel.",
    },
    fees: {
      entrance: {
        adult13AndOlder: "$3 daily",
        child12AndUnder: "Free",
      },
      caveTour: "$10 per person in addition to the park entrance fee",
      camping: {
        fullHookup: "$25 nightly plus entrance fee",
        campsitesWithWater: "$15 nightly plus entrance fee",
        groupCamp: "$45 nightly plus entrance fee",
      },
      notes: "Fees and schedules may change; confirm during reservation.",
    },
    regulations: {
      cavernAccess: "Unauthorized entry into caves is prohibited.",
      reservations: "Cavern-tour reservations are required and may be made up to five months in advance.",
      tourSafety:
        "Participants must meet the minimum age, wear appropriate footwear, carry two light sources, and follow all guide instructions.",
      capacity: "The standard wild-cave tour is limited to 10 participants.",
      waste: "The park has no trash disposal; campers must pack out all trash.",
    },
    seasonalGuidance: {
      yearRound: true,
      limitedOperatingDays: "The park is normally closed Tuesday through Thursday.",
      capacity:
        "Camping and day-use capacity can fill; reservations are recommended before making the remote drive.",
      bats:
        "Bat-flight viewing is seasonal and depends on wildlife activity, weather, and scheduled programming.",
      weather:
        "West Texas heat, storms, and remote-road conditions can affect surface activities. Cave routes remain rugged and may be wet or slippery.",
    },
    categories: [
      "state park",
      "cavern",
      "wild cave",
      "guided underground tour",
      "bat viewing",
      "camping",
      "geological attraction",
      "West Texas",
    ],
    tags: [
      "Kickapoo Cavern",
      "wild cave tour",
      "undeveloped cave",
      "guided cave tour",
      "bat flight",
      "primitive camping",
      "RV camping",
      "mountain biking",
      "birding",
      "Brackettville",
      "West Texas cavern",
      "Texas caverns",
    ],
    sourceUrl: "https://tpwd.texas.gov/state-parks/kickapoo-cavern",
    sourceName: "Texas Parks and Wildlife Department",
    sourceUpdatedAt: "2026-07-26",
  },
};

export function getTpwdCavernDestinationEnrichment(
  destinationId: string,
): TpwdCavernDestinationEnrichment | null {
  if (destinationId === "longhorn-cavern-state-park" || destinationId === "kickapoo-cavern-state-park") {
    return tpwdCavernDestinationEnrichments[destinationId];
  }

  return null;
}
