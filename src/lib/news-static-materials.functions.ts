import { createServerFn } from "@tanstack/react-start";

/**
 * Unlike route-level imports, this registry load executes only on the server.
 * No full ARTICLE_BODIES object should be bundled into the shared client entry.
 */
export const getNewsStaticMaterials = createServerFn({ method: "GET" })
  .validator((input: { slug: string; category: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 180),
    category: String(input.category ?? "").trim().slice(0, 100),
  }))
  .handler(async ({ data }) => {
    const { selectStaticNewsMaterials } = await import("@/lib/news-static-materials.server");
    return selectStaticNewsMaterials(data.slug, data.category);
  });
