import { normalizeSearchText, tokenizeSearchQuery } from './search-normalization.ts';

const SEARCH_ALIASES: Record<string, string[]> = {
  rep: ['representative', 'legislator'],
  reps: ['representative', 'legislator'],
  senator: ['senate', 'legislator', 'representative'],
  senators: ['senate', 'legislator', 'representative'],
  congressman: ['representative', 'congress', 'house'],
  congresswoman: ['representative', 'congress', 'house'],
  lawmaker: ['legislator', 'representative'],
  lawmakers: ['legislator', 'representative'],
  tax: ['taxes', 'property tax'],
  taxes: ['tax', 'property tax'],
  home: ['house', 'property', 'housing'],
  house: ['home', 'property', 'housing'],
  moving: ['relocation', 'move'],
  relocation: ['moving', 'move'],
  parks: ['park', 'outdoors', 'recreation'],
  park: ['parks', 'outdoors', 'recreation'],
  bills: ['bill', 'legislation'],
  bill: ['bills', 'legislation'],
  laws: ['law', 'legislation'],
  law: ['laws', 'legislation'],
  schools: ['school', 'education', 'district'],
  school: ['schools', 'education', 'district'],
  counties: ['county'],
  county: ['counties'],
  cities: ['city'],
  city: ['cities'],
};

export function expandSearchTokens(value: string) {
  const baseTokens = tokenizeSearchQuery(value);
  const expanded = new Set(baseTokens);

  for (const token of baseTokens) {
    for (const alias of SEARCH_ALIASES[token] ?? []) {
      for (const aliasToken of tokenizeSearchQuery(alias)) expanded.add(aliasToken);
    }
  }

  return [...expanded];
}

export function expandedSearchText(value: string) {
  const normalized = normalizeSearchText(value);
  const expanded = expandSearchTokens(value);
  return [normalized, ...expanded].filter(Boolean).join(' ');
}
