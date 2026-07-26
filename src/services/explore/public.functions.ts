import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { exploreDestinations } from "@/data/explore/destinations";
import { exploreSearchSchema, tripPreferencesSchema } from "@/schemas/explore/public.schema";
import { orderStopsForRoute } from "@/lib/explore/geography";
import type {
  ExploreAutocompleteItem,
  ExploreEntity,
  ExploreEntityCard,
  ExploreJson,
  ExploreSearchInput,
  ExploreSearchResult,
  GeneratedTrip,
  SavedTrip,
  TripPreferences,
} from "@/types/explore/public";

function publicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function json(value: unknown): ExploreJson {
  if (value === undefined) return null;
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
    return value;
  if (Array.isArray(value)) return value.map(json);
  if (typeof value === "object")
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, json(item)]),
    );
  return String(value);
}

function card(entity: ExploreEntity): ExploreEntityCard {
  const {
    alternateNames: _alternateNames,
    description: _description,
    officialUrl: _officialUrl,
    phone: _phone,
    email: _email,
    address: _address,
    profile: _profile,
    hours: _hours,
    fees: _fees,
    regulations: _regulations,
    seasonalGuidance: _seasonalGuidance,
    categories: _categories,
    tags: _tags,
    sourceUrl: _sourceUrl,
    sourceName: _sourceName,
    sourceUpdatedAt: _sourceUpdatedAt,
    updatedAt: _updatedAt,
    observations: _observations,
    related: _related,
    nearby: _nearby,
    ...result
  } = entity;
  return result;
}

function emptyFacets(): ExploreSearchResult["facets"] {
  return { entityTypes: [], regions: [], counties: [], activities: [], amenities: [] };
}

function collectFacets(items: ExploreEntity[]): ExploreSearchResult["facets"] {
  const values = {
    entityTypes: new Set<string>(),
    regions: new Set<string>(),
    counties: new Set<string>(),
    activities: new Set<string>(),
    amenities: new Set<string>(),
  };
  for (const item of items) {
    values.entityTypes.add(item.entityType);
    if (item.region) values.regions.add(item.region);
    if (item.county) values.counties.add(item.county);
    item.activities.forEach((value) => values.activities.add(value));
    item.amenities.forEach((value) => values.amenities.add(value));
  }
  return {
    entityTypes: [...values.entityTypes].sort(),
    regions: [...values.regions].sort(),
    counties: [...values.counties].sort(),
    activities: [...values.activities].sort(),
    amenities: [...values.amenities].sort(),
  };
}

