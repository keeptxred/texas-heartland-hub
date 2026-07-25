import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { DuplicateCandidate, ImportEntityDraft } from "@/types/explore/import";

type Client = SupabaseClient<Database>;

export class DuplicateResolver {
  constructor(private readonly client: Client) {}

  async findCandidates(record: ImportEntityDraft): Promise<DuplicateCandidate[]> {
    const normalizedName = record.name.trim().toLowerCase();
    const { data, error } = await this.client
      .from("explore_entities" as never)
      .select("id,name,latitude,longitude" as never)
      .ilike("name" as never, `%${record.name.trim()}%`)
      .limit(20);
    if (error) throw error;

    return ((data ?? []) as Array<{ id: string; name: string; latitude?: number | null; longitude?: number | null }>)
      .map((candidate) => {
        const reasons: string[] = [];
        let score = this.nameSimilarity(normalizedName, candidate.name.trim().toLowerCase());
        if (score >= 0.9) reasons.push("near-exact name match");
        if (
          record.latitude != null && record.longitude != null &&
          candidate.latitude != null && candidate.longitude != null
        ) {
          const distance = this.distanceMiles(record.latitude, record.longitude, candidate.latitude, candidate.longitude);
          if (distance <= 0.1) {
            score = Math.min(1, score + 0.25);
            reasons.push("within 0.1 miles");
          } else if (distance <= 1) {
            score = Math.min(1, score + 0.1);
            reasons.push("within 1 mile");
          }
        }
        return { entityId: candidate.id, score, reasons };
      })
      .filter((candidate) => candidate.score >= 0.75)
      .sort((left, right) => right.score - left.score);
  }

  private nameSimilarity(left: string, right: string): number {
    if (left === right) return 1;
    const leftTokens = new Set(left.split(/\W+/).filter(Boolean));
    const rightTokens = new Set(right.split(/\W+/).filter(Boolean));
    const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
    const union = new Set([...leftTokens, ...rightTokens]).size;
    return union === 0 ? 0 : intersection / union;
  }

  private distanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const radius = 3958.8;
    const toRadians = (value: number) => value * Math.PI / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * radius * Math.asin(Math.sqrt(a));
  }
}
