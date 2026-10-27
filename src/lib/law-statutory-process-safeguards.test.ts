import { describe, expect, it } from "vitest";
import { LANDLORD_TENANT_RENTALS_LAW_TOPIC } from "@/data/law-topic-landlord-tenant-authority";
import { BUSINESS_FORMATION_LLC_LAW_TOPIC } from "@/data/law-topic-business-formation-authority";

describe("primary-source Texas law procedural safeguards", () => {
  it("distinguishes a conditional bad-faith deposit presumption and damages from the forwarding-address requirement", () => {
    const topic = LANDLORD_TENANT_RENTALS_LAW_TOPIC;
    const text = topic.framework.join(" ");
    expect(text).toContain("Section 92.109(d)");
    expect(text).toContain("Section 92.107");
    expect(text).toContain("Section 92.109(a)");
    expect(text).toContain("three times");
    expect(topic.questions.some((entry) => entry.q.includes("triple damages") && entry.a.includes("does not award triple damages"))).toBe(true);
    expect(topic.sources.some((s) => s.url === "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm")).toBe(true);
    expect(topic.published).toBe("2026-10-23");
    expect(topic.updated).toBe("2026-10-23");
  });
  it("distinguishes first tracked-mail repair notice from a later written notice", () => {
    const topic = LANDLORD_TENANT_RENTALS_LAW_TOPIC;
    const text = topic.framework.join(" ") + " " + topic.keyRules.join(" ");
    expect(text).toContain("Section 92.056(b)(3)");
    expect(text).toContain("subsequent written repair notice");
    expect(text).toContain("certified mail");
    expect(text).toContain("registered mail");
    expect(text).toContain("delivery-tracked");
    expect(text).toContain("Section 92.056(d)");
    expect(text).toContain("seven days");
    expect(text).toContain("presumption to be rebutted");
    expect(topic.sources.some((source) => source.url === "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm")).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
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
  it("keeps FinCEN's 2026 domestic-company BOI exemption separate from Texas entity registration", () => {
    const topic = BUSINESS_FORMATION_LLC_LAW_TOPIC;
    const text = [...topic.framework, ...topic.keyRules].join(" ");
    expect(text).toContain("August 11, 2026");
    expect(text).toContain("August 14");
    expect(text).toContain("entities created in the United States");
    expect(text).toContain("foreign-country");
    expect(text).toContain("U.S. persons");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("FinCEN beneficial-ownership") &&
      a.includes("Texas domestic LLCs") &&
      a.includes("foreign-country")
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url === "https://www.fincen.gov/boi"
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url.includes("fincen-permanently-ends-beneficial-ownership-reporting")
    )).toBe(true);
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });

});
