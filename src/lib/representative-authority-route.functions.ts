import { createServerFn } from "@tanstack/react-start";

/**
 * Only the server reads the full source-linked evidence catalog. Return at
 * most one representative's records to the client; never send the whole
 * legislature's research JSON in a browser bundle or route payload.
 */
export const getRepresentativeAuthorityRouteData = createServerFn({ method: "GET" })
  .validator((input: { slug: string; temporaryDataOutage?: boolean }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
    temporaryDataOutage: Boolean(input.temporaryDataOutage),
  }))
  .handler(async ({ data }) => {
    const [
      { getRepresentativeAuthority, getHouseCommitteeAssignments },
      { findRepresentativeBySlug },
      { applyPilotEditorial, certifyRepresentative, pilotResearchFor },
    ] = await Promise.all([
      import("@/data/representative-authority"),
      import("@/data/representatives"),
      import("@/lib/representative-quality-gates"),
    ]);
    const authority = applyPilotEditorial(data.slug, getRepresentativeAuthority(data.slug) ?? null);
    const representative = findRepresentativeBySlug(data.slug);
    return {
      authority,
      houseCommittees: getHouseCommitteeAssignments(data.slug),
      certification: certifyRepresentative({
        slug: data.slug,
        representative,
        authority,
        temporaryDataOutage: data.temporaryDataOutage,
      }),
      primarySourceResearch: pilotResearchFor(data.slug),
    };
  });
