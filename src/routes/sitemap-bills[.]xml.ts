import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { billSitemapEntries } from '@/lib/legislative-sitemaps';
import { renderUrlset, xmlResponse } from '@/lib/sitemap-shared';

export const Route = createFileRoute('/sitemap-bills.xml')({ server: { handlers: { GET: async () => xmlResponse(renderUrlset(await billSitemapEntries())) } } });
