import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");
const criticalRoutes = [
  "elections.2026.tsx",
  "elections.statewide.tsx",
  "elections.districts.index.tsx",
  "elections.districts.$districtSlug.tsx",
  "elections.candidates_.$candidateSlug.tsx",
  "elections.races_.$raceSlug.tsx",
];
describe("Election Central shared-bootstrap payload boundary", () => {
  it.each(criticalRoutes)("does not synchronously import 2026 race/candidate JSON into route config: %s", (filename) => {
    const content = read(`src/routes/${filename}`);
    expect(content).not.toMatch(/import\\s+.*(?:candidates|races)Snapshot?\\s+from\\s+[\"']@\\/data\\/elections\\/2026\\/(?:candidates|races)\\.json/);
    expect(content).toContain("head:");
    expect(content).toContain('rel: "canonical"');
  });
  it("keeps SSR verified election links and district matching through bounded server functions", () => {
    const central = read("src/lib/elections/election-central-priority.functions.ts");
    const districtIndex = read("src/lib/elections/election-district-index.functions.ts");
    const statewide = read("src/lib/elections/election-statewide-records.functions.ts");
    const districtDetail = read("src/lib/elections/election-district-detail.functions.ts");
    for (const s of [central, districtIndex, statewide, districtDetail]) {
      expect(s).toContain('createServerFn({ method: "GET" })');
      expect(s).toContain('publicationStatus === "published"');
      expect(s).toContain('verificationStatus === "verified"');
      expect(s).toContain('import("@/data/elections/2026/races.json")');
    }
    expect(central).toContain('import("@/data/elections/2026/candidates.json")');
    expect(statewide).toContain('certified2026StatewideChoices');
    expect(districtDetail).toContain('import("@/data/elections/2026/candidates.json")');
    expect(districtIndex).toContain('districtNumber: race.districtNumber');
    const candidates = read("src/routes/elections.candidates_.$candidateSlug.tsx");
    expect(candidates).toContain("throw notFound()");
    expect(candidates).toContain("statusCode: 301");
    const district = read("src/routes/elections.districts.$districtSlug.tsx");
    expect(district).toContain("getRelatedAuthorityContent");
    expect(district).toContain("getElectionDistrictDetailSnapshot");
  });
});
