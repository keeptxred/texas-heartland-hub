import { createFileRoute } from '@tanstack/react-router';
import { governanceHealth } from '@/platform/governance-event-store';

export const Route = createFileRoute('/api/governance-health')({
  server: {
    handlers: {
      GET: async () => {
        const health = governanceHealth();
        return new Response(JSON.stringify(health), {
          status: health.healthy ? 200 : 503,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store',
            'x-robots-tag': 'noindex, nofollow',
          },
        });
      },
    },
  },
});
