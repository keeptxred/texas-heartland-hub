import { absUrl, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { ELECTION_ROUTES } from "./routes";

export interface ElectionSitemapRecord {
  path: string;
  updatedAt?: string | Date | null;
  indexable?: boolean;
  canonicalPath?: string | null;
}

export interface ElectionSitemapInput {
  cycles?: readonly ElectionSitemapRecord[];
  races?: readonly ElectionSitemapRecord[];
  candidates?: readonly ElectionSitemapRecord[];
  additionalPages?: readonly ElectionSitemapRecord[];
  lastmod?: string | Date;
}

const STATIC_ELECTION_PATHS = [
  ELECTION_ROUTES.root,
  ELECTION_ROUTES.races,
  ELECTION_ROUTES.statewide,
  ELECTION_ROUTES.legislative,
  ELECTION_ROUTES.districts,
  ELECTION_ROUTES.candidates,
  ELECTION_ROUTES.polls,
  ELECTION_ROUTES.forecast,
  ELECTION_ROUTES.results,
  ELECTION_ROUTES.methodology,
  ELECTION_ROUTES.corrections,
  ELECTION_ROUTES.voting,
] as const;

function normalizeElectionPath(path: string): string | null {
  const trimmed = path.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed, "https://keeptxred.com");
    if (url.hostname !== "keeptxred.com" && url.hostname !== "www.keeptxred.com") return null;
    url.search = "";
    url.hash = "";
    const normalized =
      url.pathname.length > 1 && url.pathname.endsWith("/")
        ? url.pathname.slice(0, -1)
        : url.pathname;
    return normalized === ELECTION_ROUTES.base || normalized.startsWith(`${ELECTION_ROUTES.base}/`)
      ? normalized
      : null;
  } catch {
    return null;
  }
}

function recordToEntry(
  record: ElectionSitemapRecord,
  fallbackLastmod: string | Date,
): UrlEntry | null {
  if (record.indexable === false) return null;

  const requestedPath = normalizeElectionPath(record.path);
  const canonicalPath = normalizeElectionPath(record.canonicalPath ?? record.path);
  if (!requestedPath || !canonicalPath || requestedPath !== canonicalPath) return null;
  if (canonicalPath === ELECTION_ROUTES.legacyRoot) return null;

  return {
    loc: absUrl(canonicalPath),
    lastmod: toIsoDate(record.updatedAt ?? fallbackLastmod),
  };
}

export function buildElectionSitemapEntries(input: ElectionSitemapInput = {}): UrlEntry[] {
  const fallbackLastmod = input.lastmod ?? new Date();
  const staticEntries = STATIC_ELECTION_PATHS.map((path) => ({
    loc: absUrl(path),
    lastmod: toIsoDate(fallbackLastmod),
  }));

  const dynamicRecords = [
    ...(input.cycles ?? []),
    ...(input.races ?? []),
    ...(input.candidates ?? []),
    ...(input.additionalPages ?? []),
  ];
  const entries = [
    ...staticEntries,
    ...dynamicRecords
      .map((record) => recordToEntry(record, fallbackLastmod))
      .filter((entry): entry is UrlEntry => entry !== null),
  ];

  return [...new Map(entries.map((entry) => [entry.loc, entry])).values()];
}

export const ELECTION_STATIC_SITEMAP_COUNT = STATIC_ELECTION_PATHS.length;
