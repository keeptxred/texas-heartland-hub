import { createServerFn } from "@tanstack/react-start";

/** Only the published, verified navigation preview crosses the SSR loader boundary. */
export const getElectionCentralPriority = createServerFn({ method: "GET" })
  .handler(async () => {
    const [{ default: candidatesSnapshot }, { default: racesSnapshot }] = await Promise.all([
      import("@/data/elections/2026/candidates.json"),
      import("@/data/elections/2026/races.json"),
    ]);
    const PUBLISHED_RACES = racesSnapshot.filter(
      (race) => race.publicationStatus === "published" && race.verificationStatus === "verified",
    );
    const PUBLISHED_CANDIDATES = candidatesSnapshot.filter(
      (candidate) =>
        candidate.publicationStatus === "published" && candidate.verificationStatus === "verified",
    );
    const CANDIDATE_BY_ID = new Map(PUBLISHED_CANDIDATES.map((candidate) => [candidate.id, candidate]));
    
    const PRIORITY_CANDIDATES = [
      ...new Map(
        PUBLISHED_RACES.slice(0, 10).flatMap((race) =>
          race.candidateIds.flatMap((candidateId) => {
            const candidate = CANDIDATE_BY_ID.get(candidateId);
            return candidate ? [[candidate.slug, candidate] as const] : [];
          }),
        ),
      ).values(),
    ].slice(0, 12);
    
    function districtPathForRaceSlug(slug: string): { slug: string; label: string } | null {
      const patterns: Array<[RegExp, string, string]> = [
        [/^2026-us-house-district-(\d{1,2})$/, "congressional-district", "Congressional District"],
        [/^2026-texas-house-district-(\d{1,3})$/, "texas-house-district", "Texas House District"],
        [/^2026-texas-senate-district-(\d{1,2})$/, "texas-senate-district", "Texas Senate District"],
      ];
      for (const [pattern, prefix, label] of patterns) {
        const match = pattern.exec(slug);
        if (match) return { slug: `${prefix}-${match[1]}`, label: `${label} ${match[1]}` };
      }
      return null;
    }
    
    const PRIORITY_DISTRICTS = [
      ...new Map(
        PUBLISHED_RACES.flatMap((race) => {
          const district = districtPathForRaceSlug(race.slug);
          return district ? [[district.slug, district] as const] : [];
        }),
      ).values(),
    ].slice(0, 12);
    
    
    return {
      priorityCandidates: PRIORITY_CANDIDATES.map((candidate) => ({
        id: candidate.id, slug: candidate.slug, fullName: candidate.fullName,
      })),
      priorityDistricts: PRIORITY_DISTRICTS,
    };
  });
