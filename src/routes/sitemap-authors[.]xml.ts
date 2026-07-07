import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { AUTHORS } from "@/data/authors";

export const Route = createFileRoute("/sitemap-authors.xml")({
  server: {
    handlers: {
      GET: async () => {
        const lastmod = toIsoDate(new Date());
        const entries: UrlEntry[] = AUTHORS.map((a) => ({
          loc: `${BASE_URL}/authors/${a.slug}`,
          lastmod,
        }));
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});