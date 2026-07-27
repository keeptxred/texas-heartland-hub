import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getCavernSitemapEntries } from "@/lib/explore/cavern-sitemap";
import { exploreDestinations } from "@/data/explore/all-destinations";
import { geographyPath } from "@/lib/explore/geography-pages";
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
        const catalogLastmod = toIsoDate(
          exploreDestinations
            .map((item) => item.updatedAt)
            .sort()
            .at(-1),
        );
        const geographyEntries: UrlEntry[] = [
          { loc: `${BASE_URL}/explore`, lastmod: catalogLastmod },
          { loc: `${BASE_URL}/explore/texas-state-parks-guide`, lastmod: "2026-07-26" },
          { loc: `${BASE_URL}/explore/texas-wildflower-seasons`, lastmod: "2026-07-26" },
          { loc: `${BASE_URL}/explore/texas-scenic-drives`, lastmod: "2026-07-26" },
          { loc: `${BASE_URL}/explore/caverns`, lastmod: catalogLastmod },
          { loc: `${BASE_URL}/explore/lighthouses`, lastmod: catalogLastmod },
          { loc: `${BASE_URL}/explore/scenic-rivers`, lastmod: catalogLastmod },
          { loc: `${BASE_URL}/explore/major-springs`, lastmod: catalogLastmod },
          { loc: `${BASE_URL}/explore/spring-fed-swimming`, lastmod: catalogLastmod },
          { loc: `${BASE_URL}/explore/hill-country-springs`, lastmod: catalogLastmod },
          {
            loc: `${BASE_URL}/explore/spring-conservation-and-education`,
            lastmod: catalogLastmod,
          },
          ...[...new Set(exploreDestinations.map((item) => item.county).filter(Boolean))].map(
            (county) => ({
              loc: `${BASE_URL}${geographyPath("county", county!)}`,
              lastmod: catalogLastmod,
            }),
          ),
          ...[...new Set(exploreDestinations.map((item) => item.region).filter(Boolean))].map(
            (region) => ({
              loc: `${BASE_URL}${geographyPath("region", region!)}`,
              lastmod: catalogLastmod,
            }),
          ),
        ];
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!url || !key) {
          return xmlResponse(
            renderUrlset([...geographyEntries, ...fallbackEntries], { image: true }),
          );
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
          return xmlResponse(
            renderUrlset([...geographyEntries, ...fallbackEntries], { image: true }),
          );
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

        const entries = [...geographyEntries, ...fallbackEntries, ...databaseEntries].filter(
          (entry, index, all) =>
            all.findIndex((candidate) => candidate.loc === entry.loc) === index,
        );
        return xmlResponse(renderUrlset(entries, { image: true }));
      },
    },
  },
});