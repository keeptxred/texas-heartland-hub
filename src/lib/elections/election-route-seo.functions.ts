import { createServerFn } from "@tanstack/react-start";
import { findCandidateStoredSlug, candidateSeoSlug, findRaceStoredSlug, raceSeoSlug } from "@/lib/elections/seoSlugs";

/**
 * Resolve the exact official-published route identity and its SEO fields on the
 * server. The full election JSON is not required by the shared client entry.
 * An individual, verified record is serialized for SSR and client navigation.
 */
export const getElectionCandidateRoute = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({ slug: String(input.slug ?? "").slice(0, 180) }))
  .handler(async ({ data }) => {
    const { default: snapshot } = await import("@/data/elections/2026/candidates.json");
    const storedSlug = findCandidateStoredSlug(data.slug, snapshot);
    const record = storedSlug
      ? snapshot.find((row) => row.slug === storedSlug &&
        row.publicationStatus === "published" && row.verificationStatus === "verified")
      : undefined;
    return record && storedSlug
      ? { storedSlug, canonicalSlug: candidateSeoSlug(storedSlug), record }
      : null;
  });

export const getElectionRaceRoute = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({ slug: String(input.slug ?? "").slice(0, 180) }))
  .handler(async ({ data }) => {
    const { default: snapshot } = await import("@/data/elections/2026/races.json");
    const storedSlug = findRaceStoredSlug(data.slug, snapshot);
    const record = storedSlug
      ? snapshot.find((row) => row.slug === storedSlug &&
        row.publicationStatus === "published" && row.verificationStatus === "verified")
      : undefined;
    return {
      storedSlug: storedSlug ?? null,
      canonicalSlug: storedSlug ? raceSeoSlug(storedSlug) : data.slug,
      record: record ?? null,
    };
  });
