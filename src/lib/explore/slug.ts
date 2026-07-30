const combiningMarks = /[\u0300-\u036f]/g;
const invalidSlugCharacters = /[^a-z0-9]+/g;
const repeatedHyphens = /-{2,}/g;

export function toExploreSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(combiningMarks, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(invalidSlugCharacters, '-')
    .replace(repeatedHyphens, '-')
    .replace(/^-|-$/g, '');
}

export function ensureExploreSlug(value: string, fallback = 'entity'): string {
  const slug = toExploreSlug(value);
  return slug || fallback;
}

export function appendExploreSlugSuffix(slug: string, suffix: string | number): string {
  const normalizedSlug = ensureExploreSlug(slug);
  const normalizedSuffix = ensureExploreSlug(String(suffix), 'item');
  return `${normalizedSlug}-${normalizedSuffix}`;
}

export function isExploreSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
