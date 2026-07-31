export type PoliticalEntityValidation = {
  valid: boolean;
  errors: string[];
};

const FEDERAL_SENATE_CANDIDATES = [
  "Ken Paxton",
  "Warren Kenneth Paxton",
  "James Talarico",
] as const;

/**
 * Deterministic publication gate for high-risk office and district claims.
 * This supplements source review; it intentionally blocks rather than
 * guessing when a known statewide federal race is labeled as a state-
 * legislative district contest.
 */
export function validatePoliticalEntityClaims(text: string): PoliticalEntityValidation {
  const normalized = text.replace(/\s+/g, " ").trim();
  const errors: string[] = [];
  const containsFederalSenateCandidate = FEDERAL_SENATE_CANDIDATES.some((name) =>
    normalized.toLowerCase().includes(name.toLowerCase()),
  );

  if (
    containsFederalSenateCandidate &&
    /\b(?:Texas|state)\s+Senate\s+District\s+\d+\b/i.test(normalized)
  ) {
    errors.push(
      "Known 2026 U.S. Senate candidate was incorrectly assigned to a Texas Senate district.",
    );
  }

  if (
    /\bKen Paxton\b/i.test(normalized) &&
    /\bJames Talarico\b/i.test(normalized) &&
    !/\bU\.?S\.?\s+Senate\b/i.test(normalized)
  ) {
    errors.push(
      "Paxton–Talarico race coverage must identify the contest as the 2026 Texas U.S. Senate race.",
    );
  }

  return { valid: errors.length === 0, errors };
}
