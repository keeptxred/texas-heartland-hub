import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const route = readFileSync("src/routes/elections.races_.$raceSlug.tsx", "utf8");
const server = readFileSync("src/lib/elections/race-route-metadata.functions.ts", "utf8");

describe("race route SSR metadata boundary", () => {
  it("moves the full races dataset out of critical client route configuration", () => {
    expect(route).not.toContain('import races from "@/data/elections/2026/races.json"');
    expect(route).toContain("getRaceRouteMetadata({ data: { slug: params.raceSlug } })");
    expect(server).toContain('createServerFn({ method: "GET" })');
    expect(server).toContain('import("@/data/elections/2026/races.json")');
    expect(server).toContain('item.publicationStatus === "published"');
    expect(server).toContain('item.verificationStatus === "verified"');
  });
  it("retains permanent canonical redirects and SSR Event metadata for published races", () => {
    expect(route).toContain("statusCode: 301");
    expect(route).toContain('head: ({ params, loaderData }) =>');
    expect(route).toContain('links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : []');
    expect(route).toContain('"@type": "Event"');
    expect(route).toContain("RaceDetailSeo");
    expect(route).toContain("RaceAuthoritySection");
    expect(route).toContain("Route.useLoaderData()");
    expect(route).toContain('content: indexable ? "index, follow, max-image-preview:large" : "noindex, follow"');
  });
});
