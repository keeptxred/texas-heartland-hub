import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const route = readFileSync("src/routes/api/public/hooks/texasdefined-source-scoring-readiness.ts", "utf8");
const score = readFileSync("src/routes/api/public/hooks/score-viral.ts", "utf8");
const workflow = readFileSync(".github/workflows/texasdefined-source-scoring.yml", "utf8");

describe("deployed TexasDefined primary-source scoring handshake", () => {
  it("readiness GET is side-effect free and never exposes tokens or invents approval", () => {
    expect(route).toContain('createFileRoute("/api/public/hooks/texasdefined-source-scoring-readiness")');
    expect(route).toContain('mode: "td-source-routing"');
    expect(route).toContain('publicationSuppressed: true');
    expect(route).toContain('"cache-control": "no-store"');
    for (const risk of ["createClient", "supabase", "fetch(", "publishSingleFeedItem", "process.env"]) {
      expect(route).not.toContain(risk);
    }
  });
  it("safely probes the released Worker before calling the source scoring POST", () => {
    expect(workflow).toContain("texasdefined-source-scoring-readiness");
    expect(workflow).toContain('readiness=0');
    expect(workflow).toContain('readiness=1');
    expect(workflow).toContain('if [[ "$readiness" != 1 ]]');
    expect(workflow).toContain('No POST attempted.');
    expect(workflow).toContain('--request POST');
    expect(workflow.indexOf("texasdefined-source-scoring-readiness")).toBeLessThan(workflow.indexOf("--request POST"));
    expect(workflow).toContain('and .version == "20261117-v1"');
    expect(workflow).toContain('and .publicationSuppressed == true');
  });
  it("scorer suppresses KTR article publishing in exact verified TD-only mode", () => {
    expect(score).toContain('searchParams.get("mode") === "td-source-routing"');
    expect(score).toContain('scoreOnly ? [] : autoPublishCandidates');
    expect(score).toContain('publicationSuppressed: scoreOnly');
  });
});
