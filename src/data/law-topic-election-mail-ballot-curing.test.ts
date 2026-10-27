import { describe, expect, it } from "vitest";
import { ELECTION_LAW_TOPIC } from "@/data/law-topic-election-authority";

describe("Texas November 2026 mail ballot defect correction dates and methods", () => {
  const topic = ELECTION_LAW_TOPIC;

  it("does not confuse November 9 carrier-envelope curing with the October 23 ABBM application deadline", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 87.0411");
    expect(text).toContain("Sections 87.0271 and 87.0411");
    expect(text).toContain("Monday, November 9, 2026");
    expect(text).toContain("October 23");
    expect(text).toContain("November 3");
    expect(text).toContain("November 4");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("already-returned mail ballot") &&
      a.includes("November 9, 2026") &&
      a.includes("October 23 application deadline")
    )).toBe(true);
  });

  it("protects separate ID mismatch, corrective form and in-person options", () => {
    const content = topic.framework.join(" ");
    expect(content).toContain("identification-number omissions or mismatches");
    expect(content).toContain("Ballot by Mail Tracker");
    expect(content).toContain("corrective-action form");
    expect(content).toContain("early-voting clerk's office");
    expect(topic.questions.some(({ a }) =>
      a.includes("identification-number omission or mismatch") &&
      a.includes("signed corrective-action form")
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url === "https://www.votetexas.gov/voting-by-mail/corrective-action.html"
    )).toBe(true);
  });

  it("retains military/overseas differences and source review date", () => {
    const content = [...topic.framework, ...topic.keyRules].join(" ");
    expect(content).toContain("military and overseas");
    expect(topic.sources.some(({ url }) =>
      url === "https://tcss.legis.texas.gov/resources/EL/htm/EL.87.htm"
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });
});
