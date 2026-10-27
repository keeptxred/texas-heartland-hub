import { describe, expect, it } from "vitest";
import { GUN_CARRY_LAW_TOPIC } from "@/data/law-topic-gun-carry-authority";

describe("Texas handgun licensed-carry and trespass notice distinctions", () => {
  const topic = GUN_CARRY_LAW_TOPIC;

  it("keeps LTC concealed and open carry posted signs separate", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 30.06(c)(3)");
    expect(text).toContain("Section 30.07(c)(3)");
    expect(text).toContain("English and Spanish");
    expect(text).toContain("one inch");
    expect(text).toContain("each entrance");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("generic no-guns sign") &&
      a.includes("Section 30.06") &&
      a.includes("Section 30.07") &&
      a.includes("one inch")
    )).toBe(true);
  });

  it("distinguishes oral notice and general trespass from posted LTC signs", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("personally delivered oral notice");
    expect(text).toContain("Section 30.05");
    expect(text).toContain("not automatically the statutory bilingual");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("generic no-guns sign") &&
      a.includes("general criminal-trespass notice") &&
      a.includes("direct instruction to leave")
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url === "https://tcss.legis.texas.gov/resources/PE/htm/PE.30.htm"
    )).toBe(true);
  });

  it("retains existing licensed carry, campus, school offense and review-date protections", () => {
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 46.11");
    expect(text).toContain("Section 46.03");
    expect(text).toContain("Section 411.2031");
    expect(topic.updated).toBe("2026-09-06");
  });
});
