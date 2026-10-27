import { describe, expect, it } from "vitest";
import { LANDLORD_TENANT_RENTALS_LAW_TOPIC } from "@/data/law-topic-landlord-tenant-authority";

describe("2026 Texas residential eviction notice distinctions", () => {
  const topic = LANDLORD_TENANT_RENTALS_LAW_TOPIC;

  it("protects first nonpayment-delinquency pay-or-vacate distinction and lease variation", () => {
    const body = topic.framework.join(" ");
    expect(body).toContain("Senate Bill 38");
    expect(body).toContain("January 1, 2026");
    expect(body).toContain("Section 24.005(a)");
    expect(body).toContain("at least three days");
    expect(body).toContain("agreed in writing");
    expect(body).toContain("notice to pay rent or vacate");
    expect(body).toContain("previously late or delinquent");
    expect(body).toContain("Section 91.001");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("three days to vacate") &&
      a.includes("not late or delinquent") &&
      a.includes("written lease or agreement")
    )).toBe(true);
  });

  it("keeps authorized notice delivery and court deadline computation separate", () => {
    const body = [...topic.framework, ...topic.keyRules].join(" ");
    expect(body).toContain("Section 24.005(f-3)");
    expect(body).toContain("Section 24.005(f-4)");
    expect(body).toContain("Section 24.0042");
    expect(body).toContain("Section 24.005(c-1)");
    expect(body).toContain("tenant aged 16 or older");
    expect(body).toContain("agreed in writing");
    expect(topic.questions.some(({ a }) =>
      a.includes("email or other electronic delivery") &&
      a.includes("actually receives notice")
    )).toBe(true);
    expect(topic.sources.some(({ url }) =>
      url === "https://tcss.legis.texas.gov/resources/PR/htm/PR.24.htm"
    )).toBe(true);
  });

  it("retains existing repair, deposits, court boundary and reviewed date safeguards", () => {
    const body = [...topic.framework, ...topic.keyRules].join(" ");
    expect(body).toContain("Section 92.056(b)(3)");
    expect(body).toContain("Section 92.109");
    expect(body).toContain("eviction judgment");
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });
});
