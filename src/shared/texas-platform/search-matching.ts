export function tokenMatchesText(token: string, text: string) {
  const words = text.split(' ').filter(Boolean);
  if (words.includes(token)) return true;
  if (token.length < 4) return false;
  return words.some((word) => word.startsWith(token) || token.startsWith(word));
}

export function countTokenMatches(tokens: readonly string[], text: string) {
  return tokens.filter((token) => tokenMatchesText(token, text)).length;
}

export function allTokensMatch(tokens: readonly string[], text: string) {
  return tokens.length > 0 && countTokenMatches(tokens, text) === tokens.length;
}
