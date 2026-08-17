import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';

import { buildElectionReferenceExport } from '@/lib/elections/referenceExport';

export const Route = createFileRoute('/elections/reference.json')({
  server: {
    handlers: {
      GET: async () => {
        const [raceModule, candidateModule] = await Promise.all([
          import('@/data/elections/2026/races.json'),
          import('@/data/elections/2026/candidates.json'),
        ]);
        const payload = buildElectionReferenceExport(
          raceModule.default as readonly Record<string, unknown>[],
          candidateModule.default as readonly Record<string, unknown>[],
        );

        return new Response(JSON.stringify(payload), {
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
            'x-robots-tag': 'noindex, follow',
          },
        });
      },
    },
  },
});
