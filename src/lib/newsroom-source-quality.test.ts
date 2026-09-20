import { describe, expect, it } from "vitest";
import { countDistinctNewsSources, countDistinctPrimaryNewsSources } from "./newsroom-source-quality";

describe("newsroom source quality counts", () => {
  it("counts distinct outlets instead of feed items", () => {
    const rows = [
      { source: "Baylor Athletics", link: "https://baylorbears.com/news/a" },
      { source: "Baylor Athletics", link: "https://baylorbears.com/news/b" },
      { source: "Houston Cougars Athletics", link: "https://uhcougars.com/news/c" },
    ];
    expect(countDistinctNewsSources(rows)).toBe(2);
    expect(countDistinctPrimaryNewsSources(rows)).toBe(2);
  });

  it("never credits a Google News mirror as a primary outlet", () => {
    const rows = [
      { source: "Office of the Governor", link: "https://gov.texas.gov/news/post/example" },
      { source: "Office of the Texas Governor (.gov)", link: "https://news.google.com/rss/articles/example" },
    ];
    expect(countDistinctNewsSources(rows)).toBe(2);
    expect(countDistinctPrimaryNewsSources(rows)).toBe(1);
  });

  it("keeps primary source count bounded by distinct source count", () => {
    const rows = [
      { source: "Baylor Athletics", link: "https://baylorbears.com/news/a" },
      { source: "Baylor Athletics", link: "https://baylorbears.com/news/b" },
      { source: "Baylor Athletics", link: "https://baylorbears.com/news/c" },
    ];
    expect(countDistinctPrimaryNewsSources(rows)).toBeLessThanOrEqual(countDistinctNewsSources(rows));
  });
});
