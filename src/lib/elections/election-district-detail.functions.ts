import { createServerFn } from "@tanstack/react-start";

/**
 * SSR district detail reads published+verified election records server-side.
 * Only the selected district's race and relevant verified candidates cross
 * the route-loader boundary; no full election JSON joins the shared entry.
 */
export const getElectionDistrictDetailSnapshot = createServerFn({ method: "GET" })
  .validator((input: { raceSlug: string }) => ({
    raceSlug: String(input.raceSlug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    if (!data.raceSlug) return { race: null, candidates: [] };
    const [{ default: races }, { default: candidates }] = await Promise.all([
      import("@/data/elections/2026/races.json"),
      import("@/data/elections/2026/candidates.json"),
    ]);
    const record = races.find((race) =>
      race.slug === data.raceSlug &&
      race.publicationStatus === "published" &&
      race.verificationStatus === "verified",
    );
    if (!record) return { race: null, candidates: [] };
    return {
      race: {
        slug: record.slug,
        name: record.name,
        candidateIds: record.candidateIds,
        electionDate: record.electionDate,
        termLengthYears: record.termLengthYears,
        counties: record.counties,
        source: record.source,
        geographySource: record.geographySource,
        countyElectionLinkSource: record.countyElectionLinkSource,
      },
      candidates: candidates
        .filter((candidate) =>
          record.candidateIds.includes(candidate.id) &&
          candidate.publicationStatus === "published" &&
          candidate.verificationStatus === "verified")
        .map((candidate) => ({
          id: candidate.id,
          slug: candidate.slug,
          fullName: candidate.fullName,
          partyLabel: candidate.partyLabel,
          status: candidate.status,
        })),
    };
  });
