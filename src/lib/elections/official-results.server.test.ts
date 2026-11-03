import { describe, expect, it } from "vitest";
import { parseOfficialTexasResults } from "./official-results.server";

const fixture = '<!doctype html><html><body><h1>Election Results - Tuesday, November 3, 2026</h1><p>2026 NOVEMBER GENERAL ELECTION (Updated 11/03/2026 07:42 PM)</p>' +
  ["U. S. SENATOR", "GOVERNOR", "LIEUTENANT GOVERNOR", "ATTORNEY GENERAL", "RAILROAD COMMISSIONER", "U. S. REPRESENTATIVE DISTRICT 1"].map((race, idx) =>
    "<h3>" + race + "</h3><p>Polling Locations Reporting: " + (idx ? 5 : 20) + "%</p>" +
    '<table><tr><th>Party</th><th>Candidate</th><th>Ballots Cast</th></tr>' +
    '<tr><td>REPUBLICAN</td><td>' + (idx ? "A. Candidate" : "KEN PAXTON") + '</td><td>1,234</td></tr>' +
    '<tr><td>DEMOCRATIC</td><td>' + (idx ? "B. Candidate" : "JAMES TALARICO") + '</td><td>1,050</td></tr></table>'
  ).join("\n") + "</body></html>";

describe("official Texas election night parser", () => {
  it("extracts live vote totals and SOS reporting percentages", () => {
    const feed = parseOfficialTexasResults(fixture, "2026-11-04T01:44:00.000Z");
    expect(feed.races).toHaveLength(6);
    expect(feed.reportingNow).toBe(true);
    expect(feed.sourceUpdatedLabel).toBe("11/03/2026 07:42 PM");
    expect(feed.races[0].title).toBe("U. S. SENATOR");
    expect(feed.races[0].reportingPercent).toBe(20);
    expect(feed.races[0].totalReportedVotes).toBe(2284);
    expect(feed.races[0].candidates[0]).toEqual({
      party: "REPUBLICAN", name: "KEN PAXTON", votes: 1234,
    });
  });

  it("does not invent zero votes for unreported cells", () => {
    const blank = fixture.replaceAll("<td>1,234</td>", "<td></td>")
      .replaceAll("<td>1,050</td>", "<td></td>")
      .replaceAll("Reporting: 20%", "Reporting: 0%")
      .replaceAll("Reporting: 5%", "Reporting: 0%");
    const feed = parseOfficialTexasResults(blank);
    expect(feed.reportingNow).toBe(false);
    expect(feed.races[0].candidates[0].votes).toBeNull();
    expect(feed.races[0].totalReportedVotes).toBeNull();
  });

  it("refuses a source that is not the November 2026 general election", () => {
    expect(() => parseOfficialTexasResults("<html>HTTP 403 access denied</html>")).toThrow();
  });
});
