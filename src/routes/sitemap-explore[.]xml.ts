import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getCavernSitemapEntries } from "@/lib/explore/cavern-sitemap";
import {
  BASE_URL,
  renderUrlset,
  toIsoDate,
  xmlResponse,
  type UrlEntry,
} from "@/lib/sitemap-shared";

type SitemapEntity = {
  slug: string;
  updated_at: string;
  hero_image_url: string | null;
  name: string;
};

export const Route = createFileRoute("/sitemap-explore.xml")({
  server: {
    handlers: {
      GET: async () => {
        const fallbackEntries = getCavernSitemapEntries();
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!url || !key) {
          return xmlResponse(renderUrlset(fallbackEntries, { image: true }));
        }

        const client = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const result = await client
          .from("explore_entities")
          .select("slug,updated_at,hero_image_url,name")
          .eq("status", "published")
          .order("updated_at", { ascending: false })
          .limit(50_000);

        if (result.error) {
          console.error("[explore-sitemap] published entity query failed", {
            message: result.error.message,
          });
          return xmlResponse(renderUrlset(fallbackEntries, { image: true }));
        }

        const databaseEntries: UrlEntry[] = ((result.data ?? []) as SitemapEntity[]).map(
          (entity) => ({
            loc: `${BASE_URL}/explore/${entity.slug}`,
            lastmod: toIsoDate(entity.updated_at),
            image: entity.hero_image_url
              ? { loc: entity.hero_image_url, title: entity.name }
              : undefined,
          }),
        );

        return xmlResponse(renderUrlset([...fallbackEntries, ...databaseEntries], { image: true }));
      },
    },
  },
});
