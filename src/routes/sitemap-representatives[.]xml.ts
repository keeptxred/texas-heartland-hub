import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { BASE_URL, renderUrlset, xmlResponse } from '@/lib/sitemap-shared';

/**
 * Keep this historically submitted sitemap valid without advertising the full
 * representative directory. Search Console showed 225 submitted representative
 * URLs while higher-priority hubs and current election pages were still waiting
 * to be crawled. Representative detail pages remain live and internally linked;
 * the canonical directory hub is the only URL promoted here during recovery.
 */
export const Route = createFileRoute('/sitemap-representatives.xml')({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset([
        { loc: `${BASE_URL}/representatives` },
      ])),
    },
  },
});
