import { normalizeSearchText } from './search-normalization';

export function levenshteinDistance(left: string, right: string, maxDistance = Number.POSITIVE_INFINITY) {
  const a = normalizeSearchText(left);
  const b = normalizeSearchText(right);
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let row = 1; row <= a.length; row += 1) {
    const current = [row];
    let rowMinimum = current[0];
    for (let column = 1; column <= b.length; column += 1) {
      const substitutionCost = a[row - 1] === b[column - 1] ? 0 : 1;
      const value = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        previous[column - 1] + substitutionCost,
      );
      current.push(value);
      rowMinimum = Math.min(rowMinimum, value);
    }
    if (rowMinimum > maxDistance) return maxDistance + 1;
    previous = current;
  }
  return previous[b.length];
}

export function fuzzyTokenMatch(queryToken: string, candidateToken: string) {
  const query = normalizeSearchText(queryToken);
  const candidate = normalizeSearchText(candidateToken);
  if (query.length < 5 || candidate.length < 5) return false;
  const allowedDistance = query.length >= 9 ? 2 : 1;
  return levenshteinDistance(query, candidate, allowedDistance) <= allowedDistance;
}

export function countFuzzyTokenMatches(queryTokens: readonly string[], candidateText: string) {
  const candidateTokens = normalizeSearchText(candidateText).split(' ').filter(Boolean);
  return queryTokens.filter((queryToken) =>
    candidateTokens.some((candidateToken) => fuzzyTokenMatch(queryToken, candidateToken)),
  ).length;
}
