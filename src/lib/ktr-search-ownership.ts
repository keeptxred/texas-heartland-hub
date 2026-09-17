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
  if (kind.startsWith("sports-")) return false;

  const route = classifyStoryOwnership({
    title: input.title,
    description: input.description,
    category: input.category,
    source: input.source,
    fallbackDomain: "breaking-news",
  });

  return route.owner === "KeepTXRed";
}
