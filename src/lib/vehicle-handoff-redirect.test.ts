import { describe, expect, it } from "vitest";

import { buildVehicleHandoffLocation } from "./vehicle-handoff-redirect";

const HANDOFFS = [
  ["/vehicles/registration", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/renewal", "https://texasdefined.com/texas-vehicle-registration-renewal"],
  ["/vehicles/registration-fees-taxes", "https://texasdefined.com/texas-vehicle-registration-fees-taxes"],
  ["/vehicles/new-residents", "https://texasdefined.com/find-my-dmv"],
  ["/dmv", "https://texasdefined.com/texas-dmv"],
] as const;

describe("vehicle authority handoff redirect", () => {
  it.each(HANDOFFS)(
    "hands off %s directly while preserving the complete query",
    (path, destination) => {
      expect(
        buildVehicleHandoffLocation(
          `https://keeptxred.com${path}?utm_source=test&utm_medium=referral&foo=bar`,
        ),
      ).toBe(`${destination}?utm_source=test&utm_medium=referral&foo=bar`);
    },
  );

  it("preserves duplicate and encoded query state without reserializing it", () => {
    expect(
      buildVehicleHandoffLocation(
        "https://keeptxred.com/dmv?utm_source=email&foo=a%2Bb&foo=two",
      ),
    ).toBe("https://texasdefined.com/texas-dmv?utm_source=email&foo=a%2Bb&foo=two");
  });

  it("matches a trailing slash without creating an intermediate KTR canonical redirect", () => {
    expect(
      buildVehicleHandoffLocation(
        "https://www.keeptxred.com/vehicles/renewal/?utm_medium=email&foo=bar",
      ),
    ).toBe(
      "https://texasdefined.com/texas-vehicle-registration-renewal?utm_medium=email&foo=bar",
    );
  });

  it("does not claim unrelated routes", () => {
    expect(
      buildVehicleHandoffLocation(
        "https://keeptxred.com/vehicles/title-transfer?utm_source=test",
      ),
    ).toBeNull();
  });
});
