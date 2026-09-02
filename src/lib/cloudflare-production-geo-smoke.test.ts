import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/deploy-cloudflare-production.yml", "utf8");
const startServer = readFileSync("src/start.ts", "utf8");

const DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical";

describe("Cloudflare production GEO preview smoke", () => {
  it("uses the guarded canonical direct-Worker header for both GEO page probes", () => {
    const geoStep = workflow.split("- name: Verify preview GEO content before production promotion")[1]
      ?.split("- name: Promote tested Worker to production custom domain")[0];

    expect(geoStep).toBeTruthy();
    expect(geoStep?.match(new RegExp(DEPLOYMENT_SMOKE_HEADER, "g"))).toHaveLength(2);
    expect(geoStep).toContain('${PREVIEW_URL%/}/elections/2026');
    expect(geoStep).toContain('${PREVIEW_URL%/}/');
  });

  it("keeps the direct-Worker canonical bypass locked to the known workers.dev host", () => {
    expect(startServer).toContain('const DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke";');
    expect(startServer).toContain("directHost === DIRECT_WORKER_HOST");
    expect(startServer).toContain('request.headers.get(DEPLOYMENT_SMOKE_HEADER)?.trim().toLowerCase() === "canonical"');
  });
});
