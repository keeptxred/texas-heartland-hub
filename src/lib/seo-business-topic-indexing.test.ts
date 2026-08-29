import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const route = readFileSync("src/routes/texas-business.$topic.tsx", "utf8");
const view = readFileSync("src/components/texas-business-view.tsx", "utf8");

describe("Texas Business topic indexing", () => {
  it("consolidates the duplicate energy topic into the dedicated authority page", () => {
    expect(route).toContain('if (params.topic === "energy")');
    expect(route).toContain('href: "/texas-energy"');
    expect(route).toContain("statusCode: 301");
  });

  it("keeps remaining filtered business topic pages out of the index", () => {
    expect(route).toContain('{ name: "robots", content: "noindex,follow" }');
    expect(route).toContain('const canonical = "https://keeptxred.com/texas-business"');
  });

  it("does not revive obsolete real-estate or relocation topic slugs", () => {
    const topicDefinition = view.slice(
      view.indexOf("export const BUSINESS_SLUGS"),
      view.indexOf("export const BUSINESS_TOPIC_SLUGS"),
    );
    expect(topicDefinition).not.toMatch(/real[-_ ]?estate/i);
    expect(topicDefinition).not.toMatch(/relocation/i);
  });
});
