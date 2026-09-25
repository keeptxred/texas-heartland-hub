export const TEXASDEFINED_OFFER_CATEGORIES = [
  "concerts",
  "sports",
  "festivals",
  "family",
  "theater",
  "attractions",
  "tours",
  "hotels",
  "outdoors",
  "shopping",
] as const;

export type TexasDefinedOfferCategory = (typeof TEXASDEFINED_OFFER_CATEGORIES)[number];

export type TexasDefinedAffiliateNetwork = "impact" | "cj" | "expedia" | "direct" | "internal";

export type TexasDefinedCommissionStatus = "preserved" | "reduced" | "zero" | "unknown";

export type TexasDefinedOfferKind = "event" | "offer" | "hotel" | "attraction" | "package";

export type TexasDefinedEventOffer = {
  id: string;
  title: string;
  description: string;
  kind: TexasDefinedOfferKind;
  category: TexasDefinedOfferCategory;
  network: TexasDefinedAffiliateNetwork;
  advertiser: string;
  city: string;
  region: string;
  county?: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  priceLabel?: string;
  offerLabel?: string;
  promoCode?: string;
  affiliateUrl: string;
  imageUrl?: string;
  commissionStatus: TexasDefinedCommissionStatus;
  discountPreservesCommission: boolean | null;
  isDiscount: boolean;
  isEditorialOnly?: boolean;
  sourceUrl?: string;
  expiresAt?: string;
  lastVerifiedAt?: string;
  tags: string[];
};

export type TexasDefinedEventOfferFilters = {
  query?: string | null;
  location?: string | null;
  category?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  network?: string | null;
  commissionSafeOnly?: boolean | null;
  discountsOnly?: boolean | null;
  limit?: number | null;
};

export type TexasDefinedOfferDashboardSummary = {
  totalOffers: number;
  commissionSafeOffers: number;
  discountOffers: number;
  needsReview: number;
  byNetwork: Record<string, number>;
  byCategory: Record<string, number>;
  byCity: Record<string, number>;
  nextExpiring: TexasDefinedEventOffer[];
};

const today = new Date("2026-09-25T12:00:00-05:00");

export const TEXASDEFINED_EVENT_OFFER_SEED: TexasDefinedEventOffer[] = [
  {
    id: "tm-disney-on-ice-houston-2026",
    title: "Disney On Ice — Houston",
    description: "Family event inventory placeholder for Ticketmaster/Impact integration. Discounts should be promoted only after commission eligibility is verified.",
    kind: "event",
    category: "family",
    network: "impact",
    advertiser: "Ticketmaster",
    city: "Houston",
    region: "Gulf Coast",
    county: "Harris County",
    venue: "NRG Stadium",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
    priceLabel: "Tickets available",
    offerLabel: "Ticket link — no verified discount yet",
    affiliateUrl: "https://www.ticketmaster.com/",
    commissionStatus: "unknown",
    discountPreservesCommission: null,
    isDiscount: false,
    isEditorialOnly: false,
    tags: ["kids", "family", "houston", "ticketmaster"],
    lastVerifiedAt: today.toISOString(),
  },
  {
    id: "citypass-houston-attractions",
    title: "Houston attraction pass",
    description: "Attraction offer placeholder. CityPASS-style offers should be shown as ticket/attraction value, not as coupon codes.",
    kind: "attraction",
    category: "attractions",
    network: "cj",
    advertiser: "CityPASS",
    city: "Houston",
    region: "Gulf Coast",
    county: "Harris County",
    priceLabel: "Partner offer",
    offerLabel: "Attraction pass",
    affiliateUrl: "https://www.citypass.com/",
    commissionStatus: "preserved",
    discountPreservesCommission: true,
    isDiscount: false,
    tags: ["attractions", "family", "houston"],
    lastVerifiedAt: today.toISOString(),
  },
  {
    id: "fredericksburg-weekend-hotel-anchor",
    title: "Fredericksburg weekend stay",
    description: "Hotel inventory placeholder for Explore and event pages. Display beside events when visitor searches Hill Country dates.",
    kind: "hotel",
    category: "hotels",
    network: "expedia",
    advertiser: "Expedia Group",
    city: "Fredericksburg",
    region: "Hill Country",
    county: "Gillespie County",
    priceLabel: "Search rates",
    offerLabel: "Stay nearby",
    affiliateUrl: "https://www.expedia.com/",
    commissionStatus: "preserved",
    discountPreservesCommission: true,
    isDiscount: false,
    tags: ["hotels", "hill country", "fredericksburg"],
    lastVerifiedAt: today.toISOString(),
  },
  {
    id: "galveston-family-attraction-offer",
    title: "Galveston family attraction offer",
    description: "Commission-safe attraction/deal placeholder for coastal Explore searches and event-page add-ons.",
    kind: "offer",
    category: "attractions",
    network: "cj",
    advertiser: "Partner attraction",
    city: "Galveston",
    region: "Gulf Coast",
    county: "Galveston County",
    priceLabel: "Special offer",
    offerLabel: "Verified partner offer",
    affiliateUrl: "https://texasdefined.com/",
    commissionStatus: "preserved",
    discountPreservesCommission: true,
    isDiscount: true,
    tags: ["galveston", "family", "coast", "attractions"],
    expiresAt: "2026-12-31T23:59:59-06:00",
    lastVerifiedAt: today.toISOString(),
  },
];

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function dateValue(value: string | null | undefined): number | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function matchesDateWindow(offer: TexasDefinedEventOffer, filters: TexasDefinedEventOfferFilters): boolean {
  const filterStart = dateValue(filters.startDate);
  const filterEnd = dateValue(filters.endDate) ?? filterStart;
  if (filterStart == null && filterEnd == null) return true;

  const offerStart = dateValue(offer.startDate) ?? dateValue(offer.expiresAt) ?? 0;
  const offerEnd = dateValue(offer.endDate) ?? dateValue(offer.expiresAt) ?? offerStart;
  if (!offerStart) return offer.kind !== "event";

  const start = filterStart ?? filterEnd ?? offerStart;
  const end = filterEnd ?? filterStart ?? offerEnd;
  return offerStart <= end && offerEnd >= start;
}

