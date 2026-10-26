import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const authority = readFileSync("src/components/law-topic-page.tsx", "utf8");
const hub = readFileSync("src/routes/laws.index.tsx", "utf8");

describe("mobile laws action target sizing before deployment", () => {
  it("keeps each shared law topic section anchor at a full 44px height", () => {
    expect(authority).toContain('inline-flex min-h-11 items-center rounded px-3 py-2');
    expect(authority).toContain('aria-label="On this page"');
  });
  it("makes measured post-deployment browser geometry a required release gate", () => {
    const deploy = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");
    const deployStep = deploy.indexOf("- name: Deploy verified revision");
    const liveStep = deploy.indexOf("- name: Measure deployed Texas law touch targets on the public hostname");
    const statusStep = deploy.indexOf("- name: Record verified production-current status");
    expect(deployStep).toBeGreaterThanOrEqual(0);
    expect(liveStep).toBeGreaterThan(deployStep);
    expect(statusStep).toBeGreaterThan(liveStep);
    const requiredGate = deploy.slice(liveStep, statusStep);
    expect(requiredGate).toContain("if: steps.revision.outputs.deploy == 'true'");
    expect(requiredGate).toContain("bunx playwright test --config=playwright.laws-deployed.config.ts");
    expect(requiredGate).not.toContain("continue-on-error: true");
  });
  it("preserves 44px legal hub navigation actions without changing their targets", () => {
    expect((hub.match(/inline-flex min-h-11 items-center px-2 py-2/g) || []).length).toBeGreaterThanOrEqual(4);
    for(const url of ['/laws/topics','/laws/topic/$slug','https://statutes.capitol.texas.gov/','https://www.sos.state.tx.us/elections/']){
      expect(hub).toContain(url);
    }
  });
});