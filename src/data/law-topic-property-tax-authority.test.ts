import { describe, expect, it } from "vitest";
import { PROPERTY_TAX_LAW_TOPIC } from "./law-topic-property-tax-authority";

describe("Texas property tax law voter approval and public finance distinctions", () => {
  const topic = PROPERTY_TAX_LAW_TOPIC;
  it("keeps no-new-revenue rate separate from the actual voter-approval election rules", () => {
    const text = topic.framework.join(" ");
    expect(text).toContain("Section 26.04");
    expect(text).toContain("3.5 percent M&O");
    expect(text).toContain("Sections 26.07 and 26.08");
    expect(text).toContain("de minimis and petition-based cases");
    expect(topic.keyRules.some(x => x.includes("de minimis and petition exceptions"))).toBe(true);
    expect(topic.questions.some(x => x.q.includes("automatic election") && x.a.includes("school-district tax-rate ratification election"))).toBe(true);
    expect(topic.sources.some(x => x.url === "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.26.htm")).toBe(true);
    expect(topic.sources.some(x => x.url === "https://comptroller.texas.gov/taxes/property-tax/truth-in-taxation/rollback-elections.php")).toBe(true);
  });
  it("does not rewrite the original guide date or move homeowner actions to KTR", () => {
    expect(topic.updated).toBe("2026-09-18");
    expect(topic.framework.join(" ")).toContain("TexasDefined owns practical homeowner tasks");
    expect(topic.related.some(x => x.href === "https://texasdefined.com/do/property-tax-protest")).toBe(true);
  });
});
