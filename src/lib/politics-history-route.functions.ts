import { createServerFn } from "@tanstack/react-start";

/** Cited historical pages stay immutable in their authored source modules.
 * Only the requested route's guide crosses the server-to-client loader boundary.
 */
export const getPoliticsHistoricalAuthorityPage = createServerFn({ method: "GET" })
  .validator((input: { group: "civil-war" | "eras"; slug: string }) => ({
    group: input.group,
    slug: String(input.slug ?? "").slice(0, 150),
  }))
  .handler(async ({ data }) => {
    if (data.group === "civil-war") {
      const { TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES } =
        await import("@/data/texas-civil-war-reconstruction-authority");
      const page = TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES.find(
        (item) => item.slug === data.slug,
      );
      if (!page) throw new Error("Unknown Texas Civil War authority guide");
      return page;
    }
    if (data.group === "eras") {
      const { TEXAS_POLITICAL_ERAS_AUTHORITY_PAGES } =
        await import("@/data/texas-political-eras-authority");
      const page = TEXAS_POLITICAL_ERAS_AUTHORITY_PAGES.find(
        (item) => item.slug === data.slug,
      );
      if (!page) throw new Error("Unknown Texas political-era authority guide");
      return page;
    }
    throw new Error("Invalid Texas politics history guide group");
  });
