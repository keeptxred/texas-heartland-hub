import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import {
  STATE_LEADERSHIP,
  TEXAS_HOUSE_MEMBERS,
  TEXAS_SENATE_MEMBERS,
  US_HOUSE_DELEGATION,
  US_SENATORS,
  representativeSlug,
} from '@/data/representatives';
import { BASE_URL, renderUrlset, toIsoDate, xmlResponse } from '@/lib/sitemap-shared';

// Last substantive revision of src/data/representatives.ts. Do not replace this
// with request time; representative URLs should only look fresh when the source
// directory actually changes.
const REPRESENTATIVE_DATA_LASTMOD = toIsoDate('2026-07-31T16:26:39Z');

export const Route = createFileRoute('/sitemap-representatives.xml')({
  server: {
    handlers: {
      GET: async () => {
        const people = [
          ...US_SENATORS,
          ...STATE_LEADERSHIP,
          ...US_HOUSE_DELEGATION,
          ...TEXAS_SENATE_MEMBERS,
          ...TEXAS_HOUSE_MEMBERS,
        ];
        const seen = new Set<string>();
        const entries = people.flatMap((person) => {
          const slug = representativeSlug(person.name);
          if (!slug || seen.has(slug)) return [];
          seen.add(slug);
          return [{
            loc: `${BASE_URL}/representatives/${slug}`,
            lastmod: REPRESENTATIVE_DATA_LASTMOD,
          }];
        });
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
