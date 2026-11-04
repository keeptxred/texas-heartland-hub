/**
 * Official 2026 Texas Secretary of State election-night returns.
 * Never infer votes, leaders or winners. The SOS publishes unofficial results.
 */
export const TEXAS_SOS_RESULTS_URL = "https://electionresults.sos.state.tx.us/results.html";

export interface OfficialResultCandidate {
  party: string;
  name: string;
  votes: number | null;
}

export interface OfficialResultRace {
  id: string;
  title: string;
  reportingPercent: number | null;
  candidates: OfficialResultCandidate[];
  totalReportedVotes: number | null;
}

export interface OfficialResultsFeed {
  source: string;
  sourceUrl: string;
  sourceUpdatedLabel: string | null;
  retrievedAt: string;
  reportingNow: boolean;
  races: OfficialResultRace[];
}

const PARTY = /^(REPUBLICAN|DEMOCRATIC|LIBERTARIAN|GREEN|INDEPENDENT|WRITE-IN|WRITE IN|CONSTITUTION|REFORM)\s*$/i;
const REPORTING = /Polling\s+Locations\s+Reporting\s*:\s*([\d.]+)\s*%/i;

function textEntities(input: string): string {
  return input.replace(/&(#x[\da-f]+|#\d+|amp|nbsp|quot|apos|lt|gt|ndash|mdash);?/gi, (whole, code: string) => {
    const entity = code.toLowerCase();
    if (entity.startsWith("#")) {
      const hex = entity.startsWith("#x");
      const number = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isInteger(number) && number > 0 && number <= 0x10ffff
        ? String.fromCodePoint(number)
        : whole;
    }
    return ({ amp: "&", nbsp: " ", quot: '"', apos: "'", lt: "<", gt: ">", ndash: "–", mdash: "—" } as Record<string, string>)[entity] ?? whole;
  });
}

function linesFromHtml(html: string): string[] {
  const visible = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<\/t[dh]\s*>/gi, " | ")
    .replace(/<\/tr\s*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|h[1-6]|section|article|table|caption|header|li)\s*>/gi, "\n")
    .replace(/<[^>]*>/g, " ");
  return textEntities(visible).split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").replace(/^[| ]+|[| ]+$/g, "").trim())
    .filter(Boolean);
}

function heading(line: string): boolean {
  return line.length >= 5 &&
    line.length <= 145 &&
    line === line.toUpperCase() &&
    /^[A-Z0-9 .,&'"/()\-–]+$/.test(line) &&
    !/^(?:REPUBLICAN|DEMOCRATIC|GREEN|LIBERTARIAN|WRITE|INDEPENDENT|PARTY|CANDIDATE|BALLOTS|POLLING|UPDATED|2026 NOVEMBER|ELECTION RESULTS|MAIN SITE|SITE INDEX)/i.test(line) &&
    !line.includes("|");
}

function candidateFromLine(line: string): OfficialResultCandidate | null {
  const cells = line.split(/\s*\|\s*/).map((value) => value.trim()).filter(Boolean);
  if (cells.length < 2 || !PARTY.test(cells[0])) return null;
  const name = cells[1].replace(/\s+/g, " ").trim();
  if (!name || name.length > 130) return null;
  // An empty SOS "Ballots Cast" cell is unknown, NOT zero votes.
  const rawVotes = cells[2] ?? "";
  const match = rawVotes.match(/^([\d,]+)(?:\b|$)/);
  const votes = match ? Number(match[1].replace(/,/g, "")) : null;
  return { party: cells[0].toUpperCase(), name, votes: votes !== null && Number.isSafeInteger(votes) ? votes : null };
}

function raceId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * SOS "Updated" times are Central Standard Time on November 3-4, 2026.
 * The source's polling-location percentage is NOT estimated vote completeness.
 */
export function sosSourceAgeMinutes(label: string | null, now = Date.now()): number | null {
  const match = label?.match(/^(\d{1,2})\/(\d{1,2})\/(2026)\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const hour = Number(match[4]) % 12 + (match[6].toUpperCase() === "PM" ? 12 : 0);
  const minute = Number(match[5]);
  if (month !== 11 || (day !== 3 && day !== 4) || hour > 23 || minute > 59) return null;
  const sourceMs = Date.parse(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-06:00`);
  return Number.isFinite(sourceMs) && sourceMs <= now ? Math.floor((now - sourceMs) / 60000) : null;
}

export function parseOfficialTexasResults(html: string, retrievedAt = new Date().toISOString()): OfficialResultsFeed {
  if (!/2026\s+NOVEMBER\s+GENERAL\s+ELECTION/i.test(textEntities(html.replace(/<[^>]+>/g, " ")))) {
    throw new Error("SOS response did not identify the November 2026 general election.");
  }
  const lines = linesFromHtml(html);
  const races: OfficialResultRace[] = [];
  let lastHeaderIndex = -1;

  for (let i = 0; i < lines.length; i += 1) {
    const progress = lines[i].match(REPORTING);
    if (!progress) continue;

    let title: string | null = null;
    // Each Texas SOS office heading is immediately before its reporting progress row.
    for (let j = i - 1; j > lastHeaderIndex && j >= Math.max(0, i - 24); j -= 1) {
      if (heading(lines[j])) { title = lines[j]; break; }
    }
    lastHeaderIndex = i;
    if (!title) continue;

    const candidates: OfficialResultCandidate[] = [];
    for (let j = i + 1; j < lines.length; j += 1) {
      if (REPORTING.test(lines[j])) break;
      const candidate = candidateFromLine(lines[j]);
      if (candidate) {
        candidates.push(candidate);
      } else if (heading(lines[j]) && candidates.length > 0) {
        break;
      }
    }
    if (candidates.length === 0) continue;
    const pct = Number(progress[1]);
    const reportingPercent = Number.isFinite(pct) && pct >= 0 && pct <= 100 ? pct : null;
    const hasVotes = candidates.some((item) => item.votes !== null);
    races.push({
      id: raceId(title),
      title,
      reportingPercent,
      candidates: candidates.sort((a, b) => {
        const order = (party: string) => party === "REPUBLICAN" ? 0 : party === "DEMOCRATIC" ? 1 : 2;
        return order(a.party) - order(b.party);
      }),
      totalReportedVotes: hasVotes ? candidates.reduce((sum, item) => sum + (item.votes ?? 0), 0) : null,
    });
  }

  const unique = [...new Map(races.map((race) => [race.id, race])).values()];
  if (unique.length < 5 || !unique.some((race) => /U\.\s*S\.\s*SENATOR|GOVERNOR/i.test(race.title))) {
    throw new Error("SOS response lacked the expected Texas statewide contest tables.");
  }
  const sourceUpdatedLabel = lines.join(" ").match(/2026 NOVEMBER GENERAL ELECTION\s*\(Updated\s+([^)]+)\)/i)?.[1] ?? null;
  return {
    source: "Texas Secretary of State",
    sourceUrl: TEXAS_SOS_RESULTS_URL,
    sourceUpdatedLabel,
    retrievedAt,
    reportingNow: unique.some((race) => (race.reportingPercent ?? 0) > 0 || (race.totalReportedVotes ?? 0) > 0),
    races: unique,
  };
}
