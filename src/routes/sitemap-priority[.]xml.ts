import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getPrioritySitemapPaths } from "@/lib/priority-sitemap";
import { BASE_URL, renderUrlset, xmlResponse, type UrlEntry } from "@/lib/sitemap-shared";

export const Route = createFileRoute("/sitemap-priority.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = getPrioritySitemapPaths().map((path) => ({
          loc: `${BASE_URL}${path}`,
        }));
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
