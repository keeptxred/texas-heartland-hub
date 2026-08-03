export function tokenMatchesText(token: string, text: string) {
  if (text.includes(token)) return true;
  if (token.length < 4) return false;
  return text.split(' ').some((word) => word.startsWith(token) || token.startsWith(word));
}

export function countTokenMatches(tokens: readonly string[], text: string) {
  return tokens.filter((token) => tokenMatchesText(token, text)).length;
}

export function allTokensMatch(tokens: readonly string[], text: string) {
  return tokens.length > 0 && countTokenMatches(tokens, text) === tokens.length;
}
