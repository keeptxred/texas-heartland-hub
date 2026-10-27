import { describe, expect, it } from "vitest";
import { LAW_TOPICS, getLawTopic } from "@/data/law-topics";
import { isLawTopicIndexable, lawTopicWordCount } from "@/lib/law-topic-indexability";
import { DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC } from "@/data/law-topic-driving-traffic-authority";
import { LANDLORD_TENANT_RENTALS_LAW_TOPIC } from "@/data/law-topic-landlord-tenant-authority";
import { EMPLOYMENT_WORKPLACE_LAW_TOPIC } from "@/data/law-topic-employment-workplace-authority";
import { CONSUMER_PROTECTION_LAW_TOPIC } from "@/data/law-topic-consumer-protection-authority";
import { FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC } from "@/data/law-topic-family-custody-authority";
import { WILLS_PROBATE_INHERITANCE_LAW_TOPIC } from "@/data/law-topic-wills-probate-authority";
import { CRIMINAL_OFFENSES_PENALTIES_LAW_TOPIC } from "@/data/law-topic-criminal-offenses-authority";
import { BUSINESS_FORMATION_LLC_LAW_TOPIC } from "@/data/law-topic-business-formation-authority";

const newTopics = [DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC, LANDLORD_TENANT_RENTALS_LAW_TOPIC, EMPLOYMENT_WORKPLACE_LAW_TOPIC, CONSUMER_PROTECTION_LAW_TOPIC, FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC, WILLS_PROBATE_INHERITANCE_LAW_TOPIC, CRIMINAL_OFFENSES_PENALTIES_LAW_TOPIC, BUSINESS_FORMATION_LLC_LAW_TOPIC];

