import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES } from "./texas-political-geography-authority";
import { TEXAS_ELECTION_HISTORY } from "./texas-political-history-authority";

const PILLAR_PATH = "/keep-texas-red";
const COMPETITIVENESS_PATH = "/texas-politics/why-texas-is-politically-competitive";

const keepTexasRedSource = readFileSync(
  new URL("../routes/keep-texas-red.tsx", import.meta.url),
  "utf8",
);
const competitivenessSource = readFileSync(
  new URL("../routes/texas-politics.why-texas-is-politically-competitive.tsx", import.meta.url),
  "utf8",
);
const realignmentSource = readFileSync(
  new URL("../routes/texas-politics.how-texas-became-republican.tsx", import.meta.url),
  "utf8",
);
const electionCentralSource = readFileSync(
  new URL("../routes/elections.2026.tsx", import.meta.url),
  "utf8",
);

describe("Keep Texas Red supporting-content cluster", () => {
  it("keeps every political-geography authority page linked back to the pillar", () => {
    expect(TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES).toHaveLength(4);

    for (const page of TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES) {
      expect(
        page.relatedLinks.some((link) => link.href === PILLAR_PATH),
        `${page.slug} should link back to ${PILLAR_PATH}`,
      ).toBe(true);
    }
  });

  it("keeps Texas election history linked back to the pillar", () => {
    expect(
      TEXAS_ELECTION_HISTORY.relatedLinks.some((link) => link.href === PILLAR_PATH),
    ).toBe(true);
  });

  it("keeps route-based supporting pages linked back to the pillar", () => {
    expect(realignmentSource).toContain('href="/keep-texas-red"');
    expect(electionCentralSource).toContain('to="/keep-texas-red"');
    expect(competitivenessSource).toContain('href: "/keep-texas-red"');
  });

  it("keeps the pillar linked to the six core supporting guides", () => {
    for (const href of [
      "/texas-politics/texas-political-geography-history",
      "/texas-politics/texas-election-history",
      "/texas-politics/how-texas-became-republican",
      "/texas-politics/texas-urban-suburban-rural-politics-history",
      COMPETITIVENESS_PATH,
      "/elections/2026",
    ]) {
      expect(keepTexasRedSource).toContain(`href: "${href}"`);
    }
  });

  it("keeps the competitiveness guide on the September 25 publication contract", () => {
    expect(competitivenessSource).toContain('publishedTime: "2026-09-25"');
    expect(competitivenessSource).toContain('modifiedTime: "2026-09-25"');
    expect(competitivenessSource).toContain('datePublished: "2026-09-25"');
    expect(competitivenessSource).toContain('dateModified: "2026-09-25"');
    expect(competitivenessSource).toContain(
      '<time dateTime="2026-09-25">September 25, 2026</time>',
    );
    expect(competitivenessSource).not.toContain("2026-09-24");
    expect(competitivenessSource).not.toContain("September 24, 2026");
  });
});
