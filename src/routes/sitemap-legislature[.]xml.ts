import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { sessionSitemapEntries } from '@/lib/legislative-sitemaps';
import { renderUrlset, xmlResponse } from '@/lib/sitemap-shared';

export const Route = createFileRoute('/sitemap-legislature.xml')({ server: { handlers: { GET: async () => xmlResponse(renderUrlset(await sessionSitemapEntries())) } } });
