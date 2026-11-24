import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../routes/register-to-vote.tsx", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

describe("Texas voter registration authority page", () => {
  it("labels the elapsed 2026 deadline and maintains current official-source guidance", () => {
    expect(source).toContain("October 5, 2026");
    expect(source).toContain("November 3 general election is past");
    expect(source).toContain("30th day before Election Day");
    expect(source).toContain("ELECTION_CALENDAR");
    expect(source).toContain("UPDATE_REGISTRATION");
    expect(source).toContain("VOTE_TEXAS_REGISTER");
    expect(source).toContain("VOTE_TEXAS_FAQ");
    expect(source).toContain("CitationTrustPanel");
    expect(source).toContain('lastVerified="November 24, 2026"');
  });

  it("keeps the complete current Texas photo-ID list and reasonable-impediment caveat", () => {
    expect(source).toContain("Texas Personal Identification Card issued by DPS");
    expect(source).toContain("Texas Election Identification Certificate issued by DPS");
    expect(source).toContain("Texas Handgun License issued by DPS");
    expect(source).toContain("Reasonable Impediment Declaration");
  });

  it("keeps the corrected eligibility language and sitemap discovery", () => {
    expect(source).toContain("incarceration, parole, supervision or probation");
    expect(source).toContain("partially mentally incapacitated without the right to vote");
    expect(sitemap).toContain('"/register-to-vote"');
  });
});
