import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { GOVERNMENT_ENTITIES, GOVERNMENT_REVIEWED_AT, governmentPath } from "@/lib/texas-government";
import { renderUrlset, xmlResponse } from "@/lib/sitemap-shared";

export const Route = createFileRoute("/sitemap-government.xml")({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset([
        { path: "/texas-government", canonicalPath: "/texas-government", updatedAt: GOVERNMENT_REVIEWED_AT, indexable: true },
        ...GOVERNMENT_ENTITIES.map((entity) => ({ path: governmentPath(entity.slug), canonicalPath: governmentPath(entity.slug), updatedAt: GOVERNMENT_REVIEWED_AT, indexable: true })),
      ])),
    },
  },
});
