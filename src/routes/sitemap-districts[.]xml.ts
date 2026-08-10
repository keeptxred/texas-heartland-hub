import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import readiness from '@/data/elections/2026/readiness.json';
import { ELECTION_DISTRICT_PATHS } from '@/lib/elections/sitemap';
import { BASE_URL, renderUrlset, toIsoDate, xmlResponse } from '@/lib/sitemap-shared';

const DISTRICT_DATA_LASTMOD = toIsoDate(readiness.generatedAt);

export const Route = createFileRoute('/sitemap-districts.xml')({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset(
        ELECTION_DISTRICT_PATHS.map((path) => ({
          loc: `${BASE_URL}${path}`,
          lastmod: DISTRICT_DATA_LASTMOD,
        })),
      )),
    },
  },
});
