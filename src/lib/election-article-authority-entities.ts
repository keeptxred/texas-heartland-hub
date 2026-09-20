import candidatesJson from "@/data/elections/2026/candidates.json";
import racesJson from "@/data/elections/2026/races.json";
import type { ElectionCandidate } from "@/types/elections/candidate";
import type { ElectionRace } from "@/types/elections/race";
import type { AuthorityEntity } from "@/lib/authority-entity";
import { candidateToAuthorityEntity } from "@/lib/candidate-authority";
import { raceToAuthorityEntity } from "@/lib/race-authority";

function isPublishedVerified(record: { publicationStatus: string; verificationStatus: string }): boolean {
  return record.publicationStatus === "published" && record.verificationStatus === "verified";
}

const candidates = (candidatesJson as unknown as readonly ElectionCandidate[]).filter(isPublishedVerified);
const races = (racesJson as unknown as readonly ElectionRace[]).filter(isPublishedVerified);

const raceSlugById = new Map(races.map((race) => [String(race.id), String(race.slug)]));
const candidateSlugById = new Map(candidates.map((candidate) => [candidate.id, String(candidate.slug)]));

/**
 * Published, verified election entities that are safe for exact article-link
 * matching. Inactive candidates/races are omitted so stale campaign identities
 * never receive fresh internal-link equity.
 */
export const VERIFIED_ELECTION_ARTICLE_AUTHORITY_ENTITIES: readonly AuthorityEntity[] = [
  ...candidates.map((candidate) => candidateToAuthorityEntity(candidate, { raceSlugById })),
  ...races.map((race) => raceToAuthorityEntity(race, { candidateSlugById })),
].filter(
  (entity) => entity.active && Boolean(entity.lastVerified) && Boolean(entity.sourceOfTruth?.url),
);
