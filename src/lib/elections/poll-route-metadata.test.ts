import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");
const route = read("src/routes/elections.polls.$pollSlug.tsx");
const server = read("src/lib/elections/poll-route-metadata.functions.ts");

describe("election poll route server-only metadata and SEO", () => {
  it("does not eagerly import the source polling dataset into shared route code", () => {
    expect(route).not.toContain('import records from "@/data/elections/2026/polls.json"');
    expect(route).toContain("getPollRouteMetadata({ data: { slug: params.pollSlug } })");
    expect(server).toContain('import("@/data/elections/2026/polls.json")');
    expect(server).toContain('item.publicationStatus === "published"');
    expect(server).toContain('item.verificationStatus === "verified"');
    expect(server).not.toContain("return record;");
  });

  it("retains SSR canonical, noindex fallback, schema and full poll-detail component", () => {
    expect(route).toContain("if (!isElectionSlug(params.pollSlug)) throw notFound()");
    expect(route).toContain("if (!record) throw notFound()");
    expect(route).toContain("head: ({ params, loaderData }) =>");
    expect(route).toContain('links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : []');
    expect(route).toContain('type: "application/ld+json"');
    expect(route).toContain('content: indexable ? "index, follow, max-image-preview:large" : "noindex, follow"');
    expect(route).toContain("const record = Route.useLoaderData()");
    expect(route).toContain("<ElectionRepositoryProvider>");
    expect(route).toContain("<ElectionPollDetailData pollSlug={pollSlug} />");
    expect(route).toContain("<PollDetailView poll={poll.data} />");
  });
});
