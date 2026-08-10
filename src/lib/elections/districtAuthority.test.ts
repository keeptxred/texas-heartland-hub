import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const route = readFileSync(
  resolve(process.cwd(), "src/routes/elections.districts.$districtSlug.tsx"),
  "utf8",
);

describe("election district authority template", () => {
  it("uses verified race and candidate records", () => {
    expect(route).toContain("getPublishedRace");
    expect(route).toContain('publicationStatus === "published"');
    expect(route).toContain('verificationStatus === "verified"');
    expect(route).toContain('to="/elections/candidates/$candidateSlug"');
    expect(route).toContain('to="/elections/races/$raceSlug"');
  });

  it("publishes geography, official-source, and candidate structured data", () => {
    expect(route).toContain('"@type": "AdministrativeArea"');
    expect(route).toContain('"@type": "Event"');
    expect(route).toContain('"@type": "ItemList"');
    expect(route).toContain("geographySource.sourceUrl");
    expect(route).toContain("countyElectionLinkSource.sourceUrl");
  });

  it("cross-links district authority resources", () => {
    for (const path of [
      "/register-to-vote",
      "/voting-locations",
      "/find-representative",
      "/county-elections",
    ]) {
      expect(route).toContain(path);
    }
  });
});
