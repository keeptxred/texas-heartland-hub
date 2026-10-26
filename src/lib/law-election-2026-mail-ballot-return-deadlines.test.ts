import { describe, expect, it } from "vitest";
import { getLawTopic } from "@/data/law-topics";

describe("November 2026 Texas mail-ballot deadlines in election law guide", () => {
  const electionLaw = getLawTopic("election-law")!;
  it("distinguishes the completed ballot application deadline from still-applicable returns", () => {
    const text = electionLaw.framework.join(" ");
    expect(text).toContain("ABBM) was Friday, October 23, 2026");
    expect(text).toContain("that application deadline has passed");
    expect(text).toContain("7:00 p.m. on Tuesday, November 3");
    expect(text).toContain("5:00 p.m. on Wednesday, November 4");
    expect(text).toContain("Overseas, military");
    expect(text).toContain("not a blanket rule for future elections");
  });
  it("answers the return deadline separately and points to the official election-law calendar", () => {
    expect(electionLaw.questions.some((item) =>
      item.q.includes("mail-ballot application deadline") &&
      item.a.includes("not the return deadline") &&
      item.a.includes("November 4"),
    )).toBe(true);
    expect(electionLaw.keyRules.some((rule) =>
      rule.includes("October 23 ABBM") && rule.includes("November 4 at 5:00 p.m."),
    )).toBe(true);
    expect(electionLaw.sources.some((source) =>
      source.url === "https://www.sos.state.tx.us/elections/laws/advisory2026-21-november-3-election-law-calendar.shtml",
    )).toBe(true);
  });
  it("preserves the original publication and pre-existing full-guide review provenance", () => {
    // The change is a narrowly sourced calendar clarification, not a new complete 18-topic audit.
    expect(electionLaw.updated).toBe("2026-09-06");
  });
});
