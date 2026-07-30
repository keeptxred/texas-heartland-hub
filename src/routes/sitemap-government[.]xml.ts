import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { GOVERNMENT_ENTITIES, GOVERNMENT_REVIEWED_AT, governmentPath } from "@/lib/texas-government";
import { BASE_URL, renderUrlset, toIsoDate, xmlResponse } from "@/lib/sitemap-shared";

export const Route = createFileRoute("/sitemap-government.xml")({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset([
        { loc: `${BASE_URL}/texas-government`, lastmod: toIsoDate(GOVERNMENT_REVIEWED_AT) },
        ...GOVERNMENT_ENTITIES.map((entity) => ({
          loc: `${BASE_URL}${governmentPath(entity.slug)}`,
          lastmod: toIsoDate(GOVERNMENT_REVIEWED_AT),
        })),
      ])),
    },
  },
});
