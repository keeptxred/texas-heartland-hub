import { describe, expect, it } from "vitest";
import { OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC } from "@/data/law-topic-open-records-authority";

describe("Texas Public Information Act itemized cost notice and deadlines", () => {
  const topic = OPEN_RECORDS_PUBLIC_INFORMATION_LAW_TOPIC;

  it("distinguishes the 40-dollar itemized estimate from ordinary prompt production", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 552.2615(a)");
    expect(text).toContain("exceed $40");
    expect(text).toContain("Section 552.271");
    expect(text).toContain("less-costly");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("estimate over $40") &&
      a.includes("Section 552.2615(a)") &&
      a.includes("itemized written estimate")
    )).toBe(true);
  });

  it("protects requester 10-business-day response and projected cost-change trigger", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 552.2615(b)");
    expect(text).toContain("10 business days after the estimate was sent");
    expect(text).toContain("Section 552.2615(c)");
    expect(text).toContain("20 percent or more");
    expect(text).toContain("withdrawn");
  });

  it("does not suspend the separate attorney-general ruling deadlines", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 552.2615(g)");
    expect(text).toContain("Subchapter G");
    expect(text).toContain("Section 552.301");
    expect(text).toContain("15th business day");
    expect(topic.sources.some(({ url }) =>
      url === "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=GV&Value=552.2615"
    )).toBe(true);
    expect(topic.updated).toBe("2026-09-06");
  });
});
