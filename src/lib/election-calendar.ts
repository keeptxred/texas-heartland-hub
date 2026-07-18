// Centralized Texas election calendar. Add future elections here — no other
// code needs to change. Countdown copy, tickers, and the Elections page all
// derive their next-election data from `getNextElection()`.

export type TexasElectionType = "primary" | "runoff" | "general" | "special" | "municipal";

export interface TexasElection {
  /** Short display name, e.g. "Texas Primary Election". */
  name: string;
  /** ISO date (YYYY-MM-DD), interpreted as end-of-day Central time. */
  date: string;
  type: TexasElectionType;
  jurisdiction: string;
  description: string;
  /** Official source citation (URL). */
  source: string;
  /** ISO date this entry was last verified. */
  lastUpdated: string;
}

// Sorted chronologically. Dates per Texas Secretary of State election calendar.
export const TEXAS_ELECTIONS: TexasElection[] = [
  {
    name: "Texas Primary Election",
    date: "2026-03-03",
    type: "primary",
    jurisdiction: "Statewide",
    description: "Republican and Democratic primaries for federal, state, and county offices.",
    source: "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml",
    lastUpdated: "2026-07-18",
  },
  {
    name: "Texas Primary Runoff Election",
    date: "2026-05-26",
    type: "runoff",
    jurisdiction: "Statewide",
    description: "Runoff for any primary race in which no candidate received a majority.",
    source: "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml",
    lastUpdated: "2026-07-18",
  },
  {
    name: "Texas General Election",
    date: "2026-11-03",
    type: "general",
    jurisdiction: "Statewide",
    description: "General election for federal, state, and county offices.",
    source: "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml",
    lastUpdated: "2026-07-18",
  },
  {
    name: "Texas Primary Election",
    date: "2028-03-07",
    type: "primary",
    jurisdiction: "Statewide",
    description: "Republican and Democratic primaries for federal, state, and county offices.",
    source: "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml",
    lastUpdated: "2026-07-18",
  },
  {
    name: "Texas General Election",
    date: "2028-11-07",
    type: "general",
    jurisdiction: "Statewide",
    description: "Presidential general election.",
    source: "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml",
    lastUpdated: "2026-07-18",
  },
];

function startOfDayUTC(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Returns the next election on or after `now` (defaults to today). */
export function getNextElection(now: Date = new Date()): TexasElection | null {
  const today = startOfDayUTC(now);
  const upcoming = TEXAS_ELECTIONS
    .filter((e) => startOfDayUTC(new Date(e.date + "T00:00:00Z")) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] ?? null;
}

/** Whole days from `now` until the given election date (never negative). */
export function daysUntil(election: TexasElection, now: Date = new Date()): number {
  const today = startOfDayUTC(now);
  const target = startOfDayUTC(new Date(election.date + "T00:00:00Z"));
  return Math.max(0, Math.round((target - today) / 86_400_000));
}

/** Human-readable date, e.g. "March 3, 2026". */
export function formatElectionDate(election: TexasElection): string {
  return new Date(election.date + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Short type label for badges/stats. */
export function electionTypeLabel(type: TexasElectionType): string {
  switch (type) {
    case "primary": return "Primary";
    case "runoff": return "Primary Runoff";
    case "general": return "General";
    case "special": return "Special";
    case "municipal": return "Municipal";
  }
}

/** Ticker headline, e.g. "142 Days to Texas Primary Election". */
export function nextElectionHeadline(now: Date = new Date()): string {
  const next = getNextElection(now);
  if (!next) return "2026 Texas Elections: Races, Candidates & Voter Guide";
  const days = daysUntil(next, now);
  if (days === 0) return `${next.name} — Today`;
  if (days === 1) return `1 Day to ${next.name}`;
  return `${days} Days to ${next.name}`;
}