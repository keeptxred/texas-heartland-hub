import { describe, expect, it } from "vitest";
import {
  getArticleImageAttribution,
  hasRequiredArticleImageAttribution,
} from "./article-image-attribution";

const AM_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lone_Star_Showdown_2006_McGee_on_goal-line.jpg";

describe("article image attribution", () => {
  it("renders complete attribution metadata for the Texas A&M representative football image", () => {
    expect(getArticleImageAttribution(AM_IMAGE)).toEqual({
      credit: "Johntex",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Lone_Star_Showdown_2006_McGee_on_goal-line.jpg",
      licenseName: "CC BY 2.5",
      licenseUrl: "https://creativecommons.org/licenses/by/2.5/",
      caption:
        "Representative archive Texas A&M football photo from the 2006 Lone Star Showdown; not the 2026 Missouri State game.",
      usageNote: "Source image unmodified; page presentation may crop it responsively.",
    });
  });

  it("fails closed for unregistered external images instead of inventing credit", () => {
    expect(getArticleImageAttribution("https://example.com/photo.jpg")).toBeNull();
    expect(hasRequiredArticleImageAttribution("https://example.com/photo.jpg")).toBe(false);
  });

  it("normalizes empty image URLs to no attribution", () => {
    expect(getArticleImageAttribution(null)).toBeNull();
    expect(getArticleImageAttribution("   ")).toBeNull();
  });
});
