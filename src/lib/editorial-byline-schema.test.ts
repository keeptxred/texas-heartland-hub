import { describe, expect, it } from "vitest";
import { authorSlug, getAuthor } from "@/data/authors";
import { personJsonLd } from "@/lib/seo";

const CURRENT_CLOUD_BYLINES = [
  {
    byline: "Keep TX Red Newsroom",
    canonicalSlug: "keep-tx-red-newsroom",
    canonicalName: "Keep TX Red Newsroom",
  },
  {
    byline: "Keep TX Red Editorial Staff",
    canonicalSlug: "keep-tx-red-editorial-staff",
    canonicalName: "Keep TX Red Editorial Staff",
  },
  {
    byline: "Keep TX Red Civics Desk",
    canonicalSlug: "civics-desk",
    canonicalName: "Civics Desk",
  },
  {
    byline: "Keep TX Red Elections Desk",
    canonicalSlug: "elections-desk",
    canonicalName: "Elections Desk",
  },
] as const;

describe("current cloud editorial bylines", () => {
  it.each(CURRENT_CLOUD_BYLINES)(
    "resolves $byline to one registered organizational profile",
    ({ byline, canonicalSlug, canonicalName }) => {
      expect(authorSlug(byline)).toBe(canonicalSlug);
      const author = getAuthor(byline);
      expect(author?.slug).toBe(canonicalSlug);
      expect(author?.name).toBe(canonicalName);
      expect(author?.bio.join(" ").length).toBeGreaterThanOrEqual(100);
      expect(author?.beats.length).toBeGreaterThan(0);
    },
  );

  it.each(CURRENT_CLOUD_BYLINES)(
    "emits Organization schema instead of a fabricated Person for $byline",
    ({ byline, canonicalSlug, canonicalName }) => {
      const url = `https://keeptxred.com/authors/${canonicalSlug}`;
      const schema = personJsonLd({ name: byline, url });
      expect(schema["@type"]).toBe("Organization");
      expect(schema.name).toBe(canonicalName);
      expect(schema.url).toBe(url);
      expect(schema).toHaveProperty("parentOrganization");
      expect(schema).toHaveProperty("knowsAbout");
      expect(schema).not.toHaveProperty("worksFor");
    },
  );
});
