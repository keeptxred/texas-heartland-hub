import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { exploreSearchSchema, tripPreferencesSchema } from "@/schemas/explore/public.schema";
import type {
  ExploreEntity,
  ExploreEntityCard,
  ExploreObservation,
  ExploreSearchInput,
  ExploreSearchResult,
  GeneratedTrip,
  ExploreJson,
  TripPreferences,
} from "@/types/explore/public";

type Row = Record<string, unknown>;

function publicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function nullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function nullableBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
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
    return Object.fromEntries(Object.entries(value as Row).map(([key, item]) => [key, json(item)]));
  return String(value);
}

function card(row: Row): ExploreEntityCard {
  return {
    id: String(row.id),
    entityType: String(row.entity_type),
    name: String(row.name),
    slug: String(row.slug),
    summary: nullableString(row.summary),
    city: nullableString(row.city),
    county: nullableString(row.county),
    region: nullableString(row.region),
    latitude: nullableNumber(row.latitude),
    longitude: nullableNumber(row.longitude),
    heroImageUrl: nullableString(row.hero_image_url),
    heroImageAlt: nullableString(row.hero_image_alt),
    amenities: strings(row.amenities),
    activities: strings(row.activities),
    isFamilyFriendly: nullableBoolean(row.is_family_friendly),
    isPetFriendly: nullableBoolean(row.is_pet_friendly),
    isAccessible: nullableBoolean(row.is_accessible),
    feeRequired: nullableBoolean(row.fee_required),
    distanceKm: nullableNumber(row.distance_km),
  };
}

function observation(row: Row): ExploreObservation {
  const severity = ["info", "advisory", "warning", "closure"].includes(String(row.severity))
    ? (row.severity as ExploreObservation["severity"])
    : null;
  return {
    id: String(row.id),
    observationType: String(row.observation_type),
    title: String(row.title),
    description: nullableString(row.description),
    severity,
    startsAt: nullableString(row.starts_at),
    endsAt: nullableString(row.ends_at),
    sourceUrl: nullableString(row.source_url),
  };
}

async function search(input: ExploreSearchInput): Promise<ExploreSearchResult> {
  const parsed = exploreSearchSchema.parse(input);
  const client = publicClient();
  if (!client)
    return {
      items: [],
      total: 0,
      page: parsed.page,
      pageSize: parsed.pageSize,
      facets: emptyFacets(),
    };

  const { data, error } = await client.rpc("search_explore_entities", {
    search_query: parsed.q || null,
    entity_types: parsed.types ?? null,
    regions: parsed.regions ?? null,
    counties: parsed.counties ?? null,
    required_activities: parsed.activities ?? null,
    required_amenities: parsed.amenities ?? null,
    near_lat: parsed.lat ?? null,
    near_lng: parsed.lng ?? null,
    radius_km: parsed.radiusKm ?? null,
    result_limit: parsed.pageSize,
    result_offset: (parsed.page - 1) * parsed.pageSize,
  });
  if (error) throw new Error(`Explore search failed: ${error.message}`);
  let rows = (data ?? []) as Row[];
  if (parsed.familyFriendly != null)
    rows = rows.filter((row) => row.is_family_friendly === parsed.familyFriendly);
  if (parsed.petFriendly != null)
    rows = rows.filter((row) => row.is_pet_friendly === parsed.petFriendly);
  if (parsed.accessible != null)
    rows = rows.filter((row) => row.is_accessible === parsed.accessible);
  if (parsed.fee) rows = rows.filter((row) => row.fee_required === (parsed.fee === "required"));
  if (parsed.sort === "name") rows.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  const items = rows.map(card);

  const { data: facetRows } = await client
    .from("explore_entities")
    .select("entity_type,region,county,activities,amenities")
    .eq("status", "published")
    .limit(1000);
  const facets = collectFacets((facetRows ?? []) as Row[]);
  return {
    items,
    total: Number(rows[0]?.total_count ?? 0),
    page: parsed.page,
    pageSize: parsed.pageSize,
    facets,
  };
}

function emptyFacets() {
  return { entityTypes: [], regions: [], counties: [], activities: [], amenities: [] };
}

function collectFacets(rows: Row[]) {
  const values = {
    entityTypes: new Set<string>(),
    regions: new Set<string>(),
    counties: new Set<string>(),
    activities: new Set<string>(),
    amenities: new Set<string>(),
  };
  for (const row of rows) {
    if (row.entity_type) values.entityTypes.add(String(row.entity_type));
    if (row.region) values.regions.add(String(row.region));
    if (row.county) values.counties.add(String(row.county));
    strings(row.activities).forEach((value) => values.activities.add(value));
    strings(row.amenities).forEach((value) => values.amenities.add(value));
  }
  return Object.fromEntries(
    Object.entries(values).map(([key, set]) => [key, [...set].sort()]),
  ) as ExploreSearchResult["facets"];
}

export const searchExplore = createServerFn({ method: "GET" })
  .inputValidator((value) => exploreSearchSchema.parse(value))
  .handler(({ data }) => search(data));

