import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("statewide Texas election search intent and voter-specific safeguards", () => {
  const source = readFileSync("src/routes/elections.statewide.tsx", "utf8");

  it("uses distinct statewide candidate intent without misleading official-ballot claims", () => {
    expect(source).toContain('formatElectionTitle("Texas 2026 Statewide Races & Candidates")');
    expect(source).toContain("U.S. Senate, governor, attorney general, courts");
    expect(source).toContain('href: URL');
    expect(source).toContain('title="Texas 2026 Statewide Election Races & Candidates"');
    expect(source).toContain("Candidate and race records on this page were verified on their individual source dates, not necessarily today");
    expect(source).toContain("must not be treated as an official voter-specific ballot");
    expect(source).toContain("https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml");
    expect(source).toContain("https://www.votetexas.gov/voting/where");
  });

  it("keeps race and candidate rows behind existing verification filters", () => {
    expect(source).toContain('candidate.publicationStatus === "published" && candidate.verificationStatus === "verified"');
    expect(source).toContain('race.publicationStatus === "published" && race.verificationStatus === "verified"');
    expect(source).toContain('rel: "canonical", href: URL');
  });
});
