import { createFileRoute } from '@tanstack/react-router'

// Compatibility endpoint retained temporarily for callers that still reference
// the original scaffolded path. Email delivery itself is Cloudflare-native.
export const Route = createFileRoute('/lovable/email/transactional/send')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const target = new URL('/api/email/transactional/send', request.url)
        return new Response(null, {
          status: 308,
          headers: {
            location: target.toString(),
            'cache-control': 'no-store',
          },
        })
      },
    },
  },
})
