import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, type UrlEntry } from "@/lib/sitemap-shared";
import {
  PRIORITY_SITEMAP_PATHS,
  isValidPrioritySitemapPath,
} from "@/lib/priority-sitemap";

export const Route = createFileRoute("/sitemap-priority.xml")({
  server: {
    handlers: {
      GET: () => {
        const entries: UrlEntry[] = PRIORITY_SITEMAP_PATHS
          .filter(isValidPrioritySitemapPath)
          .map((path) => ({
            loc: path === "/" ? `${BASE_URL}/` : `${BASE_URL}${path}`,
          }));

        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
