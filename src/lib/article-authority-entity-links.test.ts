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

  it("uses election context to resolve a candidate/officeholder same-name collision", () => {
    const officeholder = entity({
      entityType: "legislator",
      slug: "jane-smith",
      name: "Jane Smith",
      title: "Texas House District 10",
    });
    const candidate = entity({
      entityType: "candidate",
      slug: "jane-smith-for-senate",
      name: "Jane Smith",
      title: "U.S. Senate",
    });

    expect(pickExactArticleAuthorityLinks(
      "Jane Smith discussed the committee proposal at the Capitol.",
      [officeholder, candidate],
    )[0]?.href).toBe("/representatives/jane-smith");

    expect(pickExactArticleAuthorityLinks(
      "Candidate Jane Smith launched her campaign ahead of the primary election.",
      [officeholder, candidate],
    )[0]?.href).toBe("/elections/candidates/jane-smith-for-senate");
  });

  it("requires election context before linking candidate or race entities", () => {
    const candidate = entity({ entityType: "candidate", slug: "alex-carter", name: "Alex Carter" });
    const race = entity({ entityType: "race", slug: "texas-senate-10", name: "Texas Senate District 10 Race" });

    expect(pickExactArticleAuthorityLinks("Alex Carter spoke at a community meeting.", [candidate])).toEqual([]);
    expect(pickExactArticleAuthorityLinks(
      "Alex Carter entered the election campaign.",
      [candidate],
    )[0]?.href).toBe("/elections/candidates/alex-carter");
    expect(pickExactArticleAuthorityLinks(
      "The Texas Senate District 10 Race is on the November ballot.",
      [race],
    )[0]?.href).toBe("/elections/races/texas-senate-10");
  });

  it("skips ambiguous duplicate candidate names rather than guessing a profile", () => {
    const first = entity({ entityType: "candidate", slug: "alex-lee-one", name: "Alex Lee" });
    const second = entity({ entityType: "candidate", slug: "alex-lee-two", name: "Alex Lee" });

    expect(pickExactArticleAuthorityLinks(
      "Candidate Alex Lee is campaigning in the primary election.",
      [first, second],
    )).toEqual([]);
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
