import { describe, expect, it } from "vitest";
import { buildSeo } from "@/lib/seo";

function titleFor(title: string) {
  const seo = buildSeo({
    title,
    description: "SEO title regression test.",
    path: "/seo-title-test",
  });

  return seo.title;
}

describe("SEO title branding", () => {
  it("does not append the site name twice when a title already starts with the brand", () => {
    expect(
      titleFor("Keep TX Red | Texas Politics, Elections & Government Accountability"),
    ).toBe("Keep TX Red | Texas Politics, Elections & Government");
  });

  it("appends the site name to an unbranded title", () => {
    expect(titleFor("Texas Election Results")).toBe(
      "Texas Election Results | Keep TX Red",
    );
  });

  it("does not duplicate a title that already ends with the site name", () => {
    expect(titleFor("Texas Election Results | Keep TX Red")).toBe(
      "Texas Election Results | Keep TX Red",
    );
  });
});
