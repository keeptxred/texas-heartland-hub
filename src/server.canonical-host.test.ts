import { describe, expect, it } from "vitest";

import { canonicalHostRedirect } from "./server";

describe("canonicalHostRedirect", () => {
  it("permanently redirects www to the HTTPS apex while preserving path and query", () => {
    const response = canonicalHostRedirect(
      new Request("http://www.keeptxred.com/elections/2026?utm_source=test"),
    );

    expect(response?.status).toBe(308);
    expect(response?.headers.get("location")).toBe(
      "https://keeptxred.com/elections/2026?utm_source=test",
    );
  });

  it("does not redirect the canonical apex", () => {
    expect(canonicalHostRedirect(new Request("https://keeptxred.com/bills"))).toBeNull();
  });

  it("does not redirect preview or unrelated hosts", () => {
    expect(
      canonicalHostRedirect(new Request("https://preview.example.workers.dev/elections/2026")),
    ).toBeNull();
  });
});
