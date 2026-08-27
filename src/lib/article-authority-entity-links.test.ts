import { describe, expect, it } from "vitest";
import type { AuthorityEntity } from "@/lib/authority-entity";
import { pickExactArticleAuthorityLinks } from "@/lib/article-authority-entity-links";

function entity(overrides: Partial<AuthorityEntity> & Pick<AuthorityEntity, "entityType" | "slug" | "name">): AuthorityEntity {
  return {
    id: `${overrides.entityType}:${overrides.slug}`,
    entityType: overrides.entityType,
    slug: overrides.slug,
    name: overrides.name,
    active: overrides.active ?? true,
    lastVerified: overrides.lastVerified === undefined ? "2026-08-27" : overrides.lastVerified,
    sourceOfTruth: overrides.sourceOfTruth === undefined
      ? { label: "Official source", url: "https://example.gov/official" }
      : overrides.sourceOfTruth,
    title: overrides.title ?? null,
    subtitle: overrides.subtitle ?? null,
    summary: overrides.summary ?? null,
    imageUrl: overrides.imageUrl ?? null,
    relatedEntityIds: overrides.relatedEntityIds ?? [],
    createdAt: overrides.createdAt ?? null,
    updatedAt: overrides.updatedAt ?? null,
  };
}

describe("exact article authority entity links", () => {
  it("links a fully named verified legislator but not a surname-only mention", () => {
    const jane = entity({
      entityType: "legislator",
      slug: "jane-smith",
      name: "Jane Smith",
      title: "Texas House District 10",
    });

    expect(pickExactArticleAuthorityLinks("Jane Smith introduced the proposal.", [jane])).toEqual([
      {
        label: "Jane Smith — Texas House District 10",
        href: "/representatives/jane-smith",
      },
    ]);
    expect(pickExactArticleAuthorityLinks("Smith introduced the proposal.", [jane])).toEqual([]);
  });

  it("allows the full current officeholder name to resolve to a verified statewide office", () => {
    const governor = entity({
      entityType: "statewide-office",
      slug: "governor",
      name: "Office of the Governor",
      title: "Governor",
      subtitle: "Greg Example",
    });

    expect(pickExactArticleAuthorityLinks("Greg Example announced the order.", [governor])).toEqual([
      {
        label: "Office of the Governor — Governor",
        href: "/texas-government/offices/governor",
      },
    ]);
  });

  it("rejects inactive, unverified, and source-less entities", () => {
    const inactive = entity({ entityType: "agency", slug: "inactive", name: "Texas Example Agency", active: false });
    const unverified = entity({ entityType: "agency", slug: "unverified", name: "Texas Other Agency", lastVerified: null });
    const sourceLess = entity({ entityType: "agency", slug: "source-less", name: "Texas Third Agency", sourceOfTruth: null });

    expect(pickExactArticleAuthorityLinks(
      "Texas Example Agency, Texas Other Agency and Texas Third Agency responded.",
      [inactive, unverified, sourceLess],
    )).toEqual([]);
  });

  it("keeps match ordering, deduplicates canonical destinations, and respects the cap", () => {
    const entities = [
      entity({ entityType: "agency", slug: "one", name: "Texas First Agency" }),
      entity({ entityType: "agency", slug: "two", name: "Texas Second Agency" }),
      entity({ entityType: "agency", slug: "three", name: "Texas Third Agency" }),
      entity({ entityType: "agency", slug: "four", name: "Texas Fourth Agency" }),
    ];
    const text = "Texas Second Agency met Texas First Agency before Texas Third Agency and Texas Fourth Agency.";

    expect(pickExactArticleAuthorityLinks(text, entities, 3).map((link) => link.href)).toEqual([
      "/texas-government/agencies/two",
      "/texas-government/agencies/one",
      "/texas-government/agencies/three",
    ]);
  });
});
