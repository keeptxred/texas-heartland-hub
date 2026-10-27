import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  OFFICIAL_2026_STATEWIDE_BALLOT,
  OFFICIAL_2026_STATEWIDE_ROSTER_CHECKED,
  OFFICIAL_2026_STATEWIDE_ROSTER_SOURCE,
  certified2026StatewideChoices,
  normalizeOfficialCandidateName,
} from "./elections/2026-statewide-official-ballot";

describe("Texas SOS November 2026 statewide roster", () => {
  it("uses the official 2026 general-election listing and covers all 18 statewide contests", () => {
    expect(OFFICIAL_2026_STATEWIDE_ROSTER_SOURCE).toBe("https://electionresults.sos.state.tx.us/results.html");
    expect(OFFICIAL_2026_STATEWIDE_ROSTER_CHECKED).toBe("2026-10-25");
    expect(Object.keys(OFFICIAL_2026_STATEWIDE_BALLOT)).toHaveLength(18);
    for (const [slug, office] of Object.entries(OFFICIAL_2026_STATEWIDE_BALLOT)) {
      const entries = certified2026StatewideChoices(slug);
      expect(entries.length, slug).toBe(office.printed.length + office.writeIn.length);
      expect(new Set(entries.map((entry) => normalizeOfficialCandidateName(entry.name))).size, slug).toBe(entries.length);
    }
  });

  it("separates written ballot choices from certified write-ins and excludes rejected independents", () => {
    const senate = certified2026StatewideChoices("2026-us-senate");
    expect(senate.filter((entry) => entry.appearance === "printed").map((entry) => entry.name))
      .toEqual(["Ken Paxton", "James Talarico", "Ted Brown"]);
    expect(senate.filter((entry) => entry.name === "Jade Simmons")).toEqual([
      { name: "Jade Simmons", appearance: "write-in" },
    ]);
    expect(certified2026StatewideChoices("2026-governor").map((entry) => entry.name))
      .not.toContain("Sarah Bowman Cunningham");
    expect(certified2026StatewideChoices("2026-governor").map((entry) => entry.name))
      .not.toContain("Demetra Jefferson Wysinger");
    expect(certified2026StatewideChoices("2026-lieutenant-governor").map((entry) => entry.name))
      .not.toContain("Mike Collier");
    expect(certified2026StatewideChoices("2026-agriculture-commissioner").map((entry) => entry.name))
      .not.toContain("Alfred Molison Jr.");
    expect(normalizeOfficialCandidateName('Bradford "Brad" Hall')).toBe(normalizeOfficialCandidateName("Bradford Brad Hall"));
    expect(certified2026StatewideChoices("2026-fifteenth-court-chief-justice").map((entry) => entry.name))
      .toEqual(["Scott Brister", "Jerry Zimmerer"]);
    expect(certified2026StatewideChoices("2026-fifteenth-court-place-2").map((entry) => entry.name))
      .toEqual(["Scott K. Field", "Tom Baker"]);
    expect(certified2026StatewideChoices("2026-fifteenth-court-place-3").map((entry) => entry.name))
      .toEqual(["April Farris", "Marc M. Meyer"]);
  });

  it("renders roster-first instead of printing unverified candidate profiles as ballot choices", () => {
    const route = readFileSync("src/routes/elections.statewide.tsx", "utf8");
    const server = readFileSync("src/lib/elections/election-statewide-records.functions.ts", "utf8");
    const definitions = readFileSync("src/lib/elections/2026-statewide-race-definitions.ts", "utf8");
    expect(server).toContain("certified2026StatewideChoices(definition.slug)");
    expect(definitions).toContain('name: "Fifteenth Court of Appeals — Place 3"');
    expect(route).toContain('/texas-government/fifteenth-court-of-appeals');
    expect(route).toContain('item.race ? (');
    expect(server).toContain('profiles.length === 1 ? profiles[0] : null');
    expect(route).toContain('candidate.appearance === "write-in"');
    expect(route).toContain('OFFICIAL_2026_STATEWIDE_ROSTER_SOURCE');
    expect(route).toContain('https://www.sos.state.tx.us/elections/laws/independent-declarations-2026.shtml');
    expect(server).toContain('candidate.publicationStatus === "published" && candidate.verificationStatus === "verified"');
    expect(route).toContain("Route.useLoaderData()");
    expect(route).toContain("getVerifiedStatewideRecords()");
  });
});
