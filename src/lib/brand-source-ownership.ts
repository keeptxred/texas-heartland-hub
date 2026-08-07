export const TEXAS_DEFINED_OWNED_SOURCE_NAMES = new Set([
  "Texas Universities and Campus Life",
  "Texas Hospitals, Health and Rankings",
  "Moving to Texas and Relocation",
  "Texas Culture and Attractions",
  "Texas Sports and Fan Culture",
]);

// Government, election, and political authority sources belong to KeepTXRed.
// This explicit allow-list takes precedence over stale/mistaken ownership notes
// so official political news can never be diverted to TexasDefined.
export const KEEP_TX_RED_OWNED_SOURCE_NAMES = new Set([
  "Office of the Governor",
  "Texas Governor",
  "Governor of Texas",
  "Texas Secretary of State",
  "Texas Attorney General",
  "Office of the Attorney General of Texas",
  "Texas Legislature",
  "Texas House of Representatives",
  "Texas Senate",
  "Texas Ethics Commission",
  "Texas Legislative Council",
  "Legislative Reference Library of Texas",
]);

function normalizeSource(source: string | null | undefined): string {
  return String(source ?? "").trim().toLowerCase();
}

export function isKeepTxRedOwnedSource(source: string | null | undefined): boolean {
  const normalized = normalizeSource(source);
  if (!normalized) return false;

  if ([...KEEP_TX_RED_OWNED_SOURCE_NAMES].some((name) => name.toLowerCase() === normalized)) {
    return true;
  }

  // Cover named official election authorities without accidentally claiming
  // general lifestyle sources. Examples: Harris County Elections, Travis
  // County Elections Division, Texas Elections Division.
  return (
    /(^|\b)texas\s+(elections?|election\s+division)(\b|$)/i.test(normalized) ||
    /(^|\b)[a-z .'-]+\s+county\s+(elections?|election\s+(department|division|administrator))(\b|$)/i.test(
      normalized,
    )
  );
}

export function isTexasDefinedOwnedSource(source: string | null | undefined): boolean {
  if (isKeepTxRedOwnedSource(source)) return false;

  const normalized = normalizeSource(source);
  if (!normalized) return false;

  return [...TEXAS_DEFINED_OWNED_SOURCE_NAMES].some(
    (name) => name.toLowerCase() === normalized,
  );
}

export function isTexasDefinedOwnedSourceRecord(
  source: string | null | undefined,
  notes: string | null | undefined,
): boolean {
  // KeepTXRed's political/government authority always wins over stale source
  // metadata. Do not let a legacy `TexasDefined-owned` note block publication.
  if (isKeepTxRedOwnedSource(source)) return false;

  return (
    isTexasDefinedOwnedSource(source) ||
    String(notes ?? "").toLowerCase().includes("texasdefined-owned")
  );
}
