import type { ExploreEntity, ExploreJson } from "@/types/explore/public";

type ScenicRiverRecord = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  segmentBoundary: string;
  counties: string[];
  region: string;
  latitude: number;
  longitude: number;
  sourceUrl: string;
  accessNotes: string;
  ecologicalNotes: string;
  activities: string[];
  relatedDestinationSlugs: string[];
};

const LAST_REVIEWED = "2026-07-26";
const SOURCE_NAME = "Texas Parks and Wildlife Department";

const scenicRiverCatalog: readonly ScenicRiverRecord[] = [
  {
    slug: "brazos-river-scenic-segment-bosque-hood",
    name: "Brazos River Scenic Segment — Bosque to Hood",
    summary:
      "A nationally inventoried Brazos River reach with outstanding wildlife, scenery, and recreation values below DeCordova Bend Dam.",
    description:
      "TPWD identifies this discrete Brazos River reach as an ecologically significant Texas Natural Rivers System nominee rather than as part of a generalized North Texas corridor.",
    segmentBoundary:
      "From immediately upstream of the Camp Creek confluence in Bosque and Johnson counties upstream to DeCordova Bend Dam in Hood County.",
    counties: ["Bosque County", "Johnson County", "Hood County"],
    region: "North Texas",
    latitude: 32.342,
    longitude: -97.708,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regiong.phtml",
    accessNotes:
      "Use established ramps, parks, leased access, or lawful public crossings. Confirm reservoir releases, streamflow, weather, and take-out access before launching.",
    ecologicalNotes:
      "TPWD cites outstanding wildlife value and ranks the reach among the leading scenic and recreational rivers in northern Texas.",
    activities: ["paddling", "fishing", "boating", "wildlife", "photography"],
    relatedDestinationSlugs: ["lake-granbury"],
  },
  {
    slug: "brazos-river-scenic-segment-parker-palo-pinto",
    name: "Brazos River Scenic Segment — Parker to Palo Pinto",
    summary:
      "A scenic Brazos River reach below Possum Kingdom Lake with limestone bluffs, wildlife habitat, fishing, and demanding paddling conditions.",
    description:
      "This record joins the adjoining TPWD Region C and Region G descriptions into one continuous authoritative reach while retaining the published endpoints.",
    segmentBoundary:
      "From 330 feet upstream of FM 2580 in Parker County upstream to Morris Sheppard Dam in Palo Pinto County.",
    counties: ["Parker County", "Palo Pinto County"],
    region: "North Texas",
    latitude: 32.785,
    longitude: -98.105,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionc.phtml",
    accessNotes:
      "Use designated access and verify dam releases, flow, portage requirements, hazards, and private-bank restrictions.",
    ecologicalNotes:
      "The reach is a Texas Natural Rivers System nominee with outstanding wildlife and scenic values and habitat for rare endemic freshwater mussels.",
    activities: ["paddling", "fishing", "boating", "wildlife", "camping"],
    relatedDestinationSlugs: ["possum-kingdom-lake"],
  },
  {
    slug: "colorado-river-scenic-segment-upper-west-central",
    name: "Colorado River Scenic Segment — Upper West-Central Texas",
    summary:
      "A long upper Colorado River reach recognized for fish, wildlife, and exceptional scenic value across West-Central Texas.",
    description:
      "This authoritative segment replaces the former generalized Central Texas Colorado River corridor and preserves TPWD's upstream and downstream limits.",
    segmentBoundary:
      "From the Brown, San Saba, and Mills county area upstream to Robert Lee Dam in Coke County, excluding O.H. Ivie Reservoir.",
    counties: ["Brown County", "San Saba County", "Mills County", "McCulloch County", "Coke County"],
    region: "West-Central Texas",
    latitude: 31.42,
    longitude: -99.47,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionf.phtml",
    accessNotes:
      "Access is limited and conditions vary around impoundments and private lands. Use lawful access and verify flows and reservoir operations.",
    ecologicalNotes:
      "TPWD identifies the reach as a Texas Natural Rivers System nominee for outstanding fish and wildlife values and exceptional aesthetics.",
    activities: ["paddling", "fishing", "boating", "wildlife", "photography"],
    relatedDestinationSlugs: [],
  },
  {
    slug: "colorado-river-scenic-segment-colorado-bend",
    name: "Colorado River Scenic Segment — Colorado Bend",
    summary:
      "A rugged Colorado River reach associated with Colorado Bend State Park, rare mussels, native wildlife, and limestone canyon scenery.",
    description:
      "This record combines adjoining TPWD Region K and Region G descriptions into a single continuous segment with explicit endpoints.",
    segmentBoundary:
      "From immediately upstream of the Yancey Creek confluence in the Burnet, San Saba, and Lampasas county area upstream to the Brown, Mills, San Saba, and McCulloch county area.",
    counties: ["Burnet County", "Lampasas County", "San Saba County", "Mills County", "Brown County", "McCulloch County"],
    region: "Central Texas",
    latitude: 31.03,
    longitude: -98.45,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionk.phtml",
    accessNotes:
      "Use state-park or other lawful access. Check river levels, weather, route difficulty, closures, and private-property boundaries.",
    ecologicalNotes:
      "The reach is a Texas Natural Rivers System nominee with exceptional aesthetics, conservation lands, and habitat for rare endemic mussels.",
    activities: ["paddling", "fishing", "camping", "hiking", "wildlife"],
    relatedDestinationSlugs: ["colorado-bend-state-park", "colorado-river-at-colorado-bend-state-park"],
  },
  {
    slug: "pecos-river-scenic-segment-trans-pecos",
    name: "Pecos River Scenic Segment — Trans-Pecos",
    summary:
      "A remote Pecos River reach crossing arid West Texas landscapes with significant native fish, wildlife, and scenic values.",
    description:
      "This segment consolidates adjoining TPWD Region E and Region F descriptions while keeping the official outer endpoints.",
    segmentBoundary:
      "From the Val Verde and Terrell county area upstream to the FM 11 bridge on the Pecos and Crane county line.",
    counties: ["Val Verde County", "Terrell County", "Crockett County", "Pecos County", "Crane County"],
    region: "West Texas",
    latitude: 30.61,
    longitude: -102.16,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regione.phtml",
    accessNotes:
      "Public access is sparse. Remote travel requires confirmed entry and exit permission, adequate water, navigation planning, and weather awareness.",
    ecologicalNotes:
      "TPWD identifies the reach as a Texas Natural Rivers System nominee for fish, wildlife, and exceptional aesthetic values, including sensitive native fishes.",
    activities: ["paddling", "fishing", "wildlife", "photography", "camping"],
    relatedDestinationSlugs: [],
  },
  {
    slug: "pecos-river-scenic-segment-lower",
    name: "Pecos River Scenic Segment — Lower Pecos",
    summary:
      "A dramatic Lower Pecos canyon reach above Lake Amistad with desert scenery, native aquatic life, and major cultural landscapes.",
    description:
      "This record narrows the former broad Lower Pecos corridor to the exact TPWD Region J segment.",
    segmentBoundary:
      "From 0.4 mile downstream of the Painted Canyon confluence in Val Verde County upstream to the Val Verde and Crockett county line.",
    counties: ["Val Verde County", "Crockett County"],
    region: "West Texas",
    latitude: 29.73,
    longitude: -101.36,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionj.phtml",
    accessNotes:
      "Access and rescue options are limited. Confirm lawful access, take-out logistics, weather, flow, skill requirements, and reservoir conditions.",
    ecologicalNotes:
      "TPWD cites outstanding fish and wildlife values, exceptional aesthetics, diverse aquatic life, and sensitive native fishes.",
    activities: ["paddling", "fishing", "photography", "wildlife", "history"],
    relatedDestinationSlugs: ["pecos-river-high-bridge-overlook", "seminole-canyon-state-park", "lake-amistad"],
  },
  {
    slug: "pedernales-river-scenic-segment-kimble",
    name: "Pedernales River Scenic Segment — Kimble County",
    summary:
      "A lightly developed upper Pedernales reach recognized nationally for natural areas, wildlife, and exceptional Hill Country scenery.",
    description:
      "TPWD identifies this Kimble County reach as a National Wild and Scenic Rivers System nominee and an ecologically significant segment.",
    segmentBoundary:
      "From the Kimble and Gillespie county line upstream to FM 385 in Kimble County.",
    counties: ["Kimble County", "Gillespie County"],
    region: "Hill Country",
    latitude: 30.35,
    longitude: -99.22,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionf.phtml",
    accessNotes:
      "Much of the corridor is bordered by private property. Use lawful crossings or authorized access and verify whether flows support recreation.",
    ecologicalNotes:
      "The segment is recognized for significant natural areas, wildlife value, and exceptional aesthetics.",
    activities: ["paddling", "fishing", "wildlife", "photography", "nature study"],
    relatedDestinationSlugs: [],
  },
  {
    slug: "devils-river-scenic-corridor",
    name: "Devils River Scenic Segment",
    summary:
      "A remote, spring-fed West Texas river segment known for clear water, rugged canyons, primitive conditions, and exceptional aquatic habitat.",
    description:
      "The record now follows TPWD's published ecologically significant segment rather than describing the entire Devils River as one corridor.",
    segmentBoundary:
      "From 0.4 mile downstream of the Little Satan Creek confluence in Val Verde County upstream to the Val Verde and Sutton county line.",
    counties: ["Val Verde County", "Sutton County"],
    region: "West Texas",
    latitude: 29.94,
    longitude: -100.97,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionj.phtml",
    accessNotes:
      "Reservations and a Devils River Access Permit may be required for TPWD-managed access or paddler camps. Confirm every access and take-out before travel.",
    ecologicalNotes:
      "The segment is a National Wild and Scenic Rivers System nominee with high water quality, exceptional aquatic life, conservation lands, and rare species.",
    activities: ["paddling", "fishing", "swimming", "wildlife", "photography"],
    relatedDestinationSlugs: ["devils-river-state-natural-area", "devils-river-state-natural-area-del-norte-unit", "devils-river-at-bakers-crossing", "lake-amistad"],
  },
  {
    slug: "frio-river-scenic-corridor",
    name: "Upper Frio River Scenic Segment",
    summary:
      "A spring-influenced Hill Country segment linking Garner State Park, limestone canyons, cypress-lined banks, and exceptional aquatic habitat.",
    description:
      "This record combines the adjoining Region L and Region J portions of the same TPWD-recognized upper Frio segment.",
    segmentBoundary:
      "From 110 yards upstream of US 90 in Uvalde County upstream to the confluence of the West Frio and East Frio rivers in Real County.",
    counties: ["Uvalde County", "Real County"],
    region: "Hill Country",
    latitude: 29.59,
    longitude: -99.74,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionl.phtml",
    accessNotes:
      "Use established public access or authorized private facilities. Verify flow, parking, fees, capacity limits, and private-bank boundaries.",
    ecologicalNotes:
      "The segment is a Texas Natural Rivers System nominee supporting Edwards Aquifer recharge, high water quality, exceptional aquatic life, and scenic habitat.",
    activities: ["paddling", "tubing", "swimming", "fishing", "camping", "wildlife"],
    relatedDestinationSlugs: ["garner-state-park", "frio-river-at-garner-state-park", "frio-river-at-concan"],
  },
  {
    slug: "guadalupe-river-scenic-corridor",
    name: "Upper Guadalupe River Scenic Segment",
    summary:
      "A cypress-lined Hill Country segment with clear pools, limestone banks, groundwater connections, and exceptional aquatic life.",
    description:
      "The record is limited to TPWD's published upper Guadalupe segment rather than extending downstream through Canyon Lake and Gruene.",
    segmentBoundary:
      "From the Kerr and Kendall county line upstream to the confluence of the North Fork and South Fork Guadalupe River in Kerr County.",
    counties: ["Kerr County", "Kendall County"],
    region: "Hill Country",
    latitude: 30.05,
    longitude: -99.15,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionj.phtml",
    accessNotes:
      "Use designated parks, crossings, or authorized access. Verify floods, flow, private-property boundaries, and local rules.",
    ecologicalNotes:
      "TPWD cites groundwater recharge and discharge, exceptional aquatic life, high scenic ranking, and rare endemic freshwater mussels.",
    activities: ["paddling", "fishing", "swimming", "camping", "wildlife"],
    relatedDestinationSlugs: ["guadalupe-river-at-guadalupe-river-state-park"],
  },
  {
    slug: "nueces-river-scenic-corridor",
    name: "Upper Nueces River Scenic Segment",
    summary:
      "A remote, spring-fed Hill Country segment of clear pools, limestone shelves, rugged ranch country, and native wildlife habitat.",
    description:
      "This record combines the adjoining Region L and Region J portions of the same TPWD-recognized upper Nueces segment.",
    segmentBoundary:
      "From US 90 in Uvalde County upstream to the confluence of the East Prong Nueces River and Hackberry Creek in Edwards County.",
    counties: ["Uvalde County", "Real County", "Edwards County"],
    region: "Hill Country",
    latitude: 29.51,
    longitude: -100.0,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionl.phtml",
    accessNotes:
      "Use lawful crossings, parks, or authorized private access. Confirm water levels, road conditions, and private-property rules.",
    ecologicalNotes:
      "The segment is a Texas Natural Rivers System nominee with aquifer-recharge value, outstanding fish and wildlife habitat, and exceptional scenery.",
    activities: ["paddling", "fishing", "swimming", "camping", "wildlife", "photography"],
    relatedDestinationSlugs: ["nueces-river-at-uvalde", "nueces-river-at-chalk-bluff-park"],
  },
  {
    slug: "sabinal-river-scenic-corridor",
    name: "Upper Sabinal River Scenic Segment",
    summary:
      "A spring-influenced Hill Country segment passing through wooded canyons and protected landscapes around Lost Maples.",
    description:
      "This record combines the adjoining Region L and Region J portions of the same TPWD-recognized upper Sabinal segment.",
    segmentBoundary:
      "From the US 90 crossing in Sabinal upstream to the most upstream crossing of Ranch Road 187 in Bandera County.",
    counties: ["Uvalde County", "Bandera County"],
    region: "Hill Country",
    latitude: 29.81,
    longitude: -99.57,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regionl.phtml",
    accessNotes:
      "Public access is concentrated at Lost Maples and lawful crossings. Water can be intermittent and adjacent property is largely private.",
    ecologicalNotes:
      "The segment is a Texas Natural Rivers System nominee with aquifer functions, exceptional scenery, protected riparian land, and native Guadalupe bass genetics.",
    activities: ["hiking", "fishing", "wildlife", "photography", "nature study"],
    relatedDestinationSlugs: ["lost-maples-state-natural-area", "sabinal-river-at-lost-maples"],
  },
  {
    slug: "big-sandy-creek-scenic-segment-east-texas",
    name: "Big Sandy Creek Scenic Segment — East Texas",
    summary:
      "A forested East Texas stream segment with exceptional scenery, fish and wildlife habitat, and Big Thicket conservation connections.",
    description:
      "TPWD identifies Big Sandy Creek as a Texas Natural Rivers System nominee; it was entirely absent from the original eight-record catalog.",
    segmentBoundary:
      "From the confluence with Village Creek in northern Hardin County upstream to the Polk and Trinity county line.",
    counties: ["Hardin County", "Polk County", "Trinity County"],
    region: "East Texas",
    latitude: 30.62,
    longitude: -94.55,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regioni.phtml",
    accessNotes:
      "Use only lawful public or authorized access. Expect remote forest conditions, variable flow, fallen timber, and limited services.",
    ecologicalNotes:
      "The segment is recognized for outstanding fish and wildlife values, exceptional aesthetics, and conservation lands in the Big Thicket region.",
    activities: ["paddling", "fishing", "wildlife", "photography", "nature study"],
    relatedDestinationSlugs: [],
  },
  {
    slug: "neches-river-scenic-segment-middle",
    name: "Neches River Scenic Segment — Middle Neches",
    summary:
      "A major forested East Texas river segment with bottomland hardwoods, wilderness character, rare species, and extensive conservation lands.",
    description:
      "TPWD identifies this specific middle Neches reach as a Texas Natural Rivers System nominee; downstream Neches reaches are separate ecological segments but are not described as system nominees.",
    segmentBoundary:
      "From immediately upstream of the Hopson Mill Creek confluence in Jasper and Tyler counties upstream to Blackburn Crossing Dam in Anderson and Cherokee counties.",
    counties: ["Jasper County", "Tyler County", "Anderson County", "Cherokee County"],
    region: "East Texas",
    latitude: 31.2,
    longitude: -94.35,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regioni.phtml",
    accessNotes:
      "Use established public access and confirm route length, take-out, flow, navigation hazards, and boundaries of adjacent public and private lands.",
    ecologicalNotes:
      "The segment includes priority bottomland habitat, national forests, Big Thicket lands, exceptional aesthetics, rare fishes, mussels, plants, and extensive natural communities.",
    activities: ["paddling", "fishing", "wildlife", "camping", "photography"],
    relatedDestinationSlugs: [],
  },
  {
    slug: "sabine-river-scenic-segment-lower",
    name: "Sabine River Scenic Segment — Lower Sabine",
    summary:
      "A broad lower Sabine River segment below Toledo Bend with outstanding wildlife values and exceptional East Texas scenery.",
    description:
      "This is the TPWD Region I Texas Natural Rivers System nominee reach between Interstate 10 and Toledo Bend Dam.",
    segmentBoundary:
      "From the Interstate 10 crossing in Orange County upstream to Toledo Bend Dam in Newton County.",
    counties: ["Orange County", "Newton County"],
    region: "East Texas",
    latitude: 30.65,
    longitude: -93.74,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regioni.phtml",
    accessNotes:
      "Use designated ramps or lawful access and account for long distances, current, commercial traffic near the lower river, and reservoir operations.",
    ecologicalNotes:
      "TPWD recognizes the reach for outstanding wildlife value and exceptional aesthetics.",
    activities: ["boating", "fishing", "paddling", "wildlife", "photography"],
    relatedDestinationSlugs: [],
  },
  {
    slug: "sabine-river-scenic-segment-upper-toledo-bend",
    name: "Sabine River Scenic Segment — Upper Toledo Bend Reach",
    summary:
      "An upper Sabine reach above Toledo Bend Reservoir with bottomland forests, native fish and wildlife, and exceptional scenic value.",
    description:
      "TPWD identifies this Panola County reach as a separate Texas Natural Rivers System nominee rather than merging it with the lower Sabine.",
    segmentBoundary:
      "From the headwaters of Toledo Bend Reservoir in Panola County upstream to the Panola and Rusk county line.",
    counties: ["Panola County", "Rusk County"],
    region: "East Texas",
    latitude: 32.0,
    longitude: -94.1,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regioni.phtml",
    accessNotes:
      "Use lawful access and confirm reservoir backwater, streamflow, route length, timber hazards, and take-out logistics.",
    ecologicalNotes:
      "The reach supports outstanding fish and wildlife values, priority bottomland hardwoods, exceptional aesthetics, and paddlefish habitat.",
    activities: ["boating", "fishing", "paddling", "wildlife", "photography"],
    relatedDestinationSlugs: [],
  },
  {
    slug: "sabine-river-scenic-segment-harrison-rusk",
    name: "Sabine River Scenic Segment — Harrison and Rusk",
    summary:
      "A scenic Northeast Texas Sabine River reach with hardwood forests, wetlands, significant natural areas, and paddlefish habitat.",
    description:
      "TPWD Region D identifies this separate Sabine reach as a Texas Natural Rivers System nominee.",
    segmentBoundary:
      "From US 59 in southern Harrison County upstream to Easton on the Rusk and Harrison county line.",
    counties: ["Harrison County", "Rusk County"],
    region: "Northeast Texas",
    latitude: 32.33,
    longitude: -94.47,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regiond.phtml",
    accessNotes:
      "Use designated public access or permission-based entry. Verify flows, woody hazards, route length, and take-out access.",
    ecologicalNotes:
      "The reach has diverse riparian hardwood and wetland habitat, exceptional aesthetic value, significant natural areas, and paddlefish habitat.",
    activities: ["paddling", "fishing", "wildlife", "photography", "nature study"],
    relatedDestinationSlugs: [],
  },
  {
    slug: "village-creek-scenic-segment",
    name: "Village Creek Scenic Segment",
    summary:
      "An East Texas blackwater stream segment flowing through Big Thicket landscapes and recognized as the region's leading scenic river.",
    description:
      "TPWD identifies Village Creek as a Texas Natural Rivers System nominee with conservation, recreation, and unusually extensive natural-community values.",
    segmentBoundary:
      "From the confluence with the Neches River in Hardin County upstream to Lake Kimble Dam in Hardin County.",
    counties: ["Hardin County"],
    region: "East Texas",
    latitude: 30.36,
    longitude: -94.3,
    sourceUrl:
      "https://tpwd.texas.gov/landwater/water/conservation/water_resources/water_quantity/sigsegs/regioni.phtml",
    accessNotes:
      "Use designated access and verify flow, fallen timber, weather, park conditions, and take-out arrangements.",
    ecologicalNotes:
      "The segment includes Big Thicket conservation lands, outstanding fish and wildlife values, exceptional aesthetics, and exemplary natural communities.",
    activities: ["paddling", "fishing", "camping", "wildlife", "photography"],
    relatedDestinationSlugs: ["village-creek-state-park"],
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
    description: `${river.description} Segment boundaries: ${river.segmentBoundary}`,
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
    alternateNames: [river.name.replace(" Scenic Segment", " River"), "Texas scenic river segment"],
    officialUrl: river.sourceUrl,
    phone: null,
    email: null,
    address: null,
    profile: {
      collection: "Texas scenic river segments",
      designation: "TPWD ecologically significant scenic river segment",
      selectionBasis: "Texas or National Wild and Scenic Rivers System nominee documented by TPWD",
      managingOrganization: "Texas Parks and Wildlife Department",
      accessType: "Multiple public and private access conditions",
      counties: toJsonArray(river.counties),
      segmentBoundary: river.segmentBoundary,
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
      "ecologically significant stream segment",
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
      "stream segment",
      "waterway",
      "riparian habitat",
    ],
    sourceUrl: river.sourceUrl,
    sourceName: SOURCE_NAME,
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
