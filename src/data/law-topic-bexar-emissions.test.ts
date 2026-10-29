import { describe, expect, it } from "vitest";
import { DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC } from "@/data/law-topic-driving-traffic-authority";

describe("November 2026 Bexar County emissions effective date", () => {
  const topic = DRIVING_TRAFFIC_INSURANCE_LAW_TOPIC;
  const text = topic.framework.join(" ");

  it("distinguishes county emissions commencement from eliminated safety checks", () => {
    expect(text).toContain("November 1, 2026");
    expect(text).toContain("Bexar County");
    expect(text).toContain("gasoline-powered vehicles");
    expect(text).toContain("2 through 24 years old");
    expect(text).toContain("not the same as the eliminated noncommercial safety inspection");
  });

  it("retains renewal-cycle and exemption caveats instead of a start-date universal mandate", () => {
    expect(text).toContain("90-day window");
    expect(text).toContain("Electric-only vehicles");
    expect(topic.questions.some(({ q, a }) =>
      q.includes("Bexar County drivers") &&
      a.includes("initial registration or renewal") &&
      a.includes("otherwise-valid registration") &&
      a.includes("Electric-only")
    )).toBe(true);
  });

  it("links official DPS and TxDMV Bexar guidance and preserves older authority", () => {
    for (const url of [
      "https://www.dps.texas.gov/section/vehicle-inspection/faq/bexar-county-emission-inspections",
      "https://content.govdelivery.com/accounts/TXDMV/bulletins/42e59be",
    ]) {
      expect(topic.sources.some((s) => s.url === url)).toBe(true);
    }
    expect(text).toContain("House Bill 3297");
    expect(topic.updated).toBe("2026-10-23");
    expect(topic.published).toBe("2026-10-23");
  });
});
