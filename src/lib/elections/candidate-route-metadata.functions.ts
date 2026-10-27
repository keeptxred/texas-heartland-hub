import { createServerFn } from "@tanstack/react-start";

/**
 * Candidate lookup and publishability are authoritative on the server. This
 * preserves SSR metadata, 301 canonical redirects, and actual 404s without
 * placing the entire candidate record database in the global route config.
 */
export const getCandidateRouteMetadata = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    const [{ default: candidates }, { findCandidateStoredSlug }] = await Promise.all([
      import("@/data/elections/2026/candidates.json"),
      import("@/lib/elections/seoSlugs"),
    ]);
    const storedSlug = findCandidateStoredSlug(data.slug, candidates);
    const record = storedSlug ? candidates.find((item) =>
      item.slug === storedSlug &&
      item.publicationStatus === "published" &&
      item.verificationStatus === "verified"
    ) : undefined;
    if (!record) return null;
    // The returned projection is limited to fields consumed by the existing
    // canonical, social and JSON-LD head. Restricted images are never exposed.
    return {
      storedSlug,
      record: {
        fullName: record.fullName,
        biography: record.biography,
        description: "description" in record && typeof record.description === "string" ? record.description : null,
        imageUrl: record.imageRights?.usageStatus === "approved" ? record.imageUrl : null,
        imageRights: record.imageRights?.usageStatus === "approved"
          ? { usageStatus: "approved" as const } : null,
        partyLabel: record.partyLabel,
        party: record.party,
      },
    };
  });