function distanceKm(
  latitude: number,
  longitude: number,
  targetLatitude: number,
  targetLongitude: number,
): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latitudeDelta = radians(targetLatitude - latitude);
  const longitudeDelta = radians(targetLongitude - longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(latitude)) *
      Math.cos(radians(targetLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function search(input: ExploreSearchInput): Promise<ExploreSearchResult> {
  const parsed = exploreSearchSchema.parse(input);
  const query = parsed.q?.trim().toLowerCase();
  let items = exploreDestinations.map((entity) => ({ ...entity }));

  if (query) {
    items = items.filter((entity) =>
      [
        entity.name,
        ...entity.alternateNames,
        entity.summary,
        entity.description,
        entity.city,
        entity.county,
        entity.region,
        ...entity.activities,
        ...entity.amenities,
        ...entity.categories,
        ...entity.tags,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }
  if (parsed.types?.length)
    items = items.filter((entity) => parsed.types!.includes(entity.entityType));
  if (parsed.regions?.length)
    items = items.filter((entity) => entity.region != null && parsed.regions!.includes(entity.region));
  if (parsed.counties?.length)
    items = items.filter((entity) => entity.county != null && parsed.counties!.includes(entity.county));
  if (parsed.activities?.length)
    items = items.filter((entity) => parsed.activities!.every((value) => entity.activities.includes(value)));
  if (parsed.amenities?.length)
    items = items.filter((entity) => parsed.amenities!.every((value) => entity.amenities.includes(value)));
  if (parsed.familyFriendly != null)
    items = items.filter((entity) => entity.isFamilyFriendly === parsed.familyFriendly);
  if (parsed.petFriendly != null)
    items = items.filter((entity) => entity.isPetFriendly === parsed.petFriendly);
  if (parsed.accessible != null)
    items = items.filter((entity) => entity.isAccessible === parsed.accessible);
  if (parsed.fee)
    items = items.filter((entity) => entity.feeRequired === (parsed.fee === "required"));

  if (parsed.lat != null && parsed.lng != null) {
    items = items
      .filter((entity) => entity.latitude != null && entity.longitude != null)
      .map((entity) => ({
        ...entity,
        distanceKm: distanceKm(parsed.lat!, parsed.lng!, entity.latitude!, entity.longitude!),
      }));
    if (parsed.radiusKm != null)
      items = items.filter((entity) => (entity.distanceKm ?? Number.POSITIVE_INFINITY) <= parsed.radiusKm!);
  }

  if (parsed.sort === "name") items.sort((a, b) => a.name.localeCompare(b.name));
  if (parsed.sort === "distance")
    items.sort(
      (a, b) =>
        (a.distanceKm ?? Number.POSITIVE_INFINITY) -
        (b.distanceKm ?? Number.POSITIVE_INFINITY),
    );

  const total = items.length;
  const start = (parsed.page - 1) * parsed.pageSize;
  return {
    items: items.slice(start, start + parsed.pageSize).map(card),
    total,
    page: parsed.page,
    pageSize: parsed.pageSize,
    facets: exploreDestinations.length ? collectFacets(exploreDestinations) : emptyFacets(),
  };
}

export const searchExplore = createServerFn({ method: "GET" })
  .inputValidator((value) => exploreSearchSchema.parse(value))
  .handler(({ data }) => search(data));

export const getExploreLanding = createServerFn({ method: "GET" }).handler(async () => {
  const [featured, lakes, parks, camping, family, seasonal] = await Promise.all([
    search({ pageSize: 6 }),
    search({ types: ["lake"], pageSize: 4 }),
    search({ types: ["park"], pageSize: 4 }),
    search({ activities: ["camping"], pageSize: 4 }),
    search({ familyFriendly: true, pageSize: 4 }),
    search({ pageSize: 4, sort: "relevance" }),
  ]);
  return { featured, lakes, parks, camping, family, seasonal };
});

export const getExploreEntity = createServerFn({ method: "GET" })
  .inputValidator((value) => z.object({ slug: z.string().min(1).max(240) }).parse(value))
  .handler(async ({ data }): Promise<ExploreEntity | null> => {
    const entity = exploreDestinations.find((item) => item.slug === data.slug);
    if (!entity) return null;
    const nearby = exploreDestinations
      .filter(
        (item) =>
          item.id !== entity.id &&
          entity.latitude != null &&
          entity.longitude != null &&
          item.latitude != null &&
          item.longitude != null,
      )
      .map((item) => ({
        item,
        distance: distanceKm(entity.latitude!, entity.longitude!, item.latitude!, item.longitude!),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4)
      .map(({ item }) => card(item));
    const related = exploreDestinations
      .filter(
        (item) =>
          item.id !== entity.id &&
          (item.entityType === entity.entityType ||
            item.categories.some((category) => entity.categories.includes(category))),
      )
      .slice(0, 4)
      .map(card);
    return { ...entity, nearby, related };
  });

export const getExploreSlugTarget = createServerFn({ method: "GET" })
  .inputValidator((value) => z.object({ slug: z.string().min(1).max(240) }).parse(value))
  .handler(async (): Promise<string | null> => null);

export const autocompleteExplore = createServerFn({ method: "GET" })
  .inputValidator((value) =>
    z
      .object({ q: z.string().trim().min(2).max(80), limit: z.number().int().min(1).max(12).default(8) })
      .parse(value),
  )
  .handler(async ({ data }): Promise<ExploreAutocompleteItem[]> => {
    const query = data.q.toLowerCase();
    return exploreDestinations
      .filter((entity) =>
        [entity.name, ...entity.alternateNames, entity.city, entity.region]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      )
      .slice(0, data.limit)
      .map((entity) => ({
        name: entity.name,
        slug: entity.slug,
        entityType: entity.entityType,
        region: entity.region,
      }));
  });

export const getSharedExploreTrip = createServerFn({ method: "GET" })
  .inputValidator((value) => z.object({ token: z.string().min(24).max(128) }).parse(value))
  .handler(async ({ data }): Promise<SavedTrip | null> => {
    const client = publicClient();
    if (!client) return null;
    const result = await client
      .from("explore_trips")
      .select("id,share_token,is_public,title,starts_on,ends_on,preferences,itinerary,updated_at")
      .eq("share_token", data.token)
      .eq("is_public", true)
      .maybeSingle();
    if (result.error) throw new Error(`Shared trip lookup failed: ${result.error.message}`);
    if (!result.data) return null;
    const row = result.data as Record<string, unknown>;
    const itinerary = json(row.itinerary) as { [key: string]: ExploreJson };
    const preferences = json(row.preferences) as { [key: string]: ExploreJson };
    return {
      id: String(row.id),
      shareToken: nullableString(row.share_token),
      isPublic: true,
      title: String(row.title),
      startsOn: nullableString(row.starts_on),
      endsOn: nullableString(row.ends_on),
      updatedAt: String(row.updated_at),
      trip: {
        title: String(row.title),
        preferences: preferences as unknown as TripPreferences,
        days: (itinerary.days ?? []) as unknown as GeneratedTrip["days"],
        verificationReminder: String(
          itinerary.verificationReminder ??
            "Verify hours, fees, conditions, reservations, and regulations with official sources.",
        ),
      },
    };
  });

export function recommendationReasons(
  entity: ExploreEntityCard,
  preferences: TripPreferences,
): string[] {
  const reasons: string[] = [];
  const activityMatches = entity.activities.filter((value) =>
    preferences.interests.some((interest) => value.toLowerCase().includes(interest.toLowerCase())),
  );
  if (activityMatches.length)
    reasons.push(`Matches your interest in ${activityMatches.slice(0, 2).join(" and ")}`);
  if (preferences.children > 0 && entity.isFamilyFriendly) reasons.push("Suitable for families");
  if (preferences.pets && entity.isPetFriendly) reasons.push("Welcomes pets");
  if (preferences.accessible && entity.isAccessible)
    reasons.push("Includes accessibility features");
  if (preferences.rv && entity.amenities.some((value) => /rv|hookup/i.test(value)))
    reasons.push("Offers RV-compatible amenities");
  if (preferences.region && entity.region === preferences.region)
    reasons.push(`Located in ${preferences.region}`);
  if (!reasons.length) reasons.push("Adds variety to the itinerary");
  return reasons;
}

export const generateExploreTrip = createServerFn({ method: "POST" })
  .inputValidator((value) => tripPreferencesSchema.parse(value))
  .handler(async ({ data }): Promise<GeneratedTrip> => {
    const result = await search({
      regions: data.region ? [data.region] : undefined,
      familyFriendly: data.children > 0 || undefined,
      petFriendly: data.pets || undefined,
      accessible: data.accessible || undefined,
      pageSize: Math.min(42, data.days * 5),
    });
    const ranked = result.items
      .map((entity) => ({
        entity,
        score:
          entity.activities.filter((activity) =>
            data.interests.some((interest) => activity.toLowerCase().includes(interest.toLowerCase())),
          ).length * 20 +
          (data.children > 0 && entity.isFamilyFriendly ? 10 : 0) +
          (data.pets && entity.isPetFriendly ? 10 : 0) +
          (data.accessible && entity.isAccessible ? 15 : 0) +
          (data.rv && entity.amenities.some((value) => /rv|hookup/i.test(value)) ? 10 : 0),
      }))
      .sort((a, b) => b.score - a.score || a.entity.name.localeCompare(b.entity.name));
    const start = data.startDate ? new Date(`${data.startDate}T12:00:00`) : null;
    const routeOrdered = orderStopsForRoute(ranked.map(({ entity }) => entity));
    const rankedById = new Map(ranked.map((item) => [item.entity.id, item]));
    const orderedRecommendations = routeOrdered
      .map((entity) => rankedById.get(entity.id)!)
      .filter(Boolean);
    const days = Array.from({ length: data.days }, (_, index) => ({
      day: index + 1,
      date: start
        ? new Date(start.getTime() + index * 86_400_000).toISOString().slice(0, 10)
        : undefined,
      stops: orderedRecommendations.slice(index * 3, index * 3 + 3).map(({ entity }, stopIndex) => ({
        entity,
        period: (["morning", "afternoon", "evening"] as const)[stopIndex],
        durationMinutes: stopIndex === 1 ? 180 : 120,
        reasons: recommendationReasons(entity, data),
        notes: [
          entity.feeRequired ? "Fees may apply; verify current pricing with the official source." : "",
          data.pets && !entity.isPetFriendly ? "Verify the current pet policy before visiting." : "",
        ].filter(Boolean),
      })),
    }));
    return {
      title: data.title,
      preferences: data,
      days,
      verificationReminder:
        "Hours, fees, conditions, reservations, and regulations can change. Verify time-sensitive details with each official source before departure.",
    };
  });
