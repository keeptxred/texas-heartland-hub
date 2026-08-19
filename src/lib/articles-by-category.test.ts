import { describe, expect, it } from "vitest";
import {
  CATEGORY_NAME_TO_SLUG,
  filterByCategorySlug,
  normalizeCategoryName,
} from "@/lib/articles-by-category";

describe("newsroom category taxonomy", () => {
  it("preserves Texas News, government and law categories instead of collapsing them", () => {
    expect(normalizeCategoryName("Texas News")).toBe("Texas News");
    expect(normalizeCategoryName("Government")).toBe("Government");
    expect(normalizeCategoryName("Local Government")).toBe("Local Government");
    expect(normalizeCategoryName("Laws")).toBe("Laws");
  });

  it("falls back safely for unknown cloud categories", () => {
    expect(normalizeCategoryName("Unknown Category")).toBe("Non-Political");
  });

  it("provides stable category slugs for filters", () => {
    expect(CATEGORY_NAME_TO_SLUG["Texas News"]).toBe("texas-news");
    expect(CATEGORY_NAME_TO_SLUG.Government).toBe("government");
    expect(CATEGORY_NAME_TO_SLUG["Local Government"]).toBe("local-government");
    expect(CATEGORY_NAME_TO_SLUG.Laws).toBe("laws");
  });

  it("filters live rows using the expanded categories", () => {
    const rows = [
      { slug: "n", category: "Texas News" },
      { slug: "a", category: "Government" },
      { slug: "b", category: "Local Government" },
      { slug: "c", category: "Laws" },
      { slug: "d", category: "Legislature" },
    ];

    expect(filterByCategorySlug(rows, "texas-news").map((row) => row.slug)).toEqual(["n"]);
    expect(filterByCategorySlug(rows, "government").map((row) => row.slug)).toEqual(["a"]);
    expect(filterByCategorySlug(rows, "local-government").map((row) => row.slug)).toEqual(["b"]);
    expect(filterByCategorySlug(rows, "laws").map((row) => row.slug)).toEqual(["c"]);
  });
});
