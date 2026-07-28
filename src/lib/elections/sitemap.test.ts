import { describe, expect, it } from "vitest";
import { buildElectionSitemapEntries } from "./sitemap";

const LASTMOD = "2026-07-28T12:00:00.000Z";

describe("Election Central sitemap", () => {
  it("uses the canonical 2026 overview and excludes the legacy redirect", () => {
    const entries = buildElectionSitemapEntries({ lastmod: LASTMOD });
    const locations = entries.map((entry) => entry.loc);

    expect(locations).toContain("https://keeptxred.com/elections/2026");
    expect(locations).not.toContain("https://keeptxred.com/elections");
  });

  it("includes canonical published detail paths", () => {
    const entries = buildElectionSitemapEntries({
      lastmod: LASTMOD,
      races: [
        {
          path: "/elections/races/2026-us-senate",
          canonicalPath: "/elections/races/2026-us-senate",
          updatedAt: LASTMOD,
        },
      ],
      candidates: [
        {
          path: "/elections/candidates/example-candidate",
          canonicalPath: "/elections/candidates/example-candidate",
          updatedAt: LASTMOD,
        },
      ],
    });
    const locations = entries.map((entry) => entry.loc);

    expect(locations).toContain("https://keeptxred.com/elections/races/2026-us-senate");
    expect(locations).toContain("https://keeptxred.com/elections/candidates/example-candidate");
  });

  it("rejects aliases, external URLs, and duplicate entries", () => {
    const entries = buildElectionSitemapEntries({
      lastmod: LASTMOD,
      additionalPages: [
        {
          path: "/elections",
          canonicalPath: "/elections/2026",
        },
        {
          path: "https://example.com/elections/races/not-ours",
        },
        {
          path: "/elections/races/duplicate",
        },
        {
          path: "/elections/races/duplicate",
        },
      ],
    });
    const locations = entries.map((entry) => entry.loc);

    expect(locations).not.toContain("https://keeptxred.com/elections");
    expect(locations).not.toContain("https://example.com/elections/races/not-ours");
    expect(locations.filter((location) => location.endsWith("/elections/races/duplicate"))).toHaveLength(1);
  });
});
