import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { BASE_URL, renderUrlset, xmlResponse } from '@/lib/sitemap-shared';

/**
 * Search Console recovery policy:
 *
 * The bill database remains fully browseable and internally linked, but the
 * dedicated sitemap is intentionally limited to the canonical bill hub. Google
 * had 897 bill/detail/subject URLs advertised here while the /bills hub itself
 * remained Discovered - currently not indexed. Continuing to push the full
 * database into the crawl queue weakens discovery of the site's editorial and
 * election priority pages.
 *
 * Keep this endpoint valid because it was historically submitted directly in
 * Search Console. Once the hub is indexed consistently and bill detail pages
 * demonstrate search demand, high-value bill URLs can be promoted selectively.
 */
export const Route = createFileRoute('/sitemap-bills.xml')({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset([
        { loc: `${BASE_URL}/bills` },
      ])),
    },
  },
});
