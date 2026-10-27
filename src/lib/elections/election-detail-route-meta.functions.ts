import { createServerFn } from "@tanstack/react-start";
import { findCandidateStoredSlug, findRaceStoredSlug } from "./seoSlugs";
import { isElectionSlug } from "@/types/elections";

/**
 * The 2026 race and candidate catalogs are large and authoritative.
 * Read them only on the server for detail-route canonical checks and SEO.
 * Returning one published/verified record preserves SSR structured data,
 * while unrelated page visits do not hydrate both full JSON files.
 */
export const getElectionCandidateDetailSnapshot = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    if (!data.slug) return null;
    const { default: candidates } = await import("@/data/elections/2026/candidates.json");
    const storedSlug = findCandidateStoredSlug(data.slug, candidates);
    if (!storedSlug || !isElectionSlug(storedSlug)) return null;
    const record = candidates.find((item) =>
      item.slug === storedSlug &&
      item.publicationStatus === "published" &&
      item.verificationStatus === "verified",
    );
    return record ? { storedSlug, record } : null;
  });

export const getElectionRaceDetailSnapshot = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    if (!data.slug) return null;
    const { default: races } = await import("@/data/elections/2026/races.json");
    const storedSlug = findRaceStoredSlug(data.slug, races);
    if (!storedSlug || !isElectionSlug(storedSlug)) return null;
    const record = races.find((item) =>
      item.slug === storedSlug &&
      item.publicationStatus === "published" &&
      item.verificationStatus === "verified",
    );
    return record ? { storedSlug, record } : null;
  });
