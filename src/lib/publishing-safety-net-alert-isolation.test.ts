import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  "src/routes/api/public/hooks/publishing-safety-net.ts",
  "utf8",
);

describe("publishing safety-net alert isolation", () => {
  it("only reads open publishing-stall incidents, never unrelated coverage alerts", () => {
    const query = source.split('const [latestArticlesResult, openAlertResult, publishedReserveResult]')[1]
      ?.split('const readError =')[0] ?? "";
    expect(query).toContain('.from("publishing_alerts")');
    expect(query).toContain('.eq("status", "open")');
    expect(query).toContain('.like("incident_key", "publishing-stall-%")');
    expect(query).not.toContain('like("incident_key", "coverage-gap-%")');
  });

  it("only resolves its own publication-stall incident on newsroom recovery", () => {
    const recovery = source.split("if (!automationStalled && openAlert) {")[1]
      ?.split("let reservePublished:")[0] ?? "";
    expect(recovery).toContain(".eq(\"id\", openAlert.id)");
    expect(recovery).toContain('.like("incident_key", "publishing-stall-%")');
    expect(recovery).toContain('event: "publishing_recovered"');
  });

  it("keeps opening publication stalls without resetting unrelated editorial alerts", () => {
    expect(source).toContain('const incidentKey = `publishing-stall-${latestAutomation?.published_at ?? "no-publication"}`');
    expect(source).not.toMatch(/update\(\{[\s\S]*?status:\s*"resolved"[\s\S]*?\.eq\("status", "open"\)/);
  });
});
