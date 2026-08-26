import { describe, expect, it } from "vitest";

import { canonicalHostRedirect, cityMigrationRedirect } from "./server";

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

  it("permanently redirects the HTTP apex to the HTTPS apex", () => {
    const response = canonicalHostRedirect(
      new Request("http://keeptxred.com/laws?utm_source=test"),
    );

    expect(response?.status).toBe(308);
    expect(response?.headers.get("location")).toBe(
      "https://keeptxred.com/laws?utm_source=test",
    );
  });

  it("does not redirect the canonical HTTPS apex", () => {
    expect(canonicalHostRedirect(new Request("https://keeptxred.com/bills"))).toBeNull();
  });

  it("does not redirect preview or unrelated hosts", () => {
    expect(
      canonicalHostRedirect(new Request("https://preview.example.workers.dev/elections/2026")),
    ).toBeNull();
  });
});

describe("cityMigrationRedirect", () => {
  const migrations = [
    ["/austin", "https://texasdefined.com/article/moving-to-austin-guide"],
    [
      "/dallas-fort-worth",
      "https://texasdefined.com/article/moving-to-dallas-fort-worth-guide",
    ],
    ["/san-antonio", "https://texasdefined.com/article/moving-to-san-antonio-guide"],
    ["/el-paso", "https://texasdefined.com/article/moving-to-el-paso-guide"],
  ] as const;

  it.each(migrations)(
    "returns a 301 for %s and preserves the complete query string",
    (path, target) => {
      const response = cityMigrationRedirect(
        new Request(
          `https://keeptxred-site.freddy-coppola.workers.dev${path}?utm_source=test&probe=city-migration`,
        ),
      );

      expect(response?.status).toBe(301);
      expect(response?.headers.get("location")).toBe(
        `${target}?utm_source=test&probe=city-migration`,
      );
    },
  );

  it("leaves Houston on KeepTXRed", () => {
    expect(
      cityMigrationRedirect(
        new Request("https://keeptxred.com/houston?utm_source=test&probe=city-migration"),
      ),
    ).toBeNull();
  });

  it("leaves unrelated routes on the existing server path", () => {
    expect(cityMigrationRedirect(new Request("https://keeptxred.com/elections/2026"))).toBeNull();
  });
});
