import { describe, expect, it } from "vitest";

import {
  adsTxtResponse,
  canonicalHostRedirect,
  cityMigrationRedirect,
  normalizeCanonicalHref,
} from "./server";

const WWW_HOST = "www.keeptxred.com";
const ADS_TXT_URLS = [
  "http://keeptxred.com/ads.txt",
  "https://keeptxred.com/ads.txt",
  `http://${WWW_HOST}/ads.txt`,
  `https://${WWW_HOST}/ads.txt`,
] as const;

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

  it("never canonical-redirects ads.txt so HTTP, HTTPS, apex, and www can answer directly", () => {
    for (const url of ADS_TXT_URLS) {
      expect(canonicalHostRedirect(new Request(url))).toBeNull();
    }
  });
});

describe("normalizeCanonicalHref", () => {
  it("removes trailing slashes from non-root KeepTXRed canonicals", () => {
    expect(normalizeCanonicalHref("https://keeptxred.com/laws/")).toBe(
      "https://keeptxred.com/laws",
    );
    expect(
      normalizeCanonicalHref("https://keeptxred.com/laws/topic/property-tax-law/"),
    ).toBe("https://keeptxred.com/laws/topic/property-tax-law");
  });

  it("preserves the canonical root and already slashless paths", () => {
    expect(normalizeCanonicalHref("https://keeptxred.com/")).toBe("https://keeptxred.com/");
    expect(normalizeCanonicalHref("https://keeptxred.com/laws/topics")).toBe(
      "https://keeptxred.com/laws/topics",
    );
  });

  it("does not rewrite another origin or a non-HTTPS URL", () => {
    expect(normalizeCanonicalHref("https://texasdefined.com/laws/")).toBe(
      "https://texasdefined.com/laws/",
    );
    expect(normalizeCanonicalHref("http://keeptxred.com/laws/")).toBe(
      "http://keeptxred.com/laws/",
    );
  });

  it("preserves query and fragment data while normalizing the pathname", () => {
    expect(normalizeCanonicalHref("https://keeptxred.com/laws/?view=all#top")).toBe(
      "https://keeptxred.com/laws?view=all#top",
    );
  });
});

describe("adsTxtResponse", () => {
  const expected = "google.com, pub-1891256141359926, DIRECT, f08c47fec0942fa0\n";

  it.each(ADS_TXT_URLS)("returns the exact AdSense declaration with HTTP 200 for %s", async (url) => {
    const response = adsTxtResponse(new Request(url));

    expect(response?.status).toBe(200);
    expect(response?.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await response?.text()).toBe(expected);
  });

  it("supports HEAD without returning a body", async () => {
    const response = adsTxtResponse(
      new Request("https://keeptxred.com/ads.txt", { method: "HEAD" }),
    );

    expect(response?.status).toBe(200);
    expect(await response?.text()).toBe("");
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