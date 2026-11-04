import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse } from "@/lib/sitemap-shared";
import { getRepresentativeAuthority } from "@/data/representative-authority";
import { findRepresentativeBySlug } from "@/data/representatives";
import {
  SIX_PROFILE_PILOT,
  applyPilotEditorial,
  certifyRepresentative,
} from "@/lib/representative-quality-gates";

/**
 * Detail URLs are listed only when they pass the identical six-gate
 * publication contract used by server-rendered per-profile robots metadata.
 * Official-source pilot evidence is a bounded, dated snapshot, not an implicit
 * claim of current activity. Others remain discoverable by internal links but
 * are intentionally absent from this sitemap during recovery.
 */
export const INDEXABLE_REPRESENTATIVE_SLUGS = SIX_PROFILE_PILOT.filter((slug) =>
  certifyRepresentative({
    slug,
    representative: findRepresentativeBySlug(slug),
    authority: applyPilotEditorial(slug, getRepresentativeAuthority(slug) ?? null),
  }).state === "AUTHORITY_READY",
);

export const Route = createFileRoute("/sitemap-representatives.xml")({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset([
        ...INDEXABLE_REPRESENTATIVE_SLUGS.map((slug) => ({ loc: `${BASE_URL}/representatives/${slug}` })),
      ])),
    },
  },
});