export const getExploreLanding = createServerFn({ method: "GET" }).handler(async () => {
  const [featured, lakes, parks, camping, family, seasonal] = await Promise.all([
    search({ pageSize: 6 }),
    search({ types: ["lake"], pageSize: 4 }),
    search({ types: ["park"], pageSize: 4 }),
    search({ types: ["campground"], pageSize: 4 }),
    search({ familyFriendly: true, pageSize: 4 }),
    search({ pageSize: 4, sort: "relevance" }),
  ]);
  return { featured, lakes, parks, camping, family, seasonal };
});

export const getExploreEntity = createServerFn({ method: "GET" })
  .inputValidator((value) => z.object({ slug: z.string().min(1).max(240) }).parse(value))
  .handler(async ({ data }): Promise<ExploreEntity | null> => {
    const client = publicClient();
    if (!client) return null;
    const result = await client
      .from("explore_entities")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (result.error) throw new Error(`Explore entity lookup failed: ${result.error.message}`);
    if (!result.data) return null;
    const row = result.data as Row;
    const [observationsResult, relationshipsResult, nearbyResult] = await Promise.all([
      client
        .from("explore_observations")
        .select("*")
        .eq("entity_id", row.id)
        .eq("is_public", true)
        .limit(20),
      client
        .from("explore_entity_relationships")
        .select("target_entity_id")
        .eq("source_entity_id", row.id)
        .order("strength", { ascending: false })
        .limit(8),
      row.latitude != null && row.longitude != null
        ? client.rpc("search_explore_entities", {
            near_lat: row.latitude,
            near_lng: row.longitude,
            radius_km: 80,
            result_limit: 9,
            result_offset: 0,
            search_query: null,
            entity_types: null,
            regions: null,
            counties: null,
            required_activities: null,
            required_amenities: null,
          })
        : Promise.resolve({ data: [], error: null }),
    ]);
    const targetIds = ((relationshipsResult.data ?? []) as Row[]).map((item) =>
      String(item.target_entity_id),
    );
    const relatedResult = targetIds.length
      ? await client
          .from("explore_entities")
          .select("*")
          .in("id", targetIds)
          .eq("status", "published")
      : { data: [], error: null };
    return {
      ...card(row),
      alternateNames: strings(row.alternate_names),
      description: nullableString(row.description),
      officialUrl: nullableString(row.official_url),
      phone: nullableString(row.phone),
      email: nullableString(row.email),
      address:
        row.address && typeof row.address === "object"
          ? (json(row.address) as { [key: string]: ExploreJson })
          : null,
      profile:
        row.profile && typeof row.profile === "object"
          ? (json(row.profile) as { [key: string]: ExploreJson })
          : {},
      hours: json(row.hours),
      fees: json(row.fees),
      regulations: json(row.regulations),
      seasonalGuidance: json(row.seasonal_guidance),
      categories: strings(row.categories),
      tags: strings(row.tags),
      sourceUrl: nullableString(row.source_url),
      sourceName: nullableString(row.source_name),
      sourceUpdatedAt: nullableString(row.source_updated_at),
      updatedAt: String(row.updated_at),
      observations: ((observationsResult.data ?? []) as Row[]).map(observation),
      related: ((relatedResult.data ?? []) as Row[]).map(card),
      nearby: ((nearbyResult.data ?? []) as Row[])
        .filter((item) => item.id !== row.id)
        .slice(0, 8)
        .map(card),
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
      activities: data.interests.length === 1 ? data.interests : undefined,
      familyFriendly: data.children > 0 || undefined,
      petFriendly: data.pets || undefined,
      accessible: data.accessible || undefined,
      pageSize: Math.min(42, data.days * 5),
    });
    const ranked = result.items
      .map((entity) => ({
        entity,
        score:
          entity.activities.filter((activity) => data.interests.includes(activity)).length * 20 +
          (data.children > 0 && entity.isFamilyFriendly ? 10 : 0) +
          (data.pets && entity.isPetFriendly ? 10 : 0) +
          (data.accessible && entity.isAccessible ? 15 : 0) +
          (data.rv && entity.amenities.some((value) => /rv|hookup/i.test(value)) ? 10 : 0),
      }))
      .sort((a, b) => b.score - a.score || a.entity.name.localeCompare(b.entity.name));
    const start = data.startDate ? new Date(`${data.startDate}T12:00:00`) : null;
    const days = Array.from({ length: data.days }, (_, index) => {
      const date = start
        ? new Date(start.getTime() + index * 86_400_000).toISOString().slice(0, 10)
        : undefined;
      return {
        day: index + 1,
        date,
        stops: ranked.slice(index * 3, index * 3 + 3).map(({ entity }, stopIndex) => ({
          entity,
          period: (["morning", "afternoon", "evening"] as const)[stopIndex],
          durationMinutes: stopIndex === 1 ? 180 : 120,
          reasons: recommendationReasons(entity, data),
          notes: [
            entity.feeRequired
              ? "Fees may apply; verify current pricing with the official source."
              : "",
            data.pets && !entity.isPetFriendly
              ? "Verify the current pet policy before visiting."
              : "",
          ].filter(Boolean),
        })),
      };
    });
    return {
      title: data.title,
      preferences: data,
      days,
      verificationReminder:
        "Hours, fees, conditions, reservations, and regulations can change. Verify time-sensitive details with each official source before departure.",
    };
  });
