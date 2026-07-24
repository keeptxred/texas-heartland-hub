import { describe, expect, it } from "vitest";
import { buildMovingTasks, DEFAULT_MOVING_PREFERENCES } from "@/lib/moving-checklist";
import { estimateVehicleRegistration } from "@/lib/vehicle-registration";

describe("vehicle registration estimator", () => {
  it("calculates the common new-resident passenger scenario", () => {
    const estimate = estimateVehicleRegistration({
      vehicleKind: "passenger",
      titleFee: 28,
      countyLocalFee: 10,
      qualifiesForNewResidentTax: true,
      electricVehicle: false,
      emissionsCounty: false,
    });

    expect(estimate.total).toBe(192);
    expect(estimate.excludesUseTax).toBe(false);
  });

  it("adds electric and emissions fees while warning when use tax is excluded", () => {
    const estimate = estimateVehicleRegistration({
      vehicleKind: "passenger",
      titleFee: 33,
      countyLocalFee: 40,
      qualifiesForNewResidentTax: false,
      electricVehicle: true,
      emissionsCounty: true,
    });

    expect(estimate.total).toBe(331.25);
    expect(estimate.excludesUseTax).toBe(true);
    expect(estimate.lineItems.find((item) => item.label.includes("Electric"))?.amount).toBe(200);
  });
});

describe("moving checklist scheduler", () => {
  it("calculates the 30-day vehicle and 90-day license deadlines", () => {
    const tasks = buildMovingTasks({
      ...DEFAULT_MOVING_PREFERENCES,
      moveDate: "2026-08-01",
    });

    expect(tasks.find((task) => task.id === "vehicle-registration")?.dueDate).toBe("2026-08-31");
    expect(tasks.find((task) => task.id === "driver-license")?.dueDate).toBe("2026-10-30");
  });

  it("includes only household-specific tasks selected by the user", () => {
    const tasks = buildMovingTasks({
      ...DEFAULT_MOVING_PREFERENCES,
      hasVehicle: false,
      buyingHome: true,
      hasChildren: true,
      hasPets: true,
    });
    const ids = new Set(tasks.map((task) => task.id));

    expect(ids.has("vehicle-registration")).toBe(false);
    expect(ids.has("homestead")).toBe(true);
    expect(ids.has("school-district")).toBe(true);
    expect(ids.has("pet-records")).toBe(true);
  });
});
