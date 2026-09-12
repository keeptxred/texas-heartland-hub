import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { formatElectionTitle } from "@/lib/elections/seo";

const titleContractRoutes = [
  "elections.candidates_.$candidateSlug.tsx",
  "elections.races_.$raceSlug.tsx",
  "elections.polls.$pollSlug.tsx",
  "elections.results.$resultSlug.tsx",
  "elections.forecast.$forecastSlug.tsx",
  "elections.voting.tsx",
  "elections.2026.tsx",
  "elections.statewide.tsx",
  "elections.legislative.tsx",
  "elections.districts.index.tsx",
  "elections.districts.$districtSlug.tsx",
] as const;

function sourceFor(fileName: string): string {
  return readFileSync(join(process.cwd(), "src/routes", fileName), "utf8");
}

describe("Election Central route title contract", () => {
  for (const fileName of titleContractRoutes) {
    it(`${fileName} delegates document-title construction to formatElectionTitle`, () => {
      const source = sourceFor(fileName);
      expect(source).toContain('from "@/lib/elections/seo"');
      expect(source).toContain("formatElectionTitle(");
    });
  }

  it("keeps representative election titles within the 60-character contract", () => {
    const titles = [
      formatElectionTitle("Texas Voting Dates, Voter ID & Ballot Research"),
      formatElectionTitle("2026 Texas Election Central: Races & Results"),
      formatElectionTitle("Texas Election Districts & 2026 Race Lookup"),
      formatElectionTitle(
        "A Deliberately Long Candidate Name for Regression Testing Election Central",
      ),
    ];

    for (const title of titles) {
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toMatch(/Keep TX Red$/);
      expect(title).not.toContain("KeepTXRed");
    }
  });

  it("keeps dynamic election detail title sources free of the compact legacy brand", () => {
    const dynamicRoutes = titleContractRoutes.slice(0, 5);
    for (const fileName of dynamicRoutes) {
      expect(sourceFor(fileName)).not.toContain("KeepTXRed");
    }
  });
});
