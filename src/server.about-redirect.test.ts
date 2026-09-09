import { describe, expect, it } from "vitest";

import { legacyAboutRedirect } from "./server";

describe("legacyAboutRedirect", () => {
  it("returns a permanent 301 to the canonical About URL from the production host", () => {
    const response = legacyAboutRedirect(
      new Request("https://keeptxred.com/about-keep-texas-red"),
    );

    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe("https://keeptxred.com/about");
  });

  it("returns the same canonical 301 from the direct Worker and preserves the query string", () => {
    const response = legacyAboutRedirect(
      new Request(
        "https://keeptxred-site.freddy-coppola.workers.dev/about-keep-texas-red?utm_source=test&probe=brand-about-consolidation",
      ),
    );

    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe(
      "https://keeptxred.com/about?utm_source=test&probe=brand-about-consolidation",
    );
  });

  it("leaves the canonical About route and unrelated routes on the existing server path", () => {
    expect(legacyAboutRedirect(new Request("https://keeptxred.com/about"))).toBeNull();
    expect(legacyAboutRedirect(new Request("https://keeptxred.com/elections/2026"))).toBeNull();
  });
});
