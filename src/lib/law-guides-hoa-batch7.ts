import { HOA_BATCH7_GUIDES } from "@/data/laws-hoa-batch7-index";
import type { LawGuideMeta } from "@/lib/law-guides-core";

const isPrimaryAuthority = (url: string) =>
  url.includes("statutes.capitol.texas.gov") || url.includes("capitol.texas.gov/tlodocs/");

export const HOA_BATCH7_LAW_GUIDES: readonly LawGuideMeta[] = Object.values(HOA_BATCH7_GUIDES).map((guide) => ({
  slug: guide.slug,
  topic: "hoa-property",
  status: "verified",
  canonicalPath: `/guides/${guide.slug}`,
  statutes: guide.sources
    .filter((source) =>
      source.label.includes("Texas Property Code") || source.label.includes("Texas Tax Code"),
    )
    .map((source) => source.label),
  sources: guide.sources.map((source) => ({ ...source, primary: isPrimaryAuthority(source.url) })),
  lastVerified: guide.updated,
  effectiveDate: guide.slug === "texas-hoa-security-measures-law"
    ? "September 1, 2025 (SB 711 security-fencing update)"
    : guide.slug === "texas-hoa-renter-payment-method-law"
      ? "September 1, 2023 (HB 1193)"
      : undefined,
}));
