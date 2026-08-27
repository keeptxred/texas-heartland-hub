import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ALL_TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures-all";
import { BASE_URL, renderUrlset, toIsoDate, xmlResponse, type UrlEntry } from "@/lib/sitemap-shared";

const LASTMOD = toIsoDate("2026-08-26T21:29:00-05:00");

export const Route = createFileRoute("/sitemap-political-figures.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = [
          { loc: `${BASE_URL}/texas-politics/figures`, lastmod: LASTMOD },
          ...ALL_TEXAS_POLITICAL_FIGURES.map((figure) => ({
            loc: `${BASE_URL}/texas-politics/figures/${figure.slug}`,
            lastmod: LASTMOD,
          })),
        ];
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
