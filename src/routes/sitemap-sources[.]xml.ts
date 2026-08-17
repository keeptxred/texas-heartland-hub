import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SOURCE_AUTHORITY_PROFILES } from "@/data/source-authority";
import { BASE_URL, renderUrlset, toIsoDate, xmlResponse, type UrlEntry } from "@/lib/sitemap-shared";

const SOURCE_AUTHORITY_LASTMOD = toIsoDate("2026-08-16T22:00:00-05:00");

export const Route = createFileRoute("/sitemap-sources.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = [
          { loc: `${BASE_URL}/sources`, lastmod: SOURCE_AUTHORITY_LASTMOD },
          ...SOURCE_AUTHORITY_PROFILES.map((profile) => ({
            loc: `${BASE_URL}/sources/${profile.slug}`,
            lastmod: SOURCE_AUTHORITY_LASTMOD,
          })),
        ];
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
