/** Public Election Central is retired; back-office election data remains intact. */
const LEGACY_ELECTION_CENTRAL_PATHS = new Set([
  "/election",
  "/election-central",
  "/texas-elections",
  "/elections-2026",
  "/candidate-guides",
  "/texas-news/elections",
]);

export function isRetiredElectionCentralPath(pathname: string): boolean {
  const normalized = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  return normalized === "/elections"
    || normalized.startsWith("/elections/")
    || LEGACY_ELECTION_CENTRAL_PATHS.has(normalized);
}
