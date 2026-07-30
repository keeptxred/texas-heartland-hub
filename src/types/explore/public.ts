export interface ExploreEntityCard {
  id: string;
  entityType: string;
  name: string;
  slug: string;
  summary: string | null;
  city: string | null;
  county: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  amenities: string[];
  activities: string[];
  isFamilyFriendly: boolean | null;
  isPetFriendly: boolean | null;
  isAccessible: boolean | null;
  feeRequired: boolean | null;
  distanceKm?: number | null;
}

export interface ExploreObservation {
  id: string;
  observationType: string;
  title: string;
  description: string | null;
  severity: "info" | "advisory" | "warning" | "closure" | null;
  startsAt: string | null;
  endsAt: string | null;
  sourceUrl: string | null;
}

export type ExploreJson =
  string | number | boolean | null | ExploreJson[] | { [key: string]: ExploreJson };

export type ExploreJsonObject = { [key: string]: ExploreJson };

export interface ExploreEntity extends ExploreEntityCard {
  alternateNames: string[];
  description: string | null;
  officialUrl: string | null;
  phone: string | null;
  email: string | null;
  address: ExploreJsonObject | null;
  profile: ExploreJsonObject;
  hours: ExploreJson;
  fees: ExploreJsonObject | null;
  regulations: ExploreJsonObject | null;
  seasonalGuidance: ExploreJsonObject | null;
  categories: string[];
  tags: string[];
  sourceUrl: string | null;
  sourceName: string | null;
  sourceUpdatedAt: string | null;
  updatedAt: string;
  observations: ExploreObservation[];
  related: ExploreEntityCard[];
  nearby: ExploreEntityCard[];
}

// Search values are normalized and defaulted by exploreSearchSchema before use.
// Keeping the navigation payload flexible avoids duplicating TanStack Router's
// generated search-parameter type throughout UI reducer callbacks.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExploreSearchInput = any;

export interface ExploreSearchResult {
  items: ExploreEntityCard[];
  total: number;
  page: number;
  pageSize: number;
  facets: {
    entityTypes: string[];
    regions: string[];
    counties: string[];
    activities: string[];
    amenities: string[];
  };
}

export interface ExploreGeographyPage {
  kind: "county" | "region";
  name: string;
  items: ExploreEntityCard[];
  total: number;
  typeCounts: Array<{ type: string; count: number }>;
  activities: string[];
  nearbyGeographies: Array<{ name: string; count: number }>;
}

export interface TripPreferences {
  title: string;
  startLocation?: string;
  region?: string;
  startDate?: string;
  days: number;
  adults: number;
  children: number;
  pets: boolean;
  rv: boolean;
  accessible: boolean;
  interests: string[];
  maxDrivingKm: number;
  stopsPerDay?: number;
}

export interface TripStop {
  entity: ExploreEntityCard;
  period: "morning" | "afternoon" | "evening";
  durationMinutes: number;
  reasons: string[];
  notes: string[];
}

export interface TripDay {
  day: number;
  date?: string;
  stops: TripStop[];
}

export interface GeneratedTrip {
  title: string;
  preferences: TripPreferences;
  days: TripDay[];
  verificationReminder: string;
}

export interface SavedTrip {
  id: string;
  shareToken: string | null;
  isPublic: boolean;
  title: string;
  startsOn: string | null;
  endsOn: string | null;
  trip: GeneratedTrip;
  updatedAt: string;
}

export interface ExploreAutocompleteItem {
  name: string;
  slug: string;
  entityType: string;
  region: string | null;
}
