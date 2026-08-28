import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const rootRoutePath = join(process.cwd(), "src/routes/__root.tsx");
const electionLayoutPath = join(
  process.cwd(),
  "src/components/elections/layout/ElectionLayout.tsx",
);

describe("GEO readiness follow-up", () => {
  it("publishes both generic Organization and NewsMediaOrganization identity types", () => {
    const source = readFileSync(rootRoutePath, "utf8");

    expect(source).toContain('"@type": ["Organization", "NewsMediaOrganization"]');
    expect(source).toContain("organizationJsonLd()");
  });

  it("uses a descriptive Election Central H1 without changing the metadata title", () => {
    const source = readFileSync(electionLayoutPath, "utf8");

    expect(source).toContain(
      'const ELECTION_CENTRAL_H1 = "2026 Texas Election Central: Races, Candidates, Polls & Results";',
    );
    expect(source).toContain(
      'const heading = title === "Texas Election Central" ? ELECTION_CENTRAL_H1 : title;',
    );
    expect(source).toContain("{heading}");
    expect(source).toContain("<title>{`${title} | KeepTXRed`}</title>");
  });
});
