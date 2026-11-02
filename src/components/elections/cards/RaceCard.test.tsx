import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RaceCard } from "./RaceCard";

describe("RaceCard candidate display order", () => {
  it("shows Republican, then Democratic, then other candidates even if the source is alphabetized", () => {
    const candidates = [
      { id: "ind", name: "Independent Candidate", party: "independent", partyLabel: "Independent" },
      { id: "dem", name: "Democratic Candidate", party: "democratic", partyLabel: "Democratic" },
      { id: "rep", name: "Republican Candidate", party: "republican", partyLabel: "Republican" },
    ];
    const html = renderToStaticMarkup(
      <RaceCard name="2026 Texas U.S. Senate" office="U.S. Senate" candidates={candidates} />,
    );
    expect(html.indexOf("Republican Candidate")).toBeLessThan(html.indexOf("Democratic Candidate"));
    expect(html.indexOf("Democratic Candidate")).toBeLessThan(html.indexOf("Independent Candidate"));
    expect((html.match(/<li /g) ?? []).length).toBe(candidates.length);
  });
});
