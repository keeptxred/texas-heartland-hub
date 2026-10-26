import { describe, expect, it } from "vitest";
import { PROPERTY_TAX_LAW_TOPIC } from "@/data/law-topic-property-tax-authority";
import { LANDLORD_TENANT_RENTALS_LAW_TOPIC } from "@/data/law-topic-landlord-tenant-authority";
import { BUSINESS_FORMATION_LLC_LAW_TOPIC } from "@/data/law-topic-business-formation-authority";

describe("primary-source Texas law procedural safeguards", () => {
  it("distinguishes appraisal protest deadlines from local tax-rate adoption without duplicating homeowner instructions", () => {
    const topic = PROPERTY_TAX_LAW_TOPIC;
    const text = topic.framework.join(" ");
    expect(text).toContain("Section 41.44(a)(1)");
    expect(text).toContain("May 15");
    expect(text).toContain("30th day");
    expect(text).toContain("distinct rules and exceptions");
    expect(topic.questions.some((entry) => entry.q.includes("appraisal protest") && entry.a.includes("whichever is later"))).toBe(true);
    expect(topic.sources.some((s) => s.url === "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.41.htm")).toBe(true);
    expect(topic.related.some((entry) => entry.href === "https://texasdefined.com/do/property-tax-protest")).toBe(true);
    expect(topic.updated).toBe("2026-09-18");
  });
  it("distinguishes a conditional bad-faith deposit presumption and damages from the forwarding-address requirement", () => {
    const topic = LANDLORD_TENANT_RENTALS_LAW_TOPIC;
    const text = topic.framework.join(" ");
    expect(text).toContain("Section 92.109(d)");
    expect(text).toContain("Section 92.107");
    expect(text).toContain("Section 92.109(a)");
    expect(text).toContain("three times");
    expect(topic.questions.some((entry) => entry.q.includes("triple damages") && entry.a.includes("not automatically"))).toBe(true);
    expect(topic.sources.some((s) => s.url === "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm")).toBe(true);
    expect(topic.published).toBe("2026-10-23");
    expect(topic.updated).toBe("2026-10-23");
  });
  it("explains consent, Texas residency and physical-service address for LLC registered agents", () => {
    const topic = BUSINESS_FORMATION_LLC_LAW_TOPIC;
    const text = topic.framework.join(" ");
    expect(text).toContain("Section 5.201(b)");
    expect(text).toContain("consented in writing or electronically");
    expect(text).toContain("cannot be the filing entity");
    expect(text).toContain("Section 5.206");
    expect(topic.sources.some((s) => s.url.includes("BO.5"))).toBe(true);
    expect(topic.published).toBe("2026-10-23");
    expect(topic.updated).toBe("2026-10-23");
  });
});
