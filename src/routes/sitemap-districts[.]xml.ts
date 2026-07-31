import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { ELECTION_DISTRICT_PATHS } from '@/lib/elections/sitemap';
import { BASE_URL, renderUrlset, toIsoDate, xmlResponse } from '@/lib/sitemap-shared';

export const Route = createFileRoute('/sitemap-districts.xml')({ server: { handlers: { GET: async () => xmlResponse(renderUrlset([
  { loc: `${BASE_URL}/elections/districts`, lastmod: toIsoDate(new Date()) },
  ...ELECTION_DISTRICT_PATHS.map((path) => ({ loc: `${BASE_URL}${path}`, lastmod: toIsoDate(new Date()) })),
])) } } });
