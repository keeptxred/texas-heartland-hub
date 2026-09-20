import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// This contract keeps the direct Election Central discovery paths crawlable as the UI evolves.
const electionHub = readFileSync(new URL("../../routes/elections.2026.tsx", import.meta.url), "utf8");
const candidateLinks = readFileSync(
  new URL("../../components/elections/candidates/CandidateInternalLinks.tsx", import.meta.url),
  "utf8",
);

describe("phase 5 election discovery links", () => {
  it("links the 2026 election hub directly to verified candidate detail pages", () => {
    expect(electionHub).toContain('to="/elections/candidates/$candidateSlug"');
    expect(electionHub).toContain("PRIORITY_CANDIDATES");
    expect(electionHub).toContain('to="/elections/candidates"');
  });

  it("links the 2026 election hub directly to active district detail pages", () => {
    expect(electionHub).toContain('to="/elections/districts/$districtSlug"');
    expect(electionHub).toContain("PRIORITY_DISTRICTS");
    expect(electionHub).toContain('to="/elections/districts"');
  });

  it("connects candidate profiles back to their district hub when the race has a district", () => {
    expect(candidateLinks).toContain("districtPathForRaceSlug");
    expect(candidateLinks).toContain("/elections/districts/");
    expect(candidateLinks).toContain('eyebrow: "Election district"');
  });

  it("connects matching live candidate pages to evergreen political biographies", () => {
    expect(candidateLinks).toContain("politicalFigureProfilePathByName");
    expect(candidateLinks).toContain('eyebrow: "Evergreen profile"');
    expect(candidateLinks).toContain("politicalProfileHref");
  });
});
