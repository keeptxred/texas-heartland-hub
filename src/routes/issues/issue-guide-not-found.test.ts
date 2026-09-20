import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./$slug.tsx", import.meta.url), "utf8");

describe("issue guide missing-route behavior", () => {
  it("throws route-level notFound for unknown issue slugs", () => {
    expect(source).toContain('import { createFileRoute, notFound } from "@tanstack/react-router"');
    expect(source).toContain("if (!guide) throw notFound()");
    expect(source).toContain("notFoundComponent:");
  });

  it("marks the missing metadata state noindex", () => {
    expect(source).toContain('{ name: "robots", content: "noindex,follow" }');
  });

  it("renders valid issue guides from loader data instead of a client-side soft-404 branch", () => {
    expect(source).toContain("const guide = Route.useLoaderData()");
    expect(source).not.toContain("if (!guide) {\n    return (");
  });
});
