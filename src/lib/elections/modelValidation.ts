import { isElectionIdentifier } from "@/types/elections";

export interface ElectionModelValidationInput {
  id: unknown;
  sourceName: unknown;
  sourceUrl: unknown;
  freshnessStatus: unknown;
  relationshipIds?: readonly unknown[];
  knownRelationshipIds?: ReadonlySet<string>;
}

export interface ElectionModelValidationResult {
  valid: boolean;
  errors: readonly string[];
  warnings: readonly string[];
}

export function validateElectionModel(
  input: ElectionModelValidationInput,
): ElectionModelValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isElectionIdentifier(input.id)) errors.push("A valid record identifier is required.");
  if (typeof input.sourceName !== "string" || !input.sourceName.trim()) {
    errors.push("Source name is required.");
  }
  if (typeof input.sourceUrl !== "string" || !isHttpUrl(input.sourceUrl)) {
    errors.push("A valid source URL is required.");
  }
  for (const relationshipId of input.relationshipIds ?? []) {
    if (
      !isElectionIdentifier(relationshipId) ||
      (input.knownRelationshipIds && !input.knownRelationshipIds.has(relationshipId))
    ) {
      errors.push(`Broken relationship: ${String(relationshipId)}`);
    }
  }
  if (input.freshnessStatus === "stale" || input.freshnessStatus === "expired") {
    warnings.push("Record data is stale.");
  }
  return { valid: errors.length === 0, errors, warnings };
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
