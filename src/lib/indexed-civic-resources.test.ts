import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const register = readFileSync("src/routes/register-to-vote.tsx", "utf8");
const county = readFileSync("src/routes/county-elections.tsx", "utf8");
const sitemap = readFileSync("src/routes/sitemap-pages[.]xml.ts", "utf8");
const review = JSON.parse(readFileSync("scripts/authority/indexed-reference-review.json", "utf8"));
describe("year-round civic resource accuracy", () => {
  it("uses the official election calendar instead of advertising an expired 2026 deadline", () => {
    expect(register).toContain("Register at least 30 days before the election");
    expect(register).toContain("The October 5, 2026 deadline for the November 3 general election is past");
    expect(register).not.toContain("Current deadline · verified August 20, 2026");
    expect(register).toContain("href={ELECTION_CALENDAR}");
    expect(register).toContain("href={UPDATE_REGISTRATION}");
  });
  it("discloses that county directory links lead to the statewide list and offers useful filtering", () => {
    expect(county).toContain("COUNTIES.filter");
    expect(county).toContain("not individual county webpages");
    expect(county).toContain("href={COUNTY_DIRECTORY}");
    expect(county).toContain('aria-live="polite"');
    expect(county).toContain('href="/register-to-vote"');
    expect(register).toContain('href="/county-elections"');
  });
  it("assigns meaningful sitemap dates and recurring review intervals to the revised resources", () => {
    for (const path of ["/register-to-vote", "/county-elections"]) {
      expect(sitemap).toContain(`"${path}": toIsoDate("2026-11-24`);
      expect(review.records.find((record: {path:string}) => record.path === path)).toMatchObject({reviewed:"2026-11-24",reviewDays:30});
    }
  });
});
