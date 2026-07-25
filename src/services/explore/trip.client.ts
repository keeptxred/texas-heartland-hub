import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { GeneratedTrip, SavedTrip } from "@/types/explore/public";

type TripRow = {
  id: string;
  share_token: string | null;
  is_public: boolean;
  title: string;
  starts_on: string | null;
  ends_on: string | null;
  itinerary: GeneratedTrip;
  updated_at: string;
};

function client(): SupabaseClient {
  return supabase as unknown as SupabaseClient;
}

function saved(row: TripRow): SavedTrip {
  return {
    id: row.id,
    shareToken: row.share_token,
    isPublic: row.is_public,
    title: row.title,
    startsOn: row.starts_on,
    endsOn: row.ends_on,
    trip: row.itinerary,
    updatedAt: row.updated_at,
  };
}

export async function saveExploreTrip(
  trip: GeneratedTrip,
  existingId?: string,
): Promise<SavedTrip> {
  const auth = await client().auth.getUser();
  if (!auth.data.user) throw new Error("Sign in before saving a trip.");
  const start = trip.preferences.startDate ?? null;
  const end = start
    ? new Date(new Date(`${start}T12:00:00`).getTime() + (trip.preferences.days - 1) * 86_400_000)
        .toISOString()
        .slice(0, 10)
    : null;
  const values = {
    owner_id: auth.data.user.id,
    title: trip.title,
    starts_on: start,
    ends_on: end,
    preferences: trip.preferences,
    itinerary: trip,
    updated_at: new Date().toISOString(),
  };
  const query = existingId
    ? client().from("explore_trips").update(values).eq("id", existingId)
    : client().from("explore_trips").insert(values);
  const result = await query
    .select("id,share_token,is_public,title,starts_on,ends_on,itinerary,updated_at")
    .single();
  if (result.error) throw new Error(result.error.message);
  return saved(result.data as TripRow);
}

export async function setExploreTripSharing(id: string, enabled: boolean): Promise<SavedTrip> {
  const values = {
    is_public: enabled,
    share_token: enabled ? crypto.randomUUID().replaceAll("-", "") : null,
    updated_at: new Date().toISOString(),
  };
  const result = await client()
    .from("explore_trips")
    .update(values)
    .eq("id", id)
    .select("id,share_token,is_public,title,starts_on,ends_on,itinerary,updated_at")
    .single();
  if (result.error) throw new Error(result.error.message);
  return saved(result.data as TripRow);
}
