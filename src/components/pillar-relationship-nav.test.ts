import { describe, expect, it } from "vitest";
import { PILLAR_FEATURED_ARTICLES } from "./pillar-relationship-nav";

describe("pillar relationship featured articles", () => {
  it("keeps the policing comparison attached to the public-safety pillar", () => {
    const articles = PILLAR_FEATURED_ARTICLES["texas-law-enforcement-public-safety"] ?? [];
    expect(articles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/news/texas-policing-agencies-compared" }),
      ]),
    );
  });
});
