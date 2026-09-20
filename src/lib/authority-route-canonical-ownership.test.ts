import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("authority route canonical ownership", () => {
  it("keeps the policy hub on an index route and renders child trackers through the parent outlet", () => {
    const layout = read("../routes/policy.tsx");
    const index = read("../routes/policy.index.tsx");
    const tracker = read("../routes/policy.$slug.tsx");

    expect(layout).toContain("<Outlet />");
    expect(layout).not.toContain('path: "/policy"');
    expect(index).toContain('createFileRoute("/policy/")');
    expect(tracker).toContain('createFileRoute("/policy/$slug")');
  });

  it("leaves candidate and race detail canonicals with their TanStack route heads", () => {
    const candidateRoute = read("../routes/elections.candidates_.$candidateSlug.tsx");
    const candidateSeo = read("../components/elections/candidates/CandidateDetailSeo.tsx");
    const raceRoute = read("../routes/elections.races_.$raceSlug.tsx");
    const raceSeo = read("../components/elections/races/RaceDetailSeo.tsx");

    expect(candidateRoute).toContain('links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : []');
    expect(raceRoute).toContain('links: indexable ? [{ rel: "canonical", href: canonicalUrl }] : []');
    expect(candidateSeo).not.toContain('<link rel="canonical"');
    expect(raceSeo).not.toContain('<link rel="canonical"');
  });
});
