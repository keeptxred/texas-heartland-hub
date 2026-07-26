import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { exploreDestinations } from "@/data/explore/all-destinations";
import { exploreSearchSchema, tripPreferencesSchema } from "@/schemas/explore/public.schema";
import { orderStopsForRoute } from "@/lib/explore/geography";
import { geographySlug } from "@/lib/explore/geography-pages";
import type {
  ExploreAutocompleteItem,
  ExploreEntity,
  ExploreEntityCard,
  ExploreGeographyPage,
  ExploreJson,
  ExploreSearchInput,
  ExploreSearchResult,
  GeneratedTrip,
  SavedTrip,
  TripPreferences,
  TripStop,
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

function cavernVisitorProfile(entity: ExploreEntity): ExploreEntity["profile"] {
  if (entity.entityType !== "cavern") return entity.profile;

  const profile = entity.profile as Record<string, ExploreJson>;
  const tourInformation = (profile.tour_information ?? {}) as Record<string, ExploreJson>;
  const visitorAccess = (profile.visitor_access ?? {}) as Record<string, ExploreJson>;
  const guidedTours = tourInformation.guided_tours === true;
  const reservationsRecommended = tourInformation.reservations_recommended === true;
  const duration = String(tourInformation.typical_duration ?? "Varies by tour");
  const accessibility = String(
    visitorAccess.accessibility ??
      "Underground routes may include stairs, slopes, narrow passages, and uneven or wet surfaces.",
  );
  const petPolicy = String(
    visitorAccess.pet_policy ??
      "Pet and service-animal policies vary by operator and may differ between surface grounds and underground tours.",
  );
  const photographyPolicy = String(
    visitorAccess.photography_policy ??
      "Photography rules vary by tour, equipment, lighting, and cave-protection requirements.",
  );

  return {
    ...entity.profile,
    visit_planning: {
      guided_access: guidedTours
        ? "Public cavern access is provided through a guided tour. Arrive before the scheduled departure time for check-in and safety instructions."
        : "Confirm whether guided access is required and which portions of the cavern are open to the public.",
      reservations: reservationsRecommended
        ? "Advance reservations are recommended because tour capacity and departure times can sell out."
        : "Reservations may not be required for every visit, but checking current capacity and tour times before departure is recommended.",
      expected_time: duration,
      clothing_and_footwear:
        "Wear closed-toe shoes with dependable traction. Cave surfaces can be damp or uneven, and underground temperatures are usually cooler than outdoor Texas conditions, so a light layer may be useful.",
      accessibility,
      pets: petPolicy,
      photography: photographyPolicy,
    },
    frequently_asked_questions: {
      is_a_guideded_tour_required: guidedTours
        ? "Yes. The listed public cavern experience uses guided tours, and visitors should remain with their assigned group."
        : "Tour format varies. Confirm the current access rules directly with the operator.",
      should_tickets_be_reserved: reservationsRecommended
        ? "Yes. Reserving ahead is recommended, especially on weekends, holidays, school breaks, and during peak travel seasons."
        : "Advance booking may not always be required, but visitors should verify the day's tour schedule and availability.",
      what_should_visitors_wear:
        "Closed-toe walking shoes are the safest choice. Bring a light layer for the cooler underground environment and avoid clothing or equipment that could interfere with stairs or narrow passages.",
      is_the_cavern_accessible: accessibility,
      are_pets_allowed: petPolicy,
      is_photography_allowed: photographyPolicy,
    },
  };
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

function sharedCount(left: string[], right: string[]): number {
  const rightValues = new Set(right.map((value) => value.toLowerCase()));
  return left.filter((value) => rightValues.has(value.toLowerCase())).length;
}

function relatedScore(entity: ExploreEntity, candidate: ExploreEntity): number {
  let score = 0;

  if (candidate.entityType === entity.entityType)
    score += entity.entityType === "cavern" ? 100 : 60;
  if (candidate.region && candidate.region === entity.region) score += 20;
  if (candidate.county && candidate.county === entity.county) score += 12;
  if (candidate.isFamilyFriendly === entity.isFamilyFriendly) score += 6;

  score += sharedCount(entity.activities, candidate.activities) * 12;
  score += sharedCount(entity.categories, candidate.categories) * 8;
  score += Math.min(sharedCount(entity.tags, candidate.tags), 5) * 3;

  if (
    entity.latitude != null &&
    entity.longitude != null &&
    candidate.latitude != null &&
    candidate.longitude != null
  ) {
    const distance = distanceKm(
      entity.latitude,
      entity.longitude,
      candidate.latitude,
      candidate.longitude,
    );
    if (distance <= 50) score += 18;
    else if (distance <= 150) score += 10;
    else if (distance <= 300) score += 4;
  }

  return score;
}

function relatedDestinations(entity: ExploreEntity): ExploreEntityCard[] {
  const minimumScore = entity.entityType === "cavern" ? 16 : 8;

  return exploreDestinations
    .filter((candidate) => candidate.id !== entity.id)
    .map((candidate) => ({ candidate, score: relatedScore(entity, candidate) }))
    .filter(({ score }) => score >= minimumScore)
    .sort(
      (left, right) =>
        right.score - left.score || left.candidate.name.localeCompare(right.candidate.name),
    )
    .slice(0, 4)
    .map(({ candidate }) => card(candidate));
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
    items = items.filter(
      (entity) => entity.region != null && parsed.regions!.includes(entity.region),
    );
  if (parsed.counties?.length)
    items = items.filter(
      (entity) => entity.county != null && parsed.counties!.includes(entity.county),
    );
  if (parsed.activities?.length)
    items = items.filter((entity) =>
      parsed.activities!.every((value) => entity.activities.includes(value)),
    );
  if (parsed.amenities?.length)
    items = items.filter((entity) =>
      parsed.amenities!.every((value) => entity.amenities.includes(value)),
    );
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
      items = items.filter(
        (entity) => (entity.distanceKm ?? Number.POSITIVE_INFINITY) <= parsed.radiusKm!,
      );
  }

  if (parsed.sort === "name") items.sort((a, b) => a.name.localeCompare(b.name));
  if (parsed.sort === "distance")
    items.sort(
      (a, b) =>
        (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY),
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
  .validator((value) => exploreSearchSchema.parse(value))
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

export const getExploreGeography = createServerFn({ method: "GET" })
  .validator((value) =>
    z
      .object({
        kind: z.enum(["county", "region"]),
        slug: z.string().min(1).max(120),
      })
      .parse(value),
  )
  .handler(async ({ data }): Promise<ExploreGeographyPage | null> => {
    const key = data.kind;
    const match = exploreDestinations.find(
      (item) => item[key] && geographySlug(item[key]!) === data.slug,
    );
    const name = match?.[key];
    if (!name) return null;

    const matching = exploreDestinations.filter((item) => item[key] === name);
    const typeCounts = [...new Set(matching.map((item) => item.entityType))]
      .map((type) => ({
        type,
        count: matching.filter((item) => item.entityType === type).length,
      }))
      .sort((left, right) => right.count - left.count || left.type.localeCompare(right.type));
    const activityCounts = new Map<string, number>();
    for (const item of matching) {
      for (const activity of item.activities) {
        activityCounts.set(activity, (activityCounts.get(activity) ?? 0) + 1);
      }
    }
    const otherKey = data.kind === "county" ? "region" : "county";
    const geographyCounts = new Map<string, number>();
    for (const item of matching) {
      const value = item[otherKey];
      if (value) geographyCounts.set(value, (geographyCounts.get(value) ?? 0) + 1);
    }

    return {
      kind: data.kind,
      name,
      items: matching.slice(0, 48).map(card),
      total: matching.length,
      typeCounts,
      activities: [...activityCounts.entries()]
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .slice(0, 12)
        .map(([activity]) => activity),
      nearbyGeographies: [...geographyCounts.entries()]
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .slice(0, 12)
        .map(([geographyName, count]) => ({ name: geographyName, count })),
    };
  });

export const getExploreEntity = createServerFn({ method: "GET" })
  .validator((value) => z.object({ slug: z.string().min(1).max(240) }).parse(value))
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
    const related = relatedDestinations(entity);
    return { ...entity, profile: cavernVisitorProfile(entity), nearby, related };
  });

export const getExploreSlugTarget = createServerFn({ method: "GET" })
  .validator((value) => z.object({ slug: z.string().min(1).max(240) }).parse(value))
  .handler(async (): Promise<string | null> => null);

export const autocompleteExplore = createServerFn({ method: "GET" })
  .validator((value) =>
    z
      .object({
        q: z.string().trim().min(2).max(80),
        limit: z.number().int().min(1).max(12).default(8),
      })
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
  .validator((value) => z.object({ token: z.string().min(24).max(128) }).parse(value))
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

const periods: TripStop["period"][] = ["morning", "afternoon", "evening"];

export const generateExploreTrip = createServerFn({ method: "POST" })
  .validator((value) => tripPreferencesSchema.parse(value))
  .handler(async ({ data }): Promise<GeneratedTrip> => {
    const result = await search({
      regions: data.region ? [data.region] : undefined,
      familyFriendly: data.children > 0 || undefined,
      petFriendly: data.pets || undefined,
      accessible: data.accessible || undefined,
      pageSize: 100,
      sort: "relevance",
    });
    const candidates = result.items.filter((item) =>
      data.interests.length
        ? item.activities.some((activity) =>
            data.interests.some((interest) =>
              activity.toLowerCase().includes(interest.toLowerCase()),
            ),
          )
        : true,
    );
    const ordered = orderStopsForRoute(candidates);
    const days = Array.from({ length: data.days }, (_, index) => {
      const items = ordered.slice(index * data.stopsPerDay, (index + 1) * data.stopsPerDay);
      const stops: TripStop[] = items.map((item, stopIndex) => ({
        entity: item,
        period: periods[Math.min(stopIndex, periods.length - 1)],
        durationMinutes: 120,
        reasons: recommendationReasons(item, data),
        notes: [],
      }));
      return {
        day: index + 1,
        date: data.startDate
          ? new Date(`${data.startDate}T12:00:00Z`).toISOString().slice(0, 10)
          : undefined,
        stops,
      };
    }).filter((day) => day.stops.length > 0);
    return {
      title: data.title || "Explore Texas Trip",
      preferences: data,
      days,
      verificationReminder:
        "Verify current hours, fees, reservations, weather, access conditions, and regulations with official sources before traveling.",
    };
  });
