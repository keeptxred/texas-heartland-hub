export const TEXAS_DEFINED_OWNED_SOURCE_NAMES = new Set([
  "Texas Universities and Campus Life",
  "Texas Hospitals, Health and Rankings",
  "Moving to Texas and Relocation",
  "Texas Culture and Attractions",
  "Texas Sports and Fan Culture",
]);

export function isTexasDefinedOwnedSource(source: string | null | undefined): boolean {
  const normalized = String(source ?? "").trim().toLowerCase();
  if (!normalized) return false;

  return [...TEXAS_DEFINED_OWNED_SOURCE_NAMES].some(
    (name) => name.toLowerCase() === normalized,
  );
}
