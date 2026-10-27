import { createServerFn } from "@tanstack/react-start";

/**
 * The four complete historical articles are source-backed, immutable editorial
 * data. Fetch one guide per SSR route instead of loading all four articles
 * into the shared root entry for visitors to unrelated pages.
 */
export const getTexasPoliticalHistoryPage = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 150),
  }))
  .handler(async ({ data }) => {
    const { TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES } =
      await import("@/data/texas-political-history-authority");
    const page = TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES.find(
      (item) => item.slug === data.slug,
    );
    if (!page) throw new Error("Unknown Texas political-history authority article");
    return page;
  });
