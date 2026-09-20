import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { BASE_URL, renderUrlset, xmlResponse } from '@/lib/sitemap-shared';

/**
 * Keep this historically submitted sitemap valid without advertising every
 * programmatic district detail URL. Search Console showed 204 submitted district
 * URLs while the current Election Central hub and other priority pages remained
 * uncrawled. District detail pages stay live and internally discoverable; this
 * sitemap promotes only the canonical district directory during recovery.
 */
export const Route = createFileRoute('/sitemap-districts.xml')({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset([
        { loc: `${BASE_URL}/districts` },
      ])),
    },
  },
});
