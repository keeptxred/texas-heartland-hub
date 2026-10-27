import { createServerFn } from "@tanstack/react-start";

/** Keep the eight complete official-source reference guides server-side.
 * The government hub needs only summary cards, not entire guide bodies.
 */
export const getSearchRecoveryAuthorityDirectory = createServerFn({ method: "GET" })
  .handler(async () => {
    const { SEARCH_RECOVERY_AUTHORITY_GUIDES } = await import("@/data/search-recovery-authority");
    return Object.values(SEARCH_RECOVERY_AUTHORITY_GUIDES).map((guide) => ({
      slug: guide.slug,
      eyebrow: guide.eyebrow,
      title: guide.title,
      dek: guide.dek,
    }));
  });

export const getSearchRecoveryAuthorityGuide = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    const { SEARCH_RECOVERY_AUTHORITY_GUIDES } = await import("@/data/search-recovery-authority");
    return SEARCH_RECOVERY_AUTHORITY_GUIDES[data.slug] ?? null;
  });
