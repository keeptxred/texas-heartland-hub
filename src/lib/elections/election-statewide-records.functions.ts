import { createServerFn } from "@tanstack/react-start";
import { STATEWIDE_RACES } from "./2026-statewide-race-definitions";
import {
  certified2026StatewideChoices,
  normalizeOfficialCandidateName,
} from "./2026-statewide-official-ballot";

/** Server projects only verified candidate link identities, never the source JSON catalogs. */
export const getVerifiedStatewideRecords = createServerFn({ method: "GET" })
  .handler(async () => {
    const [{ default: candidatesSnapshot }, { default: racesSnapshot }] = await Promise.all([
      import("@/data/elections/2026/candidates.json"),
      import("@/data/elections/2026/races.json"),
    ]);
    const PUBLISHED_CANDIDATES = candidatesSnapshot.filter((candidate) => candidate.publicationStatus === "published" && candidate.verificationStatus === "verified");
    const CANDIDATE_BY_ID = new Map(PUBLISHED_CANDIDATES.map((candidate) => [candidate.id, candidate] as const));
    const PUBLISHED_RACE_BY_SLUG = new Map(racesSnapshot.filter((race) => race.publicationStatus === "published" && race.verificationStatus === "verified").map((race) => [race.slug, race] as const));
    const STATEWIDE_RECORDS = STATEWIDE_RACES.map((definition) => {
      const race = PUBLISHED_RACE_BY_SLUG.get(definition.slug);
      const publishedProfiles = race?.candidateIds.map((id) => CANDIDATE_BY_ID.get(id))
        .filter((candidate): candidate is (typeof PUBLISHED_CANDIDATES)[number] => Boolean(candidate)) ?? [];
      // A published profile is not evidence that its candidate qualified for the
      // November 2026 ballot. Independents can be rejected and write-ins can have
      // a different status. Begin with the Secretary of State's official roster.
      const candidates = certified2026StatewideChoices(definition.slug).map((entry) => {
        const profiles = publishedProfiles.filter(
          (profile) => normalizeOfficialCandidateName(profile.fullName) === normalizeOfficialCandidateName(entry.name),
        );
        // A duplicate name can correspond to separate, conflicting filing statuses.
        // Show the official name once, but do not link to an ambiguous profile.
        return { ...entry, verifiedProfile: profiles.length === 1 ? profiles[0] : null };
      });
      return { ...definition, race, candidates };
    });
    const verifiedStatewideCount = STATEWIDE_RECORDS.filter((item) => item.race).length;
    
    return {
      verifiedStatewideCount,
      records: STATEWIDE_RECORDS.map(({ race, candidates, ...definition }) => ({
        ...definition,
        race: Boolean(race),
        candidates: candidates.map(({ verifiedProfile, ...choice }) => ({
          ...choice,
          verifiedProfile: verifiedProfile ? { slug: verifiedProfile.slug } : null,
        })),
      })),
    };
  });
