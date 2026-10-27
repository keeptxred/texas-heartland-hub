import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(path, "utf8");
const route = source("src/routes/elections.forecast.$forecastSlug.tsx");
const handler = source("src/lib/elections/forecast-route-metadata.functions.ts");

describe("election forecast route SEO-safe server data boundary", () => {
  it("keeps the full election forecasts snapshot out of the shared client route", () => {
    expect(route).not.toContain('import records from "@/data/elections/2026/forecasts.json"');
    expect(route).toContain("getForecastRouteMetadata({ data: { slug: params.forecastSlug } })");
    expect(handler).toContain('import("@/data/elections/2026/forecasts.json")');
    expect(handler).toContain('item.publicationStatus === "published"');
    expect(handler).toContain('item.verificationStatus === "verified"');
    expect(handler).not.toContain("return record;");
  });

  it("keeps actual 404s and precise SSR canonicals/head, JSON-LD, and original body renderer", () => {
    expect(route).toContain("if (!isElectionSlug(params.forecastSlug)) throw notFound()");
    expect(route).toContain("if (!record) throw notFound()");
    expect(route).toContain("head: ({ params, loaderData }) =>");
    expect(route).toContain('links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : []');
    expect(route).toContain('type: "application/ld+json"');
    expect(route).toContain('content: indexable ? "index, follow, max-image-preview:large" : "noindex, follow"');
    expect(route).toContain("const record = Route.useLoaderData()");
    expect(route).toContain("<ElectionRepositoryProvider>");
    expect(route).toContain("<ElectionForecastDetailData forecastSlug={forecastSlug} />");
    expect(route).toContain("<ForecastDetailView forecast={forecast.data} />");
  });
});
