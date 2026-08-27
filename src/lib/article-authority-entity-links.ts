import type { AuthorityEntity } from "@/lib/authority-entity";
import { authorityEntityPath } from "@/lib/authority-entity-paths";
import { STATIC_AUTHORITY_ENTITIES } from "@/lib/authority-entity-registry";
import { VERIFIED_ELECTION_ARTICLE_AUTHORITY_ENTITIES } from "@/lib/election-article-authority-entities";

export type ArticleAuthorityLink = {
  label: string;
  href: string;
};

type MatchCandidate = {
  entity: AuthorityEntity;
  phrase: string;
  index: number;
};

const DEFAULT_ARTICLE_AUTHORITY_ENTITIES: readonly AuthorityEntity[] = [
  ...STATIC_AUTHORITY_ENTITIES,
  ...VERIFIED_ELECTION_ARTICLE_AUTHORITY_ENTITIES,
];

const ELECTION_CONTEXT_RE = /\b(candidate|campaign|election|primary|ballot|race|nominee|reelect(?:ion|ed)?|re-election|running for)\b/i;

const NON_ELECTION_TYPE_PRIORITY: Record<AuthorityEntity["entityType"], number> = {
  legislator: 0,
  "statewide-office": 1,
  agency: 2,
  district: 3,
  committee: 4,
  candidate: 5,
  race: 6,
};

const ELECTION_TYPE_PRIORITY: Record<AuthorityEntity["entityType"], number> = {
  candidate: 0,
  race: 1,
  legislator: 2,
  "statewide-office": 3,
  agency: 4,
  district: 5,
  committee: 6,
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSpecificPhrase(value: string): boolean {
  const words = value.trim().match(/[A-Za-z0-9]+/g) ?? [];
  return value.trim().length >= 7 && words.length >= 2;
}

function phraseIndex(text: string, phrase: string): number {
  if (!isSpecificPhrase(phrase)) return -1;
  const escaped = escapeRegExp(phrase.trim()).replace(/\s+/g, "\\s+");
  const match = new RegExp(`(^|[^A-Za-z0-9])(${escaped})(?=$|[^A-Za-z0-9])`, "i").exec(text);
  return match ? match.index + match[1].length : -1;
}

function normalizedPhrase(value: string): string {
  return value.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
}

function entityLabel(entity: AuthorityEntity): string {
  const title = entity.title?.trim();
  if (title && title.toLowerCase() !== entity.name.trim().toLowerCase()) {
    return `${entity.name} — ${title}`;
  }
  return entity.name;
}

function ambiguousElectionNames(entities: readonly AuthorityEntity[]): ReadonlySet<string> {
  const counts = new Map<string, number>();
  for (const entity of entities) {
    if (entity.entityType !== "candidate" && entity.entityType !== "race") continue;
    if (!entity.active || !entity.lastVerified || !entity.sourceOfTruth?.url) continue;
    const key = normalizedPhrase(entity.name);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return new Set([...counts].filter(([, count]) => count > 1).map(([name]) => name));
}

/**
 * Returns only high-confidence contextual authority links. Matching is limited
 * to full verified entity names, plus the full current-officeholder name for a
 * statewide office. Candidate/race matches additionally require election
 * context and a unique published entity name. There is intentionally no fuzzy,
 * surname-only, acronym, or inferred identity matching here.
 */
export function pickExactArticleAuthorityLinks(
  text: string,
  entities: readonly AuthorityEntity[] = DEFAULT_ARTICLE_AUTHORITY_ENTITIES,
  limit = 3,
): ArticleAuthorityLink[] {
  if (!text.trim() || limit <= 0) return [];

  const electionContext = ELECTION_CONTEXT_RE.test(text);
  const typePriority = electionContext ? ELECTION_TYPE_PRIORITY : NON_ELECTION_TYPE_PRIORITY;
  const ambiguousElectionNameSet = ambiguousElectionNames(entities);
  const matches: MatchCandidate[] = [];

  for (const entity of entities) {
    if (!entity.active || !entity.lastVerified || !entity.sourceOfTruth?.url) continue;
    if (entity.entityType === "candidate" || entity.entityType === "race") {
      if (!electionContext || ambiguousElectionNameSet.has(normalizedPhrase(entity.name))) continue;
    }

    const phrases = [entity.name];
    if (entity.entityType === "statewide-office" && entity.subtitle) {
      phrases.push(entity.subtitle);
    }

    let bestIndex = Number.POSITIVE_INFINITY;
    let matchedPhrase = "";
    for (const phrase of phrases) {
      const index = phraseIndex(text, phrase);
      if (index >= 0 && index < bestIndex) {
        bestIndex = index;
        matchedPhrase = phrase;
      }
    }
    if (matchedPhrase) matches.push({ entity, phrase: matchedPhrase, index: bestIndex });
  }

  matches.sort((a, b) =>
    a.index - b.index
    || typePriority[a.entity.entityType] - typePriority[b.entity.entityType]
    || a.entity.name.localeCompare(b.entity.name)
    || a.entity.slug.localeCompare(b.entity.slug),
  );

  const out: ArticleAuthorityLink[] = [];
  const seenHref = new Set<string>();
  const seenPhrase = new Set<string>();
  for (const match of matches) {
    const href = authorityEntityPath(match.entity.entityType, match.entity.slug);
    const phraseKey = normalizedPhrase(match.phrase);
    if (seenHref.has(href) || seenPhrase.has(phraseKey)) continue;
    seenHref.add(href);
    seenPhrase.add(phraseKey);
    out.push({ label: entityLabel(match.entity), href });
    if (out.length >= limit) break;
  }
  return out;
}
