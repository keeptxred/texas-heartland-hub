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
  it("keeps law topic slugs unique for routes, canonicals and sitemap discovery", () => {
    const slugs = LAW_TOPICS.map((topic) => topic.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
