import { describe, expect, it } from "vitest";
import fs from "node:fs";

const routeSource = fs.readFileSync(
  new URL("../routes/news.$slug.tsx", import.meta.url),
  "utf8",
);

describe("article image alt rendering", () => {
  it("carries reviewed cloud image alt text into public HTML and SEO metadata", () => {
    expect(routeSource).toContain('imageAlt: (ever.image_alt_text ?? "").trim() || displayTitle');
    expect(routeSource).toContain("const imageAlt = article.imageAlt ?? article.title");
    expect(routeSource).toContain("imageAlt,");
    expect(routeSource).toContain("alt: imageAlt,");
    expect(routeSource).toContain("alt={imageAlt}");
  });
});
