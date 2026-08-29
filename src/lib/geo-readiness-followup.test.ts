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

  it("uses one deterministic Election Central title across H1, metadata, and schema", () => {
    const source = readFileSync(electionLayoutPath, "utf8");

    expect(source).toContain(
      'const ELECTION_CENTRAL_TITLE = "2026 Texas Election Central: Races, Candidates, Polls & Results";',
    );
    expect(source).toContain(
      'const isElectionCentralPage = isCanonicalPage && normalized === "/elections/2026";',
    );
    expect(source).toContain(
      'const usesElectionCentralTitle = isElectionCentralPage || title === "Texas Election Central";',
    );
    expect(source).toContain(
      "const pageTitle = usesElectionCentralTitle ? ELECTION_CENTRAL_TITLE : title;",
    );
    expect(source).toContain("? usesElectionCentralTitle");
    expect(source).toContain("name: pageTitle");
    expect(source).toContain("<title>{`${pageTitle} | KeepTXRed`}</title>");
    expect(source).toContain('<meta property="og:title" content={pageTitle} />');
    expect(source).toContain('<meta name="twitter:title" content={pageTitle} />');
    expect(source).toContain("{pageTitle}");
    expect(source).not.toContain(
      'const heading = title === "Texas Election Central" ? ELECTION_CENTRAL_H1 : title;',
    );
  });
});