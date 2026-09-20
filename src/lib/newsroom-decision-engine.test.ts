import { describe, expect, it } from "vitest";
import { decideNewsroomFormat } from "./newsroom-decision-engine";

describe("newsroom package format logic", () => {
  it("returns SKIP below the standalone threshold", () => {
    expect(decideNewsroomFormat({ editorialScore: 44, sourceCount: 3, primarySourceCount: 0, trendSignalCount: 0 }).decision).toBe("SKIP");
  });

  it("returns MERGE for corroborated same-event coverage", () => {
    expect(decideNewsroomFormat({ editorialScore: 75, sourceCount: 3, primarySourceCount: 1, trendSignalCount: 0 }).decision).toBe("MERGE");
  });

  it("returns SYNTHESIS only when broader trend signals are explicitly present", () => {
    expect(decideNewsroomFormat({ editorialScore: 80, sourceCount: 4, primarySourceCount: 1, trendSignalCount: 2 }).decision).toBe("SYNTHESIS");
  });

  it("returns SINGLE for a strong single-source development", () => {
    expect(decideNewsroomFormat({ editorialScore: 70, sourceCount: 1, primarySourceCount: 1, trendSignalCount: 0 }).decision).toBe("SINGLE");
  });
});
