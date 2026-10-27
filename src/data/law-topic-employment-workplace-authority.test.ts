import { describe, expect, it } from "vitest";
import { EMPLOYMENT_WORKPLACE_LAW_TOPIC } from "@/data/law-topic-employment-workplace-authority";

describe("Texas Payday Law pay frequency and commission distinctions", () => {
  const topic = EMPLOYMENT_WORKPLACE_LAW_TOPIC;

  it("explains monthly exempt vs twice-monthly nonexempt pay and posted default paydays", () => {
    const source = [...topic.framework, ...topic.keyRules].join(" ");
    expect(source).toContain("Section 61.011");
    expect(source).toContain("at least once per month");
    expect(source).toContain("at least twice per month");
    expect(source).toContain("Section 61.012");
    expect(source).toContain("first and fifteenth");
    expect(source).toContain("post paydays");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("How often must") &&
      a.includes("Section 61.011") &&
      a.includes("once monthly") &&
      a.includes("twice monthly") &&
      a.includes("first and fifteenth")
    )).toBe(true);
  });

  it("keeps commissions tied to the compensation agreement rather than universal final-pay timing", () => {
    const source = [...topic.framework, ...topic.keyRules].join(" ");
    expect(source).toContain("Section 61.015");
    expect(source).toContain("collective bargaining agreement");
    expect(topic.sources.some(({ url }) =>
      url === "https://tcss.legis.texas.gov/resources/LA/htm/LA.61.htm"
    )).toBe(true);
  });

  it("retains final pay and claim-deadline distinctions and original source review date", () => {
    const source = [...topic.framework, ...topic.keyRules].join(" ");
    expect(source).toContain("Section 61.014");
    expect(source).toContain("six calendar days");
    expect(source).toContain("Section 61.051(c)");
    expect(source).toContain("180");
    expect(source).toContain("Section 21.202");
    expect(source).toContain("300");
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });
});
