import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FeaturedRaceCard } from "./FeaturedRaceCard";

describe("FeaturedRaceCard", () => {
  it("renders every supplied candidate, including candidates beyond the fourth", () => {
    const candidates = [
      { name: "James Talarico", party: "Democratic" },
      { name: "Jade Simmons", party: "Independent" },
      { name: "Ted Brown", party: "Libertarian" },
      { name: "Avery Ayers", party: "Other" },
      { name: "Ken Paxton", party: "Republican" },
    ];
    const html = renderToStaticMarkup(
      <FeaturedRaceCard
        office="U.S. Senate"
        electionDate="2026-11-03"
        raceHref="/elections/races/2026-us-senate"
        candidates={candidates}
      />,
    );

    for (const candidate of candidates) {
      expect(html).toContain(candidate.name);
    }
    expect((html.match(/<li /g) ?? []).length).toBe(candidates.length);
    // This race historically omitted the Republican candidate from its featured card.
    expect(html.indexOf("Ken Paxton")).toBeLessThan(html.indexOf("James Talarico"));
    expect(html.indexOf("James Talarico")).toBeLessThan(html.indexOf("Jade Simmons"));
  });

  it("does not invent candidates when the list is empty", () => {
    const html = renderToStaticMarkup(
      <FeaturedRaceCard office="U.S. Senate" raceHref="/elections/races/2026-us-senate" />,
    );
    expect(html).not.toContain("<li ");
  });
});
