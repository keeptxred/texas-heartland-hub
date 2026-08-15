import { createFileRoute } from '@tanstack/react-router'

// The Lovable-backed queue dispatcher is retired. Transactional messages now
// send directly through Cloudflare Email Service at /api/email/transactional/send.
export const Route = createFileRoute('/lovable/email/queue/process')({
  server: {
    handlers: {
      POST: async () =>
        Response.json(
          {
            error: 'Retired email transport',
            replacement: '/api/email/transactional/send',
          },
          { status: 410 },
        ),
    },
  },
})
