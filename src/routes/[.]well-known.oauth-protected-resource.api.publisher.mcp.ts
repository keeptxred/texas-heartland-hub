import { createFileRoute } from '@tanstack/react-router';
import { publisherResponse } from '@/lib/publisher/mcp.server';

// OAuth discovery must bypass editorial canonical-query cleanup in production.
export const Route = createFileRoute('/.well-known/oauth-protected-resource/api/publisher/mcp')({
  server: { handlers: { GET: async ({ request }) => (await publisherResponse(request, undefined))! } },
});
