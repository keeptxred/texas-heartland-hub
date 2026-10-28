import { approvedFishingTagRepairs } from "./fishing-etsy-tag-repairs";

export const fishingAiDisclosure =
  "Artwork disclosure: Original fishing illustration developed for Texas Defined with AI image-generation assistance and prepared for garment printing. This shirt is printed to order by an independent production partner.";

// Match an existing, known listing by its real product+listing ID and original
// lead sentence, not a guessed product title. Never edit a different listing.
const originalLeads: Record<string, string> = {
  TDFISH2026P1_01: "A leaping largemouth bass and a splash of freshwater give this Texas Bass Co. graphic tee",
  TDFISH2026P1_02: "For the early launch, the topwater strike and the fish that almost pulled the rod",
  TDFISH2026P1_03: "A fishing boat, quiet water and a warm Texas sunset capture that first evening",
  TDFISH2026P1_04: "For anglers who know every scratch on their favorite crankbait. Texas Tackle Club",
  TDFISH2026P1_05: "The water is still, the sun is just clearing the trees and",
  TDFISH2026P1_06: "A copper-bronze redfish with its distinctive spotted tail cuts through marsh water",
};

export function approvedFishingDescription(job: string, printifyId: string, etsyId: string) {
  const p = approvedFishingTagRepairs.find((x) => x.job === job && x.printify === printifyId && x.etsy === etsyId);
  return p ? { ...p, lead: originalLeads[p.job] } : null;
}

export function requiredFishingDescription(original: string, lead: string) {
  if (!original.startsWith(lead) || original.length > 10000 || original.length < 130) return null;
  // The Sunrise Cast listing has an existing double-escaped apostrophe;
  // normalize only this known entity, preserving every other phrase verbatim.
  const normalized = original.replace(/&amp;#39;|&#39;|&apos;/gi, "'");
  if (normalized.includes(fishingAiDisclosure)) return normalized;
  return normalized.trimEnd() + "\n\n" + fishingAiDisclosure;
}
