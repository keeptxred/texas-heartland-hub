import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const contracts = [
  {
    path: "src/routes/texas-data.$datasetSlug.tsx",
    route: "/texas-data/$datasetSlug",
    destination: "https://texasdefined.com/texas-data/",
  },
  {
    path: "src/routes/texas-resources.type.$type.tsx",
    route: "/texas-resources/type/$type",
    destination: "https://texasdefined.com/texas-resources?q=",
  },
  {
    path: "src/routes/texas-resources.topic.$topicId.tsx",
    route: "/texas-resources/topic/$topicId",
    destination: "https://texasdefined.com/texas-resources?q=",
  },
  {
    path: "src/routes/texas-resources.journey.$journeyId.tsx",
    route: "/texas-resources/journey/$journeyId",
    destination: "https://texasdefined.com/texas-resources?q=",
  },
];

describe("retired dynamic TexasDefined handoffs", () => {
  it("uses router-native permanent redirects and preserves request query state", () => {
    for (const contract of contracts) {
      const source = readFileSync(contract.path, "utf8");
      expect(source).toContain(`createFileRoute("${contract.route}")`);
      expect(source).toContain('import { createFileRoute, redirect } from "@tanstack/react-router"');
      expect(source).toContain(contract.destination);
      expect(source).toContain("location.searchStr");
      expect(source).toContain("statusCode: 301");
      expect(source).not.toContain("window.location.replace");
      expect(source).not.toContain("throw new Response");
      expect(source).not.toContain("component:");
    }
  });
});
