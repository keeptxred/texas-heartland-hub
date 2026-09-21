import { describe, expect, it } from "vitest";

import {
  RETIRED_VEHICLE_EVERGREEN_PATHS,
  VEHICLE_HANDOFF_DESTINATIONS,
} from "./lib/vehicle-handoff-redirect";
import server, { vehicleAuthorityHandoffRedirect } from "./server";

const HANDOFFS = Object.entries(VEHICLE_HANDOFF_DESTINATIONS) as Array<
  [string, string]
>;
const QUERY = "utm_source=test&utm_medium=referral&foo=a%2Bb&foo=two";

function withQuery(destination: string) {
  const hashIndex = destination.indexOf("#");
  if (hashIndex < 0) return `${destination}?${QUERY}`;
  return `${destination.slice(0, hashIndex)}?${QUERY}${destination.slice(hashIndex)}`;
}

describe("vehicleAuthorityHandoffRedirect", () => {
  it.each(HANDOFFS)("returns a permanent one-hop handoff for %s", (path, target) => {
    const response = vehicleAuthorityHandoffRedirect(
      new Request(`https://keeptxred.com${path}?${QUERY}`),
    );

    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe(withQuery(target));
  });

  it("covers every retired vehicle evergreen route at the Worker edge", () => {
    for (const path of RETIRED_VEHICLE_EVERGREEN_PATHS) {
      const response = vehicleAuthorityHandoffRedirect(
        new Request(`https://keeptxred.com${path}`),
      );
      expect(response?.status).toBe(301);
      expect(response?.headers.get("location")).toMatch(/^https:\/\/texasdefined\.com\//);
    }
  });

  it("leaves unrelated vehicle routes on KeepTXRed", () => {
    expect(
      vehicleAuthorityHandoffRedirect(
        new Request("https://keeptxred.com/vehicles/not-a-real-route?utm_source=test"),
      ),
    ).toBeNull();
  });
});

describe("Worker vehicle handoff ordering", () => {
  it("hands off a www/http request before KTR host canonicalization and preserves the full query", async () => {
    const response = await server.fetch(
      new Request(`http://www.keeptxred.com/vehicles/title-transfer/?${QUERY}`),
      {},
      {},
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      `https://texasdefined.com/texas-vehicle-registration?${QUERY}#title-transfer`,
    );
  });

  it("uses the same one-hop contract for direct deployment smoke requests", async () => {
    const response = await server.fetch(
      new Request(
        `https://keeptxred-site.freddy-coppola.workers.dev/vehicles/plates?${QUERY}`,
        { headers: { "x-keeptxred-deployment-smoke": "canonical" } },
      ),
      {},
      {},
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      `https://texasdefined.com/texas-vehicle-registration?${QUERY}#license-plates`,
    );
  });

  it("sends the newcomer guide directly to its TexasDefined owner", async () => {
    const response = await server.fetch(
      new Request(`http://www.keeptxred.com/vehicles/new-residents/?${QUERY}`),
      {},
      {},
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      `https://texasdefined.com/find-my-dmv?${QUERY}`,
    );
  });
});
