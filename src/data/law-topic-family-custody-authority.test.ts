import { describe, expect, it } from "vitest";
import { FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC } from "./law-topic-family-custody-authority";

describe("Texas divorce residence versus waiting period distinctions", () => {
  const topic = FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC;
  it("limits residency to one qualifying spouse and differentiates domicile, county and exceptions", () => {
    const text = topic.framework.join(" ");
    expect(text).toContain("Section 6.301");
    expect(text).toContain("either spouse");
    expect(text).toContain("preceding six months");
    expect(text).toContain("preceding 90 days");
    expect(text).toContain("Section 6.302");
    expect(text).toContain("Sections 6.303 and 6.304");
    expect(text).toContain("Section 6.702");
    expect(topic.keyRules.some(x => x.includes("six-month Texas domicile"))).toBe(true);
    const faq = topic.questions.find(x => x.q.startsWith("Must both spouses"));
    expect(faq?.a).toContain("either the petitioner or respondent");
    expect(faq?.a).toContain("jurisdiction over a child");
  });
  it("preserves publication timestamp, existing statutory source and case distinctions", () => {
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
    expect(topic.sources.some(x => x.url === "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.6.htm")).toBe(true);
    expect(topic.questions.some(x => x.q.includes("full 60-day waiting period"))).toBe(true);
  });
});
