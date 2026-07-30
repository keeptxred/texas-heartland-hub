import { describe, expect, it } from "vitest";
import { exploreDestinations } from "@/data/explore/all-destinations";
import { groupCavernsByRegion, relatedCaverns, sortCaverns } from "./cavern-discovery";

describe("cavern discovery", () => {
  it("groups every cavern into exactly one regional collection", () => {
    const caverns = sortCaverns(exploreDestinations);
    const groups = groupCavernsByRegion(exploreDestinations);
    const grouped = groups.flatMap((group) => group.items);

    expect(grouped).toHaveLength(caverns.length);
    expect(new Set(grouped.map((cavern) => cavern.slug)).size).toBe(caverns.length);
    expect(groups.every((group) => group.items.length > 0)).toBe(true);
  });

  it("prioritizes same-region caverns and excludes the current destination", () => {
    const caverns = sortCaverns(exploreDestinations);
    const current = caverns.find(
      (cavern) => caverns.filter((candidate) => candidate.region === cavern.region).length > 1,
    );

    expect(current).toBeDefined();
    if (!current) return;

    const related = relatedCaverns(current, exploreDestinations, 3);

    expect(related).not.toContainEqual(expect.objectContaining({ slug: current.slug }));
    expect(related[0]?.region).toBe(current.region);
    expect(new Set(related.map((cavern) => cavern.slug)).size).toBe(related.length);
  });
});
