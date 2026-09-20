import { describe, expect, it } from "vitest";
import { ABOUT_LINKS, SHOP_LINK, SHOP_POLICY_LINKS, SITE_NAV_GROUPS } from "./site-navigation";

const REDIRECT_ALIASES = new Set([
  "/elections",
  "/texas-news",
  "/living-in-texas",
  "/dallas-fort-worth",
  "/san-antonio",
  "/austin",
  "/el-paso",
]);

const MIGRATED_REGION_DESTINATIONS = new Map([
  ["Dallas–Fort Worth", "https://texasdefined.com/article/moving-to-dallas-fort-worth-guide"],
  ["San Antonio", "https://texasdefined.com/article/moving-to-san-antonio-guide"],
  ["Austin", "https://texasdefined.com/article/moving-to-austin-guide"],
  ["El Paso", "https://texasdefined.com/article/moving-to-el-paso-guide"],
]);

function expectCanonicalInternalLink(link: { readonly to: string; readonly label: string }) {
  expect(link.to, `${link.label} must use an internal absolute path`).toMatch(/^\//);
  expect(
    REDIRECT_ALIASES.has(link.to),
    `${link.label} must not point through redirect alias ${link.to}`,
  ).toBe(false);
}

describe("site navigation", () => {
  it("keeps primary group ids and labels unique", () => {
    const ids = SITE_NAV_GROUPS.map((group) => group.id);
    const labels = SITE_NAV_GROUPS.map((group) => group.label);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("uses direct canonical destinations in global navigation", () => {
    for (const group of SITE_NAV_GROUPS) {
      for (const link of group.links) {
        if ("href" in link) {
          expect(link.href, `${link.label} external navigation must use HTTPS`).toMatch(/^https:\/\//);
          continue;
        }
        expectCanonicalInternalLink(link);
      }
    }

    expectCanonicalInternalLink(SHOP_LINK);
    for (const link of ABOUT_LINKS) expectCanonicalInternalLink(link);
    for (const link of SHOP_POLICY_LINKS) expectCanonicalInternalLink(link);
  });

  it("does not duplicate destinations within a navigation group", () => {
    for (const group of SITE_NAV_GROUPS) {
      const destinations = group.links.map((link) => ("href" in link ? link.href : link.to));
      expect(
        new Set(destinations).size,
        `${group.label} contains duplicate destinations`,
      ).toBe(destinations.length);
    }
  });

  it("keeps the canonical election hub discoverable", () => {
    const elections = SITE_NAV_GROUPS.find((group) => group.id === "elections");

    expect(elections?.href).toBe("/elections/2026");
    expect(elections?.links.some((link) => "to" in link && link.to === "/elections/2026")).toBe(true);
  });

  it("keeps the Texas Government authority hub globally discoverable", () => {
    const government = SITE_NAV_GROUPS.find((group) => group.id === "government");

    expect(government?.links.some((link) => "to" in link && link.to === "/texas-government")).toBe(true);
  });

  it("keeps Houston on KTR and sends migrated regions directly to TexasDefined", () => {
    const regions = SITE_NAV_GROUPS.find((group) => group.id === "regions");
    expect(regions).toBeDefined();

    const houston = regions?.links.find((link) => link.label === "Houston");
    expect(houston && "to" in houston ? houston.to : null).toBe("/houston");

    for (const [label, expectedHref] of MIGRATED_REGION_DESTINATIONS) {
      const link = regions?.links.find((candidate) => candidate.label === label);
      expect(link && "href" in link ? link.href : null).toBe(expectedHref);
    }
  });
});
