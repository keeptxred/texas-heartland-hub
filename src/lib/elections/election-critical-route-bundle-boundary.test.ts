import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The 2026 candidate and race catalogs previously contributed ~3.68 MB
 * of rendered modules to the shared client entry via critical route metadata.
 * All SSR canonicals, head schemas, published-only checks and redirects
 * must continue to read their data through small server-function results.
 */
const routeFiles = [
  "elections.2026.tsx",
  "elections.statewide.tsx",
  "elections.districts.index.tsx",
  "elections.districts.$districtSlug.tsx",
  "elections.candidates_.$candidateSlug.tsx",
  "elections.races_.$raceSlug.tsx",
];

const read = (path: string) => readFileSync(path, "utf8");

describe("critical election route metadata bundle boundary", () => {
  it.each(routeFiles)("%s does not eagerly import 2026 candidate or race catalogs", (file) => {
    const route = read(`src/routes/${file}`);
    expect(route).not.toMatch(/import\\s+[^;]*?from\\s*["'][^"']*data\\/elections\\/2026\\/(?:candidates|races)\\.json["']/s);
    expect(route).not.toMatch(/require\\([^)]*data\\/elections\\/2026\\/(?:candidates|races)\\.json/);
  });

  it("preserves SSR and real candidate 404/canonical redirects", () => {
    const route = read("src/routes/elections.candidates_.$candidateSlug.tsx");
    const handler = read("src/lib/elections/candidate-route-metadata.functions.ts");
    expect(route).toContain("getCandidateRouteMetadata");
    expect(route).toContain("loader: async");
    expect(route).toContain("head: ({ params, loaderData })");
    expect(route).toContain("throw notFound()");
    expect(route).toContain("statusCode: 301");
    expect(route).toContain('rel: "canonical", href: canonicalUrl');
    expect(handler).toContain('import("@/data/elections/2026/candidates.json")');
    expect(handler).toContain('publicationStatus === "published"');
    expect(handler).toContain('verificationStatus === "verified"');
    expect(handler).toContain('usageStatus === "approved"');
    expect(handler).toContain("storedSlug");
  });

  it("preserves race canonical metadata and unpublished noindex behavior", () => {
    const route = read("src/routes/elections.races_.$raceSlug.tsx");
    const handler = read("src/lib/elections/race-route-metadata.functions.ts");
    expect(route).toContain("getRaceRouteMetadata");
    expect(route).toContain("head: ({ params, loaderData })");
    expect(route).toContain('content: indexable ? "index, follow, max-image-preview:large" : "noindex, follow"');
    expect(route).toContain("statusCode: 301");
    expect(route).toContain('rel: "canonical", href: canonicalUrl');
    expect(handler).toContain('import("@/data/elections/2026/races.json")');
    expect(handler).toContain('publicationStatus === "published"');
    expect(handler).toContain('verificationStatus === "verified"');
    expect(handler).toContain("storedSlug");
  });
});
