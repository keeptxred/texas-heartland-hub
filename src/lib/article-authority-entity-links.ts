import type { AuthorityEntity } from "@/lib/authority-entity";
import { authorityEntityPath } from "@/lib/authority-entity-paths";
import { STATIC_AUTHORITY_ENTITIES } from "@/lib/authority-entity-registry";

export type ArticleAuthorityLink = {
  label: string;
  href: string;
};

type MatchCandidate = {
  entity: AuthorityEntity;
  phrase: string;
  index: number;
};

const TYPE_PRIORITY: Record<AuthorityEntity["entityType"], number> = {
  legislator: 0,
  "statewide-office": 1,
  agency: 2,
  district: 3,
  committee: 4,
  candidate: 5,
  race: 6,
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

function entityLabel(entity: AuthorityEntity): string {
  const title = entity.title?.trim();
  if (title && title.toLowerCase() !== entity.name.trim().toLowerCase()) {
    return `${entity.name} — ${title}`;
  }
  return entity.name;
}

/**
 * Returns only high-confidence contextual authority links. Matching is limited
 * to full verified entity names, plus the full current-officeholder name for a
 * statewide office. There is intentionally no fuzzy, surname-only, acronym,
 * or inferred candidate matching here.
 */
export function pickExactArticleAuthorityLinks(
  text: string,
  entities: readonly AuthorityEntity[] = STATIC_AUTHORITY_ENTITIES,
  limit = 3,
): ArticleAuthorityLink[] {
  if (!text.trim() || limit <= 0) return [];

  const matches: MatchCandidate[] = [];
  for (const entity of entities) {
    if (!entity.active || !entity.lastVerified || !entity.sourceOfTruth?.url) continue;

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
    || TYPE_PRIORITY[a.entity.entityType] - TYPE_PRIORITY[b.entity.entityType]
    || a.entity.name.localeCompare(b.entity.name),
  );

  const out: ArticleAuthorityLink[] = [];
  const seenHref = new Set<string>();
  for (const match of matches) {
    const href = authorityEntityPath(match.entity.entityType, match.entity.slug);
    if (seenHref.has(href)) continue;
    seenHref.add(href);
    out.push({ label: entityLabel(match.entity), href });
    if (out.length >= limit) break;
  }
  return out;
}
