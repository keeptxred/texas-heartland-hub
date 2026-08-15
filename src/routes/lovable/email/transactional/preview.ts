import { createFileRoute } from '@tanstack/react-router'

// The provider-specific preview endpoint was part of the retired Lovable mail
// scaffold. Keep a fail-closed tombstone so stale callers cannot authenticate
// with a retired provider key.
export const Route = createFileRoute('/lovable/email/transactional/preview')({
  server: {
    handlers: {
      POST: async () =>
        Response.json(
          { error: 'Retired email preview endpoint' },
          { status: 410 },
        ),
    },
  },
})
