import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("November 2026 source-first voter guidance", () => {
  const component = readFileSync("src/components/elections/November2026VotingActionGuide.tsx", "utf8");
  const homepage = readFileSync("src/routes/index.tsx", "utf8");
  const voting = readFileSync("src/routes/elections.voting.tsx", "utf8");

  it("displays statewide election dates without guessing local hours or ballots", () => {
    expect(component).toContain("October 19–30, 2026");
    expect(component).toContain("November 3, 2026");
    expect(component).toContain("Check that location's actual hours");
    expect(component).toContain("not every county uses countywide vote centers");
    expect(component).toContain("www.sos.state.tx.us/elections/voter/important-election-dates.shtml");
    expect(component).toContain("www.votetexas.gov/voting/where");
  });

  it("cross-links official answers from both election and homepage", () => {
    expect(homepage).toContain("<November2026VotingActionGuide compact />");
    expect(voting).toContain("<November2026VotingActionGuide />");
    expect(component).toContain('to="/elections/voting/polling-place"');
    expect(component).toContain('to="/elections/voting/voter-registration-card"');
  });
});

describe("the newsroom reports held publication causes", () => {
  it("retains image/source gates and captures why a generated draft was held", () => {
    const publisher = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(publisher).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(publisher).toContain("image_verification_failed");
    expect(publisher).toContain("rejection_reason: failureDetails");
    expect(publisher).toContain('status: "HELD"');
    expect(publisher).toContain('console.error("[newsroom] publication held"');
    expect(publisher).not.toContain('.in("status", ["PENDING", "HELD"])');
  });
});
