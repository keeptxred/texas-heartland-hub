import { createServerFn } from "@tanstack/react-start";

/**
 * Race canonical and head projection sourced only from published, verified
 * election records. Full record payload remains in the existing repository
 * consumed by the lazily rendered race component.
 */
export const getRaceRouteMetadata = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    const [{ default: races }, { findRaceStoredSlug }] = await Promise.all([
      import("@/data/elections/2026/races.json"),
      import("@/lib/elections/seoSlugs"),
    ]);
    const storedSlug = findRaceStoredSlug(data.slug, races);
    const record = storedSlug ? races.find((item) =>
      item.slug === storedSlug &&
      item.publicationStatus === "published" &&
      item.verificationStatus === "verified"
    ) : undefined;
    if (!record) return { storedSlug, record: null };
    return {
      storedSlug,
      record: {
        name: record.name,
        description: record.description,
        electionDate: record.electionDate,
        districtName: record.districtName,
      },
    };
  });
