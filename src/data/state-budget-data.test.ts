import { describe, expect, it } from "vitest";
import {
  STATE_BUDGET_METRICS,
  STATE_BUDGET_OFFICIAL_RESOURCES,
} from "@/data/state-budget-data";

describe("Texas state budget Data Center snapshot", () => {
  it("preserves distinct appropriations and certified revenue measures", () => {
    const byLabel = new Map(STATE_BUDGET_METRICS.map((metric) => [metric.label, metric]));

    expect(byLabel.get("2026–27 appropriations — all funds")?.value).toBe("$337.94B");
    expect(byLabel.get("2026–27 appropriations — General Revenue funds")?.value).toBe("$149.10B");
    expect(byLabel.get("Certified GR-related revenue available")?.value).toBe("$203.63B");
    expect(byLabel.get("Certified general-purpose spending")?.value).toBe("$198.97B");
    expect(byLabel.get("Expected ending GR-related certification balance")?.value).toBe("$4.66B");
  });

  it("links every snapshot metric to an official Texas source", () => {
    expect(STATE_BUDGET_METRICS.length).toBeGreaterThanOrEqual(6);
    for (const metric of STATE_BUDGET_METRICS) {
      const url = new URL(metric.sourceUrl);
      expect(["lbb.texas.gov", "comptroller.texas.gov"]).toContain(url.hostname);
    }
  });

  it("includes enacted-budget, fiscal-size-up, certified-revenue, and spending resources", () => {
    const labels = STATE_BUDGET_OFFICIAL_RESOURCES.map((resource) => resource.label).join(" ");
    expect(labels).toMatch(/General Appropriations Act/i);
    expect(labels).toMatch(/Fiscal Size-Up/i);
    expect(labels).toMatch(/Certification Revenue Estimate/i);
    expect(labels).toMatch(/Revenue and Spending/i);
  });
});
