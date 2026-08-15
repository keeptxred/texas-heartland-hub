import { createFileRoute } from '@tanstack/react-router'

// Lovable suppression webhooks are retired with the Lovable mail transport.
// Cloudflare Email Service owns provider-level bounce/suppression handling;
// user-initiated opt-outs remain handled by /email/unsubscribe.
export const Route = createFileRoute('/lovable/email/suppression')({
  server: {
    handlers: {
      POST: async () =>
        Response.json(
          { error: 'Retired suppression webhook' },
          { status: 410 },
        ),
    },
  },
})
