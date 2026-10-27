import { createServerFn } from "@tanstack/react-start";

/**
 * Fetch the existing verified 226-profile editorial authority catalog only on
 * the server. The representative route needs one article and a committee list,
 * not the complete state and U.S. delegation authority corpus on every page.
 */
export const getRepresentativeAuthorityRouteData = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
  }))
  .handler(async ({ data }) => {
    const { getRepresentativeAuthority, getHouseCommitteeAssignments } =
      await import("@/data/representative-authority");
    return {
      authority: getRepresentativeAuthority(data.slug) ?? null,
      houseCommittees: getHouseCommitteeAssignments(data.slug),
    };
  });
