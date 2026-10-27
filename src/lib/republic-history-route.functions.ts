import { createServerFn } from "@tanstack/react-start";

/** Public, structured Republic history records remain the single source of truth.
 * Lazy server imports avoid adding 100 KB of historical prose to every client
 * route's initial JavaScript, without losing SSR metadata or canonical links.
 */
export const getRepublicHistoryPage = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({ slug: String(input.slug ?? "").slice(0, 160) }))
  .handler(async ({ data }) => {
    const { TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES } =
      await import("@/data/texas-republic-government-authority");
    const page = TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES.find((entry) => entry.slug === data.slug);
    if (!page) throw new Error("Unknown Republic history authority page");
    return page;
  });

export const getRepublicHistoryDirectory = createServerFn({ method: "GET" })
  .handler(async () => {
    const { TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES } =
      await import("@/data/texas-republic-government-authority");
    return TEXAS_REPUBLIC_GOVERNMENT_AUTHORITY_PAGES.map((page) => ({
      slug: page.slug,
      title: page.title,
      description: page.description,
    }));
  });
