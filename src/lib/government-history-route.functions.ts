import { createServerFn } from "@tanstack/react-start";

/** The full, cited government-history guides remain server-owned.
 * Route loaders return exactly one guide; the hub gets only navigation fields.
 * No published text, review timestamps or source references are mutated.
 */
export const getGovernmentHistoryPage = createServerFn({ method: "GET" })
  .validator((input: { slug: string; group: "state" | "local" | "municipal" }) => ({
    slug: String(input.slug ?? "").slice(0, 150),
    group: input.group,
  }))
  .handler(async ({ data }) => {
    if (data.group === "state") {
      const { GOVERNMENT_HISTORY_AUTHORITY_PAGES } =
        await import("@/data/texas-government-history-authority");
      const page = GOVERNMENT_HISTORY_AUTHORITY_PAGES.find((item) => item.slug === data.slug);
      if (!page) throw new Error("Unknown Texas government history guide");
      return page;
    }
    if (data.group === "local") {
      const { TEXAS_LOCAL_GOVERNMENT_AUTHORITY_PAGES } =
        await import("@/data/texas-local-government-authority");
      const page = TEXAS_LOCAL_GOVERNMENT_AUTHORITY_PAGES.find((item) => item.slug === data.slug);
      if (!page) throw new Error("Unknown Texas county history guide");
      return page;
    }
    if (data.group === "municipal") {
      const { TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES } =
        await import("@/data/texas-municipal-government-authority");
      const page = TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES.find((item) => item.slug === data.slug);
      if (!page) throw new Error("Unknown Texas municipal history guide");
      return page;
    }
    throw new Error("Invalid Texas government guide group");
  });

export const getGovernmentHistoryDirectory = createServerFn({ method: "GET" })
  .handler(async () => {
    const [
      { GOVERNMENT_HISTORY_AUTHORITY_PAGES },
      { TEXAS_LOCAL_GOVERNMENT_AUTHORITY_PAGES },
      { TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES },
    ] = await Promise.all([
      import("@/data/texas-government-history-authority"),
      import("@/data/texas-local-government-authority"),
      import("@/data/texas-municipal-government-authority"),
    ]);
    const summarize = (pages: readonly { slug: string; title: string; description: string }[]) =>
      pages.map(({ slug, title, description }) => ({ slug, title, description }));
    return {
      state: summarize(GOVERNMENT_HISTORY_AUTHORITY_PAGES),
      local: summarize(TEXAS_LOCAL_GOVERNMENT_AUTHORITY_PAGES),
      municipal: summarize(TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES),
    };
  });
