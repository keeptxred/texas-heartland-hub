import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { GOVERNMENT_ENTITIES, GOVERNMENT_REVIEWED_AT, governmentPath } from "@/lib/texas-government";
import { getPublicationGovernmentEntities } from "@/lib/government-entity-publication";
import { isGovernmentEntityIndexable } from "@/lib/government-entity-indexability";
import { TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES } from "@/data/texas-civil-war-reconstruction-authority";
import { BASE_URL, renderUrlset, toIsoDate, xmlResponse } from "@/lib/sitemap-shared";

const INDEXABLE_GOVERNMENT_ENTITIES = getPublicationGovernmentEntities(GOVERNMENT_ENTITIES).filter(isGovernmentEntityIndexable);
const CIVIL_WAR_RECONSTRUCTION_LASTMOD = toIsoDate("2026-08-30T12:45:00-05:00");

export const Route = createFileRoute("/sitemap-government.xml")({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset([
        { loc: `${BASE_URL}/texas-government`, lastmod: toIsoDate(GOVERNMENT_REVIEWED_AT) },
        ...INDEXABLE_GOVERNMENT_ENTITIES.map((entity) => ({
          loc: `${BASE_URL}${governmentPath(entity.slug)}`,
          lastmod: toIsoDate(GOVERNMENT_REVIEWED_AT),
        })),
        ...TEXAS_CIVIL_WAR_RECONSTRUCTION_AUTHORITY_PAGES.map((page) => ({
          loc: `${BASE_URL}/texas-politics/${page.slug}`,
          lastmod: CIVIL_WAR_RECONSTRUCTION_LASTMOD,
        })),
      ])),
    },
  },
});