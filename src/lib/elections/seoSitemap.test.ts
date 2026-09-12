import { describe, expect, it } from "vitest";
import {
  buildElectionCollectionSchema,
  buildElectionSeo,
  formatElectionTitle,
} from "./seo";
import { buildElectionSitemapEntries, ELECTION_STATIC_SITEMAP_COUNT } from "./sitemap";
import { ELECTION_PRIMARY_NAV_ROUTES, ELECTION_ROUTES } from "./routes";

describe("Election Central metadata and sitemap", () => {
  it("creates canonical, indexable Election Central metadata", () => {
    expect(
      buildElectionSeo({
        title: "Texas Election Polls",
        pathname: "/elections/polls?race=test",
      }),
    ).toMatchObject({
      title: "Texas Election Polls | Keep TX Red",
      canonicalUrl: "https://keeptxred.com/elections/polls",
      robots: "index,follow",
      openGraph: { siteName: "Keep TX Red" },
    });
  });

  it("does not duplicate Election Central branding", () => {
    expect(formatElectionTitle("Keep TX Red | Texas Elections")).toBe(
      "Keep TX Red | Texas Elections",
    );
    expect(formatElectionTitle("Texas Elections | Keep TX Red")).toBe(
      "Texas Elections | Keep TX Red",
    );
  });

  it("clamps long Election Central titles at a word boundary", () => {
    expect(
      formatElectionTitle(
        "2026 Texas Congressional District 35 Democratic General Election Candidate Comparison",
      ),
    ).toBe("2026 Texas Congressional District 35 | Keep TX Red");
  });

  it("creates CollectionPage and ItemList structured data without fake records", () => {
    const schema = buildElectionCollectionSchema({
      name: "Texas Election Polls",
      description: "Published, source-backed Texas election polls.",
      pathname: ELECTION_ROUTES.polls,
      itemType: "Dataset",
    });
    expect(schema).toMatchObject({
      "@type": "CollectionPage",
      mainEntity: { "@type": "ItemList", itemListElement: [] },
    });
  });

  it("includes every static Election Central route in the election sitemap", () => {
    const entries = buildElectionSitemapEntries({ lastmod: "2026-07-27" });
    const locations = entries.map((entry) => entry.loc);
    expect(entries).toHaveLength(ELECTION_STATIC_SITEMAP_COUNT);
    for (const route of [
      ...ELECTION_PRIMARY_NAV_ROUTES,
      ELECTION_ROUTES.voting,
      ELECTION_ROUTES.corrections,
    ]) {
      expect(locations).toContain(`https://keeptxred.com${route}`);
    }
  });

  it("excludes noncanonical and non-Election Central dynamic records", () => {
    const entries = buildElectionSitemapEntries({
      lastmod: "2026-07-27",
      candidates: [
        { path: "/elections/candidates/valid-candidate" },
        {
          path: "/elections/candidates/duplicate",
          canonicalPath: "/elections/candidates/canonical",
        },
        { path: "/admin/elections" },
      ],
    });
    expect(entries.map((entry) => entry.loc)).toContain(
      "https://keeptxred.com/elections/candidates/valid-candidate",
    );
    expect(entries.map((entry) => entry.loc)).not.toContain(
      "https://keeptxred.com/elections/candidates/duplicate",
    );
  });
});
