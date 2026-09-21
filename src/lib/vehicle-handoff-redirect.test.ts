import { describe, expect, it } from "vitest";

import { buildVehicleHandoffLocation } from "./vehicle-handoff-redirect";

const HANDOFFS = [
  ["/vehicles/registration", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/renewal", "https://texasdefined.com/texas-vehicle-registration-renewal"],
  ["/vehicles/registration-fees-taxes", "https://texasdefined.com/texas-vehicle-registration-fees-taxes"],
  ["/vehicles/new-residents", "https://texasdefined.com/find-my-dmv"],
  ["/vehicles/auto-insurance-requirements", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/bonded-titles", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/buying-a-car", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/buying-selling", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/commercial-fleet-irp", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/disabled-parking", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/duplicate-titles", "https://texasdefined.com/texas-vehicle-registration#title-transfer"],
  ["/vehicles/farm-antique-specialty", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/financial-responsibility", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/inspections", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/inspections-emissions", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/liens-duplicate-corrected-titles", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/personalized-plates", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/plates", "https://texasdefined.com/texas-vehicle-registration#license-plates"],
  ["/vehicles/private-party-sales", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/salvage-rebuilt-titles", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/selling-a-car", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/temporary-tags", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/title-transfer", "https://texasdefined.com/texas-vehicle-registration#title-transfer"],
  ["/dmv", "https://texasdefined.com/texas-dmv"],
] as const;

function withQuery(destination: string, query: string) {
  const hashIndex = destination.indexOf("#");
  if (hashIndex < 0) return `${destination}?${query}`;
  return `${destination.slice(0, hashIndex)}?${query}${destination.slice(hashIndex)}`;
}

describe("vehicle authority handoff redirect", () => {
  it.each(HANDOFFS)(
    "hands off %s directly while preserving the complete query",
    (path, destination) => {
      expect(
        buildVehicleHandoffLocation(
          `https://keeptxred.com${path}?utm_source=test&utm_medium=referral&foo=bar`,
        ),
      ).toBe(withQuery(destination, "utm_source=test&utm_medium=referral&foo=bar"));
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
        "https://keeptxred.com/vehicles/renewal/?utm_medium=email&foo=bar",
      ),
    ).toBe(
      "https://texasdefined.com/texas-vehicle-registration-renewal?utm_medium=email&foo=bar",
    );
  });

  it("preserves query order before special title and plate fragments", () => {
    expect(
      buildVehicleHandoffLocation(
        "https://keeptxred.com/vehicles/title-transfer?utm_source=test&foo=a%2Bb",
      ),
    ).toBe(
      "https://texasdefined.com/texas-vehicle-registration?utm_source=test&foo=a%2Bb#title-transfer",
    );
    expect(
      buildVehicleHandoffLocation(
        "https://keeptxred.com/vehicles/plates?utm_source=test",
      ),
    ).toBe(
      "https://texasdefined.com/texas-vehicle-registration?utm_source=test#license-plates",
    );
  });

  it("does not claim unrelated routes", () => {
    expect(
      buildVehicleHandoffLocation(
        "https://keeptxred.com/vehicles/not-a-real-route?utm_source=test",
      ),
    ).toBeNull();
  });
});
