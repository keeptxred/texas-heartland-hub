import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, toIsoDate, xmlResponse, type UrlEntry } from "@/lib/sitemap-shared";
import { TEXAS_PARTY_REPRESENTATION_AUTHORITY_PAGES } from "@/data/texas-party-representation-authority";

const LASTMOD = toIsoDate("2026-08-30T21:30:00-05:00");

export const Route = createFileRoute("/sitemap-party-representation.xml")({
  server: {
    handlers: {
      GET: () => {
        const entries: UrlEntry[] = TEXAS_PARTY_REPRESENTATION_AUTHORITY_PAGES.map((page) => ({
          loc: `${BASE_URL}/texas-politics/${page.slug}`,
          lastmod: LASTMOD,
        }));
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
