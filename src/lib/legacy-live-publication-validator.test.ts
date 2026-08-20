import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const validator = readFileSync(
  new URL("../../scripts/news/validate-daily-news-migration.mjs", import.meta.url),
  "utf8",
);

describe("legacy live URL publication validation", () => {
  it("recognizes dated live slugs without relaxing the dated slug requirement", () => {
    expect(validator).toContain("(?:live-)?(?:20\\d{2}-\\d{2}-\\d{2})");
    expect(validator).toContain("could not find any dated article slugs in the publication input");
  });

  it("links the restored article from the agriculture pillar", () => {
    const route = readFileSync("src/routes/texas-agriculture.tsx", "utf8");

    expect(route).toContain(
      "/news/live-2026-06-29-the-history-behind-the-texas-stock-tank-name-bxkvg7",
    );
  });
});
