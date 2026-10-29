import { describe, expect, it } from "vitest";
import { WILLS_PROBATE_INHERITANCE_LAW_TOPIC } from "@/data/law-topic-wills-probate-authority";

describe("Texas Estates Code Chapter 205 limited small-estate affidavits", () => {
  const topic = WILLS_PROBATE_INHERITANCE_LAW_TOPIC;
  const text = topic.framework.join(" ");
  const rules = topic.keyRules.join(" ");

  it("distinguishes intestacy, 30-day wait, $75,000 nonexempt-assets limit and court approval", () => {
    expect(text).toContain("died intestate");
    expect(text).toContain("at least 30 days");
    expect(text).toContain("$75,000");
    expect(text).toContain("nonexempt estate assets greater than known nonexempt liabilities");
    expect(text).toContain("approved by the judge");
    expect(rules).toContain("Estates Code §§205.001–205.004");
  });

  it("covers qualified witness/distributee affidavits, homestead recording and real estate exception", () => {
    expect(text).toContain("two disinterested witnesses");
    expect(text).toContain("family-history facts");
    expect(text).toContain("Sections 205.006 and 205.008");
    expect(text).toContain("homestead-only-real-property");
    expect(text).toContain("does not transfer title to land");
    expect(text).toContain("Section 205.007");
  });

  it("gives specific qualifying-case FAQs without extending the mechanism to wills or all land", () => {
    const find = (part: string) => topic.questions.find(({ q }) => q.includes(part))?.a ?? "";
    expect(find("person left a will")).toContain("died intestate");
    expect(find("person left a will")).toContain("§205.008(a)");
    expect(find("transfer a house")).toContain("§205.006");
    expect(find("transfer a house")).toContain("only real property");
    expect(find("Who signs")).toContain("two disinterested witnesses");
    expect(find("Who signs")).toContain("§205.007");
  });

  it("provides official authority and preserves other inheritance claims and original guide dates", () => {
    expect(topic.sources.some((s) => s.url === "https://tcss.legis.texas.gov/resources/ES/htm/ES.205.htm")).toBe(true);
    expect(topic.sources.some((s) => s.url === "https://guides.sll.texas.gov/probate/informal-methods")).toBe(true);
    expect(topic.framework.join(" ")).toContain("Section 256.003");
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });
});
