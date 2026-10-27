import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import forecasts from "@/data/elections/2026/forecasts.json";

const route = readFileSync("src/routes/elections.forecast.$forecastSlug.tsx", "utf8");
const server = readFileSync("src/lib/elections/forecast-route-metadata.functions.ts", "utf8");

describe("2026 forecast route metadata remains accurate after server split", () => {
  it("keeps the entire forecast snapshot off the eager shared route config", () => {
    expect(route).not.toContain('import records from "@/data/elections/2026/forecasts.json"');
    expect(route).toContain("loader: ({ params }) => getPublishedForecastRouteMetadata");
    expect(route).toContain("head: ({ params, loaderData }) =>");
    expect(route).toContain("const record = loaderData;");
    expect(route).toContain("const indexable = validSlug && Boolean(Route.useLoaderData())");
    expect(server).toContain('await import("@/data/elections/2026/forecasts.json")');
  });
  it("preserves publishability, SSR metadata, canonical and unknown-route noindex", () => {
    expect(server).toContain('entry.publicationStatus === "published"');
    expect(server).toContain('entry.verificationStatus === "verified"');
    expect(route).toContain('content: indexable ? "index, follow, max-image-preview:large" : "noindex, follow"');
    expect(route).toContain('links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : []');
    expect(route).toContain('scripts: indexable');
    expect(route).toContain("ElectionRepositoryProvider");
    expect(forecasts.filter((item) =>
      item.publicationStatus === "published" && item.verificationStatus === "verified"
    ).length).toBeGreaterThan(0);
  });
});