describe("new Texas law authority topics", () => {
  it.each(newTopics)("is registered, indexable and substantive: $slug", (topic) => {
    expect(getLawTopic(topic.slug)).toBe(topic);
    expect(isLawTopicIndexable(topic)).toBe(true);
    expect(lawTopicWordCount(topic)).toBeGreaterThanOrEqual(700);
    expect(topic.updated).toMatch(/^20\d{2}-\d{2}-\d{2}$/);
    expect(topic.framework.length).toBeGreaterThanOrEqual(4);
    expect(topic.questions.length).toBeGreaterThanOrEqual(4);
    expect(topic.sources.filter((source) => source.url.startsWith("https://statutes.capitol.texas.gov/")).length).toBeGreaterThanOrEqual(2);
    expect(topic.related.some((item) => item.href === "/laws")).toBe(true);
    expect(topic.related.some((item) => item.href === "/laws/topics")).toBe(true);
  });
  it("distinguishes HB 3297 noncommercial safety repeal from emissions, commercial and registration duties", () => {
    const guide = DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC;
    const text = guide.framework.join(" ") + " " + guide.keyRules.join(" ");
    expect(text).toContain("House Bill 3297");
    expect(text).toContain("January 1, 2025");
    expect(text).toContain("noncommercial vehicles");
    expect(text).toContain("emissions");
    expect(text).toContain("commercial");
    expect(text).toContain("inspection-program replacement fee");
    expect(guide.sources.some(s => s.url ===
      "https://www.dps.texas.gov/news/vehicle-safety-inspection-program-changes-now-effect")).toBe(true);
    expect(guide.published).toBe("2026-10-23");
    expect(guide.updated).toBe("2026-10-23");
  });

  it("distinguishes the jurisdictional 180-day TWC wage-claim period from other remedies", () => {
    const topic = EMPLOYMENT_WORKPLACE_LAW_TOPIC;
    const framework = topic.framework.join(" ");
    const rules = topic.keyRules.join(" ");
    expect(framework).toContain("Section 61.051(c)");
    expect(framework).toContain("180th day");
    expect(framework).toContain("jurisdictional");
    expect(framework).toContain("federal wage enforcement");
    expect(rules).toContain("Section 61.051(c)");
    expect(topic.questions.some((entry) =>
      entry.q.includes("Payday Law wage claim") &&
      entry.a.includes("180th day") &&
      entry.a.includes("due for payment")
    )).toBe(true);
  });
  it("distinguishes mixed-family intestate community property and holographic self-proof", () => {
    const topic = WILLS_PROBATE_INHERITANCE_LAW_TOPIC;
    const corpus = [...topic.framework, ...topic.keyRules].join(" ");
    for (const section of ["Section 201.003", "Section 201.002", "Section 251.052", "Section 251.102", "Section 251.107"]) {
      expect(corpus).toContain(section);
    }
    expect(corpus).toContain("not also a descendant of the surviving spouse");
    expect(corpus).toContain("undivided one-half community-property interest");
    expect(corpus).toContain("does not otherwise change the treatment or validity requirements");
    expect(topic.questions.some((entry) => entry.q.includes("children from an earlier relationship") &&
      entry.a.includes("Section 201.003(c)"))).toBe(true);
    expect(topic.questions.some((entry) => entry.q.includes("notarizing a handwritten will") &&
      entry.a.includes("Section 251.107"))).toBe(true);
    expect(topic.published).toBe("2026-10-23");
    expect(topic.updated).toBe("2026-10-23");
  });

  it("keeps the Chapter 21 TWC 180/300 day discrimination complaint distinction separate from wages", () => {
    const guide = EMPLOYMENT_WORKPLACE_LAW_TOPIC;
    const framework = guide.framework.join(" ");
    const rules = guide.keyRules.join(" ");
    expect(framework).toContain("Section 21.202(a)");
    expect(framework).toContain("subsection (a-1)");
    expect(framework).toContain("within 180 days");
    expect(framework).toContain("300 days");
    expect(framework).toContain("Payday Law wage-claim deadline");
    expect(framework).toContain("Section 21.141");
    expect(framework).toContain("Section 21.142");
    expect(framework).toContain("one or more employees");
    expect(rules).toContain("one or more employees");
    expect(guide.questions.some((item) => item.q.includes("business with one employee?") && item.a.includes("§21.142"))).toBe(true);
    expect(rules).toContain("Section 21.202");
    expect(guide.questions.some((item) =>
      item.q.includes("sexual-harassment filing period") &&
      item.a.includes("300 days") &&
      item.a.includes("180 days")
    )).toBe(true);
    expect(guide.sources.some((source) => source.url ===
      "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.21.htm")).toBe(true);
    expect(guide.sources.some((source) => source.url ===
      "https://www.twc.texas.gov/programs/civil-rights/employment-discrimination")).toBe(true);
    expect(guide.updated).toBe("2026-10-23");
    expect(guide.published).toBe("2026-10-23");
  });

  it("separates probate four-year admission exceptions from letters testamentary authority", () => {
    const topic = WILLS_PROBATE_INHERITANCE_LAW_TOPIC;
    const text = topic.framework.join(" ");
    expect(text).toContain("Section 256.003(a)");
    expect(text).toContain("fourth anniversary");
    expect(text).toContain("not in default");
    expect(text).toContain("Section 256.003(b)");
    expect(text).toContain("Chapter 501");
    expect(topic.questions.some((entry) =>
      entry.q.includes("admitted to probate") &&
      entry.a.includes("late probate order") &&
      entry.a.includes("letters testamentary")
    )).toBe(true);
  });

  it("distinguishes Texas divorce waiting period and family-violence exceptions from child-only cases", () => {
    const text = FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC.framework.join(" ");
    expect(text).toContain("Section 6.702(a)");
    expect(text).toContain("60th day");
    expect(text).toContain("Section 6.702(c)");
    expect(text).toContain("family-violence");
    expect(FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC.questions.some((entry) =>
      entry.q.includes("60-day waiting period") &&
      entry.a.includes("not a guarantee")
    )).toBe(true);
  });

  it("treats the September 2025 child support net-resource cap as an adjustable guideline, not a support ceiling", () => {
    const topic = FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC;
    const framework = topic.framework.join(" ");
    expect(framework).toContain("Section 154.125(a-1)");
    expect(framework).toContain("September 1, 2025");
    expect(framework).toContain("$11,700");
    expect(framework).toContain("Section 154.126");
    expect(framework).toContain("not a universal ceiling");
    expect(topic.questions.some((q) => q.a.includes("$11,700") && q.a.includes("Section 154.126"))).toBe(true);
    expect(topic.sources.some((s) => s.url === "https://csapps.oag.texas.gov/system/files/2025-08/Final_REVISED_2025_Tax_Charts.pdf")).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });

  it("distinguishes three-year support modification from independent changed-circumstance grounds", () => {
    const topic = FAMILY_CUSTODY_CHILD_SUPPORT_LAW_TOPIC;
    const text = topic.framework.join(" ") + " " + topic.keyRules.join(" ");
    expect(text).toContain("Section 156.401(a)");
    expect(text).toContain("three years");
    expect(text).toContain("20 percent or $100");
    expect(text).toContain("Section 156.401(a-1)");
    expect(text).toContain("Section 156.401(a-2)");
    expect(text).toContain("Section 156.401(b)");
    expect(topic.questions.some((item) =>
      item.q.includes("Must three years pass") &&
      item.a.includes("material and substantial change") &&
      item.a.includes("20-percent or $100")
    )).toBe(true);
    expect(topic.sources.some((s) => s.url.includes("FA.156"))).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });

  it("keeps DTPA pre-suit notice distinct from suit limitations and narrow delay extension", () => {
    const guide = CONSUMER_PROTECTION_LAW_TOPIC;
    const framework = guide.framework.join(" ");
    expect(framework).toContain("Section 17.505");
    expect(framework).toContain("Section 17.565");
    expect(framework).toContain("60-day notice");
    expect(framework).toContain("two years");
    expect(framework).toContain("180-day extension");
    expect(guide.questions.some((item) =>
      item.q.includes("DTPA lawsuit") &&
      item.a.includes("reasonably should have discovered")
    )).toBe(true);
  });

  it("distinguishes DTPA 60-day notice exceptions from plea-in-abatement procedure", () => {
    const topic = CONSUMER_PROTECTION_LAW_TOPIC;
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("Section 17.505(a)");
    expect(text).toContain("Section 17.505(b)");
    expect(text).toContain("counterclaim");
    expect(text).toContain("avoid expiration of limitations");
    expect(text).toContain("Section 17.505(c)–(e)");
    expect(text).toContain("abatement");
    expect(topic.questions.some((item) =>
      item.q.includes("written DTPA demand") &&
      item.a.includes("limitations") &&
      item.a.includes("counterclaim")
    )).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });

  it("states ordinary misdemeanor punishment ranges without assuming an unenhanced sentence", () => {
    const topic = CRIMINAL_OFFENSES_PENALTIES_LAW_TOPIC;
    const framework = topic.framework.join(" ");
    expect(framework).toContain("Sections 12.21–12.23");
    expect(framework).toContain("$4,000");
    expect(framework).toContain("$2,000");
    expect(framework).toContain("$500");
    expect(framework).toContain("offense-specific provisions");
    expect(topic.questions.some((entry) =>
      entry.q.includes("Class A, B and C") &&
      entry.a.includes("not mandatory sentences") &&
      entry.a.includes("enhancements")
    )).toBe(true);
    expect(topic.sources.some((s) => s.url === "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.12.htm")).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });
  it("separates ordinary felony sentencing tiers and the state-jail enhancement exception", () => {
    const topic = CRIMINAL_OFFENSES_PENALTIES_LAW_TOPIC;
    const text = topic.framework.join(" ") + " " + topic.keyRules.join(" ");
    for (const code of ["12.32", "12.33", "12.34", "12.35", "12.31", "12.35(c)"]) {
      expect(text).toContain(code);
    }
    for (const range of ["five to 99 years", "two to 20 years", "two to 10 years", "180 days to two years"]) {
      expect(text).toContain(range);
    }
    expect(text).toContain("$10,000");
    expect(topic.questions.some((faq) =>
      faq.q.includes("usual prison or state-jail ranges") &&
      faq.a.includes("not automatic sentences") &&
      faq.a.includes("Section 12.35(c)")
    )).toBe(true);
    expect(topic.sources.some((source) => source.url === "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.12.htm")).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });

  it("keeps law topic slugs unique for routes, canonicals and sitemap discovery", () => {
    const slugs = LAW_TOPICS.map((topic) => topic.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
