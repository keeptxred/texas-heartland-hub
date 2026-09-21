import { describe, expect, it } from "vitest";

import {
  buildVehicleHandoffLocation,
  RETIRED_VEHICLE_EVERGREEN_PATHS,
  VEHICLE_HANDOFF_DESTINATIONS,
} from "./vehicle-handoff-redirect";

const HANDOFFS = Object.entries(VEHICLE_HANDOFF_DESTINATIONS) as Array<
  [string, string]
>;

describe("vehicle authority handoff redirect", () => {
  it.each(HANDOFFS)(
    "hands off %s directly while preserving the complete query",
    (path, destination) => {
      const expected = destination.includes("#")
        ? destination.replace("#", "?utm_source=test&utm_medium=referral&foo=bar#")
        : `${destination}?utm_source=test&utm_medium=referral&foo=bar`;

      expect(
        buildVehicleHandoffLocation(
          `https://keeptxred.com${path}?utm_source=test&utm_medium=referral&foo=bar`,
        ),
      ).toBe(expected);
    },
  );

  it("preserves duplicate and encoded query state without reserializing it", () => {
    expect(
      buildVehicleHandoffLocation(
        "https://keeptxred.com/dmv?utm_source=email&foo=a%2Bb&foo=two",
      ),
    ).toBe("https://texasdefined.com/texas-dmv?utm_source=email&foo=a%2Bb&foo=two");
  });

  it("puts query state before destination fragments", () => {
    expect(
      buildVehicleHandoffLocation(
        "https://keeptxred.com/vehicles/title-transfer?utm_source=email&foo=a%2Bb&foo=two",
      ),
    ).toBe(
      "https://texasdefined.com/texas-vehicle-registration?utm_source=email&foo=a%2Bb&foo=two#title-transfer",
    );
    expect(
      buildVehicleHandoffLocation(
        "https://keeptxred.com/vehicles/plates?utm_source=email",
      ),
    ).toBe(
      "https://texasdefined.com/texas-vehicle-registration?utm_source=email#license-plates",
    );
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

  it("covers every retired vehicle evergreen route", () => {
    for (const path of RETIRED_VEHICLE_EVERGREEN_PATHS) {
      expect(VEHICLE_HANDOFF_DESTINATIONS[path]).toBeTruthy();
      expect(buildVehicleHandoffLocation(`https://keeptxred.com${path}`)).toMatch(
        /^https:\/\/texasdefined\.com\//,
      );
    }
  });

  it("does not claim unrelated routes", () => {
    expect(
      buildVehicleHandoffLocation(
        "https://keeptxred.com/vehicles/not-a-real-route?utm_source=test",
      ),
    ).toBeNull();
  });
});
