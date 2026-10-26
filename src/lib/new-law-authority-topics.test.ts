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
  it("keeps law topic slugs unique for routes, canonicals and sitemap discovery", () => {
    const slugs = LAW_TOPICS.map((topic) => topic.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