function commissionSafe(offer: TexasDefinedEventOffer): boolean {
  return offer.commissionStatus === "preserved" && offer.discountPreservesCommission !== false && !offer.isEditorialOnly;
}

export function isTexasDefinedCommissionSafeOffer(offer: TexasDefinedEventOffer): boolean {
  return commissionSafe(offer);
}

export function searchTexasDefinedEventOffers(
  offers: readonly TexasDefinedEventOffer[],
  filters: TexasDefinedEventOfferFilters = {},
): TexasDefinedEventOffer[] {
  const query = normalize(filters.query);
  const location = normalize(filters.location);
  const category = normalize(filters.category);
  const network = normalize(filters.network);
  const limit = Math.max(1, Math.min(100, filters.limit ?? 24));

  return offers
    .filter((offer) => {
      const haystack = normalize([
        offer.title,
        offer.description,
        offer.city,
        offer.region,
        offer.county,
        offer.venue,
        offer.advertiser,
        offer.category,
        ...offer.tags,
      ].filter(Boolean).join(" "));

      if (query && !haystack.includes(query)) return false;
      if (location && !normalize([offer.city, offer.region, offer.county, offer.venue].filter(Boolean).join(" ")).includes(location)) return false;
      if (category && normalize(offer.category) !== category) return false;
      if (network && normalize(offer.network) !== network) return false;
      if (filters.commissionSafeOnly && !commissionSafe(offer)) return false;
      if (filters.discountsOnly && !offer.isDiscount) return false;
      if (!matchesDateWindow(offer, filters)) return false;
      return true;
    })
    .sort((a, b) => {
      const aSafe = commissionSafe(a) ? 1 : 0;
      const bSafe = commissionSafe(b) ? 1 : 0;
      if (aSafe !== bSafe) return bSafe - aSafe;
      const aDate = dateValue(a.startDate) ?? dateValue(a.expiresAt) ?? Number.MAX_SAFE_INTEGER;
      const bDate = dateValue(b.startDate) ?? dateValue(b.expiresAt) ?? Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    })
    .slice(0, limit);
}

function countBy(offers: readonly TexasDefinedEventOffer[], key: (offer: TexasDefinedEventOffer) => string): Record<string, number> {
  return offers.reduce<Record<string, number>>((acc, offer) => {
    const label = key(offer) || "Unclassified";
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});
}

export function buildTexasDefinedOfferDashboard(
  offers: readonly TexasDefinedEventOffer[],
): TexasDefinedOfferDashboardSummary {
  const now = Date.now();
  const nextExpiring = offers
    .filter((offer) => {
      const expires = dateValue(offer.expiresAt);
      return expires != null && expires >= now;
    })
    .sort((a, b) => (dateValue(a.expiresAt) ?? 0) - (dateValue(b.expiresAt) ?? 0))
    .slice(0, 6);

  return {
    totalOffers: offers.length,
    commissionSafeOffers: offers.filter(commissionSafe).length,
    discountOffers: offers.filter((offer) => offer.isDiscount).length,
    needsReview: offers.filter((offer) => offer.commissionStatus === "unknown" || offer.discountPreservesCommission == null).length,
    byNetwork: countBy(offers, (offer) => offer.network),
    byCategory: countBy(offers, (offer) => offer.category),
    byCity: countBy(offers, (offer) => offer.city),
    nextExpiring,
  };
}

export function parseBooleanSearchParam(value: string | null): boolean | null {
  if (value == null) return null;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function filtersFromUrl(url: URL): TexasDefinedEventOfferFilters {
  const params = url.searchParams;
  return {
    query: params.get("q") ?? params.get("query"),
    location: params.get("location") ?? params.get("city"),
    category: params.get("category"),
    startDate: params.get("start") ?? params.get("startDate"),
    endDate: params.get("end") ?? params.get("endDate"),
    network: params.get("network"),
    commissionSafeOnly: parseBooleanSearchParam(params.get("commissionSafeOnly")) ?? true,
    discountsOnly: parseBooleanSearchParam(params.get("discountsOnly")),
    limit: Number(params.get("limit") ?? "24"),
  };
}
