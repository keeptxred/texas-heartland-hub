import { describe, expect, it } from "vitest";
import { ABOUT_LINKS, SHOP_LINK, SHOP_POLICY_LINKS, SITE_NAV_GROUPS } from "./site-navigation";

const REDIRECT_ALIASES = new Set([
  "/elections",
  "/texas-news",
  "/living-in-texas",
]);

describe("site navigation", () => {
  it("keeps primary group ids and labels unique", () => {
    const ids = SITE_NAV_GROUPS.map((group) => group.id);
    const labels = SITE_NAV_GROUPS.map((group) => group.label);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("uses direct canonical destinations in global navigation", () => {
    const primaryLinks = SITE_NAV_GROUPS.flatMap((group) => group.links);
    const allLinks = [...primaryLinks, SHOP_LINK, ...ABOUT_LINKS, ...SHOP_POLICY_LINKS];

    for (const link of allLinks) {
      expect(link.to, `${link.label} must use an internal absolute path`).toMatch(/^\//);
      expect(
        REDIRECT_ALIASES.has(link.to),
        `${link.label} must not point through redirect alias ${link.to}`,
      ).toBe(false);
    }
  });

  it("does not duplicate destinations within a navigation group", () => {
    for (const group of SITE_NAV_GROUPS) {
      const destinations = group.links.map((link) => link.to);
      expect(
        new Set(destinations).size,
        `${group.label} contains duplicate destinations`,
      ).toBe(destinations.length);
    }
  });

  it("keeps the canonical election hub discoverable", () => {
    const elections = SITE_NAV_GROUPS.find((group) => group.id === "elections");

    expect(elections?.href).toBe("/elections/2026");
    expect(elections?.links.some((link) => link.to === "/elections/2026")).toBe(true);
  });
});
