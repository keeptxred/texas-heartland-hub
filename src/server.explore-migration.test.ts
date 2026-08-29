import { describe, expect, it } from "vitest";

import { exploreMigrationRedirect } from "./server";

describe("Explore migration redirect", () => {
  it("redirects the retired Explore root to TexasDefined", () => {
    const response = exploreMigrationRedirect(new Request("https://keeptxred.com/explore"));

    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe("https://texasdefined.com/explore");
  });

  it("preserves nested Explore paths and query strings", () => {
    const response = exploreMigrationRedirect(
      new Request("https://keeptxred.com/explore/scenic-rivers?utm_source=legacy&view=map"),
    );

    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe(
      "https://texasdefined.com/explore/scenic-rivers?utm_source=legacy&view=map",
    );
  });

  it("preserves dynamic shared-trip paths", () => {
    const response = exploreMigrationRedirect(
      new Request("https://keeptxred.com/explore/trip/public-share-token"),
    );

    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe(
      "https://texasdefined.com/explore/trip/public-share-token",
    );
  });

  it("does not intercept non-Explore routes", () => {
    expect(exploreMigrationRedirect(new Request("https://keeptxred.com/elections/2026"))).toBeNull();
    expect(exploreMigrationRedirect(new Request("https://keeptxred.com/explorer"))).toBeNull();
  });
});
