import { GOVERNMENT_ENTITIES } from '@/lib/texas-government';

export type VerifiedBillSourceAgency = {
  slug: string;
  name: string;
  shortName: string;
  officialUrl: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsPhrase(haystack: string, needle: string) {
  if (!needle || needle.length < 4) return false;
  return ` ${haystack} `.includes(` ${needle} `);
}

/**
 * Resolve only exact normalized names and known aliases from an official
 * fiscal-note source-agency field. Bill titles and article text are never used.
 */
export function resolveVerifiedBillSourceAgencies(sourceAgencies: string | null | undefined): VerifiedBillSourceAgency[] {
  const source = normalize(String(sourceAgencies ?? ''));
  if (!source) return [];

  return GOVERNMENT_ENTITIES
    .filter((entity) => {
      const aliases = [entity.name, entity.shortName, ...entity.newsKeywords]
        .map(normalize)
        .filter((alias) => alias.length >= 4);
      return aliases.some((alias) => containsPhrase(source, alias));
    })
    .map((entity) => ({
      slug: entity.slug,
      name: entity.name,
      shortName: entity.shortName,
      officialUrl: entity.officialUrl,
    }))
    .filter((entity, index, all) => all.findIndex((candidate) => candidate.slug === entity.slug) === index)
    .sort((a, b) => a.name.localeCompare(b.name));
}
