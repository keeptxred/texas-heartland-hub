const SEARCH_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'for',
  'in',
  'my',
  'of',
  'the',
  'to',
]);

export function normalizeSearchText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function tokenizeSearchQuery(value: string) {
  const normalized = normalizeSearchText(value);
  if (normalized.length < 2) return [];
  return normalized
    .split(' ')
    .filter((token) => token.length > 1 && !SEARCH_STOP_WORDS.has(token));
}

export function isUsefulSearchQuery(value: string) {
  return tokenizeSearchQuery(value).length > 0;
}
