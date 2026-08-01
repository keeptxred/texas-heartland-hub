import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { STATE_LEADERSHIP, US_HOUSE_DELEGATION, US_SENATORS, representativeSlug } from '@/data/representatives';
import { BASE_URL, renderUrlset, toIsoDate, xmlResponse } from '@/lib/sitemap-shared';

export const Route = createFileRoute('/sitemap-representatives.xml')({ server: { handlers: { GET: async () => xmlResponse(renderUrlset([
  { loc: `${BASE_URL}/representatives`, lastmod: toIsoDate(new Date()) },
  ...[...US_SENATORS, ...STATE_LEADERSHIP, ...US_HOUSE_DELEGATION].map((person) => ({ loc: `${BASE_URL}/representatives/${representativeSlug(person.name)}`, lastmod: toIsoDate(new Date()) })),
])) } } });
