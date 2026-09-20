import { classifyStoryOwnership } from "@/shared/platform-core";

export type KeepTxRedSearchStory = {
  title: string;
  description?: string | null;
  category?: string | null;
  source?: string | null;
  kind?: string | null;
};

/**
 * KeepTXRed should only advertise/index cloud stories that belong to its
 * public-affairs newsroom. TexasDefined-owned lifestyle coverage can remain
 * readable at legacy URLs, but it must not keep consuming KTR search-surface
 * budget after the cross-site handoff.
 */
export function isKeepTxRedSearchOwnedStory(input: KeepTxRedSearchStory): boolean {
  const kind = input.kind?.trim().toLowerCase() ?? "";
  const route = classifyStoryOwnership({
    title: input.title,
    description: input.description,
    category: input.category,
    source: input.source,
    fallbackDomain: "breaking-news",
  });

  // Legacy sports rows with no strong story-level signal still belong to the
  // retired sports pipeline, not KTR search. Explicit government, election,
  // court, enforcement, or public-safety signals are classified before sports
  // and remain eligible for the KTR newsroom.
  if (kind.startsWith("sports-") && route.confidence === "fallback") return false;

  return route.owner === "KeepTXRed";
}
