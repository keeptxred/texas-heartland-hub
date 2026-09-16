import { describe, expect, it } from "vitest";

import server, { vehicleAuthorityHandoffRedirect } from "./server";

const HANDOFFS = [
  ["/vehicles/registration", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/renewal", "https://texasdefined.com/texas-vehicle-registration-renewal"],
  ["/vehicles/registration-fees-taxes", "https://texasdefined.com/texas-vehicle-registration-fees-taxes"],
  ["/vehicles/new-residents", "https://texasdefined.com/find-my-dmv"],
  ["/dmv", "https://texasdefined.com/texas-dmv"],
] as const;

const QUERY = "utm_source=test&utm_medium=referral&foo=a%2Bb&foo=two";

describe("vehicleAuthorityHandoffRedirect", () => {
  it.each(HANDOFFS)("returns a permanent one-hop handoff for %s", (path, target) => {
    const response = vehicleAuthorityHandoffRedirect(
      new Request(`https://keeptxred.com${path}?${QUERY}`),
    );

    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe(`${target}?${QUERY}`);
  });

  it("leaves unrelated vehicle routes on KeepTXRed", () => {
    expect(
      vehicleAuthorityHandoffRedirect(
        new Request("https://keeptxred.com/vehicles/title-transfer?utm_source=test"),
      ),
    ).toBeNull();
  });
});

describe("Worker vehicle handoff ordering", () => {
  it("hands off a www/http request before KTR host canonicalization and preserves the full query", async () => {
    const response = await server.fetch(
      new Request(`http://www.keeptxred.com/vehicles/renewal/?${QUERY}`),
      {},
      {},
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      `https://texasdefined.com/texas-vehicle-registration-renewal?${QUERY}`,
    );
  });

  it("uses the same one-hop contract for direct deployment smoke requests", async () => {
    const response = await server.fetch(
      new Request(
        `https://keeptxred-site.freddy-coppola.workers.dev/dmv?${QUERY}`,
        { headers: { "x-keeptxred-deployment-smoke": "canonical" } },
      ),
      {},
      {},
    );

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      `https://texasdefined.com/texas-dmv?${QUERY}`,
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
