/**
 * Official, election-specific roster, checked October 25, 2026 against
 * the Texas Secretary of State's November 3 statewide election listing.
 *
 * The official listing distinguishes names printed on the ballot from
 * certified write-ins. Filing to run as an independent does NOT imply
 * ballot qualification: the SOS independent-filings report separately
 * identifies rejected applications. Never merge all filing records into
 * a list labeled as actual November general-election choices.
 *
 * Source: https://electionresults.sos.state.tx.us/results.html
 * Official election landing:
 * https://www.sos.state.tx.us/elections/laws/2026-november-general-election.shtml
 * Independent filing status:
 * https://www.sos.state.tx.us/elections/laws/independent-declarations-2026.shtml
 */
export const OFFICIAL_2026_STATEWIDE_ROSTER_CHECKED = "2026-10-25";
export const OFFICIAL_2026_STATEWIDE_ROSTER_SOURCE = "https://electionresults.sos.state.tx.us/results.html";
export const OFFICIAL_2026_ELECTION_INFORMATION_SOURCE = "https://www.sos.state.tx.us/elections/laws/2026-november-general-election.shtml";

type OfficeChoices = { printed: readonly string[]; writeIn: readonly string[] };

export const OFFICIAL_2026_STATEWIDE_BALLOT: Record<string, OfficeChoices> = {
  "2026-us-senate": {
    printed: ["Ken Paxton", "James Talarico", "Ted Brown"],
    writeIn: ["Avery Ayers", "Bradford Brad Hall", "Zul Mohamed", "Jade Simmons"],
  },
  "2026-governor": {
    printed: ["Greg Abbott", "Gina Hinojosa", "Pat Dixon"],
    writeIn: ["Edward Earl Giles", "Jenn Mack", "Jinghpaw Majoishingra", "Mike Miller"],
  },
  "2026-lieutenant-governor": {
    printed: ["Dan Patrick", "Vikki Goodwin", "Anthony Cristo", "Kevin McCormick"],
    writeIn: ["Arturo Espinosa", "Stephen Samuelson"],
  },
  "2026-attorney-general": {
    printed: ["Mayes Middleton", "Nathan Johnson", "Tom Oxford"],
    writeIn: [],
  },
  "2026-comptroller": {
    printed: ["Don Huffines", "Sarah Eckhardt", "V. Alonzo Echavarria-Garza", "Shehla Faizi"],
    writeIn: [],
  },
  "2026-land-commissioner": {
    printed: ["Dawn Buckingham", "Benjamin Flores", "Neill Snider"],
    writeIn: [],
  },
  "2026-agriculture-commissioner": {
    printed: ["Nate Sheets", "Clayton Tucker", "Austin R. Kelly"],
    writeIn: [],
  },
  "2026-railroad-commissioner": {
    printed: ["Bo French", "Jon Rosenthal", "Arthur Dibianca"],
    writeIn: [],
  },
  "2026-texas-supreme-court-place-1": {
    printed: ["Jimmy Blacklock", "Maggie Ellis"],
    writeIn: [],
  },
  "2026-texas-supreme-court-place-2": {
    printed: ["James P. Sullivan", "Chari Kelly"],
    writeIn: [],
  },
  "2026-texas-supreme-court-place-7": {
    printed: ["Kyle Hawkins", "Kristen Hawkins"],
    writeIn: [],
  },
  "2026-texas-supreme-court-place-8": {
    printed: ["Brett Busby", "Gisela D. Triana"],
    writeIn: [],
  },
  "2026-court-of-criminal-appeals-place-3": {
    printed: ["Thomas Smith", "Okey Anyiam", "Mark Ash"],
    writeIn: [],
  },
  "2026-court-of-criminal-appeals-place-4": {
    printed: ["Kevin Patrick Yeary", "Audra Riley"],
    writeIn: [],
  },
  "2026-court-of-criminal-appeals-place-9": {
    printed: ["John Messinger", "Holly Taylor"],
    writeIn: [],
  },
};

export function normalizeOfficialCandidateName(name: string): string {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export type Certified2026BallotChoice = { name: string; appearance: "printed" | "write-in" };

/** Returned names are official election listing entries, never unverified filings. */
export function certified2026StatewideChoices(officeSlug: string): Certified2026BallotChoice[] {
  const office = OFFICIAL_2026_STATEWIDE_BALLOT[officeSlug];
  if (!office) return [];
  const seen = new Set<string>();
  return [
    ...office.printed.map((name) => ({ name, appearance: "printed" as const })),
    ...office.writeIn.map((name) => ({ name, appearance: "write-in" as const })),
  ].filter((entry) => {
    const identity = normalizeOfficialCandidateName(entry.name);
    if (!identity || seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}
