import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const route = readFileSync("src/routes/elections.candidates_.$candidateSlug.tsx", "utf8");
const server = readFileSync("src/lib/elections/candidate-route-metadata.functions.ts", "utf8");

describe("published candidate SEO metadata data boundary", () => {
  it("keeps complete candidate JSON on the server while retaining genuine 404s and 301 canonical redirects", () => {
    expect(route).toContain('loader: async ({ params }) =>');
    expect(route).toContain("getCandidateRouteMetadata({ data: { slug: params.candidateSlug } })");
    expect(route).toContain("if (!detail || !isElectionSlug(detail.storedSlug)) throw notFound()");
    expect(route).toContain("statusCode: 301");
    expect(route).not.toContain('import candidates from "@/data/elections/2026/candidates.json"');
    expect(server).toContain('createServerFn({ method: "GET" })');
    expect(server).toContain('import("@/data/elections/2026/candidates.json")');
    expect(server).toContain('item.publicationStatus === "published"');
    expect(server).toContain('item.verificationStatus === "verified"');
  });
  it("preserves exactly one server-rendered head canonical and restricted-image protection", () => {
    expect(route).toContain('head: ({ params, loaderData }) =>');
    expect(route).toContain('links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : []');
    expect(route).toContain("record.imageRights.usageStatus === \"approved\"");
    expect(route).toContain("getFeaturedCandidateProfile");
    expect(route).toContain("hasOccupation");
    expect(route).toContain("alumniOf");
    expect(route).toContain("Route.useLoaderData()");
    expect(server).toContain('record.imageRights?.usageStatus === "approved"');
    expect(route).toContain('"@type": "Person"');
  });
});
