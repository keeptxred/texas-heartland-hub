import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { BASE_URL, renderUrlset, xmlResponse } from '@/lib/sitemap-shared';

/**
 * Search Console recovery policy: preserve every committee detail route and its
 * internal links, but stop advertising the full committee directory as a crawl
 * priority while Google is still declining to index higher-value Legislature,
 * bill, and election landing pages. This endpoint remains valid because it was
 * historically submitted directly in Search Console.
 */
export const Route = createFileRoute('/sitemap-committees.xml')({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset([
        { loc: `${BASE_URL}/texas-legislature/committees` },
      ])),
    },
  },
});
